import React, { useState } from 'react';
import Navbar from './components/Navbar';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [activeRole, setActiveRole] = useState('patient'); // 'patient', 'doctor', or 'admin'

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeRole={activeRole} setActiveRole={setActiveRole} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {activeRole === 'patient' && <PatientDashboard />}
        {activeRole === 'doctor' && <DoctorDashboard />}
        {activeRole === 'admin' && <AdminDashboard />}
      </main>

      <footer className="border-t border-navy-700/60 bg-navy-900/50 py-6 text-center text-xs text-slate-400">
        <p>
          Team MedTwin · Round 02 — The Terminal Lockdown · Gwalior 2026 | Technical Engineering Deck · Black-Box Protocol
        </p>
      </footer>
    </div>
  );
}
