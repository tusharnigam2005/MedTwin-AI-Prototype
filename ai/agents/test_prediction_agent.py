from .prediction_agent import HealthPredictionAgent


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
    ]
}


def main():
    try:
        print("Starting Health Prediction Agent...\n")

        agent = HealthPredictionAgent()

        result = agent.analyze_health_risk(
            sample_patient_data
        )

        print("===== AGENT 2 RESULT =====\n")
        print(result.model_dump_json(indent=2))

    except Exception as error:
        print(f"ERROR: {error}")


if __name__ == "__main__":
    main()