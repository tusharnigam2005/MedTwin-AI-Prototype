import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HeartPulse, LogOut, User, Stethoscope, Shield, Menu, X,
  FileText, Activity, Pill, HeartHandshake, History, LayoutDashboard,
  Calendar, MessageSquare, CreditCard
} from 'lucide-react';

import PatientProfileModal from './PatientProfileModal';

export default function Navbar() {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRoleSwitch = (newRole) => {
    login(user?.name, newRole);
    if (newRole === 'doctor') navigate('/doctor');
    else if (newRole === 'admin') navigate('/admin');
    else navigate('/patient');
  };

  const isPatient = user?.role === 'patient';
  const isDoctor = user?.role === 'doctor';
  const isAdmin = user?.role === 'admin';

  const linkClass = ({ isActive }) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${isActive
      ? 'bg-sky-100 text-sky-700 font-bold border-b-2 border-sky-500'
      : 'text-slate-600 hover:text-sky-600 hover:bg-sky-50'
    }`;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">

        {/* Logo & Subtitle */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-slate-900 font-bold text-base tracking-tight font-sans">
                MedTwin <span className="text-sky-500">AI</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
              AI-Powered Personalized Healthcare
            </p>
          </div>
        </div>

        {/* Navigation links for Patient */}
        {isPatient && (
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink to="/patient" end className={linkClass}>
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/patient/reports" className={linkClass}>
              <FileText className="w-3.5 h-3.5" />
              <span>My Reports</span>
            </NavLink>
            <NavLink to="/patient/appointments" className={linkClass}>
              <Calendar className="w-3.5 h-3.5" />
              <span>Appointments</span>
            </NavLink>
            <NavLink to="/patient/messages" className={linkClass}>
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Messages</span>
            </NavLink>
            <NavLink to="/patient/billing" className={linkClass}>
              <CreditCard className="w-3.5 h-3.5" />
              <span>Billing</span>
            </NavLink>
            <NavLink to="/patient/history" className={linkClass}>
              <History className="w-3.5 h-3.5" />
              <span>History</span>
            </NavLink>
          </nav>
        )}

        {/* Navigation links for Doctor */}
        {isDoctor && (
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink to="/doctor" end className={linkClass}>
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Patient Queue</span>
            </NavLink>
            <NavLink to="/doctor/history" className={linkClass}>
              <History className="w-3.5 h-3.5" />
              <span>Medical History</span>
            </NavLink>
            <NavLink to="/doctor/approvals" className={linkClass}>
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Pending Approvals</span>
            </NavLink>
          </nav>
        )}

        {/* Navigation links for Admin */}
        {isAdmin && (
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink to="/admin" className={linkClass}>
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/admin/blockchain" className={linkClass}>
              <Shield className="w-3.5 h-3.5" />
              <span>Blockchain</span>
            </NavLink>
          </nav>
        )}

        {/* User Profile & Single Active Portal Badge */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <>
              {/* Single Portal Badge for Logged-In Role */}
              <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${isDoctor ? 'bg-sky-50 border-sky-200 text-sky-700' :
                isAdmin ? 'bg-indigo-50 border-indigo-200 text-indigo-700' :
                  'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}>
                {isDoctor ? '🩺 Doctor Portal' : isAdmin ? '🛡️ Admin Monitor' : '👤 Patient Portal'}
              </span>

              <div 
                className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer hover:bg-slate-50 p-1 rounded-lg transition-colors"
                onClick={() => isPatient && setProfileModalOpen(true)}
                title={isPatient ? "View Medical Profile" : "User Profile"}
              >
                <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-xs">
                  {isDoctor ? 'Dr' : isAdmin ? 'Ad' : 'Pt'}
                </div>
                <div className="text-left text-xs pr-1">
                  <p className="font-semibold text-slate-800 leading-tight">{user.name}</p>
                  <p className="text-[10px] text-slate-500 capitalize">{user.role}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 shadow-sm transition-all"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-slate-600 p-2 rounded-lg hover:bg-slate-100"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2">
          {isPatient && (
            <div className="space-y-1">
              <NavLink to="/patient" end onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-slate-700">Dashboard</NavLink>
              <NavLink to="/patient/reports" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-slate-700">My Reports</NavLink>
              <NavLink to="/patient/appointments" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-slate-700">Appointments</NavLink>
              <NavLink to="/patient/messages" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-slate-700">Messages</NavLink>
              <NavLink to="/patient/billing" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-slate-700">Billing</NavLink>
              <NavLink to="/patient/history" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-slate-700">History</NavLink>
            </div>
          )}
          {isDoctor && (
            <div className="space-y-1">
              <NavLink to="/doctor" end onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-slate-700">Patient Queue</NavLink>
              <NavLink to="/doctor/history" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-slate-700">Medical History</NavLink>
              <NavLink to="/doctor/approvals" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-slate-700">Pending Approvals</NavLink>
            </div>
          )}
          {isAdmin && (
            <div className="space-y-1">
              <NavLink to="/admin" end onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-slate-700">Dashboard</NavLink>
              <NavLink to="/admin/blockchain" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-slate-700">Blockchain</NavLink>
            </div>
          )}
          {user && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">{user.name} ({user.role})</span>
              <button onClick={handleLogout} className="text-red-500 font-semibold flex items-center gap-1">
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          )}
        </div>
      )}
      
      <PatientProfileModal 
        isOpen={profileModalOpen} 
        onClose={() => setProfileModalOpen(false)} 
        user={user} 
      />
    </header>
  );
}
