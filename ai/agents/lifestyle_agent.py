import os
from typing import List, Optional, Literal, Dict, Any

from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel, Field


# =========================================================
# 1. LOAD ENVIRONMENT
# =========================================================

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError(
        "GEMINI_API_KEY not found. "
        "Please add it to your .env file."
    )


# =========================================================
# 2. STRUCTURED OUTPUT MODELS
# =========================================================

class LifestyleRecommendation(BaseModel):

    category: Literal[
        "diet",
        "physical_activity",
        "sleep",
        "hydration",
        "stress_management",
        "general"
    ]

    title: str

    recommendation: str

    reason: str

    priority: Literal[
        "low",
        "moderate",
        "high"
    ]

    evidence: List[str] = Field(
        default_factory=list
    )

    confidence: float = Field(
        ge=0,
        le=1
    )


class LifestyleAgentOutput(BaseModel):

    recommendations: List[
        LifestyleRecommendation
    ] = Field(
        default_factory=list
    )

    missing_information: List[str] = Field(
        default_factory=list
    )

    safety_considerations: List[str] = Field(
        default_factory=list
    )

    requires_clinical_review: bool = False

    warnings: List[str] = Field(
        default_factory=list
    )


# =========================================================
# 3. LIFESTYLE OPTIMIZATION AGENT
# =========================================================

class LifestyleAgent:

    def __init__(self):

        self.client = genai.Client(
            api_key=GEMINI_API_KEY
        )


    def analyze_lifestyle(
        self,
        patient_data: Dict[str, Any],
        health_prediction: Optional[
            Dict[str, Any]
        ] = None,
        medication_analysis: Optional[
            Dict[str, Any]
        ] = None
    ) -> LifestyleAgentOutput:

        if not patient_data:

            raise ValueError(
                "Patient data cannot be empty."
            )


        # =================================================
        # BUILD PROMPT
        # =================================================

        prompt = f"""
You are the Lifestyle Optimization Agent of the
MedTwin AI healthcare system.

Your role is to provide safe, practical, and
evidence-grounded GENERAL lifestyle guidance based
only on the information available in the patient's
structured medical data and previous agent outputs.

PATIENT DATA:

{patient_data}


HEALTH RISK ASSESSMENT:

{health_prediction}


MEDICATION ANALYSIS:

{medication_analysis}


STRICT SAFETY RULES:

1. Do NOT diagnose any disease.

2. Do NOT prescribe medication.

3. Do NOT recommend starting, stopping, replacing,
   or changing the dose of any medication.

4. Do NOT claim that lifestyle changes can cure
   or reverse a disease.

5. Do NOT create highly specific medical diets,
   calorie targets, supplement doses, fluid targets,
   or exercise prescriptions unless sufficient
   validated patient information is available.

6. Do NOT assume information that is missing.

For example, do not assume:
- body weight
- BMI
- pregnancy status
- kidney function
- cardiovascular fitness
- allergies
- dietary restrictions
- physical disabilities
- smoking status
- alcohol consumption
- current activity level

unless explicitly provided.

7. Recommendations must be proportional to the
   available evidence.

8. If the medical report contains only limited
   information, provide conservative general
   wellness guidance rather than pretending the
   advice is highly personalized.

9. Do not infer that a medication is ineffective.

10. Do not make claims about drug-food interactions
    unless such information is reliably established
    in the supplied data.

11. If a recommendation may depend on medical
    conditions, medication, kidney function,
    cardiovascular status, pregnancy, or other
    missing clinical information, explicitly mention
    that professional review may be needed.

12. Never recommend extreme:
- diets
- fasting
- exercise
- hydration
- supplements

13. Every recommendation must have a reason.

14. When possible, link recommendations to actual
    evidence from the supplied data.

15. If there is not enough evidence for personalized
    guidance, put the missing information in
    missing_information.


CATEGORIES:

Recommendations may belong to:

- diet
- physical_activity
- sleep
- hydration
- stress_management
- general


FOR EACH RECOMMENDATION RETURN:

- category

- title

- recommendation

- reason

- priority:
    low
    moderate
    high

- evidence

- confidence between 0 and 1


IMPORTANT:

"priority" means the priority for considering the
lifestyle recommendation.

It does NOT represent medical emergency severity.


SAFETY CONSIDERATIONS:

Include relevant safety considerations where needed.

For example:

- consult a healthcare professional before major
  changes when significant medical conditions exist

- exercise recommendations may require medical
  clearance depending on health status

- hydration recommendations may depend on kidney
  or heart conditions


CLINICAL REVIEW:

Set requires_clinical_review=true when personalized
lifestyle recommendations require medical context
that is unavailable or when significant findings
should be professionally reviewed.

This system provides decision-support and general
wellness guidance only.

It must not replace professional medical advice.
"""


        # =================================================
        # CALL GEMINI
        # =================================================

        try:

            response = (
                self.client.models.generate_content(

                    model="gemini-3.1-flash-lite",

                    contents=prompt,

                    config={

                        "response_mime_type":
                            "application/json",

                        "response_schema":
                            LifestyleAgentOutput,

                        "temperature":
                            0
                    }
                )
            )

        except Exception as error:

            raise RuntimeError(
                f"Gemini lifestyle analysis failed: "
                f"{error}"
            )


        # =================================================
        # CHECK RESPONSE
        # =================================================

        if not response.text:

            raise RuntimeError(
                "Gemini returned an empty response."
            )


        # =================================================
        # VALIDATE WITH PYDANTIC
        # =================================================

        try:

            result = (
                LifestyleAgentOutput
                .model_validate_json(
                    response.text
                )
            )

        except Exception as error:

            raise RuntimeError(
                f"Invalid Lifestyle Agent response: "
                f"{error}"
            )


        return result