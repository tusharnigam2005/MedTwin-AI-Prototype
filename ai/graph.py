from typing import TypedDict, Optional, Dict, Any

from langgraph.graph import StateGraph, START, END

from .agents.report_agent import MedicalReportAgent
from .agents.prediction_agent import HealthPredictionAgent
from .agents.health_forecast_agent import HealthForecastAgent
from .agents.medication_agent import MedicationAgent
from .agents.lifestyle_agent import LifestyleAgent
from .agents.emergency_agent import EmergencyAgent


# =========================================================
# 1. SHARED LANGGRAPH STATE
# =========================================================

class MedTwinState(TypedDict):

    # Original document text
    report_text: str

    # Agent 1 output
    medical_report: Optional[Dict[str, Any]]

    # Agent 2 output
    # Current health / risk analysis
    health_prediction: Optional[Dict[str, Any]]

    # Agent 3 output
    # Future risks + Day 1-7 forecast
    health_forecast: Optional[Dict[str, Any]]

    # Agent 4 output
    medication_analysis: Optional[Dict[str, Any]]

    # Agent 5 output
    lifestyle_analysis: Optional[Dict[str, Any]]

    # Agent 6 output
    emergency_analysis: Optional[Dict[str, Any]]


# =========================================================
# 2. CREATE ALL 6 AGENTS
# =========================================================

report_agent = MedicalReportAgent()

# Existing Agent 2
prediction_agent = HealthPredictionAgent()

# New Agent 3
forecast_agent = HealthForecastAgent()

medication_agent = MedicationAgent()

lifestyle_agent = LifestyleAgent()

emergency_agent = EmergencyAgent()


# =========================================================
# 3. AGENT 1 — MEDICAL REPORT AGENT
# =========================================================

def medical_report_node(
    state: MedTwinState
) -> dict:

    print(
        "\n[LangGraph] Running Agent 1: "
        "Medical Report Agent"
    )

    report_text = state.get(
        "report_text"
    )

    if not report_text:

        raise ValueError(
            "Medical report text is missing."
        )

    result = report_agent.analyze_report(
        report_text
    )

    return {
        "medical_report":
            result.model_dump()
    }


# =========================================================
# 4. AGENT 2 — CURRENT HEALTH RISK ANALYSIS
# =========================================================

def health_prediction_node(
    state: MedTwinState
) -> dict:

    print(
        "\n[LangGraph] Running Agent 2: "
        "Current Health Risk Analysis Agent"
    )

    medical_report = state.get(
        "medical_report"
    )

    if not medical_report:

        raise ValueError(
            "Agent 1 output is missing."
        )

    result = (
        prediction_agent
        .analyze_health_risk(
            medical_report
        )
    )

    return {
        "health_prediction":
            result.model_dump()
    }


# =========================================================
# 5. AGENT 3 — HEALTH FORECAST / PREDICTION AGENT
#
# Future risks + Day 1 to Day 7 forecast
# =========================================================

def health_forecast_node(
    state: MedTwinState
) -> dict:

    print(
        "\n[LangGraph] Running Agent 3: "
        "Health Forecast/Prediction Agent"
    )

    # Agent 1 output
    medical_report = state.get(
        "medical_report"
    )

    # Agent 2 output
    health_prediction = state.get(
        "health_prediction"
    )

    if not medical_report:

        raise ValueError(
            "Agent 1 output is missing."
        )

    if not health_prediction:

        raise ValueError(
            "Agent 2 output is missing."
        )

    # New Prediction Agent receives:
    # 1. Original structured medical data
    # 2. Current health risk analysis

    result = (
        forecast_agent
        .predict_health(

            patient_data=
                medical_report,

            health_analysis=
                health_prediction
        )
    )

    return {
        "health_forecast":
            result.model_dump()
    }


# =========================================================
# 6. AGENT 4 — MEDICATION AGENT
# =========================================================

def medication_agent_node(
    state: MedTwinState
) -> dict:

    print(
        "\n[LangGraph] Running Agent 4: "
        "Medication Agent"
    )

    medical_report = state.get(
        "medical_report"
    )

    health_prediction = state.get(
        "health_prediction"
    )

    if not medical_report:

        raise ValueError(
            "Agent 1 output is missing."
        )

    if not health_prediction:

        raise ValueError(
            "Agent 2 output is missing."
        )

    result = (
        medication_agent
        .analyze_medications(

            patient_data=
                medical_report,

            health_prediction=
                health_prediction
        )
    )

    return {
        "medication_analysis":
            result.model_dump()
    }


# =========================================================
# 7. AGENT 5 — LIFESTYLE OPTIMIZATION AGENT
# =========================================================

