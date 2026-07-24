import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HeartPulse, User, Stethoscope, Shield, ArrowRight, CheckCircle2, Lock, Mail
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { login: setGlobalUser } = useAuth();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [selectedRole, setSelectedRole] = useState('patient');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
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
        const bodyParams = new URLSearchParams();
        bodyParams.append('username', formData.email);
        bodyParams.append('password', formData.password);

        const res = await fetch(`${API_BASE}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: bodyParams
        });

        if (!res.ok) throw new Error('Invalid email or password');

        const data = await res.json();
        localStorage.setItem('medtwin_token', data.access_token);
        
        const finalRole = data.role || selectedRole;
        setGlobalUser(formData.email.split('@')[0].toUpperCase(), finalRole);
        
        if (finalRole === 'doctor') navigate('/doctor');
        else if (finalRole === 'admin') navigate('/admin');
        else navigate('/patient');
      } else {
        const signupPayload = {
          email: formData.email,
          password: formData.password,
          role: selectedRole,
          dob: '2000-01-01',
          gender: 'Not Specified'
        };

        const res = await fetch(`${API_BASE}/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signupPayload)
        });

        if (!res.ok) throw new Error('Could not register account');

        // Auto login
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
          setGlobalUser(formData.fullName || formData.email.split('@')[0], selectedRole);
          if (selectedRole === 'doctor') navigate('/doctor');
          else if (selectedRole === 'admin') navigate('/admin');
          else navigate('/patient');
        } else {
          setIsLoginMode(true);
          setError('Account created! Please login now.');
        }
      }
    } catch (err) {
      if (err.message.includes('Failed to fetch') || window.location.hostname === 'localhost') {
        setError('⚡ Local Backend Offline — Auto-entering Offline Demo Mode...');
        setTimeout(() => {
          const fallbackName = formData.fullName || formData.email.split('@')[0] || 'Tushar Nigam';
          setGlobalUser(fallbackName.toUpperCase(), selectedRole);
          if (selectedRole === 'doctor') navigate('/doctor');
          else if (selectedRole === 'admin') navigate('/admin');
          else navigate('/patient');
        }, 1000);
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

            <div className="space-y-2 text-left flex justify-between items-center border-b border-slate-200 pb-4 mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{isLoginMode ? 'Welcome back' : 'Create Account'}</h3>
                <p className="text-slate-500 text-xs">
                  {isLoginMode ? 'Select your role to access your secure portal' : 'Enter details to generate a medical twin'}
                </p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                  type="button" 
                  onClick={() => { setIsLoginMode(true); setError(''); }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${isLoginMode ? 'bg-white shadow-sm text-sky-600' : 'text-slate-500 hover:text-slate-700'}`}
                >Login</button>
                <button 
                  type="button" 
                  onClick={() => { setIsLoginMode(false); setError(''); }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${!isLoginMode ? 'bg-white shadow-sm text-sky-600' : 'text-slate-500 hover:text-slate-700'}`}
                >Sign Up</button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

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
                {!isLoginMode && (
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. Aarav Sharma"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-sky-500 transition-colors"
                      />
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Email / Username</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder={selectedRole === 'doctor' ? 'doctor@medtwin.ai' : 'patient@medtwin.ai'}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-sky-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-sky-500 transition-colors"
                    />
                  </div>
                </div>

                {!isLoginMode && (
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Confirm Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-sky-500 transition-colors"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold border border-rose-200">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Connecting...
                  </span>
                ) : (
                  <>
                    <span>{isLoginMode ? `Enter ${selectedRole === 'doctor' ? 'Doctor Portal' : selectedRole === 'admin' ? 'Admin Monitor' : 'Patient Portal'}` : 'Create MedTwin Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
