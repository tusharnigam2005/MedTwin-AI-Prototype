# MedTwin AI — Autonomous AI Healthcare Digital Twin

**MedTwin AI** is a persistent, continuously updated virtual model of a patient's medical state powered by **Multi-Agent AI (LangGraph)** and **Blockchain (Polygon)**.

---

## 🏗️ System Architecture & Technology Stack

```
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
| + OCR Document Pipeline |     | + IPFS Report Storage   |     | Doctor Signature Verify |
+-------------------------+     +-------------------------+     +-------------------------+
```

### Technology Stack (Slide 31)
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts (`frontend/`)
- **Backend**: Python 3.11+, FastAPI, SQLAlchemy, Pydantic, PostgreSQL (`backend/`)
- **AI/ML Layer**: LangGraph, Groq/OpenAI LLMs, PaddleOCR / Tesseract (`ai/`)
- **Blockchain Layer**: Polygon (Amoy Testnet), Solidity, Hardhat, Ethers.js (`blockchain/`)
- **Infrastructure**: Docker & Docker Compose (`docker-compose.yml`)

---

## 👥 Hackathon Team & Branch Strategy

We have 4 dedicated developers working in parallel. To ensure **zero merge conflicts** and maintain absolute stability, each developer owns their specific domain directory and Git branch:

| Developer Role | Git Branch | Assigned Directory | Key Responsibilities |
| :--- | :--- | :--- | :--- |
| **Project Lead & Backend Dev** | `backend` & `main` | `backend/` | FastAPI routes, PostgreSQL database schema, REST endpoints, team PR review & merges |
| **Frontend Developer** | `frontend` | `frontend/` | React SPA, Role-based dashboards (Patient/Doctor/Admin), Tailwind styling, API integration |
| **Blockchain Developer** | `blockchain` | `blockchain/` | `MedTwinTrust.sol` smart contract, Polygon deployment scripts, SHA-256 hash verification |
| **AI / ML Developer** | `aiml` | `ai/` | LangGraph 5-agent state graph, PaddleOCR/Tesseract pipeline, prompt engineering & RAG |

---

## 🚀 Daily Collaboration & Git Workflow Guide

> [!IMPORTANT]
> **RULE #1**: Only the **Team Lead** (`backend`) merges pull requests into the `main` branch after code review. No direct pushes to `main` by anyone else!
> **RULE #2**: Work only inside your assigned folder (`frontend/`, `backend/`, `blockchain/`, or `ai/`) on your specific dev branch (`frontend`, `blockchain`, `aiml`).

### 1. Initial Setup for All Developers (Run Once)
Clone the repository and switch to your assigned development branch:
```bash
# Clone the repository
git clone https://github.com/<your-username>/MedTwin-AI.git
cd MedTwin-AI

# Switch to your assigned branch (example for Frontend dev):
git checkout -b frontend origin/frontend
```

### 2. Daily Morning Routine (Stay in Sync!)
Before writing code every morning, pull any changes that were merged into `main` overnight:
```bash
git fetch origin
git merge origin/main
```
*Since everyone works in separate directories, this will merge cleanly without conflicts!*

### 3. Writing Code & Committing
While working inside your folder (`frontend/`, `blockchain/`, `ai/`), commit frequently:
```bash
git status
git add .
git commit -m "feat(frontend): implement risk chart in patient dashboard"
```

### 4. Pushing Code at the End of the Day
Push only to your assigned remote branch:
```bash
# Frontend dev:
git push origin frontend

# Blockchain dev:
git push origin blockchain

# AI/ML dev:
git push origin aiml

# Backend dev (Lead):
git push origin backend
```

### 5. Requesting Review & Merging into `main`
When your feature or daily task is complete:
1. Open GitHub $\rightarrow$ Go to **Pull Requests** $\rightarrow$ Click **New Pull Request**.
2. Set **base: `main`** $\leftarrow$ **compare: `frontend`** (or your branch).
3. Assign the **Team Lead** for review.
4. The Team Lead reviews, tests, and clicks **Merge Pull Request**.

---

## ⚡ Quick Start (Local Docker Setup)

To spin up the full stack locally with a single command (`docker-compose.yml` from Slide 35):
```bash
docker compose up --build
```
- **Frontend App**: `http://localhost:5173`
- **Backend API & Swagger Docs**: `http://localhost:8000/docs`
- **PostgreSQL Database**: `localhost:5432` (User: `postgres`, Pass: `postgres`)

Refer to the individual `README.md` files inside `backend/`, `frontend/`, `blockchain/`, and `ai/` for detailed domain-specific instructions.
