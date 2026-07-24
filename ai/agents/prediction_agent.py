import os
from typing import List, Literal

from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel, Field


load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found.")


# -----------------------------
# OUTPUT SCHEMA
# -----------------------------

class RiskAssessment(BaseModel):

    risk: str

    level: Literal[
        "low",
        "moderate",
        "high",
        "unknown"
    ]

    evidence: List[str] = []

    confidence: float = Field(
        ge=0,
        le=1
    )


class HealthPredictionOutput(BaseModel):

    risk_assessments: List[RiskAssessment] = []

    missing_information: List[str] = []

    requires_clinical_review: bool = True

    warnings: List[str] = []


# -----------------------------
# HEALTH PREDICTION AGENT
# -----------------------------

class HealthPredictionAgent:

    def __init__(self):

        self.client = genai.Client(
            api_key=GEMINI_API_KEY
        )

    def analyze_health_risk(
        self,
        patient_data: dict
    ) -> HealthPredictionOutput:

        if not patient_data:
            raise ValueError(
                "Patient data cannot be empty."
            )

        prompt = f"""
You are the Health Risk Assessment Agent
of the MedTwin AI healthcare system.

Your role is to identify observable risk indicators
from the provided structured patient data.

─────────────────────────────────────────
STRICT SAFETY AND LANGUAGE RULES
─────────────────────────────────────────

1. Do NOT issue a definitive clinical diagnosis.

2. Do NOT prescribe or recommend medication changes.

3. Do NOT use subjective clinical judgement labels.

   FORBIDDEN phrases (do not use these):
   - "uncontrolled"
   - "poorly controlled"
   - "complicated diabetes"
   - "high risk of complications"
   - "indicating poor long-term glycemic control"
   - "indicating elevated" (as a conclusion)

4. Do NOT predict complications from a single report.
   A single lab result or single visit is insufficient
   to predict future complications.

5. Use NEUTRAL, OBSERVABLE risk statements only.

   PREFERRED phrasings:
   - "Elevated glycemic markers"
   - "Abnormal glucose-related findings"
   - "Potential glycemic control concern"
   - "Above-range HbA1c value"
   - "Above-range fasting glucose value"

6. Every risk statement must be directly supported
   by specific values in the provided data.
   Do not infer beyond what is explicitly present.

7. When evidence is insufficient to assess a risk,
   state that clinical assessment is required
   rather than guessing.

8. Evidence items must quote the actual value and
   reference range from the data. Example:
   "HbA1c: 7.8% (reference range: 4.0 - 5.6 %)"

9. Confidence must reflect data completeness.
   A single report with limited context should
   have confidence ≤ 0.95.

10. Identify missing information that limits
    the completeness of the assessment.

─────────────────────────────────────────
OUTPUT FIELDS
─────────────────────────────────────────

For each observable risk indicator return:

risk       → neutral, observable description
level      → low | moderate | high | unknown
evidence   → list of direct quotes from the data
confidence → float between 0 and 1

Always set requires_clinical_review = true
when findings require professional interpretation.

─────────────────────────────────────────
PATIENT DATA
─────────────────────────────────────────

{patient_data}
"""

        response = self.client.models.generate_content(

            model="gemini-3.1-flash-lite",

            contents=prompt,

            config={
                "response_mime_type":
                    "application/json",

                "response_schema":
                    HealthPredictionOutput,

                "temperature": 0
            }
        )

        if not response.text:

            raise RuntimeError(
                "Gemini returned an empty response."
            )

        return HealthPredictionOutput.model_validate_json(
            response.text
        )
