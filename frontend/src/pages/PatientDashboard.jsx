import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PatientOverview from '../components/PatientOverview';
import HealthScore from '../components/HealthScore';
import ReportUpload from '../components/ReportUpload';
import AgentResults from '../components/AgentResults';
import EmptyState from '../components/EmptyState';
import AnimatedSection from '../components/AnimatedSection';
import MyReportsList from '../components/MyReportsList';
import PatientHistoryTimeline from '../components/PatientHistoryTimeline';
import AppointmentsList from '../components/AppointmentsList';
import MessagesList from '../components/MessagesList';
import { useAuth } from '../context/AuthContext';
import { RotateCcw, Shield, Loader2, Sparkles, HeartPulse, Activity } from 'lucide-react';
import axios from 'axios';

export default function PatientDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const [result, setResult] = useState(null);
  const [recStatus, setRecStatus] = useState('none');
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [reportId, setReportId] = useState(null);
  const [bcData, setBcData] = useState(null);

  const uploadSectionRef = useRef(null);

  const currentPath = location.pathname.replace(/\/$/, '');

  let activeAgentTab = 'all';

  if (currentPath === '/patient/reports') {
    activeAgentTab = 'agent1';
  } else if (currentPath === '/patient/health') {
    activeAgentTab = 'agent2';
  } else if (currentPath === '/patient/medications') {
    activeAgentTab = 'agent4';
  } else if (currentPath === '/patient/recommendations') {
    activeAgentTab = 'agent5';
  }

  // Numeric patient ID from user
  const numericPatientId = user?.id ? user.id.replace(/\D/g, '') : '1';

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

  const scrollToUpload = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

        {/* Dynamic Secondary Routes */}
        {currentPath === '/patient/reports' ? (
          <AnimatedSection delay={100}>
            <MyReportsList />
          </AnimatedSection>
        ) : currentPath === '/patient/history' ? (
          <AnimatedSection delay={100}>
            <PatientHistoryTimeline />
          </AnimatedSection>
        ) : currentPath === '/patient/appointments' ? (
          <AnimatedSection delay={100}>
            <AppointmentsList />
          </AnimatedSection>
        ) : currentPath === '/patient/messages' ? (
          <AnimatedSection delay={100}>
            <MessagesList />
          </AnimatedSection>
        ) : currentPath === '/patient/billing' ? (
          <AnimatedSection delay={100}>
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-xl flex items-center gap-2">
                <span className="font-bold">Demo Note:</span> This section is currently displaying mock data for demonstration purposes.
              </div>
              <h3 className="text-slate-900 font-bold text-lg border-b border-slate-100 pb-2">Billing & Claims</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                      <th className="p-3 font-bold">Date</th>
                      <th className="p-3 font-bold">Description</th>
                      <th className="p-3 font-bold">Amount</th>
                      <th className="p-3 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 text-slate-600">Aug 01, 2026</td>
                      <td className="p-3 font-medium text-slate-800">Comprehensive Blood Panel</td>
                      <td className="p-3 text-slate-600">$120.00</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Due</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 text-slate-600">Jul 15, 2026</td>
                      <td className="p-3 font-medium text-slate-800">General Consultation</td>
                      <td className="p-3 text-slate-600">$85.00</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Paid</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </AnimatedSection>
        ) : loadingInitial ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-sm space-y-3">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-sky-500" />
            <h3 className="text-slate-900 font-bold text-sm">Loading Health Dashboard...</h3>
          </div>
        ) : (
          /* MAIN DASHBOARD CONTENT ROUTE */
          <div className="space-y-8">
            {/* 1. SMART HERO / PATIENT OVERVIEW */}
            <AnimatedSection delay={0}>
              <PatientOverview
                user={user}
                result={result}
                recStatus={recStatus}
                reportId={reportId}
              />
            </AnimatedSection>

            {/* 2. INTERACTIVE HEALTH SCORE */}
            <AnimatedSection delay={60}>
              <HealthScore result={result} onUploadClick={scrollToUpload} />
            </AnimatedSection>

            {/* 6. EMPTY STATE vs REPORT ANALYZED RESULTS */}
            {!result && (
              <AnimatedSection delay={120}>
                <EmptyState 
                  onResult={(newRes) => setResult(newRes)}
                  onBlockchainData={(id, bc) => {
                    setReportId(id);
                    setBcData(bc);
                  }}
                />
              </AnimatedSection>
            )}

            {/* 4. INTERACTIVE 6 AI AGENT RESULTS */}
            {result && (
              <AnimatedSection delay={240}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-sky-500" />
                        AI Agent Analysis Results
                      </h2>
                      <p className="text-slate-500 text-xs mt-0.5">
                        Interactive clinical insights generated by MedTwin's 6-agent engine.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setResult(null);
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-sky-50 hover:border-sky-300 text-slate-700 text-xs font-semibold shadow-xs transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4 text-sky-500" />
                      <span>Upload Another Report</span>
                    </button>
                  </div>

                  <AgentResults result={result} initialTab={activeAgentTab} />
                </div>
              </AnimatedSection>
            )}
          </div>
        )}

        {/* Functional Blockchain Verification Footer Banner */}
        <AnimatedSection delay={300}>
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4 shadow-sm medtwin-hover-glow transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <Shield className="w-5 h-5" />
              </div>
              <div className="text-sm">
                <p className="text-slate-900 font-bold">Polygon SHA-256 Audit Log</p>
                <p className="text-slate-500 text-xs">
                  Status: {bcData ? 'Verified / Active' : 'No Active Verification Data'}
                  {bcData && ` • Tx: ${bcData.tx_hash.substring(0, 16)}...`}
                </p>
              </div>
            </div>
            <button
              onClick={handleBlockchainVerify}
              disabled={!reportId}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Verify & Download Original
            </button>
          </div>
        </AnimatedSection>
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        MedTwin AI Platform · Decision-support prototype · Not a substitute for professional medical advice
      </footer>
      </div>
    </div>
  );
}
