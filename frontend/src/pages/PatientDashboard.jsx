import React, { useState } from 'react';
import { Activity, ShieldCheck, Heart, Pill, Apple, AlertTriangle, CheckCircle, Clock, Sparkles, Cpu } from 'lucide-react';
import ReportUpload from '../components/ReportUpload';
import RiskChart from '../components/RiskChart';
import LangGraphAgentsPanel from '../components/LangGraphAgentsPanel';
import AgentResults from '../components/AgentResults';

export default function PatientDashboard() {
  const [result, setResult] = useState(null);
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome & Score Header matching Slide 28 & Enterprise Medical Theme */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Health Score Card */}
        <div className="glass-card md:col-span-2 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-navy-800 via-navy-800/90 to-navy-900 border border-teal-500/30 shadow-2xl">
          <div className="flex items-start justify-between z-10">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold font-mono tracking-wider text-teal-400 uppercase bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
                  Continuous Digital Twin Status
                </span>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Synchronized
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-2.5">
                Personal Health Score <Sparkles className="w-6 h-6 text-teal-400 animate-pulse" />
              </h1>
              <p className="text-slate-300 text-sm mt-1 max-w-xl">
                Real-time autonomous AI modeling of your cardiovascular, metabolic, and chronic disease baseline across all 5 LangGraph agents.
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20 shrink-0">
              <Activity className="w-7 h-7 text-navy-900 font-extrabold" />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-baseline gap-4 z-10">
            <span className="text-6xl sm:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-300 drop-shadow">
              82 <span className="text-3xl font-bold text-slate-400">/ 100</span>
            </span>
            <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border border-teal-500/40 text-teal-300 font-bold text-sm tracking-wide shadow-sm">
              OPTIMAL BASELINE · ZONE A
            </span>
          </div>

          {/* Background decoration glow */}
          <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-gradient-to-tr from-teal-500/10 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Current Risk Card */}
        <div className="glass-card flex flex-col justify-between border-l-4 border-l-teal-400 bg-gradient-to-br from-navy-800/90 to-navy-900 border border-navy-700/80 shadow-xl">
          <div>
            <span className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider block">
              Prediction Agent Status
            </span>
            <h2 className="text-xl font-bold text-white mt-1">Current Risk Level</h2>
          </div>

          <div className="my-6">
            <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              Low
            </span>
            <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
              Zero critical chronic disease trajectory anomalies flagged across the active 30-day monitoring window.
            </p>
          </div>

          <div className="pt-4 border-t border-navy-700/80 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Confidence: <strong className="text-white font-sans">94.2%</strong></span>
            <span className="text-emerald-400 flex items-center gap-1 font-sans font-bold"><CheckCircle className="w-4 h-4" /> Stable State</span>
          </div>
        </div>
      </div>

      {/* 5-Agent LangGraph Orchestration & Telemetry Panel */}
      <LangGraphAgentsPanel />

      {/* Middle Grid: Upload Report & Trajectory Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportUpload onResult={setResult} />
        <RiskChart />
      </div>

      {/* Dynamic Agent Results Output (Hidden until file is uploaded) */}
      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AgentResults result={result} />
        </div>
      )}

      {/* Bottom Grid: Recent Recommendations & Blockchain Verification */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Recommendations */}
        <div className="glass-card space-y-4 border border-navy-700/80 bg-navy-800/90 shadow-xl">
          <div className="flex items-center justify-between border-b border-navy-700/80 pb-3">
            <h3 className="font-bold text-white text-lg flex items-center gap-2.5">
              <Apple className="w-5 h-5 text-teal-400" /> Clinical Recommendations
            </h3>
            <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-semibold">
              Doctor Sign-Off Verified
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-navy-900/80 border border-teal-500/20 flex items-start gap-3.5 hover:border-teal-500/40 transition-colors">
              <Pill className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">Medication Agent Schedule</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Maintain Metformin 500mg daily. Zero adverse drug interactions flagged with new vitamin D regimen.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-navy-900/80 border border-teal-500/20 flex items-start gap-3.5 hover:border-teal-500/40 transition-colors">
              <Heart className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">Lifestyle Optimization Target</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  30 minutes moderate aerobic exercise. Hydration target adjusted to 2.8L based on wearable sleep recovery score.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Blockchain Verification Box */}
        <div className="glass-card flex flex-col justify-between border border-navy-700/80 bg-navy-800/90 shadow-xl">
          <div>
            <div className="flex items-center justify-between border-b border-navy-700/80 pb-3">
              <h3 className="font-bold text-white text-lg flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-teal-400" /> Polygon On-Chain Verification
              </h3>
              <span className="px-2.5 py-1 rounded bg-teal-500/10 border border-teal-500/20 text-teal-400 font-mono text-xs font-bold">
                Mainnet Node
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-xl bg-navy-900/90 border border-teal-500/20 font-mono text-xs space-y-2.5">
                <div className="flex justify-between text-slate-400">
                  <span>Smart Contract:</span>
                  <span className="text-teal-400 font-bold">MedTwinTrust.sol</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>SHA-256 Hash:</span>
                  <span className="text-slate-200 truncate max-w-[200px]">e3b0c44298fc1c149afbf4c8996fb924</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Block Number:</span>
                  <span className="text-emerald-400 font-bold">#14,258,902</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Only cryptographic hashes are published to Polygon. Raw patient records remain strictly inside our isolated, HIPAA/GDPR encrypted database.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-navy-700/80 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 font-sans">
              <Clock className="w-3.5 h-3.5 text-teal-400" /> Verified 2 hours ago
            </span>
            <span className="text-teal-400 font-bold">Tx 0x8f...3a1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
