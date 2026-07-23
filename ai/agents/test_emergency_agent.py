from .emergency_agent import EmergencyAgent


# =========================================================
# SAMPLE AGENT 1 OUTPUT
# =========================================================

sample_patient_data = {

    "patient": {
        "name": "Test Patient",
        "age": 45,
        "gender": "M"
    },

    "symptoms": [
        "severe chest pain",
        "difficulty breathing"
    ],

    "lab_results": [],

    "diagnoses": [],

    "medications": [],

    "warnings": []
}


# =========================================================
# SAMPLE AGENT 2 OUTPUT
# =========================================================

sample_health_prediction = {

    "risk_assessments": [

        {
            "risk":
                "Below-range lymphocyte percentage",

            "level":
                "low",

            "evidence": [
                "LYMPHOCYTE: 18%"
            ],

            "confidence":
                0.9
        }
    ],

    "requires_clinical_review":
        True
}


# =========================================================
# SAMPLE AGENT 3 OUTPUT
# =========================================================

sample_medication_analysis = {

    "medication_reviews": [],

    "safety_flags": [],

    "requires_clinical_review":
        False
}


# =========================================================
# SAMPLE AGENT 4 OUTPUT
# =========================================================

sample_lifestyle_analysis = {

    "recommendations": [

        {
            "category":
                "general",

            "title":
                "Professional Medical Consultation",

            "recommendation":
                "Discuss the results with a "
                "healthcare professional.",

            "priority":
                "high"
        }
    ],

    "requires_clinical_review":
        True
}


# =========================================================
# TEST AGENT 5
# =========================================================

def main():

    try:

        print(
            "\nStarting Emergency/Triage Agent...\n"
        )


        agent = EmergencyAgent()


        result = agent.analyze_emergency(

            patient_data=
                sample_patient_data,

            health_prediction=
                sample_health_prediction,

            medication_analysis=
                sample_medication_analysis,

            lifestyle_analysis=
                sample_lifestyle_analysis
        )


        print(
            "===== AGENT 5 RESULT =====\n"
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