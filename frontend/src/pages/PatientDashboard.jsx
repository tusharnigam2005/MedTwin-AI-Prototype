import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ReportUpload from '../components/ReportUpload';
import AgentResults from '../components/AgentResults';
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
  const [loadingInitial, setLoadingInitial] = useState(true);
  
  const currentPath = location.pathname.replace(/\/$/, '');
  const isDashboard = currentPath === '/patient';

  // Extract numeric patient ID from 'PT-101' format
  const numericPatientId = user?.id ? user.id.replace(/\D/g, '') : '1';

  React.useEffect(() => {
    const fetchLatestPrediction = async () => {
      try {
        setLoadingInitial(true);
        const res = await axios.get(`http://localhost:8000/api/prediction/${numericPatientId}`);
        // If the backend returns a prediction with details, use it
        if (res.data && res.data.details && Object.keys(res.data.details).length > 0) {
          setResult(res.data.details);
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
  const doctorApproved = result ? false : true;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Top Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 font-sans">
              Welcome, <span className="text-sky-500">{user?.name || 'Patient'}</span>
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              Upload your medical documents to view analysis from the 5 AI agents.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-sky-500" />
              Patient Twin Active
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        {isDashboard ? (
          <>
            {/* Top Summary Cards (Section 12 requirement) */}
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
                  {result ? '5 AI agents processed' : 'Upload a report to generate AI analysis'}
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
                  {result ? (doctorApproved ? 'Approved' : 'Pending Sign-Off') : 'Up to Date'}
                </p>
                <p className="text-slate-500 text-xs">
                  {result ? 'Routed to doctor queue' : 'No pending reviews'}
                </p>
              </div>
            </div>

            {/* Upload Medical Report Section */}
            {loadingInitial ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-sky-500 mb-4" />
                <h3 className="text-slate-900 font-bold text-sm">Loading Twin Data...</h3>
              </div>
            ) : !result ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900">
                    Upload Medical Report
                  </h2>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Upload a blood test PDF, prescription, or lab scan to generate your MedTwin AI analysis.
                  </p>
                </div>

                <ReportUpload onResult={setResult} />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      AI Agent Analysis Results
                    </h2>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Consolidated output from the 5 AI agents.
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

                <AgentResults result={result} />
              </div>
            )}

            {/* Clean Blockchain Integration Placeholder (Section 13 requirement) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 text-xs text-slate-500 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-400" />
                <span><strong className="text-slate-700">Verification:</strong> Blockchain Integration — Status: Pending / Next Implementation Phase</span>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold text-[11px]">
                Placeholder
              </span>
            </div>
          </>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 capitalize">
              {currentPath.split('/').pop()} Module
            </h2>
            <p className="text-slate-500 mt-2 max-w-md mx-auto">
              This module is currently connected to the MedTwin AI engine. You will be able to view and manage your {currentPath.split('/').pop()} data here in the next update.
            </p>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        MedTwin AI Platform · Decision-support prototype · Not a substitute for professional medical advice
      </footer>
    </div>
  );
}
