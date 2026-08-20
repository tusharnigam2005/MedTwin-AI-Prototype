import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ReportUpload from '../components/ReportUpload';
import AgentResults from '../components/AgentResults';
import MyReportsList from '../components/MyReportsList';
import PatientHistoryTimeline from '../components/PatientHistoryTimeline';
import AppointmentsList from '../components/AppointmentsList';
import MessagesList from '../components/MessagesList';
import { useAuth } from '../context/AuthContext';
import {
  Activity, TrendingUp, FileText, CheckCircle2, HeartPulse, Droplet, Heart, Brain, Microscope, ScanFace
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

  const numericPatientId = user?.id ? user.id.replace(/\D/g, '') : '1';

  useEffect(() => {
    const fetchLatestPrediction = async () => {
      try {
        setLoadingInitial(true);
        const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
        const res = await axios.get(`${baseUrl}/api/prediction/${numericPatientId}`);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-100/50 flex flex-col font-sans relative overflow-hidden">
      {/* Decorative Background Elements for Glassmorphism */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Top Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
              {pageTitle}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
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

        {currentPath === '/patient/reports' ? (
          <MyReportsList />
        ) : currentPath === '/patient/history' ? (
          <PatientHistoryTimeline />
        ) : currentPath === '/patient/appointments' ? (
          <AppointmentsList />
        ) : currentPath === '/patient/messages' ? (
          <MessagesList />
        ) : currentPath === '/patient/billing' ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-xl mb-4 flex items-center gap-2">
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
                    <td className="p-3 font-bold text-slate-800">Complete Blood Count (CBC)</td>
                    <td className="p-3 text-slate-900 font-medium">$45.00</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Paid</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Top Summary Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-panel rounded-2xl p-5 space-y-2 animate-fade-in delay-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Health Analysis</span>
                  <Activity className="w-4 h-4 text-sky-500" />
                </div>
                <p className="text-2xl font-bold text-slate-900 leading-tight">
                  {result ? 'Report Analyzed' : 'Baseline Active'}
                </p>
                <p className="text-slate-500 text-xs">
                  {result ? '6 AI agents processed' : 'Upload a report to generate AI analysis'}
                </p>
              </div>
              
              <div className="glass-panel rounded-2xl p-5 space-y-2 animate-fade-in delay-200">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Current Risk</span>
                  <TrendingUp className="w-4 h-4 text-sky-500" />
                </div>
                <p className="text-2xl font-bold text-slate-900 leading-tight capitalize">
                  {result ? triageLevel : 'Low Risk'}
                </p>
                <p className="text-slate-500 text-xs">
                  {result ? 'From latest report data' : 'Multi-factor baseline'}
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-5 space-y-2 animate-fade-in delay-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Latest Report</span>
                  <FileText className="w-4 h-4 text-sky-500" />
                </div>
                <p className="text-2xl font-bold text-slate-900 leading-tight">
                  {result ? 'CBC / Blood Test' : 'No Report'}
                </p>
                <p className="text-slate-500 text-xs">
                  {result ? result?.medical_report?.report_date || 'Processed today' : 'Awaiting document upload'}
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-5 space-y-2 animate-fade-in delay-400">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Doctor Review Status</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-2xl font-bold text-slate-900 leading-tight">
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

            {/* Upload Area for Patient */}
            <div className="glass-panel rounded-2xl p-6 space-y-4 animate-fade-in delay-500">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-slate-900 font-bold text-base">Upload Medical Report</h3>
                  <p className="text-slate-500 text-xs mt-0.5">Upload a blood test PDF, prescription, or lab scan to run the 6 AI Agents.</p>
                </div>
              </div>
              <ReportUpload 
                onResult={setResult} 
                onBlockchainData={(id, bc) => {
                  setReportId(id);
                  setBcData(bc);
                }}
              />
            </div>

            {/* AI Results */}
            {result && (
              <div className="mt-8 animate-fade-in delay-200">
                 <AgentResults result={result} />
              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
}
