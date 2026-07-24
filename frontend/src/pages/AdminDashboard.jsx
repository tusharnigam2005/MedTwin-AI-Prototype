import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Shield, Users, FileText, Activity, Server, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('monitoring');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:8000/api/admin/stats');
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to connect to backend.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Admin Header */}
        <div className="border-b border-slate-200 pb-6">
          <h1 className="text-3xl font-extrabold text-slate-900 font-sans">
            Admin System Monitor — <span className="text-sky-500">{user?.name || 'Admin'}</span>
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            System health, active user monitoring, API logs, and platform status.
          </p>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          {[
            { id: 'monitoring', label: 'System Monitoring', icon: Activity },
            { id: 'users', label: 'User Directory', icon: Users },
            { id: 'reports', label: 'Report Logs', icon: FileText },
            { id: 'blockchain', label: 'Blockchain Status', icon: Shield },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === id
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-sky-50 hover:text-sky-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: MONITORING */}
        {tab === 'monitoring' && (
          <div className="space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-sky-500 mb-4" />
                <p className="text-slate-500 text-sm font-semibold">Loading system statistics...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm font-semibold">
                ⚠ {error}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
                  <p className="text-slate-500 text-xs font-bold uppercase">Total Users</p>
                  <p className="text-3xl font-extrabold text-slate-900">{stats.total_users}</p>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
                  <p className="text-slate-500 text-xs font-bold uppercase">Active Doctors</p>
                  <p className="text-3xl font-extrabold text-slate-900">{stats.active_doctors}</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
                  <p className="text-slate-500 text-xs font-bold uppercase">Processed Reports</p>
                  <p className="text-3xl font-extrabold text-slate-900">{stats.processed_reports}</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
                  <p className="text-slate-500 text-xs font-bold uppercase">Blockchain Verifications</p>
                  <p className="text-3xl font-extrabold text-slate-900">{stats.blockchain_verifications}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: USERS */}
        {tab === 'users' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-slate-900 font-bold text-base">User Directory</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-sky-50 text-slate-700 border-b border-slate-200">
                    <th className="p-3 font-bold">User ID</th>
                    <th className="p-3 font-bold">Name</th>
                    <th className="p-3 font-bold">Role</th>
                    <th className="p-3 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-mono">PT-101</td>
                    <td className="p-3 font-bold text-slate-800">Aarav Sharma</td>
                    <td className="p-3 text-slate-600">Patient</td>
                    <td className="p-3 text-emerald-600 font-semibold">Active</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono">DOC-402</td>
                    <td className="p-3 font-bold text-slate-800">Dr. Saubhik Bhaumik</td>
                    <td className="p-3 text-slate-600">Doctor</td>
                    <td className="p-3 text-emerald-600 font-semibold">Active</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: REPORTS */}
        {tab === 'reports' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-slate-900 font-bold text-base">Report Processing Logs</h3>
            <div className="text-xs text-slate-600 space-y-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                <span>[2026-07-23 16:40] Processed synthetic_medical_report.pdf — 5 Agents Completed</span>
                <span className="text-emerald-600 font-bold">200 OK</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BLOCKCHAIN PLACEHOLDER (Section 13 & 21 requirement) */}
        {tab === 'blockchain' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center space-y-3 max-w-2xl mx-auto my-8">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Blockchain Integration</h3>
            <p className="text-sky-700 font-semibold text-xs bg-sky-50 py-1 px-3 rounded-full inline-block border border-sky-200">
              Status: Not Integrated Yet
            </p>
            <p className="text-slate-500 text-xs leading-relaxed max-w-md mx-auto">
              This module will be connected in a later implementation phase. Smart contract audit logging is currently disabled.
            </p>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        MedTwin AI Platform · Admin System Monitor
      </footer>
    </div>
  );
}
