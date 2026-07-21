import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LandingAuth from './pages/LandingAuth';

export default function App() {
  const [activeRole, setActiveRole] = useState('patient'); // 'patient', 'doctor', or 'admin'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleAuthSuccess = (role, userData) => {
    setActiveRole(role);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  // If not authenticated, render the starting Landing & Auth Page
  if (!isAuthenticated) {
    return <LandingAuth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-navy-900 text-slate-100">
      {/* Left Navigation Sidebar Drawer */}
      <Sidebar 
        activeRole={activeRole} 
        setActiveRole={setActiveRole} 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
      />

      {/* Top Navbar with Toggle Button & Logout */}
      <Navbar 
        activeRole={activeRole} 
        setActiveRole={setActiveRole} 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Responsive Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 overflow-x-hidden">
        {activeRole === 'patient' && <PatientDashboard />}
        {activeRole === 'doctor' && <DoctorDashboard />}
        {activeRole === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <footer className="border-t border-navy-700/60 bg-navy-900/50 py-6 text-center text-xs text-slate-400 px-4">
        <p>
          Team MedTwin · Round 02 — The Terminal Lockdown · Gwalior 2026 | Technical Engineering Deck · Black-Box Protocol
        </p>
      </footer>
    </div>
  );
}
