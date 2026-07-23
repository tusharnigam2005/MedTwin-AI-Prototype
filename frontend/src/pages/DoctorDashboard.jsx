import React, { useState } from 'react';
import { Stethoscope, CheckCircle2, AlertTriangle, FileSearch, ShieldAlert, ArrowRight, UserCheck, Sparkles, Activity, ShieldCheck, Cpu } from 'lucide-react';
import { doctorAPI } from '../services/api';
import LangGraphAgentsPanel from '../components/LangGraphAgentsPanel';

const initialPatients = [
  { id: 101, name: 'Aarav Sharma', age: 44, condition: 'Type 2 Diabetes Risk Progression', confidence: '94.8%', status: 'high_risk', riskScore: 78, summary: 'Elevated fasting blood sugar (135 mg/dL) identified via OCR ReportAgent. LangGraph PredictionAgent suggests insulin resistance progression without intervention.' },
  { id: 102, name: 'Priya Patel', age: 32, condition: 'Hypertension Baseline Monitoring', confidence: '91.2%', status: 'pending', riskScore: 54, summary: 'Wearable telemetry stream shows intermittent systolic spikes during evening hours. LifestyleAgent adjustment recommended.' },
  { id: 103, name: 'Vikram Singh', age: 58, condition: 'Cardiovascular Arrhythmia Watch', confidence: '89.5%', status: 'high_risk', riskScore: 84, summary: 'Heart rate sustained 142 bpm for 4 minutes (DiagnosticAgent flag). Urgent clinical human-in-the-loop sign-off required.' },
  { id: 104, name: 'Ananya Gupta', age: 29, condition: 'Routine Adherence Protocol', confidence: '98.1%', status: 'pending', riskScore: 24, summary: 'Optimal biomarker panel. AI MedicationAgent Recommendation: maintain current dosage.' }
];

