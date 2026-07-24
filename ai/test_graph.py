import json

from .document_processor import process_document
from .graph import medtwin_graph


# =========================================================
# TEST MEDICAL REPORT
# Supports PDF / JPG / JPEG / PNG
# =========================================================

file_path = (
    "/Users/satyamgupta/Desktop/another_desktop/"
    "MedTwin-AI-Prototype-main/"
    "reports_samples/synthetic_medical_report.pdf"
)


def main():

    try:

        # =================================================
        # STEP 1 — PROCESS DOCUMENT
        # =================================================

        print("\nProcessing medical document...")

        report_text = process_document(
            file_path
        )

        print("✓ Document processed")


        # =================================================
        # STEP 2 — START LANGGRAPH
        # =================================================

        print(
            "\nStarting MedTwin 6-Agent LangGraph...\n"
        )

        result = medtwin_graph.invoke({

            # Original input
            "report_text":
                report_text,

            # Agent 1
            "medical_report":
                None,

            # Agent 2
            "health_prediction":
                None,

            # Agent 3 — NEW
            "health_forecast":
                None,

            # Agent 4
            "medication_analysis":
                None,

            # Agent 5
            "lifestyle_analysis":
                None,

            # Agent 6
            "emergency_analysis":
                None
        })


        # =================================================
        # PIPELINE COMPLETED
        # =================================================

        print(
            "\n================================"
        )

        print(
            "MEDTWIN LANGGRAPH COMPLETED"
        )

        print(
            "================================"
        )


        # =================================================
        # AGENT 1 — MEDICAL REPORT
        # =================================================

        print(
            "\n===== AGENT 1 OUTPUT =====\n"
        )

        print(
            json.dumps(
                result.get(
                    "medical_report",
                    {}
                ),
                indent=2
            )
        )


        # =================================================
        # AGENT 2 — CURRENT HEALTH RISK ANALYSIS
        # =================================================

        print(
            "\n===== AGENT 2 OUTPUT =====\n"
        )

        print(
            json.dumps(
                result.get(
                    "health_prediction",
                    {}
                ),
                indent=2
            )
        )


        # =================================================
        # AGENT 3 — FUTURE HEALTH FORECAST / PREDICTION
        # =================================================

        print(
            "\n===== AGENT 3 OUTPUT =====\n"
        )

        print(
            json.dumps(
                result.get(
                    "health_forecast",
                    {}
                ),
                indent=2
            )
        )


        # =================================================
        # AGENT 4 — MEDICATION
        # =================================================

        print(
            "\n===== AGENT 4 OUTPUT =====\n"
        )

        print(
            json.dumps(
                result.get(
                    "medication_analysis",
                    {}
                ),
                indent=2
            )
        )


        # =================================================
        # AGENT 5 — LIFESTYLE
        # =================================================

        print(
            "\n===== AGENT 5 OUTPUT =====\n"
        )

        print(
            json.dumps(
                result.get(
                    "lifestyle_analysis",
                    {}
                ),
                indent=2
            )
        )


        # =================================================
        # AGENT 6 — EMERGENCY / TRIAGE
        # =================================================

        print(
            "\n===== AGENT 6 OUTPUT =====\n"
        )

        emergency = result.get(
            "emergency_analysis",
            {}
        )

        print(
            json.dumps(
                emergency,
                indent=2
            )
        )


        # =================================================
        # FINAL TRIAGE SUMMARY
        # =================================================

        print(
            "\n================================"
        )

        print(
            "FINAL MEDTWIN TRIAGE"
        )

        print(
            "================================"
        )

        print(
            "Triage Level:",
            emergency.get(
                "triage_level",
                "unknown"
            )
        )

        print(
            "Emergency Services Needed:",
            emergency.get(
                "emergency_services_needed",
                "unknown"
            )
        )

        print(
            "Recommended Action:",
            emergency.get(
                "recommended_action",
                "No recommendation available."
            )
        )


        # =================================================
        # SHOW COMPLETE 6-AGENT PIPELINE
        # =================================================

        print(
            """
==========================================
MEDTWIN 6-AGENT PIPELINE
==========================================

Medical PDF / JPG / PNG
          │
          ▼
┌──────────────────────────────┐
│ Document Processor           │
│ PyMuPDF / OCR                │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ AGENT 1                      │
│ Medical Report Agent         │
│                              │
│ Extracts medical information │
└──────────────┬───────────────┘
               │
               │ medical_report
               ▼
┌──────────────────────────────┐
│ AGENT 2                      │
│ Current Health Risk Analysis │
│                              │
│ Analyzes current concerns    │
└──────────────┬───────────────┘
               │
               │ health_prediction
               ▼
┌──────────────────────────────┐
│ AGENT 3                      │
│ Health Forecast Agent        │
│                              │
│ Future Risks                 │
│ + Day 1 → Day 7 Forecast     │
└──────────────┬───────────────┘
               │
               │ health_forecast
               ▼
┌──────────────────────────────┐
│ AGENT 4                      │
│ Medication Agent             │
│                              │
│ Reviews medications          │
└──────────────┬───────────────┘
               │
               │ medication_analysis
               ▼
┌──────────────────────────────┐
│ AGENT 5                      │
│ Lifestyle Optimization Agent │
│                              │
│ Lifestyle recommendations    │
└──────────────┬───────────────┘
               │
               │ lifestyle_analysis
               ▼
┌──────────────────────────────┐
│ AGENT 6                      │
│ Emergency / Triage Agent     │
│                              │
│ Detects emergency red flags  │
└──────────────┬───────────────┘
               │
               │ emergency_analysis
               ▼
              END

==========================================
"""
        )


    except Exception as error:

        print(
            f"\nGRAPH ERROR: {error}"
        )


if __name__ == "__main__":
    main()