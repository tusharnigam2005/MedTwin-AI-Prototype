import React, { useState, useEffect } from 'react';
import { X, User, Activity, Scale, Ruler, Droplet, ShieldCheck, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function PatientProfileModal({ isOpen, onClose, user }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Editable fields
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [email, setEmail] = useState('');

  // Auto-calculated BMI
  const bmi = (weight && height) 
    ? (parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2)).toFixed(1) 
    : '--';

  useEffect(() => {
    if (isOpen && user?.role === 'patient') {
      fetchProfile();
    }
  }, [isOpen, user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const token = localStorage.getItem('medtwin_jwt') || localStorage.getItem('medtwin_token');
      
      const res = await axios.get(`${baseUrl}/api/patient/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = res.data;
      setProfileData(data);
      setWeight(data.medical_history?.weight || '');
      setHeight(data.medical_history?.height || '');
      setGender(data.gender || '');
      setDob(data.dob || '');
      setBloodGroup(data.medical_history?.blood_group || '');
      setEmail(data.email || user?.email || '');
    } catch (err) {
      console.error("Failed to fetch profile", err);
      setError("Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const token = localStorage.getItem('medtwin_jwt') || localStorage.getItem('medtwin_token');
      
      await axios.put(`${baseUrl}/api/patient/profile`, 
        { weight, height, gender, dob, blood_group: bloodGroup, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state and close
      onClose();
    } catch (err) {
      console.error("Failed to update profile", err);
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all duration-300">
      <div 
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col transform transition-all duration-300 scale-100 opacity-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-400 to-purple-500 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Medical Profile</h2>
              <p className="text-sky-100 text-xs">Patient Digital Twin Settings</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-sky-500">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p className="text-sm font-semibold text-slate-600">Loading profile data...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-200">
              {error}
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Personal Information */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 opacity-70">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Full Name (Locked)</p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{user?.name || profileData?.email}</p>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center justify-between">Email</label>
                    <input 
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Email address"
                      className="w-full bg-slate-50 hover:bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all cursor-text"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Gender</label>
                    <select 
                      value={gender}
                      onChange={e => setGender(e.target.value)}
                      className="w-full bg-slate-50 hover:bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all cursor-pointer capitalize"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Date of Birth</label>
                    <input 
                      type="date"
                      value={dob}
                      onChange={e => setDob(e.target.value)}
                      className="w-full bg-slate-50 hover:bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all cursor-text"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                      <Droplet className="w-3 h-3 text-rose-500" /> Blood Group
                    </label>
                    <select 
                      value={bloodGroup}
                      onChange={e => setBloodGroup(e.target.value)}
                      className="w-full bg-slate-50 hover:bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all cursor-pointer"
                    >
                      <option value="">Select</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Dynamic Vitals */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Dynamic Health Metrics
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  
                  {/* Weight Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-sky-500" /> Weight (kg)
                    </label>
                    <input 
                      type="number"
                      value={weight}
                      onChange={e => setWeight(e.target.value)}
                      placeholder="e.g. 70"
                      className="w-full bg-slate-50 hover:bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all cursor-text"
                    />
                  </div>

                  {/* Height Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5 text-sky-500" /> Height (cm)
                    </label>
                    <input 
                      type="number"
                      value={height}
                      onChange={e => setHeight(e.target.value)}
                      placeholder="e.g. 175"
                      className="w-full bg-slate-50 hover:bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all cursor-text"
                    />
                  </div>
                </div>

                {/* Live BMI Display */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 flex items-center justify-between text-white shadow-lg shadow-slate-900/10">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Calculated BMI</p>
                    <div className="flex items-end gap-2 mt-1">
                      <span className="text-2xl font-black">{bmi}</span>
                      {bmi !== '--' && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase mb-1 ${
                          bmi < 18.5 ? 'bg-amber-500/20 text-amber-300' :
                          bmi < 25 ? 'bg-emerald-500/20 text-emerald-300' :
                          bmi < 30 ? 'bg-orange-500/20 text-orange-300' :
                          'bg-rose-500/20 text-rose-300'
                        }`}>
                          {bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'}
                        </span>
                      )}
                    </div>
                  </div>
                  <Activity className="w-10 h-10 text-white/10" />
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-100 bg-slate-50 p-4 flex items-center justify-end gap-3 rounded-b-2xl">
          <button 
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={saving || loading}
            className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-sky-400 to-purple-500 hover:from-sky-500 hover:to-purple-600 shadow-md shadow-purple-500/30 transition-all disabled:opacity-70 flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}
