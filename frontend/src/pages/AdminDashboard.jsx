import React from 'react';
import { ShieldCheck, Activity, Users, Server, Database, CheckCircle, Cpu } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Stats matching Slide 30 UI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Users (Slide 30: 1,204) */}
        <div className="glass-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Users</span>
            <h2 className="text-5xl font-black text-white mt-2">1,204</h2>
            <p className="text-xs text-teal-400 mt-2">+12% from last week</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
            <Users className="w-8 h-8 text-teal-400" />
          </div>
        </div>

        {/* System Uptime (Slide 30: 99.9%) */}
        <div className="glass-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">System Uptime</span>
            <h2 className="text-5xl font-black text-teal-400 mt-2">99.9%</h2>
            <p className="text-xs text-slate-400 mt-2">Docker + Railway + Neon Postgres</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
            <Server className="w-8 h-8 text-teal-400" />
          </div>
        </div>
      </div>

      {/* Middle Grid matching Slide 30: API Latency & On-Chain Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Latency (p95) */}
        <div className="glass-card space-y-6">
          <div className="flex items-center justify-between border-b border-navy-700/80 pb-3">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-400" /> API Latency (p95)
            </h3>
            <span className="text-xs text-slate-400 font-mono">FastAPI Async Engine</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-semibold">/api/prediction/:patientId</span>
                <span className="text-teal-400 font-mono">118ms</span>
              </div>
              <div className="w-full h-2.5 bg-navy-900 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-semibold">/api/reports/upload (OCR + LangGraph)</span>
                <span className="text-teal-400 font-mono">640ms</span>
              </div>
              <div className="w-full h-2.5 bg-navy-900 rounded-full overflow-hidden">
                <div className="h-full bg-teal-400 rounded-full" style={{ width: '80%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-semibold">/api/blockchain/verify</span>
                <span className="text-teal-400 font-mono">210ms</span>
              </div>
              <div className="w-full h-2.5 bg-navy-900 rounded-full overflow-hidden">
                <div className="h-full bg-teal-600 rounded-full" style={{ width: '55%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* On-Chain Transactions Today (Slide 30 exact replica) */}
        <div className="glass-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-navy-700/80 pb-3">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-400" /> On-Chain Transactions Today
              </h3>
              <span className="px-2.5 py-1 rounded bg-teal-500/10 text-teal-400 text-xs font-semibold">
                Polygon Network
              </span>
            </div>

            <div className="mt-8 flex items-baseline gap-4">
              <span className="text-5xl font-black text-white">312</span>
              <span className="text-teal-400 font-bold text-sm flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> confirmed · 0 failed
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-navy-700/80 flex items-center justify-between text-xs text-slate-400">
            <span>Audit Trail Integrity: <strong className="text-teal-400">100% Tamper-Proof</strong></span>
            <span className="font-mono">Gas Avg: 0.0004 MATIC</span>
          </div>
        </div>
      </div>
    </div>
  );
}
