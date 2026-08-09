import os
from typing import List, Literal, Dict, Any, Optional

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
        "GEMINI_API_KEY not found in .env file."
    )


# =========================================================
# 2. OUTPUT MODELS
# =========================================================

class EmergencyAlert(BaseModel):

    title: str

    severity: Literal[
        "routine",
        "urgent",
        "emergency"
    ]

    evidence: List[str] = Field(
        default_factory=list
    )

    reason: str

    confidence: float = Field(
        ge=0,
        le=1
    )


class EmergencyAgentOutput(BaseModel):

    triage_level: Literal[
        "routine",
        "urgent",
        "emergency",
        "insufficient_information"
    ]

    alerts: List[
        EmergencyAlert
    ] = Field(
        default_factory=list
    )

    recommended_action: str

    emergency_services_needed: bool = False

    reasoning_summary: str

    missing_information: List[str] = Field(
        default_factory=list
    )

    warnings: List[str] = Field(
        default_factory=list
    )

    confidence: float = Field(
        ge=0,
        le=1
    )


# =========================================================
# 3. DETERMINISTIC SAFETY LAYER
# =========================================================

def detect_explicit_red_flags(
    patient_data: Dict[str, Any]
) -> List[str]:

    """
    Conservative deterministic safety layer.

    This does NOT diagnose emergencies.

    It only detects explicit emergency symptom phrases
    if they are actually present in the supplied data.

    In production, replace/extend this with medically
    validated rules reviewed by clinicians.
    """

    red_flags = []

    text = str(
        patient_data
    ).lower()

    emergency_phrases = [

        "severe chest pain",

        "difficulty breathing",

        "unable to breathe",

        "loss of consciousness",

        "unconscious",

        "seizure",

        "severe bleeding",

        "suicidal thoughts",

        "anaphylaxis",

        "severe allergic reaction"
    ]

    for phrase in emergency_phrases:

        if phrase in text:

            red_flags.append(
                f"Explicit red-flag phrase detected: "
                f"{phrase}"
            )

    return red_flags


# =========================================================
# 4. EMERGENCY / TRIAGE AGENT
# =========================================================

class EmergencyAgent:

    def __init__(self):

        self.client = genai.Client(
            api_key=GEMINI_API_KEY
        )


    def analyze_emergency(

        self,

        patient_data: Dict[str, Any],

        health_prediction: Optional[
            Dict[str, Any]
        ] = None,

        medication_analysis: Optional[
            Dict[str, Any]
        ] = None,

        lifestyle_analysis: Optional[
            Dict[str, Any]
        ] = None

    ) -> EmergencyAgentOutput:


        if not patient_data:

            raise ValueError(
                "Patient data cannot be empty."
            )


        # =================================================
        # STEP 1 — DETERMINISTIC SAFETY CHECK
        # =================================================

        deterministic_flags = (
            detect_explicit_red_flags(
                patient_data
            )
        )


        # =================================================
        # STEP 2 — GEMINI CONTEXTUAL TRIAGE
        # =================================================

        prompt = f"""
You are the Emergency and Triage Safety Agent
of the MedTwin AI healthcare system.

Your task is to assess whether the AVAILABLE
information indicates:

- routine follow-up
- urgent professional evaluation
- a possible emergency requiring immediate care
- insufficient information

You are a SAFETY TRIAGE layer.

You are NOT a diagnostic or treatment system.


PATIENT / REPORT DATA:

{patient_data}


HEALTH RISK ASSESSMENT:

{health_prediction}


MEDICATION ANALYSIS:

{medication_analysis}


LIFESTYLE ANALYSIS:

{lifestyle_analysis}


DETERMINISTIC RED-FLAG CHECK:

{deterministic_flags}


STRICT SAFETY RULES:

1. DO NOT diagnose a medical condition.

2. DO NOT prescribe medication.

3. DO NOT recommend changing medication dosage.

4. DO NOT invent symptoms that are not provided.

5. DO NOT assume the patient has symptoms simply
   because laboratory values are abnormal.

6. Mild or moderately out-of-range laboratory values
   alone must NOT automatically be classified as an
   emergency.

7. Do NOT classify something as an emergency simply
   because another agent says:
   "requires_clinical_review = true".

Clinical review does NOT automatically mean emergency.

8. Distinguish carefully between:

ROUTINE:
No explicit evidence of immediate danger.
Normal follow-up or non-emergency clinical review
may still be appropriate.

URGENT:
Available evidence suggests prompt professional
medical evaluation may be appropriate, but there
is no clear evidence requiring immediate emergency
services.

EMERGENCY:
Use only when the supplied information contains
clear evidence of a potentially immediate serious
safety concern.

INSUFFICIENT_INFORMATION:
Use when there is not enough information to make
a meaningful triage assessment.

9. Never create emergency symptoms from laboratory
results alone.

10. Every alert must cite exact evidence from the
provided information.

11. If deterministic red flags are present, consider
them carefully, but still explain exactly what
triggered escalation.

12. Do NOT downgrade a clear explicit emergency
red flag merely because other laboratory results
appear normal.

13. emergency_services_needed=true should ONLY be
used when the available evidence supports immediate
emergency evaluation.

14. If emergency_services_needed=true, the
recommended action should clearly direct the person
to seek immediate emergency medical help or contact
local emergency services.

15. Do not provide home treatment instructions for
a suspected emergency.

16. Do not claim certainty when important clinical
information is missing.


RETURN:

triage_level:
- routine
- urgent
- emergency
- insufficient_information

alerts:
For each alert:
- title
- severity
- evidence
- reason
- confidence

recommended_action

emergency_services_needed

reasoning_summary

missing_information

warnings

confidence


IMPORTANT:

This is decision-support triage.

It does not replace evaluation by a qualified
healthcare professional.
"""


        try:

            response = (
                self.client.models.generate_content(

                    model="gemini-3.1-flash-lite",

                    contents=prompt,

                    config={

                        "response_mime_type":
                            "application/json",

                        "response_schema":
                            EmergencyAgentOutput,

                        "temperature":
                            0
                    }
                )
            )

        except Exception as error:

            raise RuntimeError(
                f"Emergency Agent Gemini call failed: "
                f"{error}"
            )


        if not response.text:

            raise RuntimeError(
                "Gemini returned an empty response."
            )


        try:

            result = (
                EmergencyAgentOutput
                .model_validate_json(
                    response.text
                )
            )

        except Exception as error:

            raise RuntimeError(
                f"Invalid Emergency Agent response: "
                f"{error}"
            )


        return result