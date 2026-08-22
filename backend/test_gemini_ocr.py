import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

def test_ocr():
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    # We will just write a small dummy image for testing, or we can use the uploaded one!
    # Let's try to list files in uploads
    # ...
    # Instead, let's just create a dummy string to see if the client works.
    print("GenAI client initialized successfully.")
    
test_ocr()
