from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.schema import Recommendation, Doctor, AuditLog, BlockchainTx
from app.services.auth_service import require_role, User
from app.services.blockchain_service import generate_sha256_hash, record_hash_on_polygon
from app.services.notification_service import push_realtime_notification

router = APIRouter()

class ApprovalRequest(BaseModel):
    action_status: str  # 'approved' or 'rejected'
    override_notes: str | None = None

@router.get("/queue", summary="Get pending recommendations for Doctor review")
def get_doctor_queue(
    db: Session = Depends(get_db),
    current_doctor: User = Depends(require_role("doctor"))
):
    # Fetch pending recommendations joined with prediction and patient
    pending = db.query(Recommendation).filter(Recommendation.status == "pending_doctor_review").all()
    
    queue = []
    for rec in pending:
        prediction = rec.prediction
        patient = prediction.patient
        patient_user = patient.user
        
        queue.append({
            "id": rec.id,
            "patient_name": patient_user.email.split('@')[0].replace('.', ' ').title(),
            "patient_id": patient.id,
            "risk_score": prediction.risk_score,
            "confidence": prediction.confidence,
            "ai_recommendation": rec.action,
            "created_at": rec.created_at,
            "status": rec.status
        })
        
    return queue

@router.post("/approve/{record_id}", summary="Doctor approval action on a pending recommendation (Slide 33)")
def doctor_approve_record(
    record_id: int, 
    payload: ApprovalRequest, 
    db: Session = Depends(get_db), 
    current_doctor: User = Depends(require_role("doctor"))
):
    recommendation = db.query(Recommendation).filter(Recommendation.id == record_id).first()
    if not recommendation:
        raise HTTPException(status_code=404, detail="Recommendation record not found")

    doctor_profile = db.query(Doctor).filter(Doctor.user_id == current_doctor.id).first()
    
    recommendation.status = payload.action_status
    if doctor_profile:
        recommendation.doctor_id = doctor_profile.id
    if payload.override_notes:
        recommendation.action += f"\n[Doctor Notes]: {payload.override_notes}"

    # Record Doctor Sign-Off on Polygon Blockchain (Slide 26 doctorApproval)
    approval_hash = generate_sha256_hash({"rec_id": record_id, "status": payload.action_status, "doctor_email": current_doctor.email})
    bc_tx = record_hash_on_polygon(record_id=f"approval_{record_id}", data_hash=approval_hash)
    
    tx_entry = BlockchainTx(
        record_id=f"approval_{record_id}",
        tx_hash=bc_tx["tx_hash"],
        chain=bc_tx["chain"],
        block_number=bc_tx["block_number"]
    )
    db.add(tx_entry)

    # Audit Log
    audit = AuditLog(
        entity_type="approval",
        action=f"doctor_{payload.action_status}",
        actor_id=current_doctor.id,
        metadata_info={"recommendation_id": record_id, "tx_hash": bc_tx["tx_hash"]}
    )
    db.add(audit)
    db.commit()
    db.refresh(recommendation)

    # Push Notification to Patient (Slide 27)
    push_realtime_notification(
        recipient_role="patient",
        recipient_id=recommendation.prediction.patient_id,
        title="Doctor Verification Updated",
        message=f"Your AI recommendation has been {payload.action_status.upper()} by your doctor."
    )

    return {
        "message": f"Recommendation successfully {payload.action_status}",
        "recommendation_id": recommendation.id,
        "new_status": recommendation.status,
        "blockchain_receipt": bc_tx
    }
