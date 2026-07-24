import os
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.schema import MedicalReport, Patient, Prediction, Recommendation, AuditLog, BlockchainTx, User
from app.services.auth_service import get_current_user
from app.services.ai_service import invoke_langgraph_pipeline
from app.services.blockchain_service import generate_sha256_hash, record_hash_on_polygon
from app.services.recommendation_service import merge_agent_recommendations

router = APIRouter()

@router.post("/upload", summary="Upload a medical report for OCR + AI processing (Slide 33)")
async def upload_report(
    patient_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found")

    # Save uploaded report locally/simulated IPFS (Slide 14 & 15)
    os.makedirs("uploads", exist_ok=True)
    file_path = f"uploads/{patient_id}_{file.filename}"
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    # Simulated OCR extraction text or real PyTesseract/PaddleOCR output if needed
    mock_ocr_text = f"Patient Blood Report: Fasting Blood Sugar 135 mg/dL. HbA1c 6.8%. Cholesterol 210 mg/dL. Uploaded file: {file.filename}"

    # 1. Store Report in DB
    report = MedicalReport(
        patient_id=patient.id,
        file_url=file_path,
        ocr_text=mock_ocr_text,
        structured_data={"Fasting Blood Sugar": "135 mg/dL", "HbA1c": "6.8%"}
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    # 2. Invoke LangGraph 5-Agent Pipeline (Slide 11, 21 & 23)
    ai_result = invoke_langgraph_pipeline(
        patient_id=patient.id,
        ocr_text=mock_ocr_text,
        medical_history=patient.medical_history or {},
        vitals={"heart_rate": 74, "blood_pressure": "120/80"}
    )

    # 3. Store Prediction in DB
    prediction = Prediction(
        patient_id=patient.id,
        risk_score=ai_result.get("overall_risk_score", 65.0),
        confidence=ai_result.get("overall_confidence", 0.90),
        agent_source="LangGraph-Orchestrator",
        details=ai_result  # Store the full AI analysis JSON
    )
    db.add(prediction)
    db.commit()
    db.refresh(prediction)

    # 4. Recommendation Engine Merge (Slide 22)
    merged = merge_agent_recommendations(
        risk_score=prediction.risk_score,
        medication_data=ai_result.get("medication_alerts", []),
        lifestyle_signals=ai_result.get("lifestyle_targets", {})
    )
    recommendation = Recommendation(
        prediction_id=prediction.id,
        action=merged["final_recommendation"],
        status="pending_doctor_review"
    )
    db.add(recommendation)
    db.commit()
    db.refresh(recommendation)

    # 5. Blockchain SHA-256 Hash Registration (Slide 25)
    record_payload = {"report_id": report.id, "prediction_id": prediction.id, "ocr_hash": generate_sha256_hash(mock_ocr_text)}
    sha_hash = generate_sha256_hash(record_payload)
    bc_tx = record_hash_on_polygon(record_id=f"report_{report.id}", data_hash=sha_hash)

    tx_entry = BlockchainTx(
        record_id=f"report_{report.id}",
        tx_hash=bc_tx["tx_hash"],
        chain=bc_tx["chain"],
        block_number=bc_tx["block_number"]
    )
    db.add(tx_entry)

    # 6. Audit Log
    audit = AuditLog(
        entity_type="report",
        action="report_uploaded_and_ai_processed",
        actor_id=current_user.id,
        metadata_info={"report_id": report.id, "tx_hash": bc_tx["tx_hash"]}
    )
    db.add(audit)
    db.commit()

    return {
        "message": "Report uploaded, OCR processed, LangGraph evaluated, and hashed to Polygon",
        "report_id": report.id,
        "prediction": {"risk_score": prediction.risk_score, "confidence": prediction.confidence, "details": prediction.details},
        "recommendation": recommendation.action,
        "blockchain_verification": bc_tx
    }
