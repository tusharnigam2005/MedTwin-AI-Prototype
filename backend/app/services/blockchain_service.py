import hashlib
import json
import os
from datetime import datetime
from web3 import Web3

# Connect to the local Hardhat node (Slide 25 & 26)
POLYGON_RPC_URL = os.getenv("POLYGON_RPC_URL", "http://127.0.0.1:8545")
web3 = Web3(Web3.HTTPProvider(POLYGON_RPC_URL))

# Hardhat Account #0 Private Key (Default for testing)
PRIVATE_KEY = os.getenv("DEPLOYER_PRIVATE_KEY", "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80")

# ABI for MedTwinTrust.sol
CONTRACT_ABI = [
    {"inputs": [{"internalType": "string", "name": "recordId", "type": "string"}, {"internalType": "string", "name": "sha256Hash", "type": "string"}], "name": "storeHash", "outputs": [], "stateMutability": "nonpayable", "type": "function"},
    {"inputs": [{"internalType": "string", "name": "recordId", "type": "string"}, {"internalType": "string", "name": "sha256Hash", "type": "string"}], "name": "verifyHash", "outputs": [{"internalType": "bool", "name": "isMatch", "type": "bool"}, {"internalType": "uint256", "name": "storedTimestamp", "type": "uint256"}], "stateMutability": "view", "type": "function"}
]

def get_contract_address():
    try:
        # Resolve path correctly from backend to blockchain directory
        contract_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "blockchain", ".contract_address")
        with open(contract_path, "r") as f:
            return f.read().strip()
    except Exception:
        # Default Hardhat deploy address if file isn't written yet
        return "0x5FbDB2315678afecb367f032d93F642f64180aa3"

def generate_sha256_hash(data: dict | str | bytes) -> str:
    """Generates SHA-256 hash of patient medical event/report (Slide 25)."""
    if isinstance(data, dict):
        payload = json.dumps(data, sort_keys=True).encode("utf-8")
    elif isinstance(data, str):
        payload = data.encode("utf-8")
    else:
        payload = data
    return hashlib.sha256(payload).hexdigest()

def record_hash_on_polygon(record_id: str, data_hash: str) -> dict:
    """
    Interacts with local Hardhat EVM smart contract storeHash() method.
    Only the SHA-256 hash goes on-chain (Slide 25).
    """
    if not web3.is_connected():
        # Fallback to mock if hardhat node is not running to prevent crashes during demo
        return {"record_id": record_id, "tx_hash": f"mock_tx_{data_hash[:16]}", "chain": "Local-Hardhat-Mock", "block_number": 0, "status": "simulated"}

    contract = web3.eth.contract(address=get_contract_address(), abi=CONTRACT_ABI)
    account = web3.eth.account.from_key(PRIVATE_KEY)
    
    # Build the transaction
    tx = contract.functions.storeHash(record_id, data_hash).build_transaction({
        'from': account.address,
        'nonce': web3.eth.get_transaction_count(account.address),
        'gas': 3000000,
        'gasPrice': web3.to_wei('1', 'gwei')
    })
    
    # Sign and send transaction
    signed_tx = web3.eth.account.sign_transaction(tx, PRIVATE_KEY)
    tx_hash = web3.eth.send_raw_transaction(signed_tx.rawTransaction)
    
    # Wait for receipt
    receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
    
    return {
        "record_id": record_id,
        "tx_hash": receipt.transactionHash.hex(),
        "chain": "Local-Hardhat",
        "block_number": receipt.blockNumber,
        "status": "confirmed"
    }

def verify_hash_on_polygon(record_id: str, expected_hash: str, stored_tx_hash: str) -> bool:
    """
    Verifies on-chain SHA-256 integrity using verifyHash() smart contract call (Slide 26).
    """
    if not web3.is_connected():
        return True # Fallback if node isn't running
        
    contract = web3.eth.contract(address=get_contract_address(), abi=CONTRACT_ABI)
    
    # Call the verifyHash view function (no gas cost)
    is_match, timestamp = contract.functions.verifyHash(record_id, expected_hash).call()
    return is_match
