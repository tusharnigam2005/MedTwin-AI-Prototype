import os
import sys
import tempfile
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# ── IMPORTANT: load .env BEFORE importing any agents ──────────────────────
_env_path = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "ai", ".env"
)
load_dotenv(_env_path)
# Add project root to path so 'ai' package is importable
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# ──────────────────────────────────────────────────────────────────────────

from app.db.database import engine, Base
from app.routes import auth, reports, prediction, recommendation, history, blockchain, doctor, patient

from ai.document_processor import process_document
from ai.graph import medtwin_graph

# Initialize Database tables automatically on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MedTwin AI Backend API",
    description="Production-level FastAPI backend for Autonomous AI Healthcare Digital Twin (LangGraph + Polygon Blockchain)",
    version="1.0.0"
)

# Configure CORS for Frontend SPA (React + Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to frontend URL (e.g., http://localhost:5173)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers (Slide 33)
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(reports.router, prefix="/api/reports", tags=["Medical Reports & OCR"])
app.include_router(prediction.router, prefix="/api/prediction", tags=["Health Predictions"])
app.include_router(recommendation.router, prefix="/api/recommendation", tags=["Recommendations Engine"])
app.include_router(history.router, prefix="/api/history", tags=["Audit History"])
app.include_router(blockchain.router, prefix="/api/blockchain", tags=["Blockchain Verification"])
app.include_router(doctor.router, prefix="/api/doctor", tags=["Doctor Portal & Approvals"])
app.include_router(patient.router, prefix="/api/patient", tags=["Patient Profile & Onboarding"])

@app.get("/", tags=["Health Check"])
def health_check():
    return {
        "status": "online",
        "service": "MedTwin AI Backend",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@app.post("/analyze", tags=["AI LangGraph Pipeline"])
async def analyze_report(file: UploadFile = File(...)):
    """
    Accepts a medical report (PDF / JPG / PNG),
    runs the full 6-agent MedTwin pipeline,
    and returns structured JSON output.
    """
    allowed_types = {"application/pdf", "image/jpeg", "image/png"}
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. Use PDF, JPG, or PNG."
        )

    ext = os.path.splitext(file.filename)[1] or ".pdf"
    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name

        report_text = process_document(tmp_path)
        if not report_text or not report_text.strip():
            raise HTTPException(
                status_code=422,
                detail="Could not extract text from the uploaded file."
            )

        result = medtwin_graph.invoke({
            "report_text": report_text,
            "medical_report": None,
            "health_prediction": None,
            "health_forecast": None,
            "medication_analysis": None,
            "lifestyle_analysis": None,
            "emergency_analysis": None,
        })
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline error: {str(e)}")
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)
