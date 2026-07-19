import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import engine, Base
from app.routes import auth, reports, prediction, recommendation, history, blockchain, doctor

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

@app.get("/", tags=["Health Check"])
def health_check():
    return {
        "status": "online",
        "service": "MedTwin AI Backend",
        "version": "1.0.0",
        "docs_url": "/docs"
    }
