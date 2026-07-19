from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.schema import User, Patient, Doctor
from app.services.auth_service import verify_password, get_password_hash, create_access_token

router = APIRouter()

class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    role: str  # 'patient', 'doctor', 'admin'
    dob: str | None = None
    gender: str | None = None
    specialization: str | None = None
    license_no: str | None = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_id: int


@router.post("/signup", status_code=status.HTTP_201_CREATED, summary="Create new patient/doctor account (Slide 33)")
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        email=payload.email,
        password_hash=get_password_hash(payload.password),
        role=payload.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    if payload.role == "patient":
        patient_profile = Patient(user_id=new_user.id, dob=payload.dob, gender=payload.gender)
        db.add(patient_profile)
    elif payload.role == "doctor":
        doctor_profile = Doctor(user_id=new_user.id, specialization=payload.specialization, license_no=payload.license_no)
        db.add(doctor_profile)

    db.commit()
    return {"message": "Account created successfully", "user_id": new_user.id, "role": new_user.role}


@router.post("/login", response_model=TokenResponse, summary="Authenticate and issue JWT (Slide 33)")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

    access_token = create_access_token(data={"sub": user.email, "role": user.role, "user_id": user.id})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "user_id": user.id
    }
