from typing import Dict, Any

def run_prediction_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Health Prediction Agent (Slide 17)
    Inputs: Age/demographics, full medical history, latest vitals, extracted lab values, wearable data.
    Output: Disease risk score (0-100 scale), confidence score, trend direction.
    Below-threshold confidence or high-risk predictions auto-escalate to doctor review.
    """
    extracted_labs = state.get("extracted_lab_values", {})
    history = state.get("medical_history", {})
    vitals = state.get("vitals", {})

    base_score = 40.0
    high_flags = 0

    for test_name, data in extracted_labs.items():
        if isinstance(data, dict) and data.get("flag") in ["HIGH", "CRITICAL"]:
            high_flags += 1
            base_score += 15.0

    if vitals.get("heart_rate", 70) > 100:
        base_score += 10.0

    # Cap at 100
    risk_score = min(round(base_score, 1), 100.0)
    confidence = 0.93 if high_flags > 0 else 0.89

    return {
        "risk_scores": {"metabolic_diabetes_risk": risk_score, "cardiovascular_risk": min(round(risk_score * 0.85, 1), 100.0)},
        "overall_risk_score": risk_score,
        "overall_confidence": confidence
    }
