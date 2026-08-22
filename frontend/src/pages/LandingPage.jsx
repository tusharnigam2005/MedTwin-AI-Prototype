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

export default function LandingPage() {
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
    return import.meta.env.VITE_API_BASE_URL || '';
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

    if (!isLoginMode) {
      if (!formData.fullName) {
        setError('Please enter your full name.');
        setLoading(false);
        return;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long.');
        setLoading(false);
        return;
      }
      if (!/\d/.test(formData.password) || !/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
        setError('Password must contain at least one number and one special character.');
        setLoading(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
      }
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between relative overflow-hidden medtwin-motion">
      {/* Background covering full height, blue on left and purple on right fading to white in the middle */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-sky-200/80 via-white/60 to-purple-200/80 z-0 pointer-events-none" />

      {/* Premium Glassmorphic Healthcare Watermarks (Full Page) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[5%] left-[-2%] w-[400px] h-[400px] opacity-70 rotate-12">
          <div className="absolute top-1/2 left-0 w-full h-[100px] -mt-[50px] bg-gradient-to-tr from-sky-300/20 to-white/40 rounded-[40px] backdrop-blur-3xl border border-white/60 shadow-xl" />
          <div className="absolute left-1/2 top-0 w-[100px] h-full -ml-[50px] bg-gradient-to-tr from-sky-300/20 to-white/40 rounded-[40px] backdrop-blur-3xl border border-white/60 shadow-xl" />
        </div>
        <div className="absolute top-[15%] right-[5%] w-[300px] h-[120px] rounded-[100px] bg-gradient-to-br from-purple-300/20 to-white/30 backdrop-blur-3xl border-2 border-white/50 rotate-[45deg] shadow-lg flex items-center justify-center overflow-hidden opacity-70">
          <div className="w-[3px] h-full bg-white/60" />
          <div className="absolute top-2 left-6 w-[100px] h-[20px] bg-white/40 blur-lg rounded-full" />
        </div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[600px] h-[250px] rounded-[150px] bg-gradient-to-br from-purple-300/20 to-white/30 backdrop-blur-3xl border-2 border-white/50 rotate-[-35deg] shadow-2xl flex items-center justify-center overflow-hidden opacity-70">
          <div className="w-[4px] h-full bg-white/60" />
          <div className="absolute top-4 left-10 w-[200px] h-[40px] bg-white/40 blur-xl rounded-full" />
        </div>
      </div>

      {/* Top Brand Header */}
      <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-400 to-purple-500 flex items-center justify-center shadow-lg shadow-sky-500/20 border border-white/60">
            <Activity className="w-6 h-6 text-white font-bold" />
          </div>
          <div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
              MedTwin <span className="text-sky-500">AI</span>
            </span>
            <span className="text-xs text-slate-600 block font-medium">Autonomous Healthcare Digital Twin</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/60 text-sky-600 text-xs font-bold shadow-sm">
          <ShieldCheck className="w-4 h-4 text-sky-500 animate-pulse" />
          <span>Polygon On-Chain Node Ready</span>
        </div>
      </header>

      {/* Main Content: Hero Showcase + Authentication Form */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 flex-1">
        {/* Left Column: Platform Highlights */}
        <div className="lg:col-span-7 space-y-8 pr-0 lg:pr-8">


          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Your Persistent <br />
            <span className="bg-gradient-to-r from-sky-500 to-purple-500 bg-clip-text text-transparent">
              AI Medical Twin
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-medium">
            MedTwin AI bridges patient vitals and clinical diagnosis using a 5-agent LangGraph architecture. Every diagnosis is cryptographically verified and signed off on-chain by licensed doctors.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-3xl border border-white/60 shadow-xl space-y-2 ring-1 ring-black/5">
              <Cpu className="w-6 h-6 text-sky-500" />
              <h3 className="font-bold text-slate-900 text-sm">5-Agent LangGraph</h3>
              <p className="text-xs text-slate-500">OCR, Prediction, Diagnostic, Medication & Emergency automation.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-3xl border border-white/60 shadow-xl space-y-2 ring-1 ring-black/5">
              <Database className="w-6 h-6 text-purple-500" />
              <h3 className="font-bold text-slate-900 text-sm">Neon PostgreSQL</h3>
              <p className="text-xs text-slate-500">FastAPI async REST endpoints with relational patient telemetry.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-3xl border border-white/60 shadow-xl space-y-2 ring-1 ring-black/5">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              <h3 className="font-bold text-slate-900 text-sm">Polygon On-Chain</h3>
              <p className="text-xs text-slate-500">Tamper-proof medical audit trail with SHA-256 hash storage.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Auth Card (Swappable UI template for Frontend Team) */}
        <div className="lg:col-span-5">
          <div className="p-6 sm:p-8 rounded-3xl bg-white/70 backdrop-blur-3xl border border-white/60 shadow-2xl relative ring-1 ring-black/5">
            {/* Login vs Create Account Switcher */}
            <div className="flex rounded-xl bg-slate-100/50 p-1 mb-6 border border-white/50 backdrop-blur-sm">
              <button
                type="button"
                onClick={() => { setIsLoginMode(true); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${isLoginMode
                  ? 'bg-white text-sky-600 shadow-md border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => { setIsLoginMode(false); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${!isLoginMode
                  ? 'bg-white text-purple-600 shadow-md border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection Tabs */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Select Your Portal Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('patient')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 text-xs font-bold transition-all ${role === 'patient'
                      ? 'bg-sky-50 border-sky-400 text-sky-600 shadow-sm'
                      : 'bg-white/50 border-transparent text-slate-500 hover:border-slate-200'
                      }`}
                  >
                    <UserCheck className="w-5 h-5 mb-1.5" />
                    <span>Patient</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('doctor')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 text-xs font-bold transition-all ${role === 'doctor'
                      ? 'bg-purple-50 border-purple-400 text-purple-600 shadow-sm'
                      : 'bg-white/50 border-transparent text-slate-500 hover:border-slate-200'
                      }`}
                  >
                    <Stethoscope className="w-5 h-5 mb-1.5" />
                    <span>Doctor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 text-xs font-bold transition-all ${role === 'admin'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-600 shadow-sm'
                      : 'bg-white/50 border-transparent text-slate-500 hover:border-slate-200'
                      }`}
                  >
                    <ShieldCheck className="w-5 h-5 mb-1.5" />
                    <span>Admin</span>
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
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/50 bg-white/30 backdrop-blur-sm py-5 text-center text-xs text-slate-500 px-4 relative z-10 font-medium">
        <p>
          🤷Made by Team Tesseract
        </p>
      </footer>
    </div>
  );
}
