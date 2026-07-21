import React from 'react';
import { Activity, ShieldCheck, UserCheck, Stethoscope, LayoutDashboard, Menu, PanelLeft, LogOut, User } from 'lucide-react';

export default function Navbar({ activeRole, setActiveRole, isSidebarOpen, setIsSidebarOpen, user, onLogout }) {
  return (
    <header className="border-b border-navy-700/80 bg-navy-900/90 backdrop-blur-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
        {/* Left Section: Toggle Button & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 -ml-1 rounded-xl bg-navy-800/90 border border-navy-700 hover:bg-navy-700 text-teal-400 transition-all shadow-md active:scale-95 flex items-center justify-center"
            title="Toggle Left Navigation"
            aria-label="Toggle Navigation Sidebar"
          >
            <PanelLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div 
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-400 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-navy-900 font-bold" />
            </div>
            <div>
              <span className="text-lg sm:text-2xl font-bold tracking-tight text-white flex items-center gap-1.5">
                MedTwin <span className="text-teal-400">AI</span>
              </span>
              <span className="hidden sm:block text-xs text-slate-400 font-medium">Autonomous Healthcare Digital Twin</span>
            </div>
          </div>
        </div>

        {/* Role Switcher tabs for Desktop (Slide 1 testing) */}
        <div className="hidden lg:flex items-center gap-2 bg-navy-800/90 p-1.5 rounded-xl border border-navy-700 shadow-inner">
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

        {/* Status indicator & User Profile / Logout */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {user && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-navy-800 border border-navy-700 text-slate-300 text-xs font-medium">
              <User className="w-3.5 h-3.5 text-teal-400" />
              <span className="truncate max-w-[120px]">{user.name}</span>
            </div>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
              title="Logout from Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}

          <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 animate-pulse-subtle shrink-0" />
            <span>Polygon On-Chain Verified</span>
          </div>
        </div>
      </div>
    </header>
  );
}
