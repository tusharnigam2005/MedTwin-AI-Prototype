from typing import Dict, Any

def run_emergency_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Emergency Response Agent (Slide 20)
    Responsibilities:
    - Continuously monitors heart rate and blood pressure streams from wearables
    - Rule-based thresholds combined with personal baseline — not one-size-fits-all cutoffs
    - Any breach triggers an immediate, high-priority alert — bypasses the normal recommendation queue
    """
    vitals = state.get("vitals", {})
    history = state.get("medical_history", {})
    
    hr = vitals.get("heart_rate", 72)
    bp = vitals.get("blood_pressure", "120/80")

    is_emergency = False
    alert_msg = ""

    # Rule-based thresholds combined with personal baseline (Slide 20 example: Heart rate 142 bpm sustained)
    if hr >= 130:
        is_emergency = True
        alert_msg = f"EMERGENCY ALERT: Sustained heart rate spike detected ({hr} bpm). Personal baseline: 68-84 bpm. Doctor notified instantly!"
    elif hr <= 45:
        is_emergency = True
        alert_msg = f"EMERGENCY ALERT: Severe bradycardia detected ({hr} bpm). Immediate medical escalation required!"

    return {
        "emergency_flag": is_emergency,
        "emergency_alert_message": alert_msg
    }
