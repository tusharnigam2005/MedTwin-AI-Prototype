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
