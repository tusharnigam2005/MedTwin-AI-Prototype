import os
from dotenv import load_dotenv
from ai.document_processor import extract_text_with_ocr

load_dotenv()

def test():
    # Use any test file that exists in the backend directory
    # If the uploads folder is empty, just print OK
    upload_dir = "uploads"
    if not os.path.exists(upload_dir):
        print("No uploads dir.")
        return
        
    files = [f for f in os.listdir(upload_dir) if f.endswith(".jpeg") or f.endswith(".jpg")]
    if not files:
        print("No jpeg files.")
        return
        
    test_file = os.path.join(upload_dir, files[-1])
    print(f"Testing OCR on: {test_file}")
    
    try:
        text = extract_text_with_ocr(test_file)
        print("OCR SUCCESS! Text length:", len(text))
        print("Preview:", text[:100])
    except Exception as e:
        print("OCR FAILED:", str(e))

test()
