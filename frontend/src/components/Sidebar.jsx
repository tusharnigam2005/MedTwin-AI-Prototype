import React from 'react';
import { 
  Activity, 
  UserCheck, 
  Stethoscope, 
  LayoutDashboard, 
  X, 
  ShieldCheck, 
  FileText, 
  Heart, 
  Cpu, 
  Settings, 
  ChevronRight,
  Radio,
  ExternalLink
} from 'lucide-react';

export default function Sidebar({ activeRole, setActiveRole, isSidebarOpen, setIsSidebarOpen }) {
  const handleRoleChange = (role) => {
    setActiveRole(role);
    // On mobile screens, close sidebar after choosing role for smooth UX
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile & Tablet Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Slide-over Left Navigation Bar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 w-72 bg-navy-900/95 backdrop-blur-2xl border-r border-navy-700/80 flex flex-col justify-between transition-all duration-300 ease-in-out shadow-2xl ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header inside Sidebar */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-navy-700/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
                <Activity className="w-5 h-5 text-navy-900 font-bold" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
                  MedTwin <span className="text-teal-400">AI</span>
                </span>
                <span className="text-[10px] text-teal-400 font-mono tracking-wider block">v2.4 SYSTEM ACTIVE</span>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-xl bg-navy-800/80 hover:bg-navy-700 text-slate-400 hover:text-white transition-colors"
              title="Close Navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Role Switcher Section */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block px-1">
              Switch Portal Role
            </span>
            <div className="space-y-1.5">
              <button
                onClick={() => handleRoleChange('patient')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeRole === 'patient'
                    ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-navy-900 shadow-md shadow-teal-500/10'
                    : 'bg-navy-800/60 hover:bg-navy-800 text-slate-300 hover:text-white border border-navy-700/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <UserCheck className={`w-4 h-4 ${activeRole === 'patient' ? 'text-navy-900' : 'text-teal-400'}`} />
                  <span>Patient Twin</span>
                </div>
                {activeRole === 'patient' && <span className="w-2 h-2 rounded-full bg-navy-900 animate-pulse" />}
              </button>

              <button
                onClick={() => handleRoleChange('doctor')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeRole === 'doctor'
                    ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-navy-900 shadow-md shadow-teal-500/10'
                    : 'bg-navy-800/60 hover:bg-navy-800 text-slate-300 hover:text-white border border-navy-700/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Stethoscope className={`w-4 h-4 ${activeRole === 'doctor' ? 'text-navy-900' : 'text-teal-400'}`} />
                  <span>Doctor Portal</span>
                </div>
                {activeRole === 'doctor' && <span className="w-2 h-2 rounded-full bg-navy-900 animate-pulse" />}
              </button>

              <button
                onClick={() => handleRoleChange('admin')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeRole === 'admin'
                    ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-navy-900 shadow-md shadow-teal-500/10'
                    : 'bg-navy-800/60 hover:bg-navy-800 text-slate-300 hover:text-white border border-navy-700/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className={`w-4 h-4 ${activeRole === 'admin' ? 'text-navy-900' : 'text-teal-400'}`} />
                  <span>Admin Monitoring</span>
                </div>
                {activeRole === 'admin' && <span className="w-2 h-2 rounded-full bg-navy-900 animate-pulse" />}
              </button>
            </div>
          </div>

          {/* Navigation Links / Modules */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block px-1">
              Medical Twin Modules
            </span>
            <div className="space-y-1 text-sm font-medium text-slate-300">
              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/20 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-teal-400" />
                  <span>Live Health Score</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </div>

              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-navy-800/60 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>OCR Report Upload</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </div>

              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-navy-800/60 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span>Risk Trajectory</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </div>

              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-navy-800/60 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Cpu className="w-4 h-4 text-teal-400" />
                  <span>LangGraph AI Agents</span>
                </div>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded font-mono font-bold">5 ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer inside Sidebar */}
        <div className="p-6 border-t border-navy-700/80 bg-navy-900/60 space-y-3.5">
          <div className="p-3 rounded-xl bg-navy-800/80 border border-teal-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
              <ShieldCheck className="w-4 h-4 shrink-0 animate-pulse-subtle" />
              <span>Polygon On-Chain Node</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-emerald-400 animate-ping" /> Connected
              </span>
              <span>Smart Contract active</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Terminal Lockdown</span>
            <span className="font-mono text-teal-400">Round 02</span>
          </div>
        </div>
      </aside>
    </>
  );
}
