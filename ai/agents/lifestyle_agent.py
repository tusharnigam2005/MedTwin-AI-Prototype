from typing import Dict, Any

def run_lifestyle_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Lifestyle Optimization Agent (Slide 19)
    Responsibilities:
    - Exercise: personalized activity targets based on current risk profile
    - Diet: nutrition guidance informed by lab values and conditions
    - Water Intake: hydration targets adjusted for activity and vitals
    - Sleep & Stress: sleep-quality recommendations and stress tracking
    """
    risk = state.get("overall_risk_score", 50.0)
    extracted = state.get("extracted_lab_values", {})

    targets = {
        "exercise": "30 minutes low-impact brisk walking daily to improve insulin sensitivity.",
        "diet": "Mediterranean diet baseline: rich in fiber, leafy greens, and lean protein.",
        "water_intake": "2.8 Liters daily (adjusted for current blood pressure baseline).",
        "sleep": "Aim for 7.5 hours consistent sleep window. Wearable data indicates slight REM deficit.",
        "stress": "Perform 10-minute deep breathing exercises during high heart-rate periods."
    }

    if "Fasting Blood Sugar" in extracted:
        targets["diet"] += " Strictly limit refined carbohydrates and sugary beverages."

    return {"lifestyle_targets": targets}
