# 🧬 MedTwin AI — Autonomous AI Healthcare Digital Twin

> **MedTwin AI** is a persistent, continuously updated virtual model of a patient's medical state, powered by **Multi-Agent AI orchestration (LangGraph)** and secured by an **Immutable Blockchain Layer (Polygon)**.

## 🚀 Live Links
- 🌐 **Deployed Application**: [http://13.239.27.137:5173/](http://13.239.27.137:5173/)
- 🎥 **Demo Video**: [Watch on Google Drive](https://drive.google.com/file/d/1znYWZfhEb8mg85E34yCqPQnXe18clQU-/view?usp=sharing)

---

## 🚨 Problem Statement
Healthcare data today is heavily fragmented, reactive, and vulnerable to tampering. 
1. **Doctors** suffer from alert fatigue and lack unified, actionable patient insights due to manual chart reviews. 
2. **Patients** do not have a real-time, holistic view of their health trajectory and risk factors.
3. **Data Security** is compromised, with medical records lacking auditable, tamper-proof history, leading to privacy breaches and lack of trust.

## 💡 Our Solution
**MedTwin AI** acts as a true **Digital Twin** for patients. Instead of generic LLM chatbots, we utilize an **explicit, stateful Multi-Agent Pipeline (LangGraph)** that continuously digests new physical lab reports, prescriptions, and wearable vitals to dynamically update the patient's health state. 

To ensure absolute trust and HIPAA/GDPR compliance, raw data remains in a secure, private database. However, a cryptographic **SHA-256 hash of every medical event is permanently stored on the Polygon Blockchain**. This creates an immutable audit trail requiring Doctor cryptographic sign-offs, bridging AI innovation with Web3 security.

---

## ✨ Key Features & Portals

### 🧑‍⚕️ Patient Portal (Real-time Health Tracking)
* **Live Health Score**: A dynamic 0-100 wellness score calculated based on AI-analyzed vitals and lab results.
* **Risk Trajectory Charts**: Interactive historical health data visualization utilizing `Recharts`.
* **Automated Data Entry**: Drag-and-drop OCR pipeline to automatically parse physical blood test reports into structured JSON.

### 🩺 Doctor Portal (Verification & Audit)
* **AI Recommendation Queue**: Doctors review AI-generated risk flags, potential drug interactions, and lifestyle recommendations.
* **One-Click Cryptographic Sign-off**: Doctors approve AI suggestions, signing the transaction directly onto the Polygon blockchain via their Web3 wallet.

### 🧠 Deep Dive: The 5 Autonomous AI Agents (LangGraph)
Our AI layer completely bypasses traditional reactive prompts. We use a LangGraph `StateGraph` where 5 specialized agents operate over a persistent `MedTwinState`:
1. **Medical Report Agent**: Uses OCR to extract raw text from uploaded reports, parses it into structured lab values (e.g., `HbA1c: 6.8%`), and assigns a confidence score.
2. **Health Prediction Agent**: Analyzes the parsed data to output a disease risk score and determines if the patient's trend is improving or worsening.
3. **Medication Agent**: Cross-checks active prescriptions against new OCR data to prevent fatal drug interactions and manages scheduling.
4. **Lifestyle Agent**: Consolidates risk profiles into personalized daily targets (Diet, Sleep, Exercise, Hydration).
5. **Emergency Agent**: Bypasses the queue to alert on real-time vitals threshold breaches (e.g., `Sustained Heart Rate > 140bpm`).

### ⛓️ Deep Dive: Polygon Blockchain Security Layer
Medical records require absolute immutability. Our EVM Smart Contract (`MedTwinTrust.sol`) on the **Polygon Amoy Testnet** handles:
* **Tamper-Proof Hashing**: The backend generates a SHA-256 hash of the medical report. Only this hash is stored on-chain, keeping raw data private.
* **`verifyHash()`**: A function that instantly detects if a database record has been maliciously altered.
* **Doctor Approvals**: Records the exact timestamp and Wallet Address of the physician who approved the AI recommendation.

---

## 🏗️ System Architecture

```text
+-----------------------------------------------------------------------------------+
|                            REACT + TAILWIND CSS (Frontend)                        |
|                     Patient Dashboard | Doctor Portal | Admin UI                  |
+-----------------------------------------------------------------------------------+
                                         | REST API (JWT Auth)
                                         v
+-----------------------------------------------------------------------------------+
|                               FASTAPI (Python Backend)                            |
|                 Auth | Routing | ORM | Service Orchestration Layer                |
+-----------------------------------------------------------------------------------+
         |                               |                               |
         v (Task Invocation)             v (PostgreSQL/IPFS)             v (Ethers/Web3)
+-------------------------+     +-------------------------+     +-------------------------+
|     LANGGRAPH AI/ML     |     |       DATA LAYER        |     |     POLYGON BLOCKCHAIN  |
| 5 Specialized AI Agents |     | ACID-Compliant Postgres |     | Immutable Audit Trail   |
+-------------------------+     +-------------------------+     +-------------------------+
```

## 🛠️ Complete Technology Stack
* **Frontend**: React 18, Vite, Tailwind CSS (Glassmorphism), Recharts.
* **Backend**: Python 3.11+, FastAPI, SQLAlchemy, PostgreSQL.
* **AI/ML Layer**: LangGraph, Groq/OpenAI LLMs, PaddleOCR / Tesseract.
* **Blockchain Layer**: Polygon (Amoy Testnet), Solidity, Hardhat, Ethers.js.
* **Infrastructure**: Docker & Docker Compose / AWS EC2.

---

## 🚀 Step-by-Step Local Setup Guide

### Option 1: One-Click Docker Setup (Recommended)
You can spin up the entire application stack (Frontend, Backend, and Database) with a single command:
```bash
docker compose up --build
```
* **Frontend UI**: `http://localhost:5173`
* **FastAPI Swagger Docs**: `http://localhost:8000/docs`

### Option 2: Manual Setup
#### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
