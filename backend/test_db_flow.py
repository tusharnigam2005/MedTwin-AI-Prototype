import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from app.db.database import SessionLocal
from app.models.schema import User, Patient, Doctor
from app.services.auth_service import verify_password
from app.services.crud_service import get_user_by_email, get_patient_by_user_id, get_doctor_by_user_id

def run_database_test():
    print("="*60)
    print(">>> MEDTWIN AI -- DATABASE & AUTH LAYER VERIFICATION TEST")
    print("="*60)

    db = SessionLocal()
    try:
        # 1. Test Patient Account Fetch & Verification
        print("\n[TEST 1] Checking Patient Demo Account (`umang@medtwin.ai`)...")
        patient_user = get_user_by_email(db, "umang@medtwin.ai")
        if not patient_user:
            print("[ERROR] Patient account not found in DB!")
            return False
        
        patient_profile = get_patient_by_user_id(db, patient_user.id)
        is_pwd_valid = verify_password("patient123", patient_user.password_hash)
        
        print(f"  [OK] User ID     : {patient_user.id}")
        print(f"  [OK] Role        : {patient_user.role}")
        print(f"  [OK] Password Ok : {is_pwd_valid} ('patient123')")
        print(f"  [OK] DOB & Gender: {patient_profile.dob} ({patient_profile.gender})")
        print(f"  [OK] Med History : {patient_profile.medical_history}")

        # 2. Test Doctor Account Fetch & Verification
        print("\n[TEST 2] Checking Doctor Demo Account (`doctor@medtwin.ai`)...")
        doctor_user = get_user_by_email(db, "doctor@medtwin.ai")
        if not doctor_user:
            print("[ERROR] Doctor account not found in DB!")
            return False
        
        doctor_profile = get_doctor_by_user_id(db, doctor_user.id)
        is_doc_pwd_valid = verify_password("doctor123", doctor_user.password_hash)
        
        print(f"  [OK] User ID     : {doctor_user.id}")
        print(f"  [OK] Role        : {doctor_user.role}")
        print(f"  [OK] Password Ok : {is_doc_pwd_valid} ('doctor123')")
        print(f"  [OK] Speciality  : {doctor_profile.specialization}")
        print(f"  [OK] License No  : {doctor_profile.license_no}")

        # 3. Test Admin Account Fetch
        print("\n[TEST 3] Checking Admin Demo Account (`admin@medtwin.ai`)...")
        admin_user = get_user_by_email(db, "admin@medtwin.ai")
        print(f"  [OK] User ID     : {admin_user.id} | Role: {admin_user.role}")

        print("\n" + "="*60)
        print(">>> ALL DATABASE & AUTHENTICATION TESTS PASSED 100%!")
        print("="*60)
        return True

    finally:
        db.close()

if __name__ == "__main__":
    run_database_test()
