import os
import sys
import tempfile

# Ensure project root is on the Python path
# so 'ai' package is always importable regardless
# of where Streamlit is launched from.
sys.path.insert(
    0,
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)

import pandas as pd
import streamlit as st

from ai.document_processor import process_document
from ai.graph import medtwin_graph


# =========================================================
# PAGE CONFIGURATION
# =========================================================

st.set_page_config(
    page_title="MedTwin AI",
    page_icon="🩺",
    layout="wide"
)


# =========================================================
# HELPER FUNCTIONS
# =========================================================

def show_list(items, empty_message="No information available."):

    if not items:
        st.info(empty_message)
        return

    for item in items:
        st.write(f"• {item}")


def risk_icon(level):

    level = str(level).lower()

    if level in ["high", "emergency"]:
        return "🔴"

    if level in ["moderate", "urgent"]:
        return "🟠"

    if level == "low":
        return "🟡"

    return "🟢"


# =========================================================
# HEADER
# =========================================================

st.title("🩺 MedTwin AI")

st.subheader(
    "AI-Powered Medical Report Analysis & Health Intelligence"
)

st.caption(
    "Upload a medical report to run the MedTwin 6-Agent AI pipeline."
)

st.warning(
    "MedTwin is a prototype decision-support system and does not "
    "replace diagnosis, treatment, or professional medical advice."
)


# =========================================================
# FILE UPLOAD
# =========================================================

st.divider()

st.header("📄 Upload Medical Report")

uploaded_file = st.file_uploader(
    "Upload PDF, JPG, JPEG or PNG",
    type=[
        "pdf",
        "jpg",
        "jpeg",
        "png"
    ]
)


# =========================================================
# ANALYZE BUTTON
# =========================================================

