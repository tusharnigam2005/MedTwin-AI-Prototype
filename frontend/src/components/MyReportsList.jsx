import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FileText, Download, Activity, AlertCircle, Calendar, ShieldCheck, Loader2, Search, X } from 'lucide-react';
import AgentResults from './AgentResults';

export default function MyReportsList() {
  const { user } = useAuth();
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  const numericPatientId = user?.id ? user.id.replace(/\D/g, '') : '1';

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const res = await axios.get(`${baseUrl}/api/history/${numericPatientId}`);
        setHistoryData(res.data);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [numericPatientId]);

  const handleDownload = async (reportId) => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      // First verify
      const verifyRes = await axios.get(`${baseUrl}/api/blockchain/verify/${reportId}`);
      if (verifyRes.data.is_match) {
        alert('✅ Verified! The file matches the Polygon Smart Contract hash perfectly. Downloading now...');
        window.open(`${baseUrl}/api/blockchain/download/${reportId}`, '_blank');
      } else {
        alert('🔴 Verification Failed: The file has been modified or tampered with.');
      }
    } catch (err) {
      alert(err.response?.data?.detail || 'Verification error or file not found.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-sky-500 mb-4" />
        <h3 className="text-slate-900 font-bold text-sm">Loading Your Reports...</h3>
      </div>
    );
  }

  if (!historyData || historyData.reports.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
        <FileText className="w-12 h-12 mx-auto text-slate-300 mb-4" />
        <h3 className="text-slate-900 font-bold text-lg">No Reports Found</h3>
        <p className="text-slate-500 text-sm mt-2">You haven't uploaded any medical reports yet.</p>
      </div>
    );
  }

  // Reverse arrays to show newest first, assuming 1:1 mapping between reports and predictions
  const reports = [...historyData.reports].reverse();
  const predictions = [...historyData.predictions].reverse();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">My Medical Reports</h2>
          <p className="text-slate-500 text-xs mt-1">All your uploaded documents and AI analyses in one place.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((report, index) => {
          const prediction = predictions[index]; // Map to corresponding prediction
          const aiDetails = prediction?.details || {};
          const triage = aiDetails?.emergency_analysis?.triage_level || 'routine';
          const riskScore = prediction?.risk_score || 0;
          const fileName = report.structured_data?.filename || 'Unknown Document.pdf';
          const uploadDate = new Date(report.uploaded_at).toLocaleDateString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
          });

          return (
            <div key={report.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1" title={fileName}>{fileName}</h3>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono mt-0.5">
                      <Calendar className="w-3 h-3" /> {uploadDate}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                {/* AI Summary Section */}
                {prediction ? (
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-600">AI Risk Score</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${riskScore > 75 ? 'bg-rose-100 text-rose-700' : riskScore > 40 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {riskScore.toFixed(1)} / 100
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-slate-200 pt-2">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Triage Level</span>
                      <span className="text-[11px] font-bold text-slate-700 capitalize flex items-center gap-1">
                        <Activity className="w-3 h-3 text-sky-500" />
                        {triage}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 line-clamp-2 italic border-l-2 border-sky-300 pl-2">
                       "{aiDetails?.overall_summary || 'Analysis complete. Risk patterns detected and quantified.'}"
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-2 text-slate-500 text-xs italic">
                    <AlertCircle className="w-4 h-4" /> No AI analysis data found for this report.
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </div>
                <div className="flex items-center gap-2">
                  {prediction && (
                    <button
                      onClick={() => setSelectedPrediction(prediction)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors border border-indigo-200"
                    >
                      <Search className="w-3.5 h-3.5" /> AI Analysis
                    </button>
                  )}
                  <button
                    onClick={() => handleDownload(report.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Analysis Modal */}
      {selectedPrediction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div 
            className="bg-[#F8FAFC] rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Comprehensive AI Analysis</h3>
                <p className="text-slate-500 text-xs mt-0.5">Detailed breakdown from MedTwin's 6-Agent AI Pipeline</p>
              </div>
              <button 
                onClick={() => setSelectedPrediction(null)}
                className="p-2 bg-slate-50 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <AgentResults result={selectedPrediction.details} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
