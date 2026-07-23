import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HeartPulse, User, Stethoscope, Shield, ArrowRight, CheckCircle2, Lock
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState('patient');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const userObj = login(username || (selectedRole === 'doctor' ? 'Dr. Saubhik Bhaumik' : 'Aarav Sharma'), selectedRole);
    if (selectedRole === 'doctor') navigate('/doctor');
    else if (selectedRole === 'admin') navigate('/admin');
    else navigate('/patient');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between font-sans">

      {/* Main Split Screen Container */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-[calc(100vh-60px)]">

        {/* Left Side: Brand & Value Proposition (Inspired by Screenshot) */}
        <div className="lg:w-1/2 bg-gradient-to-br from-sky-500 via-sky-600 to-sky-700 p-8 lg:p-16 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="relative z-10 space-y-6">

            {/* Brand Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight font-sans">MedTwin AI</h1>
                <p className="text-xs text-sky-100 font-medium">Autonomous Healthcare Platform</p>
              </div>
            </div>

            <div className="pt-12 space-y-4 max-w-lg">
              <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
                Your Health.<br />
                Predicted.<br />
                Protected.
              </h2>
              <p className="text-sky-100 text-sm sm:text-base leading-relaxed font-normal">
                A multi-agent healthcare platform that analyzes medical reports, monitors vitals, and flags health risks before they become emergencies.
              </p>
            </div>

            <div className="pt-6 space-y-3 text-xs text-sky-100 font-medium">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-200" />
                <span>AI-powered chronic disease risk prediction</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-200" />
                <span>Human-in-the-loop doctor oversight</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-200" />
                <span>Evidence-based lifestyle & medication guidance</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-12 text-xs text-sky-200 font-medium">
            Team MedTwin · Healthcare AI Platform
          </div>
        </div>

        {/* Right Side: Role Selection & Login Form */}
        <div className="lg:w-1/2 bg-white p-8 lg:p-16 flex flex-col justify-center items-center">
          <div className="w-full max-w-md space-y-8">

            <div className="space-y-2 text-left">
              <h3 className="text-2xl font-bold text-slate-900">Welcome back</h3>
              <p className="text-slate-500 text-xs">
                Select your role to access your secure portal
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">

              {/* Role Selection Cards */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Select Role
                </p>

                {/* Patient Role Card */}
                <div
                  onClick={() => setSelectedRole('patient')}
                  className={`border-2 rounded-2xl p-4 cursor-pointer transition-all flex items-center justify-between ${
                    selectedRole === 'patient'
                      ? 'border-sky-500 bg-sky-50/60 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      selectedRole === 'patient' ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <User className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-900 text-sm">Patient Portal</p>
                      <p className="text-slate-500 text-xs">View digital twin, reports & health analysis</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedRole === 'patient' ? 'border-sky-500 bg-sky-500' : 'border-slate-300'
                  }`}>
                    {selectedRole === 'patient' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>

                {/* Doctor Role Card */}
                <div
                  onClick={() => setSelectedRole('doctor')}
                  className={`border-2 rounded-2xl p-4 cursor-pointer transition-all flex items-center justify-between ${
                    selectedRole === 'doctor'
                      ? 'border-sky-500 bg-sky-50/60 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      selectedRole === 'doctor' ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-900 text-sm">Doctor Portal</p>
                      <p className="text-slate-500 text-xs">Review patient queue, approve & escalate cases</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedRole === 'doctor' ? 'border-sky-500 bg-sky-500' : 'border-slate-300'
                  }`}>
                    {selectedRole === 'doctor' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>

                {/* Admin Role Card */}
                <div
                  onClick={() => setSelectedRole('admin')}
                  className={`border-2 rounded-2xl p-4 cursor-pointer transition-all flex items-center justify-between ${
                    selectedRole === 'admin'
                      ? 'border-sky-500 bg-sky-50/60 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      selectedRole === 'admin' ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Shield className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-900 text-sm">Admin Monitor</p>
                      <p className="text-slate-500 text-xs">System access — users, logs & monitoring</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedRole === 'admin' ? 'border-sky-500 bg-sky-500' : 'border-slate-300'
                  }`}>
                    {selectedRole === 'admin' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Username / Email</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username or email"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Enter {selectedRole === 'doctor' ? 'Doctor Portal' : selectedRole === 'admin' ? 'Admin Portal' : 'Patient Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
