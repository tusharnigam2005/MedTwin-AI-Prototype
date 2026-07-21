from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from app.models.schema import User, Patient, Doctor, MedicalReport, Prediction, Recommendation, AuditLog, BlockchainTx
from app.schemas.pydantic_schemas import (
    UserCreate, PatientCreate, DoctorCreate, MedicalReportCreate,
    PredictionCreate, RecommendationCreate, AuditLogCreate, BlockchainTxCreate
)

# ==========================================
# Step 3: CRUD Repository Operations
# Modular queries for all 8 Slide 12 database tables
# ==========================================

# --- 1. USER CRUD ---
def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()

def create_user_record(db: Session, email: str, password_hash: str, role: str) -> User:
    db_user = User(email=email, password_hash=password_hash, role=role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# --- 2. PATIENT CRUD ---
def get_patient_by_user_id(db: Session, user_id: int) -> Optional[Patient]:
    return db.query(Patient).filter(Patient.user_id == user_id).first()

def create_patient_record(db: Session, user_id: int, dob: Optional[str] = None, gender: Optional[str] = None, medical_history: Optional[Dict[str, Any]] = None) -> Patient:
    db_patient = Patient(
        user_id=user_id,
        dob=dob,
        gender=gender,
        medical_history=medical_history or {}
    )
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient


# --- 3. DOCTOR CRUD ---
def get_doctor_by_user_id(db: Session, user_id: int) -> Optional[Doctor]:
    return db.query(Doctor).filter(Doctor.user_id == user_id).first()

def create_doctor_record(db: Session, user_id: int, specialization: Optional[str] = "General Medicine", license_no: Optional[str] = None) -> Doctor:
    db_doctor = Doctor(
        user_id=user_id,
        specialization=specialization,
        license_no=license_no
    )
    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)
    return db_doctor


# --- 4. MEDICAL REPORT CRUD ---
def create_medical_report_record(db: Session, patient_id: int, file_url: str, ocr_text: Optional[str] = None, structured_data: Optional[Dict[str, Any]] = None) -> MedicalReport:
    report = MedicalReport(
        patient_id=patient_id,
        file_url=file_url,
        ocr_text=ocr_text,
        structured_data=structured_data or {}
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

def get_reports_by_patient(db: Session, patient_id: int) -> List[MedicalReport]:
    return db.query(MedicalReport).filter(MedicalReport.patient_id == patient_id).order_by(MedicalReport.uploaded_at.desc()).all()


# --- 5. PREDICTION CRUD ---
def create_prediction_record(db: Session, patient_id: int, risk_score: float, confidence: float, agent_source: str = "LangGraph-5-Agent-Pipeline", details: Optional[Dict[str, Any]] = None) -> Prediction:
    pred = Prediction(
        patient_id=patient_id,
        risk_score=risk_score,
        confidence=confidence,
        agent_source=agent_source,
        details=details or {}
    )
    db.add(pred)
    db.commit()
    db.refresh(pred)
    return pred

def get_predictions_by_patient(db: Session, patient_id: int) -> List[Prediction]:
    return db.query(Prediction).filter(Prediction.patient_id == patient_id).order_by(Prediction.created_at.desc()).all()


# --- 6. RECOMMENDATION CRUD (Human-in-the-Loop Signoff) ---
def create_recommendation_record(db: Session, prediction_id: int, action: str) -> Recommendation:
    rec = Recommendation(
        prediction_id=prediction_id,
        action=action,
        status="pending_doctor_review"
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return rec

def review_recommendation_record(db: Session, recommendation_id: int, status: str, doctor_id: int) -> Optional[Recommendation]:
    rec = db.query(Recommendation).filter(Recommendation.id == recommendation_id).first()
    if not rec:
        return None
    rec.status = status
    rec.doctor_id = doctor_id
    db.commit()
    db.refresh(rec)
    return rec


# --- 7. AUDIT LOG CRUD ---
def create_audit_log_record(db: Session, entity_type: str, action: str, actor_id: Optional[int] = None, metadata_info: Optional[Dict[str, Any]] = None) -> AuditLog:
    log = AuditLog(
        entity_type=entity_type,
        action=action,
        actor_id=actor_id,
        metadata_info=metadata_info or {}
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log

def get_audit_logs(db: Session, limit: int = 50) -> List[AuditLog]:
    return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()


# --- 8. BLOCKCHAIN TX CRUD ---
def create_blockchain_tx_record(db: Session, record_id: str, tx_hash: str, chain: str = "Polygon-Amoy", block_number: Optional[int] = None) -> BlockchainTx:
    tx = BlockchainTx(
        record_id=record_id,
        tx_hash=tx_hash,
        chain=chain,
        block_number=block_number
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)
    return tx

def get_blockchain_tx_by_record(db: Session, record_id: str) -> Optional[BlockchainTx]:
    return db.query(BlockchainTx).filter(BlockchainTx.record_id == record_id).first()
