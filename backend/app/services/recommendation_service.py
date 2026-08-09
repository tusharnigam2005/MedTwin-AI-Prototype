from typing import Dict, Any

def merge_agent_recommendations(
    risk_score: float, 
    medication_data: list, 
    lifestyle_signals: dict, 
    doctor_rules: dict = None
) -> Dict[str, Any]:
    """
    Recommendation Engine — Merging Agent Outputs (Slide 22).
    Weighted merge where doctor-authored rules always take precedence over pure model output.
    Output includes contributing weight of each input.
    """
    weights = {
        "doctor_rules": 0.50 if doctor_rules else 0.0,
        "risk_score": 0.25 if not doctor_rules else 0.20,
        "medication_data": 0.15,
        "lifestyle_signals": 0.10 if not doctor_rules else 0.15
    }

    actions = []
    
    if doctor_rules and "override_action" in doctor_rules:
        actions.append(f"[Doctor Override]: {doctor_rules['override_action']}")
    else:
        if risk_score > 75.0:
            actions.append("High risk threshold crossed. Schedule urgent clinical consultation within 48 hours.")
        elif risk_score > 50.0:
            actions.append("Moderate risk detected. Increase monitoring frequency to weekly vitals review.")
        else:
            actions.append("Low/Stable risk profile. Maintain current wellness baseline.")

    for med in medication_data:
        actions.append(f"Medication Alert: {med}")

    for category, guidance in lifestyle_signals.items():
        actions.append(f"Lifestyle ({category.title()}): {guidance}")

    merged_text = "\n".join(actions)

    return {
        "final_recommendation": merged_text,
        "contributing_weights": weights,
        "requires_doctor_review": risk_score > 50.0 or bool(doctor_rules)
    }
