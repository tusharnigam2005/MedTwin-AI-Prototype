# ⛓️ MedTwin AI — Blockchain Trust Layer (Blockchain Dev Domain)

Welcome to the **Blockchain Smart Contract** folder of `MedTwin AI`. As the **Blockchain Developer (`blockchain` branch)**, you own this directory.

---

## 🏗️ Architecture Overview

The blockchain layer ensures that **every verified event is hashed, signed, and made tamper-proof** (Slide 25 & 26). To comply with medical privacy (HIPAA/GDPR) and performance, **raw patient data never leaves our encrypted database** — only the cryptographic **SHA-256 hash** and doctor verification signatures are written to the EVM smart contract on the **Polygon Network**.

### Folder Structure (`blockchain/`)
```
blockchain/
├── contracts/
│   └── MedTwinTrust.sol   # Solidity contract implementing exact Slide 26 specification
├── scripts/
│   └── deploy.js          # Deployment script for local node and Polygon Amoy
├── hardhat.config.js      # Hardhat network & compiler configuration
└── package.json
```

---

## 📜 Smart Contract Architecture (`MedTwinTrust.sol` — Slide 26)

| Function | Description |
| :--- | :--- |
| **`storeHash()`** | Writes a new record's SHA-256 hash with a timestamp (`recordId`, `sha256Hash`) |
| **`verifyHash()`** | Confirms if a given document matches its on-chain hash and returns verification status |
| **`doctorApproval()`** | Records a doctor's wallet signature against a pending record upon human approval |
| **`patientConsent()`** | Stores patient consent flags (`allowed: true/false`) for each data-sharing scope |
| **`retrieveAudit()`** | Returns the full immutable history (`storedHash`, `submitter`, `doctorSigner`, timestamps) |

---

## 🚀 Quick Start (For Blockchain Dev)

### 1. Install Hardhat Dependencies
Open terminal inside `blockchain/`:
```bash
cd blockchain
npm install
```

### 2. Compile the Smart Contract
```bash
npx hardhat compile
```

### 3. Run a Local Hardhat Node (For Fast Hackathon Testing)
```bash
npx hardhat node
```
This spins up a local EVM network at `http://127.0.0.1:8545` with 20 pre-funded accounts.

### 4. Deploy Contract
To deploy to your local node:
```bash
npx hardhat run scripts/deploy.js --network localhost
```
To deploy to Polygon Amoy Testnet (ensure you set `DEPLOYER_PRIVATE_KEY` and `POLYGON_RPC_URL` in `.env`):
```bash
npx hardhat run scripts/deploy.js --network polygonAmoy
```

---

## 🔄 Daily Collaboration Checklist (For Blockchain Dev)

1. Check out your branch every morning: `git checkout blockchain`
2. Pull latest main from the Team Lead: `git fetch origin && git merge origin/main`
3. Modify or test contracts inside `contracts/` or add test scripts.
4. Commit and push: `git commit -m "feat(blockchain): optimize gas in storeHash" && git push origin blockchain`
5. Create a Pull Request on GitHub and ask the Team Lead (`backend`) to review & merge!
