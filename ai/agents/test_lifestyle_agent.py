from .lifestyle_agent import LifestyleAgent


# =========================================================
# SAMPLE AGENT 1 OUTPUT
# =========================================================

sample_patient_data = {

    "patient": {
        "name": "Rahul Sharma",
        "age": 45,
        "gender": "Male"
    },

    "report_date": "20 July 2026",

    "lab_results": [

        {
            "test_name": "HbA1c",
            "value": 7.8,
            "unit": "%",
            "reference_range": "4.0 - 5.6 %",
            "status": "high",
            "confidence": 1.0
        },

        {
            "test_name": "Fasting Blood Glucose",
            "value": 145,
            "unit": "mg/dL",
            "reference_range": "70 - 100 mg/dL",
            "status": "high",
            "confidence": 1.0
        }
    ],

    "diagnoses": [
        "Type 2 Diabetes Mellitus"
    ],

    "medications": [

        {
            "name": "Metformin",
            "dose": "500 mg",
            "frequency": "twice daily",
            "duration": "30 days",
            "confidence": 1.0
        }
    ]
}


# =========================================================
# SAMPLE AGENT 2 OUTPUT
# =========================================================

sample_health_prediction = {

    "risk_assessments": [

        {
            "risk": "Elevated glycemic markers",

            "level": "high",

            "evidence": [
                "HbA1c: 7.8%",
                "Fasting Blood Glucose: 145 mg/dL"
            ],

            "confidence": 0.9
        }
    ],

    "missing_information": [

        "Historical laboratory results",

        "Current lifestyle information",

        "Other relevant clinical information"
    ],

    "requires_clinical_review": True,

    "warnings": []
}


# =========================================================
# SAMPLE AGENT 3 OUTPUT
# =========================================================

sample_medication_analysis = {

    "medication_reviews": [

        {
            "medication_name":
                "Metformin",

            "documented_dose":
                "500 mg",

            "documented_frequency":
                "twice daily",

            "documented_duration":
                "30 days",

            "review_status":
                "needs_review",

            "observations": [

                "Metformin is documented in the "
                "provided medical data.",

                "Elevated glycemic markers are "
                "also present."
            ],

            "confidence":
                0.9
        }
    ],

    "safety_flags": [],

    "missing_information": [

        "Medication adherence",

        "Medication start date relative "
        "to laboratory results"
    ],

    "requires_clinical_review":
        True,

    "warnings": []
}


# =========================================================
# TEST AGENT 4
# =========================================================

def main():

    try:

        print(
            "\nStarting Lifestyle "
            "Optimization Agent...\n"
        )

        agent = LifestyleAgent()


        result = agent.analyze_lifestyle(

            patient_data=
                sample_patient_data,

            health_prediction=
                sample_health_prediction,

            medication_analysis=
                sample_medication_analysis
        )


        print(
            "===== AGENT 4 RESULT =====\n"
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


if __name__ == "__main__":

    main()