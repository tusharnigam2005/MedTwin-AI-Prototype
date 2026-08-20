from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.schema import User, MedicalReport, BlockchainTx, Doctor
from app.services.auth_service import require_role

router = APIRouter()

@router.get("/stats", summary="Get overall system statistics for Admin Dashboard")
def get_admin_stats(
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_role("admin"))
):
    total_users = db.query(User).count()
    active_doctors = db.query(Doctor).count()
    processed_reports = db.query(MedicalReport).count()
    blockchain_verifications = db.query(BlockchainTx).count()

    return {
        "total_users": total_users,
        "active_doctors": active_doctors,
        "processed_reports": processed_reports,
        "blockchain_verifications": blockchain_verifications,
        "system_status": "Operational",
        "cpu_usage": "42%",
        "memory_usage": "3.1GB"
    }
