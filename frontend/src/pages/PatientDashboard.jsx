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
import { useAuth } from '../context/AuthContext';
import {
  RotateCcw, Shield, Loader2, Sparkles, FileText, Calendar
} from 'lucide-react';
import axios from 'axios';

export default function PatientDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const [result, setResult] = useState(null);
  const [recStatus, setRecStatus] = useState('none');
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [reportId, setReportId] = useState(null);
  const [bcData, setBcData] = useState(null);

  const uploadSectionRef = useRef(null);

  const currentPath = location.pathname.replace(/\/$/, '');

  let activeAgentTab = 'all';

  // Numeric patient ID from user
  const numericPatientId = user?.id ? user.id.replace(/\D/g, '') : '1';

  useEffect(() => {
    const fetchLatestPrediction = async () => {
      try {
        setLoadingInitial(true);
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const res = await axios.get(`${baseUrl}/api/prediction/${numericPatientId}`);
        if (res.data && res.data.details && Object.keys(res.data.details).length > 0) {
          setResult(res.data.details);
          setRecStatus(res.data.recommendation_status || 'none');
          if (res.data.latest_report_id) setReportId(res.data.latest_report_id);
          if (res.data.blockchain_verification) setBcData(res.data.blockchain_verification);
        }
      } catch (err) {
        console.error('No previous predictions found or error fetching:', err);
      } finally {
        setLoadingInitial(false);
      }
    };
    fetchLatestPrediction();
  }, [numericPatientId]);

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
    if (uploadSectionRef.current) {
      uploadSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen medtwin-scroll-gradient medtwin-motion flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* 1. SMART HERO / PATIENT OVERVIEW */}
        <AnimatedSection delay={0}>
          <PatientOverview
            user={user}
            result={result}
            recStatus={recStatus}
            reportId={reportId}
          />
        </AnimatedSection>

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
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-xl flex items-center gap-2">
                <span className="font-bold">Demo Note:</span> This section is currently displaying mock data for demonstration purposes.
              </div>
              <h3 className="text-slate-900 font-bold text-lg border-b border-slate-100 pb-2">Upcoming Appointments</h3>
              <div className="space-y-3">
                <div className="p-4 border border-slate-200 rounded-xl flex justify-between items-center bg-slate-50 medtwin-hover-glow">
                  <div>
                    <p className="font-bold text-slate-900">Dr. Saubhik Bhaumik</p>
                    <p className="text-xs text-slate-500">Endocrinology Follow-up</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sky-600">Aug 15, 2026</p>
                    <p className="text-xs text-slate-500">10:00 AM</p>
                  </div>
                </div>
                <div className="p-4 border border-slate-200 rounded-xl flex justify-between items-center medtwin-hover-glow">
                  <div>
                    <p className="font-bold text-slate-900">Dr. Anita Patel</p>
                    <p className="text-xs text-slate-500">Annual Wellness Check</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-700">Sep 02, 2026</p>
                    <p className="text-xs text-slate-500">02:30 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        ) : currentPath === '/patient/messages' ? (
          <AnimatedSection delay={100}>
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-xl flex items-center gap-2">
                <span className="font-bold">Demo Note:</span> This section is currently displaying mock data for demonstration purposes.
              </div>
              <h3 className="text-slate-900 font-bold text-lg border-b border-slate-100 pb-2">Secure Inbox</h3>
              <div className="space-y-3">
                <div className="p-4 border border-sky-200 rounded-xl bg-sky-50 cursor-pointer hover:bg-sky-100 transition-colors medtwin-card-clickable">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-sky-900">Dr. Saubhik Bhaumik</p>
                    <span className="text-[10px] bg-sky-200 text-sky-800 px-2 py-0.5 rounded-full font-bold">New</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800">Regarding your recent HbA1c results</p>
                  <p className="text-xs text-slate-500 truncate mt-1">Please make sure to review the AI analysis and start the recommended diet changes...</p>
                </div>
              </div>
            </div>
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
            {/* 2. INTERACTIVE HEALTH SCORE */}
            <AnimatedSection delay={60}>
              <HealthScore result={result} onUploadClick={scrollToUpload} />
            </AnimatedSection>

            {/* 6. EMPTY STATE vs REPORT ANALYZED RESULTS */}
            {!result && (
              <AnimatedSection delay={120}>
                <EmptyState onUploadClick={scrollToUpload} />
              </AnimatedSection>
            )}

            {/* 3. REDESIGNED MEDICAL REPORT UPLOAD EXPERIENCE */}
            <div ref={uploadSectionRef}>
              <AnimatedSection delay={180}>
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        {result ? 'Upload New Medical Report' : 'Upload Medical Report'}
                      </h2>
                      <p className="text-slate-500 text-xs mt-0.5">
                        Upload a blood test PDF, lab prescription, or medical scan to run the 6 AI Agents.
                      </p>
                    </div>
                    {result && (
                      <button
                        onClick={() => setResult(null)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-sky-500" />
                        <span>Clear Current View</span>
                      </button>
                    )}
                  </div>

                  <ReportUpload
                    onResult={(newRes) => {
                      setResult(newRes);
                    }}
                    onBlockchainData={(id, bc) => {
                      setReportId(id);
                      setBcData(bc);
                    }}
                  />
                </div>
              </AnimatedSection>
            </div>

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
                        scrollToUpload();
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
  );
}
