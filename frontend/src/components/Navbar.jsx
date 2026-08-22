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

  const isPatient = user?.role === 'patient';
  const isDoctor = user?.role === 'doctor';
  const isAdmin = user?.role === 'admin';

  const linkClass = ({ isActive }) =>
    `flex items-center gap-1.5 px-1 py-2 text-sm font-semibold transition-all ${isActive
      ? 'text-slate-900 border-b-2 border-slate-900'
      : 'text-slate-600 hover:text-slate-900'
    }`;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">

        {/* Logo & Subtitle */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-purple-500 flex items-center justify-center text-white shadow-sm">
            <HeartPulse className="w-5 h-5 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-slate-900 font-extrabold text-lg tracking-tight font-sans">
                MedTwin
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
              AI-Powered Autonomous Healthcare Platform
            </p>
          </div>
        </div>

        {/* Navigation links (Centered like Zocdoc) */}
        <div className="flex-1 flex justify-center">
          {isPatient && (
            <nav className="hidden lg:flex items-center gap-6">
              <NavLink to="/patient" end className={linkClass}>
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
                <span>History</span>
              </NavLink>
            </nav>
          )}

        {/* Navigation links for Doctor */}
        {isDoctor && (
          <nav className="hidden lg:flex items-center gap-6">
            <NavLink to="/doctor" end className={linkClass}>
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
          <nav className="hidden lg:flex items-center gap-6">
            <NavLink to="/admin" className={linkClass}>
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/admin/blockchain" className={linkClass}>
              <span>Blockchain</span>
            </NavLink>
          </nav>
        )}
        </div>

        {/* User Profile & Single Active Portal Badge */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <>
              {/* Removed Portal Badge */}

              <div className="flex items-center gap-1 bg-white border border-slate-200 shadow-sm rounded-full p-1 pl-1 pr-2">
                {/* Clickable Profile Section */}
                <div 
                  className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 rounded-full pr-3 transition-colors"
                  onClick={() => isPatient && setProfileModalOpen(true)}
                  title={isPatient ? "View Medical Profile" : "User Profile"}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-purple-500 flex items-center justify-center text-white text-sm shadow-sm">
                    {isDoctor ? '🩺' : isAdmin ? '🛡️' : '👤'}
                  </div>
                  <div className="text-left text-xs">
                    <p className="font-bold text-slate-800 leading-tight">
                      {user.name ? user.name.split(' ')[0].charAt(0).toUpperCase() + user.name.split(' ')[0].slice(1).toLowerCase() : 'User'}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium capitalize">{user.role}</p>
                  </div>
                </div>

                {/* Separator */}
                <div className="w-px h-6 bg-slate-200 mx-1"></div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
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
