# 🚀 MedTwin AI — FastAPI Backend (Team Lead & Backend Domain)

Welcome to the **Backend & Database** folder of `MedTwin AI`. As the **Project Lead & Backend Developer (`backend` branch)**, you own this directory.

---

## 🏗️ Architecture Overview

The backend is built with **Python 3.11+, FastAPI, SQLAlchemy ORM, and PostgreSQL**. It acts as the central orchestrator connecting:
1. **Frontend (React SPA)** via REST APIs & JWT Authentication.
2. **AI Layer (LangGraph)** via `app.services.ai_service`.
3. **Blockchain Layer (Polygon Amoy)** via `app.services.blockchain_service` and `BlockchainTx` audits.

### Folder Structure (`backend/`)
```
backend/
├── app/
│   ├── routes/        # REST API endpoints matching Slide 33
│   ├── controllers/   # Request handlers & validation
│   ├── services/      # Business logic (AI, Blockchain, Recommendations, Auth)
│   ├── models/        # SQLAlchemy ORM models matching Slide 12 PostgreSQL schema
│   ├── utils/         # Shared helpers (hashing, formatting)
│   └── db/            # Database engine & session management
├── main.py            # FastAPI entrypoint + CORS setup
├── requirements.txt   # Python dependencies
└── Dockerfile         # Container definition
```

---

## 📡 REST API Architecture (Slide 33)

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| **POST** | `/api/auth/signup` | Create a new patient/doctor/admin account |
| **POST** | `/api/auth/login` | Authenticate with credentials and issue JWT |
| **POST** | `/api/reports/upload` | Upload medical report for OCR extraction + LangGraph AI processing + Polygon hashing |
| **GET** | `/api/prediction/{patientId}` | Fetch latest disease risk score (0-100) and confidence score |
| **GET** | `/api/recommendation/{patientId}` | Fetch current doctor-verifiable recommendation set |
| **GET** | `/api/history/{patientId}` | Fetch full verified medical history & blockchain transaction audit trail |
| **POST** | `/api/blockchain/verify` | Verify a record's SHA-256 hash against on-chain Polygon data |
| **POST** | `/api/doctor/approve/{recordId}` | Doctor sign-off/approval action on pending AI recommendation |

---

## 🛠️ Running Locally During Development

### Option A: Using Docker Compose (Recommended)
From the root directory (`MedTwin_Prototype/`):
```bash
docker compose up --build backend postgres
```
API Documentation (Swagger UI) will be live at: **http://localhost:8000/docs**

### Option B: Running Directly with Python Virtual Environment
If running without Docker:
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
*(If PostgreSQL is not running locally, the backend automatically falls back to `sqlite:///./medtwin_local.db` for seamless hackathon prototyping!)*

---

## 🔄 Daily Collaboration Checklist (For Team Lead)

1. Check out your branch: `git checkout backend`
2. Pull latest main: `git fetch origin && git merge origin/main`
3. Write your backend logic or database migrations.
4. Commit and push: `git commit -m "feat(backend): add verification endpoint" && git push origin backend`
5. Review your teammates' (`frontend`, `blockchain`, `aiml`) Pull Requests on GitHub and merge into `main`!