if uploaded_file is not None:

    st.success(
        f"File uploaded: {uploaded_file.name}"
    )

    analyze_button = st.button(
        "🔬 Analyze Medical Report",
        type="primary",
        use_container_width=True
    )

    if analyze_button:

        temp_path = None

        try:

            # =================================================
            # SAVE UPLOADED FILE TEMPORARILY
            # =================================================

            suffix = os.path.splitext(
                uploaded_file.name
            )[1]

            with tempfile.NamedTemporaryFile(
                delete=False,
                suffix=suffix
            ) as temp_file:

                temp_file.write(
                    uploaded_file.getvalue()
                )

                temp_path = temp_file.name


            # =================================================
            # PROCESS DOCUMENT
            # =================================================

            with st.status(
                "Running MedTwin AI...",
                expanded=True
            ) as status:

                st.write(
                    "📄 Processing medical document..."
                )

                report_text = process_document(
                    temp_path
                )

                st.write(
                    "✅ Document processed"
                )

                st.write(
                    "🤖 Running 6 AI agents..."
                )


                # =============================================
                # INITIAL LANGGRAPH STATE
                # =============================================

                result = medtwin_graph.invoke({

                    "report_text":
                        report_text,

                    "medical_report":
                        None,

                    "health_prediction":
                        None,

                    "health_forecast":
                        None,

                    "medication_analysis":
                        None,

                    "lifestyle_analysis":
                        None,

                    "emergency_analysis":
                        None
                })

                status.update(
                    label="Analysis completed",
                    state="complete",
                    expanded=False
                )


            # =================================================
            # GET AGENT OUTPUTS
            # =================================================

            medical_report = result.get(
                "medical_report",
                {}
            )

            health_analysis = result.get(
                "health_prediction",
                {}
            )

            health_forecast = result.get(
                "health_forecast",
                {}
            )

            medication_analysis = result.get(
                "medication_analysis",
                {}
            )

            lifestyle_analysis = result.get(
                "lifestyle_analysis",
                {}
            )

            emergency_analysis = result.get(
                "emergency_analysis",
                {}
            )


            # =================================================
            # EMERGENCY TRIAGE
            # SHOW THIS FIRST
            # =================================================

            st.divider()

            st.header(
                "🚨 Emergency / Triage Assessment"
            )

            triage_level = emergency_analysis.get(
                "triage_level",
                "unknown"
            )

            emergency_needed = emergency_analysis.get(
                "emergency_services_needed",
                False
            )

            recommended_action = emergency_analysis.get(
                "recommended_action",
                "No recommendation available."
            )


            if triage_level.lower() == "emergency":

                st.error(
                    "🚨 EMERGENCY LEVEL DETECTED"
                )

            elif triage_level.lower() == "urgent":

                st.warning(
                    "⚠️ URGENT MEDICAL REVIEW RECOMMENDED"
                )

            else:

                st.success(
                    f"Triage Level: {triage_level.upper()}"
                )


            col1, col2 = st.columns(2)

            with col1:

                st.metric(
                    "Triage Level",
                    triage_level.upper()
                )

            with col2:

                st.metric(
                    "Emergency Services",
                    "YES"
                    if emergency_needed
                    else "NO"
                )


            st.subheader(
                "Recommended Action"
            )

            st.write(
                recommended_action
            )


            # =================================================
            # PATIENT SUMMARY
            # =================================================

            st.divider()

            st.header(
                "👤 Patient Summary"
            )

            patient = medical_report.get(
                "patient",
                {}
            )

            c1, c2, c3, c4 = st.columns(4)

            c1.metric(
                "Name",
                patient.get(
                    "name"
                ) or "Not available"
            )

            c2.metric(
                "Age",
                patient.get(
                    "age"
                ) or "N/A"
            )

            c3.metric(
                "Gender",
                patient.get(
                    "gender"
                ) or "N/A"
            )

            c4.metric(
                "Report Date",
                medical_report.get(
                    "report_date"
                ) or "N/A"
            )


            # =================================================
            # SYMPTOMS
            # =================================================

            st.subheader(
                "🩹 Reported Symptoms"
            )

            show_list(
                medical_report.get(
                    "symptoms",
                    []
                ),
                "No symptoms documented in the report."
            )


            # =================================================
            # CLINICAL FINDINGS
            # =================================================

            st.subheader(
                "🩺 Clinical Findings"
            )

            show_list(
                medical_report.get(
                    "clinical_findings",
                    []
                ),
                "No clinical findings documented."
            )


            # =================================================
            # LAB RESULTS
            # =================================================

            st.divider()

            st.header(
                "🧪 Laboratory Results"
            )

            lab_results = medical_report.get(
                "lab_results",
                []
            )

            if lab_results:

                lab_df = pd.DataFrame(
                    lab_results
                )

                display_columns = [
                    column
                    for column in [
                        "test_name",
                        "value",
                        "unit",
                        "reference_range",
                        "status",
                        "confidence"
                    ]
                    if column in lab_df.columns
                ]

                st.dataframe(
                    lab_df[
                        display_columns
                    ],
                    use_container_width=True,
                    hide_index=True
                )

            else:

                st.info(
                    "No laboratory results found."
                )


            # =================================================
            # CURRENT HEALTH ANALYSIS
            # =================================================

            st.divider()

            st.header(
                "🔍 Current Health Risk Analysis"
            )

            risks = health_analysis.get(
                "risk_assessments",
                []
            )

            if risks:

                for risk in risks:

                    level = risk.get(
                        "level",
                        "unknown"
                    )

                    with st.expander(
                        f"{risk_icon(level)} "
                        f"{risk.get('risk', 'Health Risk')} "
                        f"— {level.upper()}"
                    ):

                        st.write(
                            "**Evidence:**"
                        )

                        show_list(
                            risk.get(
                                "evidence",
                                []
                            )
                        )

                        st.write(
                            "**Confidence:**",
                            risk.get(
                                "confidence",
                                "N/A"
                            )
                        )

            else:

                st.info(
                    "No current health risks identified."
                )


            # =================================================
            # HEALTH FORECAST
            # =================================================

            st.divider()

            st.header(
                "🔮 7-Day Health Forecast"
            )

            overall_forecast = health_forecast.get(
                "overall_forecast"
            )

            if overall_forecast:

                st.info(
                    overall_forecast
                )


            future_risks = health_forecast.get(
                "future_risks",
                []
            )

            if future_risks:

                st.subheader(
                    "Potential Future Risks"
                )

                for risk in future_risks:

                    st.write(
                        f"{risk_icon(risk.get('risk_level'))} "
                        f"**{risk.get('risk', 'Risk')}** "
                        f"— {risk.get('risk_level', 'unknown').upper()}"
                    )

                    st.caption(
                        risk.get(
                            "explanation",
                            ""
                        )
                    )


            forecast = health_forecast.get(
                "seven_day_forecast",
                []
            )

            if forecast:

                for day in forecast:

                    with st.expander(
                        f"Day {day.get('day')} — "
                        f"{day.get('risk_level', 'unknown').upper()}"
                    ):

                        st.write(
                            "**Possible Health Status**"
                        )

                        show_list(
                            day.get(
                                "possible_health_status",
                                []
                            )
                        )

                        st.write(
                            "**Explanation:**"
                        )

                        st.write(
                            day.get(
                                "explanation",
                                "Not available"
                            )
                        )

                        st.write(
                            "**Confidence:**",
                            day.get(
                                "confidence",
                                "N/A"
                            )
                        )

            else:

                st.info(
                    "No 7-day forecast available."
                )


            # =================================================
            # MEDICATION REVIEW
            # =================================================

            st.divider()

            st.header(
                "💊 Medication Review"
            )

            medications = medication_analysis.get(
                "medication_reviews",
                []
            )

            if medications:

                for medication in medications:

                    with st.expander(
                        f"💊 "
                        f"{medication.get('medication_name', 'Medication')}"
                    ):

                        st.write(
                            "**Dose:**",
                            medication.get(
                                "documented_dose",
                                "Not available"
                            )
                        )

                        st.write(
                            "**Frequency:**",
                            medication.get(
                                "documented_frequency",
                                "Not available"
                            )
                        )

                        st.write(
                            "**Duration:**",
                            medication.get(
                                "documented_duration",
                                "Not available"
                            )
                        )

                        st.write(
                            "**Review Status:**",
                            medication.get(
                                "review_status",
                                "Unknown"
                            )
                        )

                        st.write(
                            "**Observations:**"
                        )

                        show_list(
                            medication.get(
                                "observations",
                                []
                            )
                        )

            else:

                st.info(
                    "No medications documented for review."
                )


            # =================================================
            # LIFESTYLE RECOMMENDATIONS
            # =================================================

            st.divider()

            st.header(
                "🌱 Lifestyle Recommendations"
            )

            recommendations = lifestyle_analysis.get(
                "recommendations",
                []
            )

            if recommendations:

                for recommendation in recommendations:

                    with st.expander(
                        f"{recommendation.get('title', 'Recommendation')} "
                        f"— "
                        f"{recommendation.get('priority', 'unknown').upper()}"
                    ):

                        st.write(
                            recommendation.get(
                                "recommendation",
                                ""
                            )
                        )

                        st.write(
                            "**Why:**"
                        )

                        st.write(
                            recommendation.get(
                                "reason",
                                ""
                            )
                        )

            else:

                st.info(
                    "No lifestyle recommendations available."
                )


            # =================================================
            # DETAILED EMERGENCY ALERTS
            # =================================================

            st.divider()

            st.header(
                "🚨 Detailed Triage Alerts"
            )

            alerts = emergency_analysis.get(
                "alerts",
                []
            )

            if alerts:

                for alert in alerts:

                    severity = alert.get(
                        "severity",
                        "unknown"
                    )

                    with st.expander(
                        f"{risk_icon(severity)} "
                        f"{alert.get('title', 'Alert')} "
                        f"— {severity.upper()}"
                    ):

                        st.write(
                            alert.get(
                                "reason",
                                ""
                            )
                        )

                        st.write(
                            "**Evidence:**"
                        )

                        show_list(
                            alert.get(
                                "evidence",
                                []
                            )
                        )


            # =================================================
            # RAW AGENT OUTPUTS
            # USEFUL DURING DEVELOPMENT
            # =================================================

            with st.expander(
                "🛠 Developer View — Raw Agent Outputs"
            ):

                st.write(
                    "**Agent 1 — Medical Report**"
                )

                st.json(
                    medical_report
                )

                st.write(
                    "**Agent 2 — Current Health Analysis**"
                )

                st.json(
                    health_analysis
                )

                st.write(
                    "**Agent 3 — Health Forecast**"
                )

                st.json(
                    health_forecast
                )

                st.write(
                    "**Agent 4 — Medication Analysis**"
                )

                st.json(
                    medication_analysis
                )

                st.write(
                    "**Agent 5 — Lifestyle Analysis**"
                )

                st.json(
                    lifestyle_analysis
                )

                st.write(
                    "**Agent 6 — Emergency Analysis**"
                )

                st.json(
                    emergency_analysis
                )


        except Exception as error:

            st.error(
                f"Analysis failed: {error}"
            )

        finally:

            if temp_path and os.path.exists(
                temp_path
            ):

                os.remove(
                    temp_path
                )