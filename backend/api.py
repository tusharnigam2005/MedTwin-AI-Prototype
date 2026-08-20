"""
MedTwin AI - FastAPI Bridge Server
Connects the React frontend to the 6-agent LangGraph pipeline.
Run with: black/bin/python -m uvicorn backend.api:app --reload --port 8000
"""
import os
import sys
import tempfile

# ── IMPORTANT: load .env BEFORE importing any agents ──────────────────────
# The .env file lives at ai/.env — load it explicitly so GEMINI_API_KEY
# is available regardless of which directory uvicorn is launched from.
from dotenv import load_dotenv

_env_path = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "ai", ".env"
)
load_dotenv(_env_path)
# ──────────────────────────────────────────────────────────────────────────

# Add project root to path so 'ai' package is importable
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from ai.document_processor import process_document
from ai.graph import medtwin_graph


app = FastAPI(
    title="MedTwin AI Pipeline API",
    description="Bridges the React frontend to the 6-agent LangGraph pipeline",
    version="1.0.0",
)

# Allow React dev server (port 3000) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {"status": "online", "service": "MedTwin AI", "version": "1.0.0"}


@app.post("/analyze")
async def analyze_report(file: UploadFile = File(...)):
    """
    Accepts a medical report (PDF / JPG / PNG),
    runs the full 6-agent MedTwin pipeline,
    and returns structured JSON output.
    """

    # Validate file type
    allowed_types = {"application/pdf", "image/jpeg", "image/png"}
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. Use PDF, JPG, or PNG."
        )

    # Save to temp file
    ext = os.path.splitext(file.filename)[1] or ".pdf"
    tmp_path = None

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name

        # Step 1 — OCR / document processing
        report_text = process_document(tmp_path)

        if not report_text or not report_text.strip():
            raise HTTPException(
                status_code=422,
                detail="Could not extract text from the uploaded file."
            )

        # Step 2 — Run 6-agent LangGraph pipeline
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
