from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.schema import Patient, User
from app.services.auth_service import get_current_user

router = APIRouter()

class ProfileUpdateRequest(BaseModel):
    dob: str | None = None
    gender: str | None = None
    blood_group: str | None = None
    height: str | None = None
    weight: str | None = None
    allergies: list[str] | None = None
    chronic_conditions: list[str] | None = None
    lifestyle: dict | None = None

@router.get("/profile", summary="Get Current Patient Profile Data")
def get_patient_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "patient":
        raise HTTPException(status_code=403, detail="Not authorized. Role must be patient.")
        
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found.")
        
    return {
        "id": patient.id,
        "user_id": patient.user_id,
        "email": current_user.email,
        "dob": patient.dob,
        "gender": patient.gender,
        "medical_history": patient.medical_history or {}
    }

@router.put("/profile", summary="Update Patient Profile Data (Onboarding/Verification)")
def update_patient_profile(
    payload: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "patient":
        raise HTTPException(status_code=403, detail="Not authorized. Role must be patient.")
        
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found.")
        
    if payload.dob is not None:
        patient.dob = payload.dob
    if payload.gender is not None:
        patient.gender = payload.gender
        
    # Merge/Update the medical history JSON
    current_history = patient.medical_history or {}
    if payload.blood_group is not None:
        current_history["blood_group"] = payload.blood_group
    if payload.height is not None:
        current_history["height"] = payload.height
    if payload.weight is not None:
        current_history["weight"] = payload.weight
    if payload.allergies is not None:
        current_history["allergies"] = payload.allergies
    if payload.chronic_conditions is not None:
        current_history["chronic_conditions"] = payload.chronic_conditions
    if payload.lifestyle is not None:
        current_history["lifestyle"] = payload.lifestyle
        
    patient.medical_history = current_history
    
    db.commit()
    db.refresh(patient)
    
    return {
        "message": "Profile updated successfully",
        "medical_history": patient.medical_history
    }