def lifestyle_agent_node(
    state: MedTwinState
) -> dict:

    print(
        "\n[LangGraph] Running Agent 5: "
        "Lifestyle Optimization Agent"
    )

    medical_report = state.get(
        "medical_report"
    )

    health_prediction = state.get(
        "health_prediction"
    )

    health_forecast = state.get(
        "health_forecast"
    )

    medication_analysis = state.get(
        "medication_analysis"
    )

    if not medical_report:

        raise ValueError(
            "Agent 1 output is missing."
        )

    if not health_prediction:

        raise ValueError(
            "Agent 2 output is missing."
        )

    if health_forecast is None:

        raise ValueError(
            "Agent 3 output is missing."
        )

    if medication_analysis is None:

        raise ValueError(
            "Agent 4 output is missing."
        )

    # Keep the existing LifestyleAgent function signature.
    #
    # We validate health_forecast above so Agent 3 must have run,
    # but we do NOT pass health_forecast here unless you also
    # modify lifestyle_agent.py to accept that argument.

    result = (
        lifestyle_agent
        .analyze_lifestyle(

            patient_data=
                medical_report,

            health_prediction=
                health_prediction,

            medication_analysis=
                medication_analysis
        )
    )

    return {
        "lifestyle_analysis":
            result.model_dump()
    }


# =========================================================
# 8. AGENT 6 — EMERGENCY / TRIAGE AGENT
# =========================================================

def emergency_agent_node(
    state: MedTwinState
) -> dict:

    print(
        "\n[LangGraph] Running Agent 6: "
        "Emergency/Triage Agent"
    )

    medical_report = state.get(
        "medical_report"
    )

    health_prediction = state.get(
        "health_prediction"
    )

    health_forecast = state.get(
        "health_forecast"
    )

    medication_analysis = state.get(
        "medication_analysis"
    )

    lifestyle_analysis = state.get(
        "lifestyle_analysis"
    )

    if not medical_report:

        raise ValueError(
            "Agent 1 output is missing."
        )

    if not health_prediction:

        raise ValueError(
            "Agent 2 output is missing."
        )

    if health_forecast is None:

        raise ValueError(
            "Agent 3 output is missing."
        )

    if medication_analysis is None:

        raise ValueError(
            "Agent 4 output is missing."
        )

    if lifestyle_analysis is None:

        raise ValueError(
            "Agent 5 output is missing."
        )

    # Keep existing EmergencyAgent function signature.
    #
    # Agent 6 already receives current symptoms, clinical findings,
    # labs, health analysis, medication analysis and lifestyle analysis.
    #
    # Do not add health_forecast=health_forecast here unless
    # emergency_agent.py is also updated to accept that parameter.

    result = (
        emergency_agent
        .analyze_emergency(

            patient_data=
                medical_report,

            health_prediction=
                health_prediction,

            medication_analysis=
                medication_analysis,

            lifestyle_analysis=
                lifestyle_analysis
        )
    )

    return {
        "emergency_analysis":
            result.model_dump()
    }


# =========================================================
# 9. BUILD LANGGRAPH
# =========================================================

builder = StateGraph(
    MedTwinState
)


# Agent 1
builder.add_node(
    "medical_report_agent",
    medical_report_node
)


# Agent 2
builder.add_node(
    "health_prediction_agent",
    health_prediction_node
)


# Agent 3 — NEW
builder.add_node(
    "health_forecast_agent",
    health_forecast_node
)


# Agent 4
builder.add_node(
    "medication_agent",
    medication_agent_node
)


# Agent 5
builder.add_node(
    "lifestyle_agent",
    lifestyle_agent_node
)


# Agent 6
builder.add_node(
    "emergency_agent",
    emergency_agent_node
)


# =========================================================
# 10. CONNECT ALL 6 AGENTS
#
# START
#   ↓
# Agent 1 — Medical Report
#   ↓
# Agent 2 — Current Health Risk Analysis
#   ↓
# Agent 3 — Future Health Forecast
#   ↓
# Agent 4 — Medication
#   ↓
# Agent 5 — Lifestyle
#   ↓
# Agent 6 — Emergency/Triage
#   ↓
# END
# =========================================================

builder.add_edge(
    START,
    "medical_report_agent"
)

builder.add_edge(
    "medical_report_agent",
    "health_prediction_agent"
)

builder.add_edge(
    "health_prediction_agent",
    "health_forecast_agent"
)

builder.add_edge(
    "health_forecast_agent",
    "medication_agent"
)

builder.add_edge(
    "medication_agent",
    "lifestyle_agent"
)

builder.add_edge(
    "lifestyle_agent",
    "emergency_agent"
)

builder.add_edge(
    "emergency_agent",
    END
)


# =========================================================
# 11. COMPILE LANGGRAPH
# =========================================================

medtwin_graph = builder.compile()