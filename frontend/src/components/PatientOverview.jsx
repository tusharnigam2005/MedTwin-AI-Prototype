import React from 'react';
import { Activity, TrendingUp, FileText, CheckCircle2, ShieldCheck, AlertCircle, Clock } from 'lucide-react';

export default function PatientOverview({ user, result, recStatus, reportId }) {
  // Determine greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const rawName = user?.name || 'Priyanshi';
  const firstName = rawName.split(' ')[0];
  const formattedName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  const greetingText = `${getGreeting()}, ${formattedName}`;

  const triageLevel = result?.emergency_analysis?.triage_level || 'routine';
  const doctorApproved = recStatus === 'approved';
  const doctorRejected = recStatus === 'rejected';
  const doctorEscalated = recStatus === 'escalated';
  const doctorMoreData = recStatus === 'more_data';

  const riskLevelDisplay = result
    ? triageLevel === 'emergency'
      ? 'High Risk'
      : triageLevel === 'urgent'
      ? 'Moderate Risk'
      : 'Low Risk'
    : 'Low Risk';

  const riskBadgeColor = result
    ? triageLevel === 'emergency'
      ? 'bg-rose-50 text-rose-700 border-rose-200'
      : triageLevel === 'urgent'
      ? 'bg-amber-50 text-amber-800 border-amber-200'
      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
    : 'bg-emerald-50 text-emerald-800 border-emerald-200';

  const doctorReviewText = !result
    ? 'Up to Date'
    : doctorApproved
    ? 'Approved'
    : doctorRejected
    ? 'Flagged'
    : doctorEscalated
    ? 'Escalated'
    : doctorMoreData
    ? 'Data Requested'
    : 'Pending Sign-Off';

  const doctorReviewSub = !result
    ? 'No pending reviews'
    : doctorApproved
    ? 'Verified by your doctor'
    : doctorRejected
    ? 'Doctor flagged issues'
    : doctorEscalated
    ? 'Escalated to specialist'
    : doctorMoreData
    ? 'Doctor requested data'
    : 'Routed to doctor queue';

  const reportText = result
    ? result.medical_report?.patient?.name
      ? `CBC / Lab Scan`
      : 'Medical Report'
    : 'No Report';

  const reportSub = result
    ? result.medical_report?.report_date || 'Processed today'
    : 'Awaiting upload';

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 tracking-tight drop-shadow-sm">
              {greetingText}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200/60 text-sky-700 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
              Patient Portal
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Here's your health overview for today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>ID: {user?.id || 'PT-101'}</span>
          </div>
        </div>
      </div>

      {/* Compact Health Snapshot Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Health Status */}
        <div className="bg-slate-50/70 border border-slate-200/60 rounded-xl p-3.5 space-y-1 medtwin-hover-glow transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Health Status</span>
            <Activity className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-base font-bold text-slate-900">
            {result ? 'Report Analyzed' : 'Baseline Active'}
          </p>
          <p className="text-[11px] text-slate-500 truncate">
            {result ? '6 AI agents synced' : 'Standard baseline'}
          </p>
        </div>

        {/* Current Risk */}
        <div className="bg-slate-50/70 border border-slate-200/60 rounded-xl p-3.5 space-y-1 medtwin-hover-glow transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Risk Level</span>
            <TrendingUp className="w-4 h-4 text-sky-500" />
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${riskBadgeColor}`}>
              {riskLevelDisplay}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 truncate">
            {result ? 'From report markers' : 'Multi-factor baseline'}
          </p>
        </div>

        {/* Latest Report */}
        <div className="bg-slate-50/70 border border-slate-200/60 rounded-xl p-3.5 space-y-1 medtwin-hover-glow transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Reports</span>
            <FileText className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-base font-bold text-slate-900 truncate" title={reportText}>
            {reportText}
          </p>
          <p className="text-[11px] text-slate-500 truncate">
            {reportSub}
          </p>
        </div>

        {/* Doctor Review */}
        <div className="bg-slate-50/70 border border-slate-200/60 rounded-xl p-3.5 space-y-1 medtwin-hover-glow transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Doctor Review</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-base font-bold text-slate-900 truncate">
            {doctorReviewText}
          </p>
          <p className="text-[11px] text-slate-500 truncate">
            {doctorReviewSub}
          </p>
        </div>
      </div>
    </div>
  );
}
