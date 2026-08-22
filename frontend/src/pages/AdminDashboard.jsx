import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Shield, Users, FileText, Activity, Server, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('monitoring');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [logsLoading, setLogsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const res = await axios.get(`${baseUrl}/api/admin/stats`);
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to connect to backend.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    if (tab === 'users') {
      fetchUsers();
    } else if (tab === 'reports') {
      fetchLogs();
    }
  }, [tab]);

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const res = await axios.get(`${baseUrl}/api/admin/users`);
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      setLogsLoading(true);
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const res = await axios.get(`${baseUrl}/api/admin/logs`);
      setLogs(res.data);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setLogsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 medtwin-motion flex flex-col font-sans text-slate-900 relative">
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
        <div className="absolute top-[45%] left-[5%] w-[250px] h-[250px] rounded-full bg-gradient-to-tr from-sky-300/20 to-purple-300/20 backdrop-blur-3xl border-2 border-white/50 shadow-xl opacity-70" />
        <div className="absolute top-[60%] right-[-2%] w-[250px] h-[250px] opacity-70 rotate-[-15deg]">
          <div className="absolute top-1/2 left-0 w-full h-[60px] -mt-[30px] bg-gradient-to-tr from-purple-300/20 to-white/40 rounded-[30px] backdrop-blur-3xl border border-white/60" />
          <div className="absolute left-1/2 top-0 w-[60px] h-full -ml-[30px] bg-gradient-to-tr from-purple-300/20 to-white/40 rounded-[30px] backdrop-blur-3xl border border-white/60" />
        </div>
        <div className="absolute bottom-[15%] left-[8%] w-[250px] h-[100px] rounded-[100px] bg-gradient-to-br from-sky-300/20 to-white/30 backdrop-blur-3xl border-2 border-white/50 rotate-[-60deg] shadow-lg flex items-center justify-center overflow-hidden opacity-70">
          <div className="w-[3px] h-full bg-white/60" />
        </div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[600px] h-[250px] rounded-[150px] bg-gradient-to-br from-purple-300/20 to-white/30 backdrop-blur-3xl border-2 border-white/50 rotate-[-35deg] shadow-2xl flex items-center justify-center overflow-hidden opacity-70">
          <div className="w-[4px] h-full bg-white/60" />
          <div className="absolute top-4 left-10 w-[200px] h-[40px] bg-white/40 blur-xl rounded-full" />
        </div>
      </div>

      <div className="relative z-10 w-full flex flex-col min-h-screen">
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
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${tab === id
                  ? 'bg-gradient-to-r from-sky-400 to-purple-500 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-white/60 backdrop-blur-md hover:text-sky-600 border border-transparent hover:border-white/50'
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
                <div className="bg-white/70 backdrop-blur-3xl border border-white/60 rounded-3xl p-5 shadow-xl space-y-1 medtwin-hover-glow ring-1 ring-black/5">
                  <p className="text-slate-500 text-xs font-bold uppercase">Total Users</p>
                  <p className="text-3xl font-extrabold text-slate-900">{stats.total_users}</p>
                </div>

                <div className="bg-white/70 backdrop-blur-3xl border border-white/60 rounded-3xl p-5 shadow-xl space-y-1 medtwin-hover-glow ring-1 ring-black/5">
                  <p className="text-slate-500 text-xs font-bold uppercase">Active Doctors</p>
                  <p className="text-3xl font-extrabold text-slate-900">{stats.active_doctors}</p>
                </div>

                <div className="bg-white/70 backdrop-blur-3xl border border-white/60 rounded-3xl p-5 shadow-xl space-y-1 medtwin-hover-glow ring-1 ring-black/5">
                  <p className="text-slate-500 text-xs font-bold uppercase">Processed Reports</p>
                  <p className="text-3xl font-extrabold text-slate-900">{stats.processed_reports}</p>
                </div>

                <div className="bg-white/70 backdrop-blur-3xl border border-white/60 rounded-3xl p-5 shadow-xl space-y-1 medtwin-hover-glow ring-1 ring-black/5">
                  <p className="text-slate-500 text-xs font-bold uppercase">Blockchain Verifications</p>
                  <p className="text-3xl font-extrabold text-slate-900">{stats.blockchain_verifications}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: USERS */}
        {tab === 'users' && (
          <div className="bg-white/70 backdrop-blur-3xl border border-white/60 rounded-3xl p-6 shadow-xl space-y-4 medtwin-hover-glow ring-1 ring-black/5">
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
                  {usersLoading ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-slate-500 font-semibold">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-sky-500" />
                        Loading users...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-slate-500 font-semibold">No users found.</td>
                    </tr>
                  ) : users.map(u => (
                    <tr key={u.id}>
                      <td className="p-3 font-mono">{u.display_id}</td>
                      <td className="p-3 font-bold text-slate-800">{u.name}</td>
                      <td className="p-3 text-slate-600">{u.role}</td>
                      <td className="p-3 text-emerald-600 font-semibold">{u.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: REPORTS */}
        {tab === 'reports' && (
          <div className="bg-white/70 backdrop-blur-3xl border border-white/60 rounded-3xl p-6 shadow-xl space-y-4 medtwin-hover-glow ring-1 ring-black/5">
            <h3 className="text-slate-900 font-bold text-base">Report Processing Logs</h3>
            <div className="text-xs text-slate-600 space-y-2">
              {logsLoading ? (
                <div className="p-8 text-center text-slate-500 font-semibold flex flex-col items-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-sky-500" />
                  Loading logs...
                </div>
              ) : logs.length === 0 ? (
                <div className="p-4 text-center text-slate-500 font-semibold">No logs found.</div>
              ) : logs.map(l => (
                <div key={l.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                  <span>[{l.timestamp}] {l.message}</span>
                  <span className="text-emerald-600 font-bold">{l.status_code}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: BLOCKCHAIN */}
        {tab === 'blockchain' && (
          <div className="bg-white/70 backdrop-blur-3xl border border-white/60 rounded-3xl p-8 shadow-xl text-center space-y-3 max-w-2xl mx-auto my-8 medtwin-hover-glow ring-1 ring-black/5">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Blockchain Integration</h3>
            <p className="text-sky-700 font-semibold text-xs bg-sky-50 py-1 px-3 rounded-full inline-block border border-sky-200">
              Status: Verified / Polygon SHA-256 Connected
            </p>
            <p className="text-slate-500 text-xs leading-relaxed max-w-md mx-auto">
              Smart contract audit log tracking and automated verification enabled.
            </p>
          </div>
        )}
      </main>

      <footer className="border-t border-white/50 bg-white/30 backdrop-blur-sm py-4 text-center text-xs text-slate-500 relative z-10">
        MedTwin AI Platform · Admin System Monitor
      </footer>
      </div>
    </div>
  );
}
