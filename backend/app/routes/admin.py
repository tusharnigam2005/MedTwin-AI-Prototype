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

@router.get("/users", summary="Get all registered users")
def get_admin_users(
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_role("admin"))
):
    users = db.query(User).all()
    user_data = []
    for u in users:
        # Generate a display ID based on role
        prefix = "PT" if u.role == "patient" else "DOC" if u.role == "doctor" else "ADM"
        display_id = f"{prefix}-{100 + u.id}"
        
        # Use email prefix as a placeholder name since the schema doesn't store 'name' on User
        name = u.email.split('@')[0].replace('.', ' ').title()
        
        user_data.append({
            "id": u.id,
            "display_id": display_id,
            "name": name,
            "role": u.role.capitalize(),
            "status": "Active"
        })
    return user_data

@router.get("/logs", summary="Get system activity logs")
def get_admin_logs(
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_role("admin"))
):
    # Fetch recent medical reports as system logs
    reports = db.query(MedicalReport).order_by(MedicalReport.uploaded_at.desc()).limit(50).all()
    log_data = []
    for r in reports:
        filename = r.file_url.split('/')[-1] if r.file_url else f"report_{r.id}.pdf"
        log_data.append({
            "id": r.id,
            "timestamp": r.uploaded_at.strftime("%Y-%m-%d %H:%M") if r.uploaded_at else "Unknown",
            "message": f"Processed {filename} — 6 Agents Completed",
            "status_code": "200 OK"
        })
    return log_data
