from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field

# ==========================================
# Step 1: Pydantic Validation Schemas
# Used for serialization, request validation, and OpenAPI documentation
# ==========================================

# --- 1. USER SCHEMAS ---
class UserBase(BaseModel):
    email: EmailStr
    role: str = Field(..., description="Role must be 'patient', 'doctor', or 'admin'")

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, description="Raw password before hashing")
    full_name: Optional[str] = None
    wallet_address: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# --- 2. PATIENT SCHEMAS ---
class PatientCreate(BaseModel):
    dob: Optional[str] = None
    gender: Optional[str] = None
    medical_history: Optional[Dict[str, Any]] = Field(default_factory=dict)

class PatientResponse(PatientCreate):
    id: int
    user_id: int

    class Config:
        from_attributes = True


# --- 3. DOCTOR SCHEMAS ---
class DoctorCreate(BaseModel):
    specialization: Optional[str] = "General Medicine"
    license_no: Optional[str] = None

class DoctorResponse(DoctorCreate):
    id: int
    user_id: int

    class Config:
        from_attributes = True


# --- 4. MEDICAL REPORT SCHEMAS ---
class MedicalReportCreate(BaseModel):
    patient_id: int
    file_url: str
    ocr_text: Optional[str] = None
    structured_data: Optional[Dict[str, Any]] = Field(default_factory=dict)

class MedicalReportResponse(MedicalReportCreate):
    id: int
    uploaded_at: datetime

    class Config:
        from_attributes = True


# --- 5. PREDICTION SCHEMAS ---
class PredictionCreate(BaseModel):
    patient_id: int
    risk_score: float = Field(..., ge=0.0, le=100.0)
    confidence: float = Field(..., ge=0.0, le=1.0)
    agent_source: str = "LangGraph-5-Agent-Pipeline"
    details: Optional[Dict[str, Any]] = Field(default_factory=dict)

class PredictionResponse(PredictionCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# --- 6. RECOMMENDATION SCHEMAS (Human-in-the-Loop) ---
class RecommendationCreate(BaseModel):
    prediction_id: int
    action: str

class RecommendationReview(BaseModel):
    status: str = Field(..., description="'approved' or 'rejected'")
    doctor_id: int

class RecommendationResponse(BaseModel):
    id: int
    prediction_id: int
    action: str
    status: str
    doctor_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


# --- 7. AUDIT LOG SCHEMAS ---
class AuditLogCreate(BaseModel):
    entity_type: str
    action: str
    actor_id: Optional[int] = None
    metadata_info: Optional[Dict[str, Any]] = Field(default_factory=dict)

class AuditLogResponse(AuditLogCreate):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True


# --- 8. BLOCKCHAIN TX SCHEMAS ---
class BlockchainTxCreate(BaseModel):
    record_id: str
    tx_hash: str
    chain: str = "Polygon-Amoy"
    block_number: Optional[int] = None

class BlockchainTxResponse(BlockchainTxCreate):
    id: int
    verified_at: datetime

    class Config:
        from_attributes = True
