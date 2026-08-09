from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.schema import Recommendation, Prediction, Patient
from app.services.auth_service import get_current_user, User

router = APIRouter()

@router.get("/{patient_id}", summary="Fetch current recommendation set (Slide 33)")
def get_recommendations(patient_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Join Recommendations via Predictions belonging to patient
    recs = db.query(Recommendation).join(Prediction).filter(Prediction.patient_id == patient_id).order_by(Recommendation.created_at.desc()).all()
    
    return [
        {
            "recommendation_id": r.id,
            "prediction_id": r.prediction_id,
            "action": r.action,
            "status": r.status,  # pending_doctor_review, approved, rejected
            "doctor_id": r.doctor_id,
            "created_at": r.created_at
        }
        for r in recs
    ]
