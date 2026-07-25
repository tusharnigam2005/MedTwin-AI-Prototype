from ..document_processor import process_document
from .report_agent import MedicalReportAgent
from .prediction_agent import HealthPredictionAgent


# ---------------------------------------------------------
# CHANGE ONLY THIS PATH TO TEST ANOTHER REPORT
# Supports: PDF, JPG, JPEG, PNG
# ---------------------------------------------------------

file_path = "/Users/satyamgupta/Desktop/another_desktop/MedTwin-AI-Prototype-main/reports_samples/cbc_text.pdf"


def main():

    try:

        # =================================================
        # STEP 1: READ THE MEDICAL DOCUMENT
        # =================================================

        print("\n========================================")
        print("STEP 1: PROCESSING MEDICAL DOCUMENT")
        print("========================================\n")

        report_text = process_document(file_path)

        print("✓ Document processed successfully")


        # =================================================
        # STEP 2: AGENT 1 - MEDICAL REPORT AGENT
        # =================================================

        print("\n========================================")
        print("STEP 2: RUNNING AGENT 1")
        print("Medical Report Agent")
        print("========================================\n")

        report_agent = MedicalReportAgent()

        medical_report = report_agent.analyze_report(
            report_text
        )

        print("✓ Agent 1 completed\n")

        print("===== AGENT 1 OUTPUT =====\n")

        print(
            medical_report.model_dump_json(
                indent=2
            )
        )


        # =================================================
        # STEP 3: CONVERT AGENT 1 OUTPUT TO DICTIONARY
        # =================================================

        patient_data = medical_report.model_dump()


        # =================================================
        # STEP 4: AGENT 2 - HEALTH PREDICTION AGENT
        # =================================================

        print("\n========================================")
        print("STEP 3: RUNNING AGENT 2")
        print("Health Prediction Agent")
        print("========================================\n")

        prediction_agent = HealthPredictionAgent()

        prediction = prediction_agent.analyze_health_risk(
            patient_data
        )

        print("✓ Agent 2 completed\n")

        print("===== AGENT 2 OUTPUT =====\n")

        print(
            prediction.model_dump_json(
                indent=2
            )
        )


        # =================================================
        # PIPELINE COMPLETE
        # =================================================

        print("\n========================================")
        print("AGENT PIPELINE COMPLETED SUCCESSFULLY")
        print("========================================")

        print(
            """
Medical Document
       ↓
Document Processor
       ↓
Agent 1: Medical Report Agent
       ↓
Structured Medical Data
       ↓
Agent 2: Health Prediction Agent
       ↓
Health Risk Assessment
            """
        )


    except Exception as error:

        print("\n========================================")
        print("PIPELINE ERROR")
        print("========================================")

        print(error)


if __name__ == "__main__":
    main()