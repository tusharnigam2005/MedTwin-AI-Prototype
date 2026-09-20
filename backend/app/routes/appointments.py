from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.schema import Appointment, User, Patient, Doctor
from app.services.auth_service import get_current_user

router = APIRouter()

class AppointmentCreateRequest(BaseModel):
    doctor_id: int
    date: str
    time: str
    reason: str | None = None

class AppointmentUpdateRequest(BaseModel):
    status: str
    date: str | None = None
    time: str | None = None

@router.post("/book", summary="Book an Appointment")
def book_appointment(
    payload: AppointmentCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "patient":
        raise HTTPException(status_code=403, detail="Only patients can book appointments.")
        
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found.")
        
    doctor = db.query(Doctor).filter(Doctor.id == payload.doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found.")
        
    new_appt = Appointment(
        patient_id=patient.id,
        doctor_id=doctor.id,
        date=payload.date,
        time=payload.time,
        reason=payload.reason,
        status="pending"
    )
    db.add(new_appt)
    db.commit()
    db.refresh(new_appt)
    
    return {"message": "Appointment booked successfully", "appointment_id": new_appt.id}

@router.get("/my", summary="List Appointments")
def get_appointments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role == "patient":
        patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
        if not patient:
            return []
        appointments = db.query(Appointment).filter(Appointment.patient_id == patient.id).order_by(Appointment.created_at.desc()).all()
    elif current_user.role == "doctor":
        doctor = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()
        if not doctor:
            return []
        appointments = db.query(Appointment).filter(Appointment.doctor_id == doctor.id).order_by(Appointment.created_at.desc()).all()
    else:
        appointments = []
        
    result = []
    for appt in appointments:
        pat_user = db.query(User).filter(User.id == appt.patient.user_id).first()
        doc_user = db.query(User).filter(User.id == appt.doctor.user_id).first()
        
        # Get patient name or doctor name safely
        patient_name = pat_user.email.split('@')[0].replace('.', ' ').title() if pat_user else f"Patient {appt.patient_id}"
        doctor_name = doc_user.email.split('@')[0].replace('.', ' ').title() if doc_user else f"Doctor {appt.doctor_id}"

        result.append({
            "id": appt.id,
            "patient_name": patient_name,
            "doctor_name": doctor_name,
            "date": appt.date,
            "time": appt.time,
            "reason": appt.reason,
            "status": appt.status,
            "created_at": appt.created_at
        })
    return result

@router.put("/update/{appointment_id}", summary="Update Appointment Status")
def update_appointment(
    appointment_id: int,
    payload: AppointmentUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Only doctors can update appointments.")
        
    doctor = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor profile not found.")
        
    appt = db.query(Appointment).filter(Appointment.id == appointment_id, Appointment.doctor_id == doctor.id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found or not authorized.")
        
    appt.status = payload.status
    if payload.date:
        appt.date = payload.date
    if payload.time:
        appt.time = payload.time
        
    db.commit()
    db.refresh(appt)
    
    return {"message": "Appointment updated", "status": appt.status}
