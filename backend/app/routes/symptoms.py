from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.symptom_service import recommend_test_for_symptoms

router = APIRouter(prefix="/api/symptoms", tags=["Symptoms"])

class SymptomQuery(BaseModel):
    query: str

@router.post("/recommend")
async def recommend_test(payload: SymptomQuery):
    if not payload.query or len(payload.query.strip()) < 3:
        raise HTTPException(status_code=400, detail="Query is too short.")
        
    result = recommend_test_for_symptoms(payload.query)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
        
    return result
