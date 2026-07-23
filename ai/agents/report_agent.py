import os
from typing import List, Optional

from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel, Field


# ---------------------------------------------------------
# 1. LOAD ENVIRONMENT VARIABLES
# ---------------------------------------------------------

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError(
        "GEMINI_API_KEY not found. Please add it to your .env file."
    )


# ---------------------------------------------------------
# 2. DEFINE STRUCTURED OUTPUT
# ---------------------------------------------------------

class PatientInfo(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None


class LabResult(BaseModel):
    test_name: str

    value: Optional[float] = None

    unit: Optional[str] = None

    reference_range: Optional[str] = None

    status: str = Field(
        description="One of: high, low, normal, unknown"
    )

    confidence: float = Field(
        ge=0,
        le=1
    )


class Medication(BaseModel):
    name: str

    dose: Optional[str] = None

    frequency: Optional[str] = None

    duration: Optional[str] = None

    confidence: float = Field(
        ge=0,
        le=1
    )


class MedicalReportOutput(BaseModel):

    patient: PatientInfo

    report_date: Optional[str] = None
    # Explicitly documented symptoms

    symptoms: List[str] = []

    # Explicitly documented clinical findings

    clinical_findings: List[str] = []

    lab_results: List[LabResult] = []

    diagnoses: List[str] = []

    medications: List[Medication] = []

    warnings: List[str] = []


# ---------------------------------------------------------
# 3. CREATE MEDICAL REPORT AGENT
# ---------------------------------------------------------

class MedicalReportAgent:

    def __init__(self):

        self.client = genai.Client(
            api_key=GEMINI_API_KEY
        )

    def analyze_report(
        self,
        report_text: str
    ) -> MedicalReportOutput:

        if not report_text or not report_text.strip():

            raise ValueError(
                "Medical report text cannot be empty."
            )

        prompt = f"""
You are the Medical Report Agent of the MedTwin AI healthcare system.

Your ONLY responsibility is to extract factual structured information
from a medical report.

STRICT SAFETY RULES:

1. Extract ONLY information explicitly present in the report.

2. NEVER invent:
   - patient information
   - symptoms
   - clinical findings
   - laboratory values
   - diagnoses
   - medications
   - dosages
   - dates

3. DO NOT diagnose diseases yourself.

4. DO NOT provide treatment recommendations.

5. DO NOT modify medication dosage.

6. If information is missing, return null or an empty list.

PATIENT INFORMATION:

Extract:
- name
- age
- gender

SYMPTOMS:

Extract every symptom explicitly documented in the report.

Examples may include:
- chest pain
- difficulty breathing
- dizziness
- fever
- vomiting
- headache
- weakness

IMPORTANT:
Do NOT infer symptoms from laboratory results or diagnoses.
Only extract symptoms explicitly written in the report.

If no symptoms are documented, return an empty list.


CLINICAL FINDINGS:

Extract any explicitly documented clinical findings, observations,
vital-sign abnormalities, or examination findings.

Do NOT invent or infer clinical findings.

If none are documented, return an empty list.


LABORATORY RESULTS:

For every laboratory test extract:

- test_name
- value
- unit
- reference_range
- status
- confidence

Status must be:

high
low
normal
unknown

Use the reference range written in the report when determining
whether the value is high, low, or normal.

If no reference range is available, use:

status = unknown


DIAGNOSES:

Extract diagnoses ONLY if they are explicitly written in the report.

Do not infer a diagnosis from laboratory values.


MEDICATIONS:

Extract:

- medicine name
- dose
- frequency
- duration
- confidence


CONFIDENCE:

Confidence must be between:

0 and 1

Lower the confidence when the information is unclear or ambiguous.


REPORT:

{report_text}
"""

        response = self.client.models.generate_content(

            model="gemini-3.1-flash-lite",

            contents=prompt,

            config={

                "response_mime_type":
                    "application/json",

                "response_schema":
                    MedicalReportOutput,

                "temperature":
                    0
            }
        )

        if not response.text:

            raise RuntimeError(
                "Gemini returned an empty response."
            )

        result = MedicalReportOutput.model_validate_json(
            response.text
        )

        return result


# ---------------------------------------------------------
# 4. SIMPLE LOCAL TEST
# ---------------------------------------------------------

if __name__ == "__main__":

    sample_report = """

   Patient Name: Rahul Sharma
   Age: 45
   Gender: Male
   Symptoms:
   Severe chest pain
   Difficulty breathing
   Dizziness
    """

    try:

        print(
            "\nStarting MedTwin Medical Report Agent..."
        )

        agent = MedicalReportAgent()

        print(
            "Sending report to Gemini...\n"
        )

        result = agent.analyze_report(
            sample_report
        )

        print(
            "===== AGENT 1 RESULT =====\n"
        )

        print(
            result.model_dump_json(
                indent=2
            )
        )

    except Exception as error:

        print(
            f"\nERROR: {error}"
        )