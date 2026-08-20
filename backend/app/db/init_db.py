import logging
from sqlalchemy.orm import Session
from app.db.database import engine, Base, SessionLocal
from app.models.schema import User, Patient, Doctor
from app.services.auth_service import get_password_hash
from app.services.crud_service import (
    get_user_by_email, create_user_record,
    create_patient_record, create_doctor_record
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ==========================================
# Step 5: Auto-Migration & Database Seeder
# Creates all 8 Slide 12 tables and seeds default demo accounts
# ==========================================Har 8 table ke structure create honge agar na hon
def init_db() -> None:
    logger.info("Initializing Slide 12 Database Tables (PostgreSQL / SQLite)...")
    Base.metadata.create_all(bind=engine)
    logger.info("Tables created successfully.")

    db: Session = SessionLocal()
    try:
        seed_default_accounts(db)
    finally:
        db.close()


def seed_default_accounts(db: Session) -> None:
    """Pre-seed 3 demo accounts so instant hackathon logins & API tests work right away."""
    logger.info("Checking and seeding default demo accounts...")

    # 1. Patient Account (Umang Sharma)
    if not get_user_by_email(db, "umang@medtwin.ai"):
        logger.info("Seeding Patient account: umang@medtwin.ai")
        user = create_user_record(
            db=db,
            email="umang@medtwin.ai",
            password_hash=get_password_hash("patient123"),
            role="patient"
        )
        create_patient_record(
            db=db,
            user_id=user.id,
            dob="2003-08-15",
            gender="Male",
            medical_history={"baseline": "Asthma controlled", "allergies": ["Penicillin"]}
        )

    # 2. Doctor Account (Dr. Aarav Patel)
    if not get_user_by_email(db, "doctor@medtwin.ai"):
        logger.info("Seeding Doctor account: doctor@medtwin.ai")
        user = create_user_record(
            db=db,
            email="doctor@medtwin.ai",
            password_hash=get_password_hash("doctor123"),
            role="doctor"
        )
        create_doctor_record(
            db=db,
            user_id=user.id,
            specialization="Cardiology & Critical Care",
            license_no="MED-TWIN-DOC-8921"
        )

    # 3. Admin Account (System Audit)
    if not get_user_by_email(db, "admin@medtwin.ai"):
        logger.info("Seeding Admin account: admin@medtwin.ai")
        create_user_record(
            db=db,
            email="admin@medtwin.ai",
            password_hash=get_password_hash("admin123"),
            role="admin"
        )

    logger.info("Database seeding complete!")


if __name__ == "__main__":
    init_db()
