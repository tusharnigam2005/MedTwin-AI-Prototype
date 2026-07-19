# 🤖 MedTwin AI — Multi-Agent AI & OCR Layer (AI/ML Dev Domain)

Welcome to the **LangGraph Multi-Agent & OCR Pipeline** folder of `MedTwin AI`. As the **AI/ML Developer (`aiml` branch)**, you own this directory.

---

## 🏗️ Architecture Overview

The AI layer replaces generic ChatGPT-style reactive prompts with an **explicit, stateful LangGraph orchestration pipeline** (Slide 21) containing **5 specialized autonomous agents** working in parallel over a persistent patient state (`MedTwinState`).

### Folder Structure (`ai/`)
```
ai/
├── agents/
│   ├── report_agent.py       # Slide 16: OCR extraction, JSON entity parsing, confidence scoring
│   ├── prediction_agent.py   # Slide 17: Disease risk scoring (0-100 scale) & trend analysis
│   ├── medication_agent.py   # Slide 18: Drug interaction cross-checking & schedule adherence
│   ├── lifestyle_agent.py    # Slide 19: Personalized diet, exercise, sleep, and hydration targets
│   └── emergency_agent.py    # Slide 20: Real-time vitals threshold breach & alert escalation
├── graph.py                  # Slide 21: LangGraph StateGraph compiling parallel node transitions
└── requirements.txt
```

---

## 🔬 The 5 Specialized AI Agents (Slides 16–20)

| Agent Name | Input Data | Key Output |
| :--- | :--- | :--- |
| **1. Medical Report Agent** | Raw OCR text from PaddleOCR / Tesseract | Structured JSON lab values (`Fasting Blood Sugar: 135 mg/dL`, `HbA1c: 6.8%`) + confidence tag |
| **2. Health Prediction Agent** | Extracted labs + medical history + vitals | Disease risk score (**0–100 scale**), confidence score (`0.94`), trend direction (`improving/worsening`) |
| **3. Medication Agent** | Active prescriptions + new OCR extracted drugs | Schedule reminders, drug-interaction cross-check alerts, adherence patterns |
| **4. Lifestyle Optimization Agent** | Risk profile + lab values + sleep/vitals | Custom daily action targets (Exercise, Diet, Water intake, Sleep recovery) |
| **5. Emergency Response Agent** | Continuous wearable heart rate & blood pressure | Personal baseline breach detection (`Heart rate 142 bpm sustained`). Bypasses normal queue! |

---

## 🚀 Quick Start (For AI/ML Dev)

### 1. Install Dependencies
Open terminal inside `ai/`:
```bash
cd ai
pip install -r requirements.txt
```

### 2. Configure Environment Variables
Create a `.env` file inside `ai/` or export directly:
```bash
export GROQ_API_KEY="your_groq_or_openai_api_key_here"
```

### 3. Test the LangGraph Pipeline Locally
You can test the StateGraph directly in Python interactive mode:
```python
from graph import medtwin_graph

mock_initial_state = {
    "patient_id": 101,
    "raw_ocr_text": "Fasting Blood Sugar 135 mg/dL. HbA1c 6.8%. Patient reports mild fatigue.",
    "medical_history": {"active_medications": ["Metformin 500mg"]},
    "vitals": {"heart_rate": 78, "blood_pressure": "122/80"}
}

result = medtwin_graph.invoke(mock_initial_state)
print("Risk Score:", result["overall_risk_score"])
print("Final Recommendation:\n", result["final_recommendation"])
```

---

## 🔄 Daily Collaboration Checklist (For AI/ML Dev)

1. Check out your branch every morning: `git checkout aiml`
2. Pull latest main from the Team Lead: `git fetch origin && git merge origin/main`
3. Modify agent prompts, LangGraph nodes, or RAG embeddings inside `agents/` and `graph.py`.
4. Commit and push: `git commit -m "feat(ai): enhance HbA1c threshold confidence in report agent" && git push origin aiml`
5. Create a Pull Request on GitHub and ask the Team Lead (`backend`) to review & merge!
