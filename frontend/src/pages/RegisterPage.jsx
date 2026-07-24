import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartPulse, Stethoscope, User, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const { role } = useParams(); // 'doctor' or 'patient'
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState(role || 'patient');
  const [error, setError] = useState('');

  const isDoctor = selectedRole === 'doctor';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    register(name.trim(), selectedRole);
    navigate(selectedRole === 'doctor' ? '/doctor' : '/patient');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(#14b8a6 1px, transparent 1px), linear-gradient(90deg, #14b8a6 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none transition-all duration-700 ${isDoctor ? 'bg-blue-500/8' : 'bg-teal-500/8'}`} />

      <div className="relative z-10 w-full max-w-md">

        {/* Back button */}
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </button>

        <div className="glass rounded-2xl p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-all duration-300 ${isDoctor ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-teal-500 to-emerald-600'}`}>
              {isDoctor ? <Stethoscope className="w-9 h-9 text-white" /> : <User className="w-9 h-9 text-white" />}
            </div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <HeartPulse className="w-5 h-5 text-teal-400" />
              <span className="text-teal-400 font-semibold text-sm">MedTwin AI</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Get Started</h2>
            <p className="text-slate-400 text-sm mt-1">Enter your details to access your portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Role toggle */}
            <div>
              <label className="block text-slate-400 text-xs uppercase tracking-widest mb-2">I am a</label>
              <div className="grid grid-cols-2 gap-2 p-1 glass-light rounded-xl">
                {['patient', 'doctor'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRole(r)}
                    className={`py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 capitalize ${
                      selectedRole === r
                        ? r === 'doctor'
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-teal-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {r === 'doctor' ? '🩺 Doctor' : '👤 Patient'}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-slate-400 text-xs uppercase tracking-widest mb-2">
                {isDoctor ? 'Doctor\'s Name' : 'Your Name'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                placeholder={isDoctor ? 'Dr. Sharma' : 'Your full name'}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors text-sm"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              className={`w-full py-3.5 rounded-xl font-bold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                isDoctor
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500'
                  : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500'
              }`}
            >
              {isDoctor ? 'Enter Doctor Portal →' : 'Enter Patient Portal →'}
            </button>
          </form>

          <p className="text-center text-slate-600 text-xs mt-6">
            Prototype system · For demonstration only
          </p>
        </div>
      </div>
    </div>
  );
}
