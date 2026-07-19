import React from 'react';
import { Activity, ShieldCheck, UserCheck, Stethoscope, LayoutDashboard, LogOut } from 'lucide-react';

export default function Navbar({ activeRole, setActiveRole }) {
  return (
    <header className="border-b border-navy-700/80 bg-navy-900/90 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo matching Slide 1 icons */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Activity className="w-6 h-6 text-navy-900 font-bold" />
          </div>
          <div>
            <span className="text-2xl font-bold tracking-tight text-white flex items-center gap-1.5">
              MedTwin <span className="text-teal-400">AI</span>
            </span>
            <span className="text-xs text-slate-400 block font-medium">Autonomous Healthcare Digital Twin</span>
          </div>
        </div>

        {/* Role Switcher tabs for Hackathon Demo testing */}
        <div className="flex items-center gap-2 bg-navy-800/90 p-1.5 rounded-xl border border-navy-700">
          <button
            onClick={() => setActiveRole('patient')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeRole === 'patient'
                ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-navy-900 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" /> Patient Twin
          </button>
          <button
            onClick={() => setActiveRole('doctor')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeRole === 'doctor'
                ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-navy-900 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Stethoscope className="w-4 h-4" /> Doctor Portal
          </button>
          <button
            onClick={() => setActiveRole('admin')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeRole === 'admin'
                ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-navy-900 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Admin Monitoring
          </button>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 animate-pulse-subtle" />
            <span>Polygon On-Chain Verified</span>
          </div>
        </div>
      </div>
    </header>
  );
}
