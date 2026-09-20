import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ReportUpload from '../components/ReportUpload';
import AgentResults from '../components/AgentResults';
import { useAuth } from '../context/AuthContext';
import {
  Stethoscope, CheckCircle2, AlertTriangle, Flag,
  Users, Activity, FileText, RotateCcw, Shield, Loader2, Search, FolderOpen
} from 'lucide-react';
import axios from 'axios';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname.replace(/\/$/, '');

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [result, setResult] = useState(null);
  const [reviewDecision, setReviewDecision] = useState(null); // 'approved' | 'more_data' | 'escalated'
  const [queue, setQueue] = useState([]);
  const [loadingQueue, setLoadingQueue] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [reportId, setReportId] = useState(null);
  const [bcData, setBcData] = useState(null);
  const [showAllQueue, setShowAllQueue] = useState(false);

  const pendingQueue = queue.filter(q => q.status === 'pending_doctor_review');
  const approvedQueue = queue.filter(q => q.status === 'approved');

  const fetchQueue = async () => {
    try {
      setLoadingQueue(true);
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const res = await axios.get(`${baseUrl}/api/doctor/queue`);
      setQueue(res.data);
    } catch (err) {
      console.error('Failed to fetch doctor queue', err);
    } finally {
      setLoadingQueue(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleReviewClick = (patient) => {
    setSelectedPatient(patient);
    setReviewDecision(patient.status === 'approved' ? 'approved' : null);
    if (patient.latest_report_id) setReportId(patient.latest_report_id);
    if (patient.blockchain_verification) setBcData(patient.blockchain_verification);
  };

  const handleBlockchainVerify = async () => {
    if (!reportId) return alert('No report found to verify.');
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const res = await axios.get(`${baseUrl}/api/blockchain/verify/${reportId}`);
      if (res.data.is_match) {
        alert('✅ Blockchain Verification Successful! The file matches the Polygon Smart Contract hash perfectly. Downloading now...');
        window.open(`${baseUrl}/api/blockchain/download/${reportId}`, '_blank');
      } else {
        alert('🔴 Blockchain Verification Failed: The file has been modified or tampered with.');
      }
    } catch (err) {
      alert(err.response?.data?.detail || 'Verification error');
    }
  };

  const handleAction = async (status) => {
    if (!selectedPatient) return;
    try {
      setActionLoading(true);
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      await axios.post(`${baseUrl}/api/doctor/approve/${selectedPatient.id}`, {
        action_status: status
      });
      setReviewDecision(status);
      fetchQueue(); // Refresh queue
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to submit review');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 medtwin-motion flex flex-col font-sans text-slate-900 relative">
      {/* Background covering full height, blue on left and purple on right fading to white in the middle */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-sky-200/80 via-white/60 to-purple-200/80 z-0 pointer-events-none" />

      {/* Premium Glassmorphic Healthcare Watermarks (Full Page) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* 1. Top Left: Giant Medical Cross */}
        <div className="absolute top-[5%] left-[-2%] w-[400px] h-[400px] opacity-70 rotate-12">
          <div className="absolute top-1/2 left-0 w-full h-[100px] -mt-[50px] bg-gradient-to-tr from-sky-300/20 to-white/40 rounded-[40px] backdrop-blur-3xl border border-white/60 shadow-xl" />
          <div className="absolute left-1/2 top-0 w-[100px] h-full -ml-[50px] bg-gradient-to-tr from-sky-300/20 to-white/40 rounded-[40px] backdrop-blur-3xl border border-white/60 shadow-xl" />
        </div>
        {/* 2. Top Right: Small Pill */}
        <div className="absolute top-[15%] right-[5%] w-[300px] h-[120px] rounded-[100px] bg-gradient-to-br from-purple-300/20 to-white/30 backdrop-blur-3xl border-2 border-white/50 rotate-[45deg] shadow-lg flex items-center justify-center overflow-hidden opacity-70">
          <div className="w-[3px] h-full bg-white/60" />
          <div className="absolute top-2 left-6 w-[100px] h-[20px] bg-white/40 blur-lg rounded-full" />
        </div>
        {/* 3. Center Left: Abstract Floating Cell */}
        <div className="absolute top-[45%] left-[5%] w-[250px] h-[250px] rounded-full bg-gradient-to-tr from-sky-300/20 to-purple-300/20 backdrop-blur-3xl border-2 border-white/50 shadow-xl opacity-70" />
        {/* 4. Center Right: Secondary Medical Cross */}
        <div className="absolute top-[60%] right-[-2%] w-[250px] h-[250px] opacity-70 rotate-[-15deg]">
          <div className="absolute top-1/2 left-0 w-full h-[60px] -mt-[30px] bg-gradient-to-tr from-purple-300/20 to-white/40 rounded-[30px] backdrop-blur-3xl border border-white/60" />
          <div className="absolute left-1/2 top-0 w-[60px] h-full -ml-[30px] bg-gradient-to-tr from-purple-300/20 to-white/40 rounded-[30px] backdrop-blur-3xl border border-white/60" />
        </div>
        {/* 5. Bottom Left: Another Small Pill */}
        <div className="absolute bottom-[15%] left-[8%] w-[250px] h-[100px] rounded-[100px] bg-gradient-to-br from-sky-300/20 to-white/30 backdrop-blur-3xl border-2 border-white/50 rotate-[-60deg] shadow-lg flex items-center justify-center overflow-hidden opacity-70">
          <div className="w-[3px] h-full bg-white/60" />
        </div>
        {/* 6. Bottom Right: Giant Capsule/Pill */}
        <div className="absolute bottom-[-5%] right-[-5%] w-[600px] h-[250px] rounded-[150px] bg-gradient-to-br from-purple-300/20 to-white/30 backdrop-blur-3xl border-2 border-white/50 rotate-[-35deg] shadow-2xl flex items-center justify-center overflow-hidden opacity-70">
          <div className="w-[4px] h-full bg-white/60" />
          <div className="absolute top-4 left-10 w-[200px] h-[40px] bg-white/40 blur-xl rounded-full" />
        </div>
      </div>

      <div className="relative z-10 w-full flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Doctor Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-purple-500 text-white flex items-center justify-center font-bold text-2xl shadow-md border border-white/60">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'D'}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {user?.name || 'Dr. Saubhik Bhaumik'}
              </h1>
              <p className="text-slate-500 text-sm mt-0.5 font-medium flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-sky-500" /> Chief Clinical Officer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Portal Active
            </span>
          </div>
        </div>

        {/* Summary Metrics Cards */}
        {currentPath === '/doctor' && !result && !selectedPatient && (
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white/70 backdrop-blur-3xl border border-white/60 rounded-3xl p-5 shadow-xl space-y-2 medtwin-hover-glow ring-1 ring-black/5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs font-bold uppercase">Pending Reviews</span>
                <Users className="w-4 h-4 text-sky-500" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{pendingQueue.length}</p>
              <p className="text-slate-500 text-xs">Patient cases awaiting sign-off</p>
            </div>

            <div className="bg-white/70 backdrop-blur-3xl border border-white/60 rounded-3xl p-5 shadow-xl space-y-2 medtwin-hover-glow ring-1 ring-black/5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs font-bold uppercase">High-Risk Cases</span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-3xl font-extrabold text-amber-600">
                {pendingQueue.filter(q => q.risk_score > 70).length}
              </p>
              <p className="text-slate-500 text-xs">Require priority clinical review</p>
            </div>

            <div className="bg-white/70 backdrop-blur-3xl border border-white/60 rounded-3xl p-5 shadow-xl space-y-2 medtwin-hover-glow ring-1 ring-black/5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs font-bold uppercase">Total Patients Reviewed</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-3xl font-extrabold text-emerald-600">{approvedQueue.length}</p>
              <p className="text-slate-500 text-xs">Approved this month</p>
            </div>
          </div>
        )}

        {/* Dynamic Route Content */}
        {currentPath === '/doctor/history' ? (
          <div className="bg-white/70 backdrop-blur-3xl border border-white/60 rounded-3xl p-6 shadow-xl space-y-4 medtwin-hover-glow ring-1 ring-black/5">
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-xl mb-4 flex items-center gap-2">
              <span className="font-bold">Demo Note:</span> This section is currently displaying mock directory data for demonstration purposes.
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <h3 className="text-slate-900 font-bold text-lg">Patient Directory & History</h3>
                  <p className="text-slate-500 text-xs mt-0.5">Search and view historical medical records for all patients under your care.</p>
                </div>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search patient name or ID..."
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                    <th className="p-3 font-bold">Patient Name</th>
                    <th className="p-3 font-bold">Patient ID</th>
                    <th className="p-3 font-bold">Last Active</th>
                    <th className="p-3 font-bold">Status</th>
                    <th className="p-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {queue.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-500 font-semibold">
                        No patients found in directory.
                      </td>
                    </tr>
                  ) : (
                    Array.from(new Set(queue.map(q => q.patient_id))).map(uniqueId => {
                      const latestRecord = queue.find(q => q.patient_id === uniqueId);
                      return (
                        <tr key={uniqueId} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{latestRecord.patient_name}</td>
                          <td className="p-3 text-slate-500">{uniqueId}</td>
                          <td className="p-3 text-slate-600">{latestRecord.created_at}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold capitalize ${latestRecord.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'}`}>
                              {latestRecord.status === 'approved' ? 'Stable / Discharged' : 'Active Care'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs shadow-sm transition-all">
                              View Complete Chart
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : currentPath === '/doctor/approvals' ? (
          <div className="bg-white/70 backdrop-blur-3xl border border-white/60 rounded-3xl p-6 shadow-xl space-y-4 medtwin-hover-glow ring-1 ring-black/5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-slate-900 font-bold text-lg">My Approvals</h3>
                <p className="text-slate-500 text-xs mt-0.5">A complete audit log of all AI recommendations you have clinically verified and approved.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-sky-50 text-slate-700 border-b border-slate-200">
                    <th className="p-3 font-bold">Patient</th>
                    <th className="p-3 font-bold">Clinical Summary</th>
                    <th className="p-3 font-bold">Risk Level</th>
                    <th className="p-3 font-bold">Date Approved</th>
                    <th className="p-3 font-bold">Status</th>
                    <th className="p-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingQueue ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-500 font-semibold">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-sky-500" />
                        Fetching approved cases...
                      </td>
                    </tr>
                  ) : approvedQueue.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-500 font-semibold">
                        No approved cases found.
                      </td>
                    </tr>
                  ) : (
                    approvedQueue.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-800 whitespace-nowrap">
                          {item.patient_name} <span className="text-slate-400 font-normal">(ID: {item.patient_id})</span>
                        </td>
                        <td className="p-3 text-slate-600 max-w-xs truncate" title={item.ai_recommendation}>{item.ai_recommendation || 'AI Report Analysis'}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold capitalize ${item.risk_score > 70 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                            {item.risk_score > 70 ? 'High Risk' : 'Routine'}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 font-medium whitespace-nowrap">{item.created_at}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold capitalize bg-emerald-100 text-emerald-800">
                            Approved
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleReviewClick(item)}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs shadow-sm transition-all"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : !result && !selectedPatient ? (
          <div className="space-y-6">

            {/* Upload Area for Doctor */}
            <div className="bg-white/70 backdrop-blur-3xl border border-white/60 rounded-3xl p-6 shadow-xl space-y-4 medtwin-hover-glow ring-1 ring-black/5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-slate-900 font-bold text-sm">Upload Patient Report for Direct Review</h3>
                <p className="text-slate-500 text-xs mt-0.5">Upload a report file to process through the AI agents and review output.</p>
              </div>
              <ReportUpload 
                onResult={setResult} 
                onBlockchainData={(id, bc) => {
                  setReportId(id);
                  setBcData(bc);
                }}
              />
            </div>

            {/* Patient Queue Table */}
            <div className="bg-white/70 backdrop-blur-3xl border border-white/60 rounded-3xl p-6 shadow-xl space-y-4 medtwin-hover-glow ring-1 ring-black/5">
              <h3 className="text-slate-900 font-bold text-base">Patient Review Queue</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-sky-50 text-slate-700 border-b border-slate-200">
                      <th className="p-3 font-bold">Patient</th>
                      <th className="p-3 font-bold">Clinical Summary</th>
                      <th className="p-3 font-bold">Risk Level</th>
                      <th className="p-3 font-bold">Date</th>
                      <th className="p-3 font-bold">Status</th>
                      <th className="p-3 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loadingQueue ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-slate-500 font-semibold">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-sky-500" />
                          Fetching latest cases...
                        </td>
                      </tr>
                    ) : pendingQueue.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-slate-500 font-semibold">
                          No pending cases to review.
                        </td>
                      </tr>
                    ) : (
                      (showAllQueue ? pendingQueue : pendingQueue.slice(0, 3)).map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-800 whitespace-nowrap">
                            {item.patient_name} <span className="text-slate-400 font-normal">(ID: {item.patient_id})</span>
                          </td>
                          <td className="p-3 text-slate-600 max-w-xs truncate" title={item.ai_recommendation}>{item.ai_recommendation || 'AI Report Analysis'}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold capitalize ${item.risk_score > 70 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                              {item.risk_score > 70 ? 'High Risk' : 'Routine'}
                            </span>
                          </td>
                          <td className="p-3 text-slate-600 font-medium whitespace-nowrap">{item.created_at}</td>
                          <td className="p-3 text-amber-600 font-medium capitalize whitespace-nowrap">{item.status.replace(/_/g, ' ')}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleReviewClick(item)}
                              className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-sm transition-all whitespace-nowrap"
                            >
                              Review Case
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {!loadingQueue && pendingQueue.length > 3 && (
                <div className="pt-2 flex justify-center">
                  <button 
                    onClick={() => setShowAllQueue(!showAllQueue)}
                    className="text-sky-600 hover:text-sky-700 font-bold text-xs hover:underline flex items-center gap-1"
                  >
                    {showAllQueue ? 'Show Less' : `View All ${pendingQueue.length} Pending Cases`}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">

            {/* Doctor Review Actions Bar */}
            <div className="bg-white/70 backdrop-blur-3xl border border-white/60 rounded-3xl p-6 shadow-xl space-y-4 medtwin-hover-glow ring-1 ring-black/5">
              <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Clinical Case Review — {selectedPatient?.patient || result?.medical_report?.patient?.name || 'Patient Case'}
                  </h2>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Review existing AI outputs and choose a clinical workflow action.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {!reviewDecision ? (
                    <>
                      <button
                        onClick={() => handleAction('approved')}
                        disabled={actionLoading}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve
                      </button>
                      <button
                        onClick={() => handleAction('more_data')}
                        disabled={actionLoading}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <Flag className="w-4 h-4" /> Request More Data
                      </button>
                      <button
                        onClick={() => handleAction('escalated')}
                        disabled={actionLoading}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <AlertTriangle className="w-4 h-4" /> Escalate
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-bold">
                      <span className="text-slate-700 capitalize">Status: {reviewDecision.replace('_', ' ')}</span>
                      <button onClick={() => setReviewDecision(null)} className="text-sky-600 hover:underline">Change</button>
                    </div>
                  )}

                  <button
                    onClick={() => { setSelectedPatient(null); setResult(null); setReviewDecision(null); }}
                    className="px-3 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Back to Queue
                  </button>
                </div>
              </div>

              {reviewDecision && (
                <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 text-xs text-sky-800 font-medium">
                  ✓ Clinical workflow action Recorded ({reviewDecision.replace('_', ' ')}). Original AI outputs remain untouched.
                </div>
              )}
            </div>

            {/* Display Full Structured AI Results from Agents for Doctor Review */}
            {(result || selectedPatient?.details) ? (
              <div className="space-y-4">
                <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex items-center justify-between text-xs text-sky-900 font-medium">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-sky-600" />
                    <span>Viewing complete 6-Agent AI structured telemetry for <strong>{selectedPatient?.patient_name || result?.medical_report?.patient?.name || 'Patient'}</strong>.</span>
                  </div>
                  <span className="px-2.5 py-1 bg-white border border-sky-200 rounded-lg text-sky-700 font-bold uppercase text-[10px]">
                    Verified Structured Output
                  </span>
                </div>

                <AgentResults result={result || selectedPatient?.details} />
              </div>
            ) : selectedPatient && selectedPatient.ai_recommendation ? (
              <div className="bg-white/70 backdrop-blur-3xl border border-white/60 rounded-3xl p-6 shadow-xl space-y-4 medtwin-hover-glow ring-1 ring-black/5">
                <h3 className="text-slate-900 font-bold text-sm">AI Recommendation Summary</h3>
                <p className="text-slate-700 text-sm whitespace-pre-line leading-relaxed">
                  {selectedPatient.ai_recommendation}
                </p>
                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <div className="text-xs">
                    <span className="text-slate-500 font-bold">Risk Score: </span>
                    <span className="text-slate-900 font-extrabold">{selectedPatient.risk_score} / 100</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-slate-500 font-bold">Confidence: </span>
                    <span className="text-slate-900 font-extrabold">{(selectedPatient.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/70 backdrop-blur-3xl border border-white/60 rounded-3xl p-6 shadow-xl space-y-4 medtwin-hover-glow ring-1 ring-black/5">
                <h3 className="text-slate-900 font-bold text-sm">Patient Case Selection</h3>
                <p className="text-slate-500 text-xs">
                  Select a patient from the queue or upload a new report to inspect structured AI agent results.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Functional Blockchain Integration Component */}
        <div className="bg-white/70 backdrop-blur-3xl border border-white/60 rounded-3xl p-5 flex items-center justify-between flex-wrap gap-4 shadow-xl medtwin-hover-glow ring-1 ring-black/5">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-sky-500" />
            <div className="text-sm">
              <p className="text-slate-900 font-bold">Polygon SHA-256 Audit Log</p>
              <p className="text-slate-500 text-xs">
                Status: {bcData ? 'Verified / Active' : 'No Data'}
                {bcData && ` • Tx: ${bcData.tx_hash.substring(0, 10)}...`}
              </p>
            </div>
          </div>
          <button
            onClick={handleBlockchainVerify}
            disabled={!reportId}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-sm transition-all disabled:opacity-50"
          >
            Verify & Download Original
          </button>
        </div>
      </main>

      <footer className="border-t border-white/50 bg-white/30 backdrop-blur-sm py-4 text-center text-xs text-slate-500 relative z-10">
        MedTwin AI Platform · Doctor Review Portal
      </footer>
      </div>
    </div>
  );
}
