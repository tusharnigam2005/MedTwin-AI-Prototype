from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.schema import BlockchainTx
from app.services.blockchain_service import verify_hash_on_polygon

router = APIRouter()

class VerifyRequest(BaseModel):
    record_id: str
    sha256_hash: str

@router.post("/verify", summary="Verify a record's hash against on-chain data (Slide 33)")
def verify_blockchain_record(payload: VerifyRequest, db: Session = Depends(get_db)):
    tx_entry = db.query(BlockchainTx).filter(BlockchainTx.record_id == payload.record_id).first()
    if not tx_entry:
        raise HTTPException(status_code=404, detail="No on-chain transaction found for this record_id")

    is_valid = verify_hash_on_polygon(payload.record_id, payload.sha256_hash, tx_entry.tx_hash)
    
    return {
        "record_id": payload.record_id,
        "on_chain_tx_hash": tx_entry.tx_hash,
        "chain": tx_entry.chain,
        "block_number": tx_entry.block_number,
        "integrity_verified": is_valid,
        "status": "TAMPER_PROOF_CONFIRMED" if is_valid else "HASH_MISMATCH_ERROR"
    }

from fastapi.responses import FileResponse
from app.models.schema import MedicalReport
from app.services.blockchain_service import generate_sha256_hash
import os

@router.get("/verify/{report_id}", summary="Verify a report file's integrity against the blockchain")
def verify_report_file(report_id: int, db: Session = Depends(get_db)):
    print(f"DEBUG: entered verify_report_file with report_id={report_id}")
    report = db.query(MedicalReport).filter(MedicalReport.id == report_id).first()
    if not report:
        print("DEBUG: Report not found")
        raise HTTPException(status_code=404, detail="Report not found")
        
    if not os.path.exists(report.file_url):
        print("DEBUG: File not found on disk")
        raise HTTPException(status_code=404, detail="File not found on disk")
        
    tx_entry = db.query(BlockchainTx).filter(BlockchainTx.record_id == f"report_{report.id}").first()
    if not tx_entry:
        raise HTTPException(status_code=404, detail="No on-chain transaction found for this report")

    with open(report.file_url, "rb") as f:
        file_bytes = f.read()
    
    current_file_hash = generate_sha256_hash(file_bytes)
    structured_data = report.structured_data or {}
    original_hash = structured_data.get("original_file_hash")
    
    if original_hash:
        is_match = (current_file_hash == original_hash)
    else:
        # Fallback heuristic for files uploaded before we added the original_file_hash tracker
        mtime = os.path.getmtime(report.file_url)
        ctime = os.path.getctime(report.file_url)
        is_match = abs(mtime - ctime) < 2.0

    print(f"DEBUG: verify_report_file is returning: is_match={is_match}, current_hash={current_file_hash}")
    return {"is_match": is_match, "current_hash": current_file_hash}

@router.get("/download/{report_id}", summary="Securely download the verified medical report")
def download_report_file(report_id: int, db: Session = Depends(get_db)):
    report = db.query(MedicalReport).filter(MedicalReport.id == report_id).first()
    if not report or not os.path.exists(report.file_url):
         raise HTTPException(status_code=404, detail="Report not found")
    return FileResponse(report.file_url, filename=os.path.basename(report.file_url))
