import React, { useState } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  UserCheck, 
  Stethoscope, 
  LayoutDashboard, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  Database,
  Wallet,
  Sparkles
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LandingAuth() {
  const { login: setGlobalUser } = useAuth();
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [role, setRole] = useState('patient'); // 'patient', 'doctor', or 'admin'
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    walletAddress: '0x71C...89f2'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const getApiBaseUrl = () => {
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
      if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return `http://${window.location.hostname}:8000`;
      }
    }
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError('Please provide both email and password.');
      setLoading(false);
      return;
    }

    if (!isLoginMode && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const BASE_URL = getApiBaseUrl();
      const API_BASE = `${BASE_URL}/api/auth`;
      
      if (isLoginMode) {
        // Login using real FastAPI OAuth2 form data
        const bodyParams = new URLSearchParams();
        bodyParams.append('username', formData.email);
        bodyParams.append('password', formData.password);

        const res = await fetch(`${API_BASE}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: bodyParams
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({ detail: 'Login failed' }));
          throw new Error(errData.detail || 'Invalid email or password');
        }

        const data = await res.json();
        localStorage.setItem('medtwin_token', data.access_token);
        localStorage.setItem('medtwin_jwt', data.access_token);
        
        const finalRole = data.role || role;
        setGlobalUser(formData.email.split('@')[0].toUpperCase(), finalRole);
        
        if (finalRole === 'doctor') navigate('/doctor');
        else if (finalRole === 'admin') navigate('/admin');
        else navigate('/patient');
      } else {
        // Create Account (Signup) using real FastAPI endpoint
        const signupPayload = {
          email: formData.email,
          password: formData.password,
          role: role,
          dob: '2000-01-01',
          gender: 'Not Specified'
        };

        const res = await fetch(`${API_BASE}/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signupPayload)
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({ detail: 'Registration failed' }));
          throw new Error(errData.detail || 'Could not register account');
        }

        // Auto login after signup
        const bodyParams = new URLSearchParams();
        bodyParams.append('username', formData.email);
        bodyParams.append('password', formData.password);

        const loginRes = await fetch(`${API_BASE}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: bodyParams
        });

        if (loginRes.ok) {
          const data = await loginRes.json();
          localStorage.setItem('medtwin_token', data.access_token);
          localStorage.setItem('medtwin_jwt', data.access_token);
          
          setGlobalUser(formData.fullName || formData.email.split('@')[0], role);
          
          if (role === 'doctor') navigate('/doctor');
          else if (role === 'admin') navigate('/admin');
          else navigate('/patient');
        } else {
          setIsLoginMode(true);
          setError('Account created! Please login now.');
        }
      }
    } catch (err) {
      console.warn('Real backend call error, falling back if offline:', err.message);
      // If backend is unreachable on localhost or errored out, automatically enter Local Offline Demo Mode!
      if (err.message.includes('Failed to fetch') || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        setError('⚡ Local Backend Offline — Auto-entering Offline Demo Mode...');
        setTimeout(() => {
          const fallbackName = formData.fullName || (formData.email ? formData.email.split('@')[0] : 'Tushar Nigam');
          setGlobalUser(fallbackName.toUpperCase(), role);
          
          if (role === 'doctor') navigate('/doctor');
          else if (role === 'admin') navigate('/admin');
          else navigate('/patient');
        }, 1000);
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoRole) => {
    setLoading(true);
    setError('');
    const demoCredentials = {
      patient: { email: 'umang@medtwin.ai', password: 'patient123', name: 'Umang Sharma' },
      doctor: { email: 'doctor@medtwin.ai', password: 'doctor123', name: 'Dr. Aarav Patel' }
    };
    const target = demoCredentials[demoRole] || demoCredentials.patient;

    try {
      const BASE_URL = getApiBaseUrl();
      const bodyParams = new URLSearchParams();
      bodyParams.append('username', target.email);
      bodyParams.append('password', target.password);

      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: bodyParams
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('medtwin_token', data.access_token);
        localStorage.setItem('medtwin_jwt', data.access_token);
        
        setGlobalUser(target.name, demoRole);
        
        if (demoRole === 'doctor') navigate('/doctor');
        else if (demoRole === 'admin') navigate('/admin');
        else navigate('/patient');
        
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Demo login failed against API:', err);
    }

    // Seamless fallback if backend not running
    setGlobalUser(target.name, demoRole);
    if (demoRole === 'doctor') navigate('/doctor');
    else if (demoRole === 'admin') navigate('/admin');
    else navigate('/patient');
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Brand Header */}
      <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
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

        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 animate-pulse-subtle" />
          <span>Polygon On-Chain Node Ready</span>
        </div>
      </header>

      {/* Main Content: Hero Showcase + Authentication Form */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 flex-1">
        {/* Left Column: Platform Highlights */}
        <div className="lg:col-span-7 space-y-8 pr-0 lg:pr-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-800 border border-navy-700 text-teal-400 text-xs font-semibold shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>Round 02 Architecture · Black-Box Protocol</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Your Persistent <br />
            <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-500 bg-clip-text text-transparent">
              AI Medical Twin
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            MedTwin AI bridges patient vitals and clinical diagnosis using a 5-agent LangGraph architecture. Every diagnosis is cryptographically verified and signed off on-chain by licensed doctors.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-navy-800/60 border border-navy-700/80 space-y-2">
              <Cpu className="w-6 h-6 text-teal-400" />
              <h3 className="font-bold text-white text-sm">5-Agent LangGraph</h3>
              <p className="text-xs text-slate-400">OCR, Prediction, Diagnostic, Medication & Emergency automation.</p>
            </div>

            <div className="p-4 rounded-2xl bg-navy-800/60 border border-navy-700/80 space-y-2">
              <Database className="w-6 h-6 text-teal-400" />
              <h3 className="font-bold text-white text-sm">Neon PostgreSQL</h3>
              <p className="text-xs text-slate-400">FastAPI async REST endpoints with relational patient telemetry.</p>
            </div>

            <div className="p-4 rounded-2xl bg-navy-800/60 border border-navy-700/80 space-y-2">
              <ShieldCheck className="w-6 h-6 text-teal-400" />
              <h3 className="font-bold text-white text-sm">Polygon On-Chain</h3>
              <p className="text-xs text-slate-400">Tamper-proof medical audit trail with SHA-256 hash storage.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Auth Card (Swappable UI template for Frontend Team) */}
        <div className="lg:col-span-5">
          <div className="glass-card p-6 sm:p-8 border-navy-700 shadow-2xl relative bg-navy-800/90 backdrop-blur-xl">
            {/* Login vs Create Account Switcher */}
            <div className="flex rounded-xl bg-navy-900/80 p-1 border border-navy-700 mb-6">
              <button
                type="button"
                onClick={() => { setIsLoginMode(true); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  isLoginMode 
                    ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-navy-900 shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => { setIsLoginMode(false); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  !isLoginMode 
                    ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-navy-900 shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection Tabs */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Select Your Portal Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('patient')}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      role === 'patient'
                        ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                        : 'bg-navy-900/50 border-navy-700 text-slate-400 hover:border-navy-600'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 mb-1" />
                    <span>Patient</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('doctor')}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      role === 'doctor'
                        ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                        : 'bg-navy-900/50 border-navy-700 text-slate-400 hover:border-navy-600'
                    }`}
                  >
                    <Stethoscope className="w-4 h-4 mb-1" />
                    <span>Doctor</span>
                  </button>
                </div>
              </div>

              {!isLoginMode && (
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                    <input
                      type="text"
                      name="fullName"
                      placeholder="e.g. Umang Sharma"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-navy-900/80 border border-navy-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Email / Username</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="email"
                    name="email"
                    placeholder={role === 'doctor' ? 'doctor@medtwin.ai' : role === 'admin' ? 'admin@medtwin.ai' : 'umang@medtwin.ai'}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-navy-900/80 border border-navy-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-navy-900/80 border border-navy-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
              </div>

              {!isLoginMode && (
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="••••••••••••"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-navy-900/80 border border-navy-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors"
                    />
                  </div>
                </div>
              )}


              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 text-base font-bold mt-2 shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
                    Connecting Database...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>{isLoginMode ? 'Access Twin Portal' : 'Create & Deploy Twin'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </form>

            {/* Instant Local Demo Bypass Section (No Account Needed) */}
            <div className="mt-6 pt-5 border-t border-navy-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase font-bold text-teal-400 tracking-wider bg-teal-500/10 px-2.5 py-0.5 rounded border border-teal-500/20 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" /> Local Testing Bypass
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Zero Login Needed</span>
              </div>
              <p className="text-xs text-slate-300">
                Testing UI locally? Click below to immediately bypass login and enter enterprise dashboards right now:
              </p>
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('patient')}
                  disabled={loading}
                  className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500/20 to-emerald-500/20 hover:from-teal-500/30 hover:to-emerald-500/30 border border-teal-500/40 text-teal-300 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Test Patient Twin</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('doctor')}
                  disabled={loading}
                  className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-teal-500/20 hover:from-cyan-500/30 hover:to-teal-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <Stethoscope className="w-4 h-4 text-cyan-400" />
                  <span>Test Doctor Portal</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-navy-700/60 bg-navy-900/50 py-5 text-center text-xs text-slate-400 px-4 relative z-10">
        <p>
          Team MedTwin · Round 02 — The Terminal Lockdown · Gwalior 2026 | Database Readiness & Authentication Layer
        </p>
      </footer>
    </div>
  );
}
