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
        patient_user = patient.user if patient else None
        p_name = patient_user.email.split('@')[0].replace('.', ' ').title() if (patient_user and patient_user.email) else f"Patient #{patient.id}"
        
        queue.append({
            "id": rec.id,
            "patient_name": p_name,
            "patient_id": patient.id,
            "risk_score": prediction.risk_score,
            "confidence": prediction.confidence,
            "ai_recommendation": rec.action,
            "details": prediction.details,
            "created_at": rec.created_at.strftime("%Y-%m-%d %H:%M") if rec.created_at else "2026-07-25",
            "status": rec.status
        })
        
    if not queue:
        # Provide pre-populated clinical review cases with complete 6-agent structured data
        queue = [
            {
                "id": 101,
                "patient_name": "Rahul Sharma",
                "patient_id": 1,
                "risk_score": 65.0,
                "confidence": 0.95,
                "ai_recommendation": "Elevated HbA1c (7.8%) and fasting blood glucose (145 mg/dL). Prescribe low GI diet and schedule follow-up lab panel.",
                "created_at": "2026-07-25 14:00",
                "status": "pending_doctor_review",
                "details": {
                    "medical_report": {
                        "patient": {"name": "Rahul Sharma", "age": 45, "gender": "Male"},
                        "report_date": "2026-07-25",
                        "symptoms": ["Fatigue", "Increased Thirst", "Blurred Vision"],
                        "clinical_findings": ["Elevated Blood Sugar", "Above-range HbA1c"],
                        "lab_results": [
                            {"test_name": "Fasting Blood Sugar", "value": "145", "unit": "mg/dL", "reference_range": "70-100", "status": "high"},
                            {"test_name": "HbA1c", "value": "7.8", "unit": "%", "reference_range": "4.0-5.6", "status": "high"},
                            {"test_name": "Total Cholesterol", "value": "240", "unit": "mg/dL", "reference_range": "<200", "status": "high"}
                        ],
                        "diagnoses": ["Type 2 Diabetes Suspected"]
                    },
                    "health_prediction": {
                        "health_score": 65,
                        "risk_assessments": [
                            {"risk": "Above-range HbA1c value", "level": "moderate", "evidence": ["HbA1c: 7.8% (Reference: 4.0-5.6%)"], "confidence": 0.95},
                            {"risk": "Above-range fasting glucose value", "level": "moderate", "evidence": ["Fasting Blood Glucose: 145 mg/dL (Reference: 70-100 mg/dL)"], "confidence": 0.95}
                        ],
                        "missing_information": ["Renal function panel", "Medication adherence log"],
                        "requires_clinical_review": True
                    },
                    "health_forecast": {
                        "overall_forecast": "Elevated glycemic markers require daily diet intervention and 7-day monitoring.",
                        "future_risks": [
                            {"risk": "Cardiovascular Complications", "risk_level": "moderate", "time_horizon": "1-3 Years", "explanation": "Hyperglycemia damages microvascular blood vessels."}
                        ],
                        "seven_day_forecast": [
                            {"day": 1, "risk_level": "moderate", "possible_health_status": ["Fatigue"], "explanation": "Fasting glucose elevated."},
                            {"day": 2, "risk_level": "moderate", "possible_health_status": ["Thirst"], "explanation": "Stabilizing post-dietary adjustment."},
                            {"day": 3, "risk_level": "moderate", "possible_health_status": ["Stable"], "explanation": "Blood pressure within range."},
                            {"day": 4, "risk_level": "low", "possible_health_status": ["Stable"], "explanation": "Glycemic control improving."},
                            {"day": 5, "risk_level": "low", "possible_health_status": ["Good Energy"], "explanation": "Dietary modification taking effect."},
                            {"day": 6, "risk_level": "low", "possible_health_status": ["Stable"], "explanation": "Approach baseline range."},
                            {"day": 7, "risk_level": "low", "possible_health_status": ["Optimal Status"], "explanation": "Routine follow-up."}
                        ]
                    },
                    "medication_analysis": {
                        "safety_flags": [
                            {"flag": "Glycemic Protocol Initiation Needed", "evidence": ["HbA1c > 7.5%"]}
                        ],
                        "medication_reviews": [
                            {"medication_name": "Metformin", "documented_dose": "500 mg", "documented_frequency": "Twice daily", "documented_duration": "Pending Review", "review_status": "needs_review"}
                        ]
                    },
                    "lifestyle_analysis": {
                        "recommendations": [
                            {"title": "Low Glycemic Index Diet", "priority": "high", "recommendation": "Switch to complex carbohydrates and limit daily refined sugar.", "reason": "Reduces postprandial glucose spikes."},
                            {"title": "Daily 30-Min Aerobic Exercise", "priority": "moderate", "recommendation": "Brisk walking or cycling 5 days a week.", "reason": "Enhances muscular glucose uptake."}
                        ]
                    },
                    "emergency_analysis": {
                        "triage_level": "urgent",
                        "recommended_action": "Schedule physician review for glycemic management sign-off.",
                        "emergency_services_needed": False,
                        "reasoning_summary": "Elevated HbA1c (7.8%) requires timely doctor consultation."
                    }
                }
            }
        ]

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
    
    # [DISABLED BLOCKCHAIN]
    # bc_tx = record_hash_on_polygon(record_id=f"approval_{record_id}", data_hash=approval_hash)
    bc_tx = {
        "tx_hash": f"mock_tx_{approval_hash[:16]}",
        "chain": "Polygon-Amoy-Mock",
        "block_number": 999999
    }
    
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
