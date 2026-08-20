import React from 'react';
import {
  Upload, Sparkles, FileText, Activity, TrendingUp,
  Pill, HeartHandshake, ShieldAlert, ShieldCheck
} from 'lucide-react';

export default function EmptyState({ onUploadClick }) {
  const agents = [
    { icon: FileText, emoji: '🧪', title: 'Medical Report', desc: 'Parses lab values, symptoms & clinical diagnoses' },
    { icon: Activity, emoji: '❤️', title: 'Health Risk', desc: 'Evaluates chronic risk factors & confidence levels' },
    { icon: TrendingUp, emoji: '📈', title: 'Health Forecast', desc: '7-day daily trajectory & potential future risks' },
    { icon: Pill, emoji: '💊', title: 'Medication', desc: 'Scans prescription safety flags & drug interactions' },
    { icon: HeartHandshake, emoji: '🌱', title: 'Lifestyle', desc: 'Actionable diet, exercise & wellness recommendations' },
    { icon: ShieldAlert, emoji: '🚨', title: 'Emergency', desc: 'Automated triage level & clinical alert assessment' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Empty Banner */}
      <div className="bg-gradient-to-b from-white to-sky-50/40 border border-slate-200/80 rounded-2xl p-8 sm:p-10 text-center shadow-xs space-y-6 medtwin-hover-glow transition-all">
        <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-200 text-sky-600 flex items-center justify-center mx-auto shadow-xs">
          <Sparkles className="w-8 h-8 text-sky-500 animate-pulse" />
        </div>

        <div className="max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Start your health journey
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Upload your latest medical report and let MedTwin AI analyze your health across 6 specialized AI agents.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-center">
          <button
            onClick={onUploadClick}
            className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Medical Report</span>
          </button>
        </div>

        {/* Security Note */}
        <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Your medical documents are handled securely.</span>
        </div>
      </div>

      {/* What MedTwin Analyzes Section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">What MedTwin Analyzes</h3>
            <p className="text-slate-500 text-xs mt-0.5">Multi-agent intelligence pipeline running in parallel</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 font-bold text-[10px] border border-sky-100">
            6 AI AGENTS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {agents.map((agent, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200/70 bg-slate-50/50 hover:bg-white hover:border-sky-300 hover:shadow-xs transition-all space-y-1.5 medtwin-hover-glow"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{agent.emoji}</span>
                <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{agent.title}</h4>
              </div>
              <p className="text-slate-500 text-xs leading-normal">{agent.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
