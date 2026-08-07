import sys
import os
sys.path.append(os.path.abspath('..'))
from ai.graph import medtwin_graph

try:
    initial_state = {
        "report_text": "Patient Blood Report: Fasting Blood Sugar 135 mg/dL. HbA1c 6.8%. Cholesterol 210 mg/dL.",
        "medical_report": None,
        "health_prediction": None,
        "health_forecast": None,
        "medication_analysis": None,
        "lifestyle_analysis": None,
        "emergency_analysis": None
    }
    result = medtwin_graph.invoke(initial_state)
    print("Success:", list(result.keys()))
except Exception as e:
    import traceback
    traceback.print_exc()
