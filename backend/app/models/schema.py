from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from app.db.database import Base

# ==========================================
# Slide 12 — PostgreSQL Schema Definitions
# ==========================================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String(50), nullable=False)  # 'patient', 'doctor', 'admin'
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    patient_profile = relationship("Patient", back_populates="user", uselist=False)
    doctor_profile = relationship("Doctor", back_populates="user", uselist=False)


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    dob = Column(String(20), nullable=True)
    gender = Column(String(20), nullable=True)
    medical_history = Column(JSON, default={})  # Baseline chronic conditions, allergies, etc.

    # Relationships
    user = relationship("User", back_populates="patient_profile")
    reports = relationship("MedicalReport", back_populates="patient")
    predictions = relationship("Prediction", back_populates="patient")


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    specialization = Column(String(100), nullable=True)
    license_no = Column(String(100), unique=True, nullable=True)

    # Relationships
    user = relationship("User", back_populates="doctor_profile")
    approved_recommendations = relationship("Recommendation", back_populates="doctor")


class MedicalReport(Base):
    __tablename__ = "medical_reports"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    file_url = Column(String(500), nullable=False)  # IPFS / S3 / Local path
    ocr_text = Column(Text, nullable=True)
    structured_data = Column(JSON, default={})  # Normalized lab values (Slide 15/16)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    patient = relationship("Patient", back_populates="reports")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    risk_score = Column(Float, nullable=False)  # 0 to 100 scale
    confidence = Column(Float, nullable=False)  # e.g., 0.95
    agent_source = Column(String(100), default="LangGraph-5-Agent-Pipeline")
    details = Column(JSON, default={})  # Contributing factors, flags
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    patient = relationship("Patient", back_populates="predictions")
    recommendations = relationship("Recommendation", back_populates="prediction")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    prediction_id = Column(Integer, ForeignKey("predictions.id", ondelete="CASCADE"), nullable=False)
    action = Column(Text, nullable=False)  # Merged lifestyle/medication action items
    status = Column(String(50), default="pending_doctor_review")  # pending_doctor_review, approved, rejected
    doctor_id = Column(Integer, ForeignKey("doctors.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    prediction = relationship("Prediction", back_populates="recommendations")
    doctor = relationship("Doctor", back_populates="approved_recommendations")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    entity_type = Column(String(50), nullable=False)  # 'report', 'prediction', 'approval'
    action = Column(String(100), nullable=False)
    actor_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    metadata_info = Column(JSON, default={})


class BlockchainTx(Base):
    __tablename__ = "blockchain_txs"

    id = Column(Integer, primary_key=True, index=True)
    record_id = Column(String(100), nullable=False, index=True)  # Entity unique ID
    tx_hash = Column(String(100), unique=True, nullable=False)
    chain = Column(String(50), default="Polygon-Amoy")
    block_number = Column(Integer, nullable=True)
    verified_at = Column(DateTime, default=datetime.utcnow)
