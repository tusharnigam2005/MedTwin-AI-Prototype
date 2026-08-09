import sys
from ..document_processor import process_document
from .report_agent import MedicalReportAgent


# Default test file — change this or pass a path as a CLI argument:
#   python -m ai.agents.test_pdf_agent /Users/satyamgupta/Desktop/another_desktop/MedTwin-AI-Prototype-main/reports_samples/report2.pdf
#   python -m ai.agents.test_pdf_agent /Users/satyamgupta/Desktop/another_desktop/MedTwin-AI-Prototype-main/reports_samples/screenshot_test.png
SAMPLES_DIR = "/Users/satyamgupta/Desktop/another_desktop/MedTwin-AI-Prototype-main/reports_samples"

DEFAULT_FILE_PATH = f"{SAMPLES_DIR}/cbc_text.pdf"


def main():

    # Accept file path from command line, or use default
    file_path = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_FILE_PATH

    try:
        print(f"\nProcessing document: {file_path}")
        print("-" * 50)

        # Step 1 — Auto-detect format and extract text
        report_text = process_document(file_path)

        print("\n✅ Text extracted successfully.")
        print(f"   Characters extracted: {len(report_text)}")

        # Step 2 — Send extracted text to Gemini via MedicalReportAgent
        agent = MedicalReportAgent()

        print("\nSending extracted text to Gemini...")

        result = agent.analyze_report(report_text)

        print("\n===== AGENT RESULT =====\n")

        print(result.model_dump_json(indent=2))

    except FileNotFoundError as error:
        print(f"\n❌ FILE NOT FOUND: {error}")

    except ValueError as error:
        print(f"\n❌ INVALID INPUT: {error}")

    except RuntimeError as error:
        print(f"\n❌ PROCESSING FAILED: {error}")

    except Exception as error:
        print(f"\n❌ UNEXPECTED ERROR: {error}")


if __name__ == "__main__":
    main()