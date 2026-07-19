from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.schema import MedicalReport, Prediction, Recommendation, BlockchainTx, AuditLog
from app.services.auth_service import get_current_user, User

router = APIRouter()

@router.get("/{patient_id}", summary="Fetch full verified medical history and audit trail (Slide 33)")
def get_medical_history(patient_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    reports = db.query(MedicalReport).filter(MedicalReport.patient_id == patient_id).all()
    predictions = db.query(Prediction).filter(Prediction.patient_id == patient_id).all()
    
    # Collect all verified blockchain transactions linked to these reports
    report_ids = [f"report_{r.id}" for r in reports]
    blockchain_txs = db.query(BlockchainTx).filter(BlockchainTx.record_id.in_(report_ids)).all() if report_ids else []

    return {
        "patient_id": patient_id,
        "reports_count": len(reports),
        "reports": [
            {"id": r.id, "file_url": r.file_url, "uploaded_at": r.uploaded_at, "structured_data": r.structured_data}
            for r in reports
        ],
        "predictions": [
            {"id": p.id, "risk_score": p.risk_score, "confidence": p.confidence, "created_at": p.created_at}
            for p in predictions
        ],
        "blockchain_verification_trail": [
            {"record_id": tx.record_id, "tx_hash": tx.tx_hash, "chain": tx.chain, "block_number": tx.block_number, "verified_at": tx.verified_at}
            for tx in blockchain_txs
        ]
    }
