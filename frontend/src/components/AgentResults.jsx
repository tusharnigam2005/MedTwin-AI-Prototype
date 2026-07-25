import React, { useState } from 'react';
import {
  FileText, Activity, TrendingUp, Pill, HeartHandshake,
  ShieldAlert, Sparkles, Info, AlertTriangle, CheckCircle2,
  Calendar, Layers, Clock, ShieldCheck
} from 'lucide-react';

export default function AgentResults({ result }) {
  const [activeTab, setActiveTab] = useState('all');

  if (!result) return null;

  const medical = result.medical_report || {};
  const health = result.health_prediction || {};
  const forecast = result.health_forecast || {};
  const medication = result.medication_analysis || {};
  const lifestyle = result.lifestyle_analysis || {};
  const emergency = result.emergency_analysis || {};

  const triageLevel = (emergency.triage_level || 'routine').toLowerCase();

  const getTriageBadge = (level) => {
    if (level === 'emergency') {
      return (
        <span className="px-3 py-1 rounded-full bg-red-100 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-1">
          🚨 EMERGENCY LEVEL
        </span>
      );
    }
    if (level === 'urgent') {
      return (
        <span className="px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1">
          ⚠️ URGENT CLINICAL REVIEW
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1">
        ✓ ROUTINE FOLLOW-UP
      </span>
    );
  };

  const getRiskLevelBadge = (level) => {
    const l = (level || 'low').toLowerCase();
    if (l === 'high') {
      return <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700 border border-red-200">High Risk</span>;
    }
    if (l === 'moderate') {
      return <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">Moderate</span>;
    }
    return <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Low Risk</span>;
  };

  const tabs = [
    { id: 'all', label: 'All 6 Agent Outputs', icon: Layers },
    { id: 'agent1', label: 'Agent 1: Report', icon: FileText },
    { id: 'agent2', label: 'Agent 2: Risk', icon: Activity },
    { id: 'agent3', label: 'Agent 3: Forecast', icon: TrendingUp },
    { id: 'agent4', label: 'Agent 4: Meds', icon: Pill },
    { id: 'agent5', label: 'Agent 5: Lifestyle', icon: HeartHandshake },
    { id: 'agent6', label: 'Agent 6: Emergency', icon: ShieldAlert },
  ];

  return (
    <div className="space-y-6">

      {/* Tabs Header */}
      <div className="flex items-center gap-1 bg-white border border-slate-200 p-1.5 rounded-2xl overflow-x-auto shadow-sm">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === id
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-sky-50 hover:text-sky-600'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* ── AGENT 6: EMERGENCY RESPONSE SUMMARY BANNER (Shown on All & Emergency) ── */}
      {(activeTab === 'all' || activeTab === 'agent6') && (
        <div className={`bg-white border rounded-2xl p-6 shadow-sm space-y-4 ${
          triageLevel === 'emergency' ? 'border-red-300 bg-red-50/40' :
          triageLevel === 'urgent' ? 'border-amber-300 bg-amber-50/40' : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-700 font-bold text-[10px]">AGENT 06</span>
              <h3 className="text-slate-900 font-bold text-base">Emergency Response & Triage Assessment</h3>
            </div>
            {getTriageBadge(triageLevel)}
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-4 space-y-1">
              <p className="font-semibold text-slate-500">Recommended Action:</p>
              <p className="font-bold text-slate-800 text-sm">{emergency.recommended_action || 'Routine follow-up.'}</p>
            </div>

            <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-4 space-y-1">
              <p className="font-semibold text-slate-500">Emergency Services Needed:</p>
              <p className={`font-bold text-sm ${emergency.emergency_services_needed ? 'text-red-600' : 'text-emerald-700'}`}>
                {emergency.emergency_services_needed ? '🚨 YES — IMMEDIATE ATTENTION REQUIRED' : '✓ Not Required'}
              </p>
            </div>
          </div>

          {emergency.reasoning_summary && (
            <p className="text-slate-600 text-xs leading-relaxed">
              <strong className="text-slate-800">Triage Reasoning:</strong> {emergency.reasoning_summary}
            </p>
          )}

          {emergency.alerts?.length > 0 && (
            <div className="space-y-2 pt-2">
              <p className="text-slate-700 text-xs font-bold uppercase">Detected Clinical Alerts</p>
              {emergency.alerts.map((alt, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-800">{alt.title}</p>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 capitalize">{alt.severity}</span>
                  </div>
                  <p className="text-slate-600">{alt.reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── AGENT 1: MEDICAL REPORT AGENT ── */}
      {(activeTab === 'all' || activeTab === 'agent1') && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-700 font-bold text-[10px]">AGENT 01</span>
              <h3 className="text-slate-900 font-bold text-base">Medical Report Analysis Agent</h3>
            </div>
            <FileText className="w-5 h-5 text-sky-500" />
          </div>

          {/* Patient Details */}
          {medical.patient && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div>
                <p className="text-slate-400 uppercase font-medium">Patient Name</p>
                <p className="font-bold text-slate-800 mt-0.5">{medical.patient.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400 uppercase font-medium">Age</p>
                <p className="font-bold text-slate-800 mt-0.5">{medical.patient.age || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400 uppercase font-medium">Gender</p>
                <p className="font-bold text-slate-800 mt-0.5">{medical.patient.gender || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400 uppercase font-medium">Report Date</p>
                <p className="font-bold text-slate-800 mt-0.5">{medical.report_date || 'N/A'}</p>
              </div>
            </div>
          )}

          {/* Documented Symptoms & Findings */}
          <div className="grid sm:grid-cols-2 gap-4">
            {medical.symptoms?.length > 0 && (
              <div className="space-y-2">
                <p className="text-slate-700 font-bold text-xs">Documented Symptoms</p>
                <div className="flex flex-wrap gap-1.5">
                  {medical.symptoms.map((sym, i) => (
                    <span key={i} className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-medium">
                      {sym}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {medical.clinical_findings?.length > 0 && (
              <div className="space-y-2">
                <p className="text-slate-700 font-bold text-xs">Clinical Findings</p>
                <div className="flex flex-wrap gap-1.5">
                  {medical.clinical_findings.map((f, i) => (
                    <span key={i} className="px-2.5 py-1 bg-sky-50 border border-sky-200 text-sky-800 rounded-lg text-xs font-medium">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Lab Results Table */}
          {medical.lab_results?.length > 0 && (
            <div className="space-y-2">
              <p className="text-slate-700 font-bold text-xs">Extracted Laboratory Values</p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-sky-50 text-slate-700 border-b border-slate-200">
                      <th className="p-3 font-bold">Test Name</th>
                      <th className="p-3 font-bold text-right">Value</th>
                      <th className="p-3 font-bold text-right">Unit</th>
                      <th className="p-3 font-bold text-right">Reference Range</th>
                      <th className="p-3 font-bold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {medical.lab_results.map((lab, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-3 font-medium text-slate-800">{lab.test_name}</td>
                        <td className="p-3 text-right font-bold text-slate-900">{lab.value}</td>
                        <td className="p-3 text-right text-slate-500">{lab.unit}</td>
                        <td className="p-3 text-right text-slate-500">{lab.reference_range}</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold capitalize ${
                            lab.status === 'high' ? 'bg-red-100 text-red-700' :
                            lab.status === 'low' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {lab.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Diagnoses */}
          {medical.diagnoses?.length > 0 && (
            <div className="space-y-2">
              <p className="text-slate-700 font-bold text-xs">Extracted Diagnoses</p>
              <div className="flex flex-wrap gap-2">
                {medical.diagnoses.map((diag, i) => (
                  <span key={i} className="px-3 py-1 bg-purple-50 border border-purple-200 text-purple-800 rounded-lg text-xs font-semibold">
                    {diag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── AGENT 2: HEALTH PREDICTION AGENT ── */}
      {(activeTab === 'all' || activeTab === 'agent2') && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-700 font-bold text-[10px]">AGENT 02</span>
              <h3 className="text-slate-900 font-bold text-base">Health Prediction & Risk Analysis Agent</h3>
            </div>
            <Activity className="w-5 h-5 text-sky-500" />
          </div>

          {health.risk_assessments?.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {health.risk_assessments.map((item, i) => (
                <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-800 text-sm">{item.risk}</h4>
                    {getRiskLevelBadge(item.level)}
                  </div>

                  {item.evidence?.length > 0 && (
                    <div className="text-xs space-y-1">
                      <p className="text-slate-500 font-semibold">Evidence:</p>
                      <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                        {item.evidence.map((ev, j) => (
                          <li key={j}>{ev}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {item.confidence && (
                    <p className="text-[11px] text-slate-400 font-medium pt-1">
                      Confidence Level: {Math.round(item.confidence * 100)}%
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-xs">No specific chronic disease risk factors flagged.</p>
          )}
        </div>
      )}

      {/* ── AGENT 3: HEALTH FORECAST AGENT ── */}
      {(activeTab === 'all' || activeTab === 'agent3') && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-700 font-bold text-[10px]">AGENT 03</span>
              <h3 className="text-slate-900 font-bold text-base">Health Forecast Agent (7-Day Trajectory)</h3>
            </div>
            <TrendingUp className="w-5 h-5 text-sky-500" />
          </div>

          {forecast.overall_forecast && (
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-xs text-sky-900 space-y-1">
              <p className="font-bold text-sky-800 text-sm">Overall Trajectory Forecast:</p>
              <p className="leading-relaxed">{forecast.overall_forecast}</p>
            </div>
          )}

          {/* Future Risks */}
          {forecast.future_risks?.length > 0 && (
            <div className="space-y-3">
              <p className="text-slate-700 font-bold text-xs">Potential Future Health Risks</p>
              <div className="space-y-2">
                {forecast.future_risks.map((fr, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-800">{fr.risk}</p>
                      {getRiskLevelBadge(fr.risk_level)}
                    </div>
                    {fr.time_horizon && (
                      <p className="text-slate-500 text-[11px]">Time Horizon: {fr.time_horizon}</p>
                    )}
                    <p className="text-slate-600">{fr.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7-Day Day-by-Day Forecast Grid */}
          {forecast.seven_day_forecast?.length > 0 && (
            <div className="space-y-3">
              <p className="text-slate-700 font-bold text-xs flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-sky-500" /> 7-Day Daily Forecast Trajectory
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {forecast.seven_day_forecast.map((df) => (
                  <div key={df.day} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                      <span className="font-bold text-slate-800">Day {df.day}</span>
                      {getRiskLevelBadge(df.risk_level)}
                    </div>

                    {df.possible_health_status?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {df.possible_health_status.map((st, k) => (
                          <span key={k} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-700">
                            {st}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-slate-600 text-[11px] leading-tight">{df.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── AGENT 4: MEDICATION AGENT ── */}
      {(activeTab === 'all' || activeTab === 'agent4') && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-700 font-bold text-[10px]">AGENT 04</span>
              <h3 className="text-slate-900 font-bold text-base">Medication Analysis Agent</h3>
            </div>
            <Pill className="w-5 h-5 text-sky-500" />
          </div>

          {/* Safety Flags */}
          {medication.safety_flags?.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
              <p className="font-bold text-red-800 text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" /> Medication Warnings & Drug Interactions
              </p>
              {medication.safety_flags.map((flag, i) => (
                <div key={i} className="bg-white border border-red-200 rounded-lg p-3 text-xs space-y-1">
                  <p className="font-bold text-red-700">{flag.flag}</p>
                  {flag.evidence?.length > 0 && <p className="text-slate-600">Evidence: {flag.evidence.join(', ')}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Medication Reviews */}
          {medication.medication_reviews?.length > 0 && (
            <div className="space-y-2">
              <p className="text-slate-700 font-bold text-xs">Documented Prescription Reviews</p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-sky-50 text-slate-700 border-b border-slate-200">
                      <th className="p-3 font-bold">Medication</th>
                      <th className="p-3 font-bold">Dosage</th>
                      <th className="p-3 font-bold">Frequency</th>
                      <th className="p-3 font-bold">Duration</th>
                      <th className="p-3 font-bold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {medication.medication_reviews.map((med, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-800">{med.medication_name}</td>
                        <td className="p-3 text-slate-600">{med.documented_dose || 'N/A'}</td>
                        <td className="p-3 text-slate-600">{med.documented_frequency || 'N/A'}</td>
                        <td className="p-3 text-slate-600">{med.documented_duration || 'N/A'}</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold capitalize ${
                            med.review_status === 'needs_review' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {med.review_status?.replace('_', ' ') || 'Normal'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── AGENT 5: LIFESTYLE AGENT ── */}
      {(activeTab === 'all' || activeTab === 'agent5') && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-700 font-bold text-[10px]">AGENT 05</span>
              <h3 className="text-slate-900 font-bold text-base">Lifestyle Optimization Agent</h3>
            </div>
            <HeartHandshake className="w-5 h-5 text-sky-500" />
          </div>

          {lifestyle.recommendations?.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {lifestyle.recommendations.map((rec, i) => (
                <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-800 text-sm">{rec.title}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      rec.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-sky-100 text-sky-700'
                    }`}>
                      {rec.priority || 'General'}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">{rec.recommendation}</p>
                  {rec.reason && <p className="text-slate-500 text-[11px] italic">Why: {rec.reason}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-xs">No specific lifestyle recommendations generated.</p>
          )}
        </div>
      )}
    </div>
  );
}