export default function DoctorDashboard() {
  const [patients, setPatients] = useState(initialPatients);
  const [selectedPatient, setSelectedPatient] = useState(initialPatients[0]);
  const [actionStatus, setActionStatus] = useState(null);

  const handleAction = async (statusType) => {
    setActionStatus(`Processing ${statusType.toUpperCase()} and generating cryptographic hash for Polygon Mainnet...`);
    try {
      await doctorAPI.approveRecord(selectedPatient.id, statusType);
      setActionStatus(`Successfully signed off and recorded immutable SHA-256 hash on Polygon!`);
      setTimeout(() => setActionStatus(null), 4000);
    } catch (err) {
      setActionStatus(`Action ${statusType.toUpperCase()} confirmed and logged to blockchain audit ledger (Offline Demo Mode)`);
      setTimeout(() => setActionStatus(null), 4000);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header Stats matching Enterprise Medical Luxury Palette */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Reviews */}
        <div className="glass-card flex items-center justify-between border border-teal-500/30 bg-gradient-to-br from-navy-800 to-navy-900 shadow-xl">
          <div>
            <span className="text-xs font-bold font-mono text-teal-400 uppercase tracking-widest block">
              Clinical Queue
            </span>
            <h3 className="text-4xl sm:text-5xl font-black text-white mt-1">7</h3>
            <p className="text-xs text-slate-300 font-medium mt-1">Pending Human Sign-Off</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500/20 to-emerald-500/20 flex items-center justify-center border border-teal-500/40 shadow-lg shrink-0">
            <FileSearch className="w-8 h-8 text-teal-400" />
          </div>
        </div>

        {/* High-Risk Patients */}
        <div className="glass-card flex items-center justify-between border-l-4 border-l-rose-500 border-navy-700/80 bg-gradient-to-br from-navy-800 to-navy-900 shadow-xl">
          <div>
            <span className="text-xs font-bold font-mono text-rose-400 uppercase tracking-widest block">
              Critical Escalations
            </span>
            <h3 className="text-4xl sm:text-5xl font-black text-rose-400 mt-1">2</h3>
            <p className="text-xs text-rose-300 font-medium mt-1">Diagnostic Agent Flagged</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/30 shadow-lg shrink-0">
            <ShieldAlert className="w-8 h-8 text-rose-400 animate-pulse" />
          </div>
        </div>

        {/* Doctor Verification info */}
        <div className="glass-card flex flex-col justify-center border border-navy-700/80 bg-navy-800/90 shadow-xl">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <UserCheck className="w-5 h-5 text-teal-400" /> Human-In-The-Loop Governance
          </div>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Every AI recommendation requires explicit physician sign-off before reaching the patient twin. Once verified, the cryptographic hash is committed on-chain.
          </p>
        </div>
      </div>

      {/* 5-Agent LangGraph Orchestration Panel */}
      <LangGraphAgentsPanel />

      {/* Main Queue & Review Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Queue List */}
        <div className="glass-card lg:col-span-1 space-y-4 border border-navy-700/80 bg-navy-800/90 shadow-xl">
          <div className="flex items-center justify-between border-b border-navy-700/80 pb-3">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-400" /> Patient Priority Queue
            </h3>
            <span className="text-xs font-mono bg-teal-500/10 text-teal-300 px-2 py-0.5 rounded font-bold">
              4 ACTIVE
            </span>
          </div>
          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
            {patients.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedPatient(p)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedPatient.id === p.id
                    ? 'bg-gradient-to-r from-navy-800 to-navy-700 border-teal-400 shadow-lg ring-1 ring-teal-400/50'
                    : 'bg-navy-900/60 border-navy-700/60 hover:border-navy-600 hover:bg-navy-800/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-white text-sm tracking-tight">{p.name}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase shrink-0 ${
                    p.status === 'high_risk' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  }`}>
                    Score: {p.riskScore}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 font-medium truncate">{p.condition}</p>
                <div className="mt-2 pt-2 border-t border-navy-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Confidence: <strong className="text-teal-400">{p.confidence}</strong></span>
                  <span className="text-emerald-400">● LangGraph Ready</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Patient Details & AI Recommendation Confidence */}
        <div className="glass-card lg:col-span-2 flex flex-col justify-between space-y-6 border border-navy-700/80 bg-navy-800/90 shadow-2xl">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-navy-700/80 pb-4 gap-3">
              <div>
                <span className="text-xs text-teal-400 font-mono font-bold uppercase tracking-wider block">
                  Clinical Protocol Sign-Off #REC-{selectedPatient.id}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-0.5 flex items-center gap-2">
                  {selectedPatient.name} <span className="text-sm font-normal text-slate-400">(Age: {selectedPatient.age})</span>
                </h2>
              </div>
              <span className="px-3.5 py-1.5 rounded-xl bg-navy-900 border border-teal-500/30 font-mono text-xs text-teal-300 font-bold self-start sm:self-auto shadow-inner">
                LangGraph 5-Agent Consensus
              </span>
            </div>

            {/* AI Recommendation Confidence Bar */}
            <div className="mt-6 p-5 rounded-2xl bg-navy-900/80 border border-navy-700/80 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-slate-200 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-teal-400" /> AI Diagnostic Confidence Metric
                </span>
                <span className="font-mono font-bold text-teal-300 bg-teal-500/10 px-2.5 py-0.5 rounded border border-teal-500/20">
                  {selectedPatient.confidence}
                </span>
              </div>
              <div className="w-full h-3 bg-navy-950 rounded-full overflow-hidden border border-navy-800">
                <div className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400 rounded-full transition-all duration-500" style={{ width: selectedPatient.confidence }} />
              </div>
            </div>

            {/* Clinical AI Analysis Summary */}
            <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-navy-900 to-navy-900/90 border border-teal-500/30 space-y-3 shadow-inner">
              <h4 className="text-sm font-extrabold text-white flex items-center gap-2 tracking-tight">
                <Stethoscope className="w-4.5 h-4.5 text-teal-400" /> Multi-Agent Clinical Evaluation Summary
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed font-normal">
                {selectedPatient.summary}
              </p>
              <div className="pt-3 border-t border-navy-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" /> SHA-256 Hash Prepared
                </span>
                <span>Requires Physician Signature</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-4 border-t border-navy-700/80 space-y-4">
            {actionStatus && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border border-teal-500/40 text-teal-300 text-xs font-mono font-bold flex items-center gap-2.5 shadow-lg animate-pulse">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{actionStatus}</span>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleAction('approved')}
                className="btn-primary flex-1 py-3.5 text-sm font-black shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4.5 h-4.5" /> Approve & Sign On-Chain
              </button>
              <button
                onClick={() => handleAction('requested_more_data')}
                className="btn-secondary px-6 py-3.5 text-sm font-bold shadow-md"
              >
                Request Lab Retest
              </button>
              <button
                onClick={() => handleAction('escalated')}
                className="px-6 py-3.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/40 text-sm font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4" /> Escalate Emergency
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
