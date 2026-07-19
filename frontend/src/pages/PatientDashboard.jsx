import React from 'react';
import { Activity, ShieldCheck, Heart, Pill, Apple, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import ReportUpload from '../components/ReportUpload';
import RiskChart from '../components/RiskChart';

export default function PatientDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome & Score Header matching Slide 28 UI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Health Score Card (Slide 28: 82 / 100) */}
        <div className="glass-card md:col-span-2 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-navy-800 to-navy-700/90">
          <div className="flex items-start justify-between z-10">
            <div>
              <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider block mb-1">
                Continuous Twin Status
              </span>
              <h1 className="text-3xl font-extrabold text-white">Health Score</h1>
              <p className="text-slate-400 text-sm mt-1">
                Persistent AI model of your cardiovascular, metabolic, and lifestyle state.
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
              <Activity className="w-6 h-6 text-teal-400" />
            </div>
          </div>

          <div className="mt-8 flex items-baseline gap-4 z-10">
            <span className="text-6xl font-black tracking-tight text-teal-400 drop-shadow-md">
              82 <span className="text-3xl font-bold text-slate-400">/ 100</span>
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-teal-500/20 text-teal-300 font-bold text-sm">
              OPTIMAL BASELINE
            </span>
          </div>

          {/* Background decoration glow */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Current Risk Card (Slide 28: Low) */}
        <div className="glass-card flex flex-col justify-between border-l-4 border-l-teal-400">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Prediction Agent Status
            </span>
            <h2 className="text-xl font-bold text-white mt-1">Current Risk Status</h2>
          </div>

          <div className="my-6">
            <span className="text-5xl font-black text-teal-400">Low</span>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              No critical chronic disease trajectory indicators flagged from your latest 5-agent LangGraph analysis.
            </p>
          </div>

          <div className="pt-4 border-t border-navy-700/80 flex items-center justify-between text-xs text-slate-400">
            <span>Confidence Level: <strong className="text-white">94.2%</strong></span>
            <span className="text-teal-400 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Stable</span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Upload Report & Trajectory Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportUpload />
        <RiskChart />
      </div>

      {/* Bottom Grid: Recent Recommendations & Blockchain Verification matching Slide 28 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Recommendations */}
        <div className="glass-card space-y-4">
          <div className="flex items-center justify-between border-b border-navy-700/80 pb-3">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <Apple className="w-5 h-5 text-teal-400" /> Recent Recommendations
            </h3>
            <span className="text-xs text-slate-400">Doctor Sign-Off Verified</span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-navy-900/60 border border-navy-700/60 flex items-start gap-3.5">
              <Pill className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white">Medication Agent Schedule</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Maintain Metformin 500mg daily. No drug interactions flagged with new vitamin regimen.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-navy-900/60 border border-navy-700/60 flex items-start gap-3.5">
              <Heart className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white">Lifestyle Optimization Target</h4>
                <p className="text-xs text-slate-400 mt-1">
                  30 minutes moderate cardio. Hydration target adjusted to 2.8L based on wearable sleep recovery score.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Blockchain Verification Box (Slide 28 exact replica) */}
        <div className="glass-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-navy-700/80 pb-3">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-400" /> Blockchain Verification
              </h3>
              <span className="px-2.5 py-1 rounded bg-teal-500/10 text-teal-400 text-xs font-semibold">
                Polygon Network
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-xl bg-navy-900/80 border border-teal-500/20 font-mono text-xs space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Smart Contract:</span>
                  <span className="text-teal-400">MedTwinTrust.sol</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>SHA-256 Hash:</span>
                  <span className="text-slate-200 truncate max-w-[200px]">e3b0c44298fc1c149afbf4c8996fb924</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Block Number:</span>
                  <span className="text-slate-200">#14,258,902</span>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                Only the cryptographic hash goes on-chain — raw patient data never leaves our encrypted database (Slide 25).
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-navy-700/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-400" /> Last record verified 2h ago
            </span>
            <span className="text-teal-400 font-mono">Tx 0x8f...3a1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
