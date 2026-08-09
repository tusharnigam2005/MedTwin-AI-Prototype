import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ReportUpload from '../components/ReportUpload';
import AgentResults from '../components/AgentResults';
import MyReportsList from '../components/MyReportsList';
import PatientHistoryTimeline from '../components/PatientHistoryTimeline';
import { useAuth } from '../context/AuthContext';
import {
  HeartPulse, Upload, RotateCcw, Activity, TrendingUp,
  FileText, Shield, CheckCircle2, Clock, Loader2
} from 'lucide-react';
import axios from 'axios';

export default function PatientDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const [result, setResult] = useState(null);
  const [recStatus, setRecStatus] = useState("none");
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [reportId, setReportId] = useState(null);
  const [bcData, setBcData] = useState(null);

  const currentPath = location.pathname.replace(/\/$/, '');

  let activeAgentTab = 'all';
  let pageTitle = 'Dashboard Overview';
  let pageSub = 'Upload medical documents to view analysis from the 6 AI agents.';

  if (currentPath === '/patient/reports') {
    activeAgentTab = 'all';
    pageTitle = 'My Medical Reports';
    pageSub = 'Access your processed reports and health summaries.';
  } else if (currentPath === '/patient/appointments') {
    activeAgentTab = 'all';
    pageTitle = 'Appointments';
    pageSub = 'Manage your upcoming and past doctor visits.';
  } else if (currentPath === '/patient/messages') {
    activeAgentTab = 'all';
    pageTitle = 'Secure Messages';
    pageSub = 'Communicate securely with your healthcare team.';
  } else if (currentPath === '/patient/billing') {
    activeAgentTab = 'all';
    pageTitle = 'Billing & Insurance';
    pageSub = 'View statements, pay bills, and manage insurance information.';
  } else if (currentPath === '/patient/history') {
    activeAgentTab = 'all';
    pageTitle = 'Patient Medical Timeline & History';
    pageSub = 'Chronological history of processed reports, doctor sign-offs, and blockchain verification.';
  }

  // Extract numeric patient ID from 'PT-101' format
  const numericPatientId = user?.id ? user.id.replace(/\D/g, '') : '1';

  React.useEffect(() => {
    const fetchLatestPrediction = async () => {
      try {
        setLoadingInitial(true);
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const res = await axios.get(`${baseUrl}/api/prediction/${numericPatientId}`);
        // If the backend returns a prediction with details, use it
        if (res.data && res.data.details && Object.keys(res.data.details).length > 0) {
          setResult(res.data.details);
          setRecStatus(res.data.recommendation_status || "none");
          if (res.data.latest_report_id) setReportId(res.data.latest_report_id);
          if (res.data.blockchain_verification) setBcData(res.data.blockchain_verification);
        }
      } catch (err) {
        console.error("No previous predictions found or error fetching:", err);
      } finally {
        setLoadingInitial(false);
      }
    };
    fetchLatestPrediction();
  }, [numericPatientId]);

  const triageLevel = result?.emergency_analysis?.triage_level || 'routine';
  const doctorApproved = recStatus === "approved";
  const doctorRejected = recStatus === "rejected";
  const doctorEscalated = recStatus === "escalated";
  const doctorMoreData = recStatus === "more_data";

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

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Top Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 font-sans">
              {pageTitle}
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              {pageSub}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-sky-500" />
              Patient: {user?.name || 'Aarav Sharma'}
            </span>
          </div>
        </div>

        {/* Top Summary Cards (Only show on main dashboard) */}
        {currentPath === '/patient' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Health Analysis Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-xs font-bold uppercase">Health Analysis</span>
              <Activity className="w-4 h-4 text-sky-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {result ? 'Report Analyzed' : 'Baseline Active'}
            </p>
            <p className="text-slate-500 text-xs">
              {result ? '6 AI agents processed' : 'Upload a report to generate AI analysis'}
            </p>
          </div>

          {/* Current Risk Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-xs font-bold uppercase">Current Risk</span>
              <TrendingUp className="w-4 h-4 text-sky-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 capitalize">
              {result ? triageLevel : 'Low Risk'}
            </p>
            <p className="text-slate-500 text-xs">
              {result ? 'From latest report data' : 'Multi-factor baseline'}
            </p>
          </div>

          {/* Latest Report Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-xs font-bold uppercase">Latest Report</span>
              <FileText className="w-4 h-4 text-sky-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {result ? 'CBC / Blood Test' : 'No Report'}
            </p>
            <p className="text-slate-500 text-xs">
              {result ? result.medical_report?.report_date || 'Processed today' : 'Awaiting document upload'}
            </p>
          </div>

          {/* Doctor Review Status Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-xs font-bold uppercase">Doctor Review Status</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {!result ? 'Up to Date' : (
                doctorApproved ? 'Approved' :
                  doctorRejected ? 'Rejected' :
                    doctorEscalated ? 'Escalated' :
                      doctorMoreData ? 'Data Requested' :
                        'Pending Sign-Off'
              )}
            </p>
            <p className="text-slate-500 text-xs">
              {!result ? 'No pending reviews' : (
                doctorApproved ? 'Verified by your doctor' :
                  doctorRejected ? 'Doctor flagged issues' :
                    doctorEscalated ? 'Doctor escalated case' :
                      doctorMoreData ? 'Doctor requested data' :
                        'Routed to doctor queue'
              )}
            </p>
          </div>
        </div>
        )}

        {/* Dynamic Route Content */}
        {currentPath === '/patient/reports' ? (
          <MyReportsList />
        ) : currentPath === '/patient/history' ? (
          <PatientHistoryTimeline />
        ) : ['/patient/appointments', '/patient/messages', '/patient/billing'].includes(currentPath) ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-sky-50 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-sky-500" />
            </div>
            <h3 className="text-slate-900 font-bold text-xl mb-2">Feature Coming Soon</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              This module is part of our upcoming roadmap for the complete MedTwin portal experience. Check back soon!
            </p>
          </div>
        ) : loadingInitial ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-sky-500 mb-4" />
            <h3 className="text-slate-900 font-bold text-sm">Loading Twin Telemetry...</h3>
          </div>
        ) : !result ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Upload Medical Report
              </h2>
              <p className="text-slate-500 text-xs mt-0.5">
                Upload a blood test PDF, prescription, or lab scan to run the 6 AI Agents.
              </p>
            </div>

            <ReportUpload 
              onResult={setResult} 
              onBlockchainData={(id, bc) => {
                setReportId(id);
                setBcData(bc);
              }}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  AI Agent Analysis Results
                </h2>
                <p className="text-slate-500 text-xs mt-0.5">
                  Showing structured output focused on target Agent module.
                </p>
              </div>

              <button
                onClick={() => setResult(null)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all"
              >
                <RotateCcw className="w-4 h-4 text-sky-500" />
                <span>Upload Another Report</span>
              </button>
            </div>

            <AgentResults result={result} initialTab={activeAgentTab} />
          </div>
        )}

        {/* Functional Blockchain Integration Component */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4 shadow-sm">
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

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        MedTwin AI Platform · Decision-support prototype · Not a substitute for professional medical advice
      </footer>
    </div>
  );
}
