import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { History, FileText, CheckCircle2, Shield, Calendar, Clock, Loader2, ArrowUpRight } from 'lucide-react';

export default function PatientHistoryTimeline() {
  const { user } = useAuth();
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const numericPatientId = user?.id ? user.id.replace(/\D/g, '') : '1';

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
        const res = await axios.get(`${baseUrl}/api/history/${numericPatientId}`);
        const data = res.data;

        // Build a unified chronological timeline
        let events = [];

        // 1. Report Upload Events
        data.reports.forEach(report => {
          events.push({
            id: `report-${report.id}`,
            date: new Date(report.uploaded_at),
            type: 'upload',
            title: 'Medical Document Uploaded',
            description: `File: ${report.structured_data?.filename || 'Unknown Document.pdf'}`,
            icon: FileText,
            color: 'bg-sky-500',
            bg: 'bg-sky-50',
            textColor: 'text-sky-700'
          });
        });

        // 2. AI Prediction Events
        data.predictions.forEach(pred => {
          events.push({
            id: `pred-${pred.id}`,
            date: new Date(pred.created_at),
            type: 'analysis',
            title: 'MedTwin AI Analysis Complete',
            description: `Calculated Risk Score: ${pred.risk_score.toFixed(1)}/100`,
            icon: ArrowUpRight,
            color: 'bg-indigo-500',
            bg: 'bg-indigo-50',
            textColor: 'text-indigo-700'
          });
        });

        // 3. Blockchain Events
        data.blockchain_verification_trail.forEach(tx => {
          events.push({
            id: `tx-${tx.tx_hash}`,
            date: new Date(tx.verified_at),
            type: 'blockchain',
            title: 'Secured on Polygon Blockchain',
            description: `Tx Hash: ${tx.tx_hash.substring(0, 16)}...`,
            icon: Shield,
            color: 'bg-emerald-500',
            bg: 'bg-emerald-50',
            textColor: 'text-emerald-700'
          });
        });

        // Sort descending (newest first)
        events.sort((a, b) => b.date - a.date);
        setTimelineEvents(events);

      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [numericPatientId]);

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-sky-500 mb-4" />
        <h3 className="text-slate-900 font-bold text-sm">Loading Medical History...</h3>
      </div>
    );
  }

  if (timelineEvents.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
        <History className="w-12 h-12 mx-auto text-slate-300 mb-4" />
        <h3 className="text-slate-900 font-bold text-lg">No History Found</h3>
        <p className="text-slate-500 text-sm mt-2">Your medical activity timeline is currently empty.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="border-b border-slate-100 pb-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <History className="w-5 h-5 text-sky-500" />
          Patient Activity Timeline
        </h2>
        <p className="text-slate-500 text-xs mt-1">
          A chronological audit trail of all uploads, AI analyses, and blockchain verifications.
        </p>
      </div>

      <div className="relative border-l-2 border-slate-100 ml-4 space-y-8 pl-8 py-4">
        {timelineEvents.map((event, index) => {
          const Icon = event.icon;
          const isFirst = index === 0;

          return (
            <div key={event.id} className="relative group">
              {/* Timeline dot */}
              <div className={`absolute -left-[41px] w-5 h-5 rounded-full border-4 border-white ${event.color} shadow-sm z-10 flex items-center justify-center`} />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  {event.title}
                  {isFirst && (
                    <span className="text-[9px] uppercase tracking-wider font-bold bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded">Latest</span>
                  )}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {event.date.toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              <div className={`mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold ${event.bg} ${event.textColor} border border-white/50 shadow-sm`}>
                <Icon className="w-4 h-4" />
                {event.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
