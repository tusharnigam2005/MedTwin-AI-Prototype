from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.schema import Prediction, Patient, Recommendation
from app.services.auth_service import get_current_user, User

router = APIRouter()

@router.get("/{patient_id}", summary="Fetch latest risk prediction for a patient (Slide 33)")
def get_latest_prediction(patient_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    patient = None
    if current_user.role == "patient" and current_user.patient_profile:
        patient = current_user.patient_profile
    else:
        patient = db.query(Patient).filter(Patient.id == patient_id).first()
        
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found")
        
    resolved_patient_id = patient.id

    prediction = db.query(Prediction).filter(Prediction.patient_id == resolved_patient_id).order_by(Prediction.created_at.desc()).first()
    if not prediction:
        return {"message": "No predictions found for this patient yet.", "risk_score": 0, "confidence": 0}

    recommendation = db.query(Recommendation).filter(Recommendation.prediction_id == prediction.id).first()
    rec_status = recommendation.status if recommendation else "none"

    return {
        "prediction_id": prediction.id,
        "patient_id": prediction.patient_id,
        "risk_score": prediction.risk_score,
        "confidence": prediction.confidence,
        "agent_source": prediction.agent_source,
        "details": prediction.details,
        "created_at": prediction.created_at,
        "recommendation_status": rec_status
    }
