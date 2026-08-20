import os
import json
from typing import List, Optional

from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel, Field


# =========================================================
# 1. LOAD ENVIRONMENT VARIABLES
# =========================================================

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError(
        "GEMINI_API_KEY not found. Please add it to your .env file."
    )


# =========================================================
# 2. PYDANTIC OUTPUT SCHEMAS
# =========================================================

class FutureRisk(BaseModel):

    risk: str

    risk_level: str = Field(
        description="One of: low, moderate, high, uncertain"
    )

    time_horizon: Optional[str] = Field(
        default=None,
        description=(
            "Approximate future time horizon only when supported "
            "by the available evidence."
        )
    )

    evidence: List[str] = []

    explanation: str

    confidence: float = Field(
        ge=0,
        le=1
    )


class DailyHealthForecast(BaseModel):

    day: int = Field(
        ge=1,
        le=7
    )

    possible_health_status: List[str] = []

    risk_level: str = Field(
        description="One of: low, moderate, high, uncertain"
    )

    evidence: List[str] = []

    explanation: str

    confidence: float = Field(
        ge=0,
        le=1
    )


class HealthForecastOutput(BaseModel):

    overall_forecast: str

    future_risks: List[FutureRisk] = []

    seven_day_forecast: List[DailyHealthForecast] = []

    missing_information: List[str] = []

    requires_clinical_review: bool = False

    warnings: List[str] = []


# =========================================================
# 3. HEALTH FORECAST / PREDICTION AGENT
# =========================================================

class HealthForecastAgent:

    def __init__(self):

        self.client = genai.Client(
            api_key=GEMINI_API_KEY
        )


    def predict_health(

        self,

        patient_data: dict,

        health_analysis: dict

    ) -> HealthForecastOutput:


        if not patient_data:

            raise ValueError(
                "Patient medical data cannot be empty."
            )


        if not health_analysis:

            raise ValueError(
                "Health analysis cannot be empty."
            )


        patient_json = json.dumps(
            patient_data,
            indent=2
        )


        analysis_json = json.dumps(
            health_analysis,
            indent=2
        )


        prompt = f"""
You are the Health Forecast Agent of the MedTwin AI healthcare system.

You receive:

1. Structured patient medical data extracted from a medical document.
2. Current health/risk analysis produced by another agent.

Your responsibility is to create a CAUTIOUS, EVIDENCE-BASED health
forecast from the available information.

You have TWO tasks:

TASK 1:
Identify possible FUTURE HEALTH RISKS.

TASK 2:
Create a cautious DAY 1 TO DAY 7 HEALTH FORECAST.


=========================================================
CRITICAL SAFETY RULES
=========================================================

1. NEVER claim that a future event will definitely happen.

Do NOT say:

"The patient will develop fever tomorrow."

Instead say:

"Fever may be possible if supported by the current clinical evidence."

2. NEVER invent symptoms.

A possible future symptom must have a reasonable connection to:

- documented symptoms
- clinical findings
- laboratory abnormalities
- explicitly documented diagnoses
- current health/risk analysis

3. DO NOT create a new diagnosis.

You may describe:

- possible health deterioration
- persistence of existing abnormalities
- possible symptom progression
- future health risks

But do not diagnose a new disease.

4. DO NOT invent exact probabilities.

Confidence represents how strongly the available information supports
the forecast.

It is NOT the statistical probability that the event will happen.

5. DAY-WISE FORECASTING MUST BE CAUTIOUS.

You MUST return exactly:

Day 1
Day 2
Day 3
Day 4
Day 5
Day 6
Day 7

For each day, provide:

- possible_health_status
- risk_level
- evidence
- explanation
- confidence

6. DO NOT invent different symptoms just to make every day unique.

For example, do NOT create:

Day 1 -> fever
Day 2 -> eye burning
Day 3 -> headache

unless each prediction is actually supported by the available
medical evidence.

It is completely acceptable for several days to have similar
forecasts.

Example:

Day 1:
"Existing symptoms may persist."

Day 2:
"Current abnormalities may continue without appropriate clinical
management."

7. If there is NOT enough information to predict a specific
day-by-day symptom, clearly state:

"No specific new symptom can be reliably predicted from the
available data."

Use:

risk_level = "uncertain"

and lower confidence.

8. If the patient has EMERGENCY RED FLAGS such as:

- severe chest pain
- severe difficulty breathing
- very low oxygen saturation
- loss of consciousness
- severe bleeding
- signs of acute medical instability

DO NOT pretend to predict the natural 7-day progression.

Instead, clearly state that the patient's future health trajectory
depends on immediate medical evaluation and treatment.

The Day 1-7 forecast should emphasize that reliable progression
cannot be predicted without knowing the outcome of emergency
medical care.

9. Do NOT recommend:

- prescription medication changes
- medication dosage changes
- stopping medications
- starting new prescription drugs

10. Use ONLY the information provided below.


=========================================================
FUTURE RISK ANALYSIS
=========================================================

For each possible future risk return:

- risk
- risk_level
- time_horizon
- evidence
- explanation
- confidence

Allowed risk levels:

low
moderate
high
uncertain


=========================================================
7-DAY HEALTH FORECAST
=========================================================

Return exactly 7 entries.

Day 1 through Day 7.

Each entry must contain:

day
possible_health_status
risk_level
evidence
explanation
confidence


=========================================================
IMPORTANT DISTINCTION
=========================================================

Current Health Analysis answers:

"What health concerns are present NOW?"

Your job answers:

"What possible future health risks or short-term health trajectory
may be reasonably anticipated from the available evidence?"

Do not simply copy the current health analysis.

Do not overstate predictive certainty.


=========================================================
PATIENT MEDICAL DATA
=========================================================

{patient_json}


=========================================================
CURRENT HEALTH ANALYSIS
=========================================================

{analysis_json}

"""


        response = self.client.models.generate_content(

            model="gemini-3.1-flash-lite",

            contents=prompt,

            config={

                "response_mime_type":
                    "application/json",

                "response_schema":
                    HealthForecastOutput,

                "temperature":
                    0
            }
        )


        if not response.text:

            raise RuntimeError(
                "Gemini returned an empty response."
            )


        result = HealthForecastOutput.model_validate_json(
            response.text
        )


        # Extra validation:
        # Ensure Gemini returned exactly Day 1 - Day 7

        days = [
            forecast.day
            for forecast in result.seven_day_forecast
        ]


        if days != [1, 2, 3, 4, 5, 6, 7]:

            raise ValueError(
                "Prediction Agent must return exactly "
                "Day 1 through Day 7 in order."
            )


        return result


