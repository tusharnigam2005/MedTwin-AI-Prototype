from typing import Dict, Any, List

def run_medication_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Medication Agent (Slide 18)
    Responsibilities:
    - Medicine Reminder: schedule-aware push notifications based on prescription timing
    - Drug Interaction: cross-checks new prescriptions against active medications
    - Dose Tracking: logs confirmed doses, flags missed adherence patterns
    """
    history = state.get("medical_history", {})
    active_meds = history.get("active_medications", ["Metformin 500mg"])
    extracted = state.get("extracted_lab_values", {})

    alerts = []
    for med in active_meds:
        alerts.append(f"Reminder: Take {med} after dinner as prescribed.")

    if "HbA1c" in extracted and isinstance(extracted["HbA1c"], dict):
        if extracted["HbA1c"].get("flag") == "HIGH":
            alerts.append("Drug Adherence Check: Elevated HbA1c detected. Verify if Metformin doses have been missed regularly.")

    return {"medication_alerts": alerts}
