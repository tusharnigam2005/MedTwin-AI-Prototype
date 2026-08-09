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
# 2. PYDANTIC OUTPUT MODELS
# =========================================================

class MedicationReview(BaseModel):

    medication_name: str

    documented_dose: Optional[str] = None

    documented_frequency: Optional[str] = None

    documented_duration: Optional[str] = None

    review_status: Literal[
        "no_obvious_issue",
        "needs_review",
        "insufficient_information"
    ]

    observations: List[str] = Field(
        default_factory=list
    )

    confidence: float = Field(
        ge=0,
        le=1
    )


class MedicationSafetyFlag(BaseModel):

    flag: str

    severity: Literal[
        "informational",
        "attention",
        "urgent",
        "unknown"
    ]

    evidence: List[str] = Field(
        default_factory=list
    )

    affected_medications: List[str] = Field(
        default_factory=list
    )

    confidence: float = Field(
        ge=0,
        le=1
    )


class MedicationAgentOutput(BaseModel):

    medication_reviews: List[
        MedicationReview
    ] = Field(
        default_factory=list
    )

    safety_flags: List[
        MedicationSafetyFlag
    ] = Field(
        default_factory=list
    )

    missing_information: List[str] = Field(
        default_factory=list
    )

    requires_clinical_review: bool = True

    warnings: List[str] = Field(
        default_factory=list
    )


# =========================================================
# 3. MEDICATION AGENT
# =========================================================

class MedicationAgent:

    def __init__(self):

        self.client = genai.Client(
            api_key=GEMINI_API_KEY
        )


    def analyze_medications(
        self,
        patient_data: Dict[str, Any],
        health_prediction: Optional[
            Dict[str, Any]
        ] = None
    ) -> MedicationAgentOutput:

        if not patient_data:

            raise ValueError(
                "Patient data cannot be empty."
            )


        # -------------------------------------------------
        # CHECK WHETHER MEDICATIONS EXIST
        # -------------------------------------------------

        medications = patient_data.get(
            "medications",
            []
        )

        if not medications:

            return MedicationAgentOutput(

                medication_reviews=[],

                safety_flags=[],

                missing_information=[
                    "No medications were documented "
                    "in the provided medical report."
                ],

                requires_clinical_review=False,

                warnings=[
                    "Medication analysis could not be "
                    "performed because no documented "
                    "medications were available."
                ]
            )


        # -------------------------------------------------
        # GEMINI PROMPT
        # -------------------------------------------------

        prompt = f"""
You are the Medication Review Agent of the
MedTwin AI healthcare system.

Your responsibility is to review medications
that are ALREADY DOCUMENTED in the provided
patient data.

PATIENT DATA:

{patient_data}


HEALTH RISK ASSESSMENT:

{health_prediction}


STRICT SAFETY RULES:

1. DO NOT prescribe any new medication.

2. DO NOT recommend starting a medication.

3. DO NOT recommend stopping a medication.

4. DO NOT change or suggest changing:
   - dosage
   - frequency
   - duration

5. DO NOT independently diagnose diseases.

6. Review ONLY medications explicitly present
   in the patient data.

7. Never invent medications that are not present.

8. Never invent missing dosage, frequency,
   or duration information.

9. If medication information is missing,
   clearly report it as missing.

10. Do not claim a drug interaction,
    contraindication, or medication safety issue
    as established unless it is directly supported
    by the supplied information.

11. If reliable determination cannot be made from
    the supplied data, use:
    "insufficient_information"
    or an appropriate missing-information entry.

12. Do not treat the Gemini model as an authoritative
    drug-interaction database.

13. Any potentially important medication concern
    must be flagged for professional clinical review,
    not presented as an autonomous treatment decision.
14.Do not conclude that a medication is ineffective, failing,
or causing inadequate disease control merely because abnormal
lab values are present.

Do not use terms such as:
- "despite medication"
- "treatment failure"
- "suboptimal control due to current medication"
- "medication is ineffective"

unless the supplied data explicitly establishes:
- medication start date and duration,
- adherence,
- temporal relationship between medication use and lab results,
- and sufficient clinical context.

Treat medications and abnormal laboratory findings as separate
documented facts unless the provided evidence explicitly supports
a relationship between them.

If the relationship is uncertain, state that clinical context
is required rather than inferring causation or treatment failure.


FOR EACH DOCUMENTED MEDICATION:

Return:

- medication_name

- documented_dose

- documented_frequency

- documented_duration

- review_status:
    no_obvious_issue
    needs_review
    insufficient_information

- observations

- confidence


SAFETY FLAGS:

Only create a safety flag when the provided
patient/medication information gives a clear
reason to flag something for review.

Severity must be:

- informational
- attention
- urgent
- unknown

Provide the exact evidence supporting every flag.

If there is insufficient information to assess
something safely, report that under
missing_information rather than guessing.


IMPORTANT:

This output is decision-support information only.

It must not contain autonomous prescribing or
treatment instructions.
"""


        # -------------------------------------------------
        # CALL GEMINI
        # -------------------------------------------------

        try:

            response = (
                self.client.models.generate_content(

                    model="gemini-3.1-flash-lite",

                    contents=prompt,

                    config={

                        "response_mime_type":
                            "application/json",

                        "response_schema":
                            MedicationAgentOutput,

                        "temperature":
                            0
                    }
                )
            )

        except Exception as error:

            raise RuntimeError(
                f"Gemini medication analysis failed: "
                f"{error}"
            )


        # -------------------------------------------------
        # VALIDATE RESPONSE
        # -------------------------------------------------

        if not response.text:

            raise RuntimeError(
                "Gemini returned an empty response."
            )


        try:

            result = (
                MedicationAgentOutput
                .model_validate_json(
                    response.text
                )
            )

        except Exception as error:

            raise RuntimeError(
                f"Invalid Medication Agent response: "
                f"{error}"
            )


        return result