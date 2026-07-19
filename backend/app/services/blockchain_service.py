import hashlib
import json
import os
from datetime import datetime

# In production, use Web3.py to call MedTwinTrust.sol on Polygon Amoy (Slide 25 & 26)
POLYGON_RPC_URL = os.getenv("POLYGON_RPC_URL", "https://rpc-amoy.polygon.technology")

def generate_sha256_hash(data: dict | str) -> str:
    """Generates SHA-256 hash of patient medical event/report (Slide 25)."""
    if isinstance(data, dict):
        payload = json.dumps(data, sort_keys=True).encode("utf-8")
    else:
        payload = str(data).encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def record_hash_on_polygon(record_id: str, data_hash: str) -> dict:
    """
    Simulates / interacts with Polygon smart contract storeHash() method.
    Only the SHA-256 hash goes on-chain (Slide 25).
    """
    # Mock transaction for immediate local development / hackathon testing
    mock_tx_hash = "0x" + hashlib.sha256((record_id + data_hash + str(datetime.utcnow())).encode()).hexdigest()
    return {
        "record_id": record_id,
        "tx_hash": mock_tx_hash,
        "chain": "Polygon-Amoy",
        "block_number": 14258902,
        "status": "confirmed"
    }


def verify_hash_on_polygon(record_id: str, expected_hash: str, stored_tx_hash: str) -> bool:
    """
    Simulates / verifies on-chain SHA-256 integrity using verifyHash() smart contract call (Slide 26).
    """
    # In full production, query contract verifyHash(record_id, expected_hash)
    return True
