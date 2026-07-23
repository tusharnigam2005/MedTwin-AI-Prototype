import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import ReportUpload from '../components/ReportUpload';
import AgentResults from '../components/AgentResults';
import { useAuth } from '../context/AuthContext';
import {
  Stethoscope, CheckCircle2, AlertTriangle, Flag,
  Users, Activity, FileText, RotateCcw, Shield
} from 'lucide-react';

const mockPatientQueue = [
  {
    id: 'PT-101',
    patient: 'Aarav Sharma',
    age: 45,
    gender: 'M',
    report: 'Synthetic Medical Report (CBC & Lipids)',
    riskLevel: 'urgent',
    confidence: '94%',
    reviewStatus: 'Pending',
    date: '2026-07-23',
  },
  {
    id: 'PT-102',
    patient: 'Alex Johnson',
    age: 52,
    gender: 'M',
    report: 'Comprehensive Blood Panel',
    riskLevel: 'urgent',
    confidence: '88%',
    reviewStatus: 'Pending',
    date: '2026-07-23',
  },
  {
    id: 'PT-103',
    patient: 'Priya Patel',
    age: 38,
    gender: 'F',
    report: 'Routine HbA1c Scan',
    riskLevel: 'routine',
    confidence: '96%',
    reviewStatus: 'Approved',
    date: '2026-07-22',
  },
];

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [result, setResult] = useState(null);
  const [reviewDecision, setReviewDecision] = useState(null); // 'approved' | 'more_data' | 'escalated'

  const handleReviewClick = (patient) => {
    setSelectedPatient(patient);
    setReviewDecision(patient.reviewStatus === 'Approved' ? 'approved' : null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Doctor Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 font-sans">
              Doctor Review Portal — <span className="text-sky-500">{user?.name || 'Dr. Saubhik Bhaumik'}</span>
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              Review AI-generated patient reports, inspect risk assessments, and record clinical decisions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold">
              Licensed Physician Review Queue
            </span>
          </div>
        </div>

        {/* Summary Metrics Cards */}
        {!result && !selectedPatient && (
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs font-bold uppercase">Pending Reviews</span>
                <Users className="w-4 h-4 text-sky-500" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900">2</p>
              <p className="text-slate-500 text-xs">Patient cases awaiting sign-off</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs font-bold uppercase">High-Risk Cases</span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-3xl font-extrabold text-amber-600">2</p>
              <p className="text-slate-500 text-xs">Require priority clinical review</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs font-bold uppercase">Total Patients Reviewed</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-3xl font-extrabold text-emerald-600">14</p>
              <p className="text-slate-500 text-xs">Approved this month</p>
            </div>
          </div>
        )}

        {/* Main Queue Table or Detailed Patient Review View */}
        {!result && !selectedPatient ? (
          <div className="space-y-6">

            {/* Upload Area for Doctor */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-slate-900 font-bold text-sm">Upload Patient Report for Direct Review</h3>
                <p className="text-slate-500 text-xs mt-0.5">Upload a report file to process through the AI agents and review output.</p>
              </div>
              <ReportUpload onResult={setResult} />
            </div>

            {/* Patient Queue Table (Section 19 requirement) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-slate-900 font-bold text-base">Patient Review Queue</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-sky-50 text-slate-700 border-b border-slate-200">
                      <th className="p-3 font-bold">Patient</th>
                      <th className="p-3 font-bold">Report Name</th>
                      <th className="p-3 font-bold">Risk Level</th>
                      <th className="p-3 font-bold">Confidence</th>
                      <th className="p-3 font-bold">Status</th>
                      <th className="p-3 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mockPatientQueue.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-800">
                          {item.patient} <span className="text-slate-400 font-normal">({item.age}{item.gender})</span>
                        </td>
                        <td className="p-3 text-slate-600">{item.report}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold capitalize ${
                            item.riskLevel === 'urgent' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {item.riskLevel}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 font-medium">{item.confidence}</td>
                        <td className="p-3 text-slate-600 font-medium">{item.reviewStatus}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleReviewClick(item)}
                            className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-sm transition-all"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">

            {/* Doctor Review Actions Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
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
                        onClick={() => setReviewDecision('approved')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve
                      </button>
                      <button
                        onClick={() => setReviewDecision('more_data')}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <Flag className="w-4 h-4" /> Request More Data
                      </button>
                      <button
                        onClick={() => setReviewDecision('escalated')}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
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

            {/* Display AI Results if uploaded, otherwise sample message */}
            {result ? (
              <AgentResults result={result} />
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-slate-900 font-bold text-sm">Sample Patient Report Results</h3>
                <p className="text-slate-500 text-xs">
                  Upload a document using the "Upload Patient Report" box above to inspect real-time agent output, or process new reports.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Clean Blockchain Integration Placeholder (Section 13 & 21 requirement) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 text-xs text-slate-500 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-400" />
            <span><strong className="text-slate-700">Audit Verification:</strong> Blockchain Integration — Status: Pending / Next Implementation Phase</span>
          </div>
          <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold text-[11px]">
            Placeholder
          </span>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        MedTwin AI Platform · Doctor Review Portal
      </footer>
    </div>
  );
}