# =========================================================
# 4. SIMPLE LOCAL TEST
# =========================================================

if __name__ == "__main__":

    sample_patient_data = {

        "patient": {
            "name": "Test Patient",
            "age": 58,
            "gender": "Male"
        },

        "symptoms": [
            "General weakness",
            "Increased thirst"
        ],

        "clinical_findings": [
            "Blood Pressure 150/95 mmHg",
            "BMI 30 kg/m²"
        ],

        "lab_results": [

            {
                "test_name": "HbA1c",
                "value": 8.6,
                "unit": "%",
                "reference_range": "4.0 - 5.6 %",
                "status": "high",
                "confidence": 1.0
            },

            {
                "test_name": "Fasting Blood Glucose",
                "value": 176,
                "unit": "mg/dL",
                "reference_range": "70 - 100 mg/dL",
                "status": "high",
                "confidence": 1.0
            }

        ],

        "diagnoses": [
            "Type 2 Diabetes Mellitus",
            "Hypertension"
        ],

        "medications": [
            {
                "name": "Metformin",
                "dose": "500 mg",
                "frequency": "Twice daily",
                "duration": "Long-term"
            }
        ]
    }


    sample_health_analysis = {

        "risk_assessments": [

            {
                "risk": "Elevated glycemic markers",
                "level": "high",
                "evidence": [
                    "HbA1c: 8.6%",
                    "Fasting Blood Glucose: 176 mg/dL"
                ],
                "confidence": 0.95
            },

            {
                "risk": "Elevated blood pressure",
                "level": "high",
                "evidence": [
                    "Blood Pressure: 150/95 mmHg"
                ],
                "confidence": 0.95
            }

        ],

        "requires_clinical_review": True
    }


    try:

        print(
            "\nStarting Health Forecast Agent..."
        )


        agent = HealthForecastAgent()


        result = agent.predict_health(

            patient_data=
                sample_patient_data,

            health_analysis=
                sample_health_analysis
        )


        print(
            "\n===== HEALTH FORECAST RESULT =====\n"
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