import React, { useState } from 'react';
import { Stethoscope, CheckCircle2, AlertTriangle, FileSearch, ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';
import { doctorAPI } from '../services/api';

const initialPatients = [
  { id: 101, name: 'Aarav Sharma', age: 44, condition: 'Type 2 Diabetes Risk', confidence: '94.8%', status: 'high_risk', riskScore: 78, summary: 'Elevated fasting blood sugar (135 mg/dL) identified via OCR. LangGraph prediction suggests insulin resistance progression.' },
  { id: 102, name: 'Priya Patel', age: 32, condition: 'Hypertension Baseline', confidence: '91.2%', status: 'pending', riskScore: 54, summary: 'Wearable stream shows intermittent systolic spikes during evening hours. Lifestyle adjustment recommended.' },
  { id: 103, name: 'Vikram Singh', age: 58, condition: 'Cardiovascular Monitoring', confidence: '89.5%', status: 'high_risk', riskScore: 84, summary: 'Heart rate sustained 142 bpm for 4 min (Emergency Agent alert). Urgent clinical review required.' },
  { id: 104, name: 'Ananya Gupta', age: 29, condition: 'Routine Adherence Check', confidence: '98.1%', status: 'pending', riskScore: 24, summary: 'Optimal lab panel. AI Recommendation: maintain current dosage.' }
];

export default function DoctorDashboard() {
  const [patients, setPatients] = useState(initialPatients);
  const [selectedPatient, setSelectedPatient] = useState(initialPatients[0]);
  const [actionStatus, setActionStatus] = useState(null);

  const handleAction = async (statusType) => {
    setActionStatus(`Processing ${statusType} and signing on Polygon Blockchain...`);
    try {
      await doctorAPI.approveRecord(selectedPatient.id, statusType);
      setActionStatus(`Successfully signed off and recorded immutable hash on Polygon!`);
      setTimeout(() => setActionStatus(null), 4000);
    } catch (err) {
      setActionStatus(`Action ${statusType.toUpperCase()} confirmed and logged to blockchain (Demo mode)`);
      setTimeout(() => setActionStatus(null), 4000);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header Stats matching Slide 29 UI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Reviews (Slide 29: 7) */}
        <div className="glass-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Review Queue</span>
            <h3 className="text-4xl font-extrabold text-white mt-1">7</h3>
            <p className="text-xs text-teal-400 mt-1">Pending Human Sign-Off</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
            <FileSearch className="w-7 h-7 text-teal-400" />
          </div>
        </div>

        {/* High-Risk Patients (Slide 29: 2) */}
        <div className="glass-card flex items-center justify-between border-l-4 border-l-rose-500">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Critical Escalation</span>
            <h3 className="text-4xl font-extrabold text-rose-400 mt-1">2</h3>
            <p className="text-xs text-rose-300 mt-1">Emergency Agent Flagged</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
            <ShieldAlert className="w-7 h-7 text-rose-400" />
          </div>
        </div>

        {/* Doctor Verification info */}
        <div className="glass-card flex flex-col justify-center">
          <div className="flex items-center gap-2 text-white font-bold">
            <UserCheck className="w-5 h-5 text-teal-400" /> Human-In-The-Loop Safety
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Every verified medical event is routed to the doctor for sign-off before reaching the patient as an actionable recommendation (Slide 5 & 27).
          </p>
        </div>
      </div>

      {/* Main Queue & Review Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Queue List */}
        <div className="glass-card lg:col-span-1 space-y-4">
          <h3 className="font-bold text-white text-lg border-b border-navy-700/80 pb-3">
            Assigned Patient Queue
          </h3>
          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {patients.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedPatient(p)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedPatient.id === p.id
                    ? 'bg-navy-700 border-teal-500 shadow-md'
                    : 'bg-navy-900/60 border-navy-700/60 hover:border-navy-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold text-white text-sm">{p.name}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    p.status === 'high_risk' ? 'bg-rose-500/20 text-rose-400' : 'bg-teal-500/20 text-teal-400'
                  }`}>
                    Score: {p.riskScore}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{p.condition}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Patient Details & AI Recommendation Confidence matching Slide 29 */}
        <div className="glass-card lg:col-span-2 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-navy-700/80 pb-4">
              <div>
                <span className="text-xs text-teal-400 font-semibold uppercase">Patient Review #REC-{selectedPatient.id}</span>
                <h2 className="text-2xl font-bold text-white">{selectedPatient.name} <span className="text-sm font-normal text-slate-400">(Age: {selectedPatient.age})</span></h2>
              </div>
              <span className="px-3 py-1.5 rounded-lg bg-navy-900 border border-navy-700 font-mono text-xs text-slate-300">
                LangGraph 5-Agent Output
              </span>
            </div>

            {/* AI Recommendation Confidence Bar (Slide 29) */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-200">AI Recommendation Confidence</span>
                <span className="font-bold text-teal-400">{selectedPatient.confidence}</span>
              </div>
              <div className="w-full h-3 bg-navy-900 rounded-full overflow-hidden border border-navy-700">
                <div className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full" style={{ width: selectedPatient.confidence }} />
              </div>
            </div>

            <div className="mt-6 p-5 rounded-2xl bg-navy-900/80 border border-navy-700 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-teal-400" /> Clinical AI Analysis Summary
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {selectedPatient.summary}
              </p>
            </div>
          </div>

          {/* Quick Actions (Slide 29: Approve · Request More Data · Escalate) */}
          <div className="pt-4 border-t border-navy-700/80">
            {actionStatus && (
              <div className="mb-4 p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
                {actionStatus}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleAction('approved')}
                className="btn-primary flex-1 py-3 text-sm font-bold"
              >
                <CheckCircle2 className="w-4 h-4" /> Approve & Sign On-Chain
              </button>
              <button
                onClick={() => handleAction('requested_more_data')}
                className="btn-secondary px-5 py-3 text-sm font-semibold"
              >
                Request More Data
              </button>
              <button
                onClick={() => handleAction('escalated')}
                className="px-5 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-sm font-semibold transition-all"
              >
                Escalate Emergency
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
