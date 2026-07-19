from typing import TypedDict, Dict, Any, List
from langgraph.graph import StateGraph, END
from ai.agents.report_agent import run_medical_report_agent
from ai.agents.prediction_agent import run_prediction_agent
from ai.agents.medication_agent import run_medication_agent
from ai.agents.lifestyle_agent import run_lifestyle_agent
from ai.agents.emergency_agent import run_emergency_agent

# ==============================================================
# Slide 21 — LangGraph Explicit State Schema (`MedTwinState`)
# ==============================================================
class MedTwinState(TypedDict):
    patient_id: int
    raw_ocr_text: str
    medical_history: Dict[str, Any]
    vitals: Dict[str, Any]
    extracted_lab_values: Dict[str, Any]
    risk_scores: Dict[str, float]
    medication_alerts: List[str]
    lifestyle_targets: Dict[str, str]
    emergency_flag: bool
    emergency_alert_message: str
    overall_risk_score: float
    overall_confidence: float
    final_recommendation: str


# Node Functions
def report_node(state: MedTwinState) -> Dict[str, Any]:
    return run_medical_report_agent(state)

def prediction_node(state: MedTwinState) -> Dict[str, Any]:
    return run_prediction_agent(state)

def medication_node(state: MedTwinState) -> Dict[str, Any]:
    return run_medication_agent(state)

def lifestyle_node(state: MedTwinState) -> Dict[str, Any]:
    return run_lifestyle_agent(state)

def emergency_node(state: MedTwinState) -> Dict[str, Any]:
    return run_emergency_agent(state)

def confidence_check_and_merge_node(state: MedTwinState) -> Dict[str, Any]:
    """
    Confidence Check & Recommendation Node (Slide 21 & 22)
    Conditional routing / aggregation based on confidence score and emergency flags.
    """
    if state.get("emergency_flag"):
        return {
            "final_recommendation": f"🚨 {state.get('emergency_alert_message')}\n[SYSTEM ACTION]: Normal recommendation queue bypassed. Routed to Emergency Dispatch & Doctor Dashboard immediately."
        }

    rec_parts = []
    if state.get("overall_risk_score", 0) > 70:
        rec_parts.append("High disease trajectory risk identified. Schedule clinical consultation within 48 hours.")
    else:
        rec_parts.append("Stable metabolic/cardiovascular baseline.")

    for alert in state.get("medication_alerts", []):
        rec_parts.append(f"• {alert}")

    for cat, guidance in state.get("lifestyle_targets", {}).items():
        rec_parts.append(f"• [{cat.title()}]: {guidance}")

    merged = "\n".join(rec_parts)
    return {"final_recommendation": merged}


# ==============================================================
# Building the LangGraph Orchestration Graph (Slide 21)
# ==============================================================
workflow = StateGraph(MedTwinState)

# Add Nodes
workflow.add_node("input_router", report_node)
workflow.add_node("prediction", prediction_node)
workflow.add_node("medication", medication_node)
workflow.add_node("lifestyle", lifestyle_node)
workflow.add_node("emergency", emergency_node)
workflow.add_node("aggregator", confidence_check_and_merge_node)

# Set Entry point
workflow.set_entry_point("input_router")

# Connect parallel branches after OCR / report extraction
workflow.add_edge("input_router", "prediction")
workflow.add_edge("input_router", "medication")
workflow.add_edge("input_router", "lifestyle")
workflow.add_edge("input_router", "emergency")

# Connect parallel agents into aggregator node
workflow.add_edge("prediction", "aggregator")
workflow.add_edge("medication", "aggregator")
workflow.add_edge("lifestyle", "aggregator")
workflow.add_edge("emergency", "aggregator")

# End graph
workflow.add_edge("aggregator", END)

# Compile executable graph
medtwin_graph = workflow.compile()
