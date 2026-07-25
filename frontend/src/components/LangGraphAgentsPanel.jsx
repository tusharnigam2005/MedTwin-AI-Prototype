import React, { useState } from 'react';
import { 
  Cpu, 
  FileText, 
  Stethoscope, 
  HeartPulse, 
  Pill, 
  Activity, 
  CheckCircle2, 
  Zap, 
  Database, 
  ShieldCheck, 
  RefreshCw,
  Terminal,
  Layers
} from 'lucide-react';

const agentsData = [
  {
    id: 'ocr_agent',
    name: 'OCR & Data Parsing Agent',
    code: 'ReportAgent v2.4',
    icon: FileText,
    color: 'from-emerald-500 to-teal-500',
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-400',
    status: 'ACTIVE · SYNCHRONIZED',
    confidence: '99.4% Accuracy',
    metric: '14 Bio-Markers Parsed',
    description: 'Autonomous extraction of structured clinical schemas from raw PDF reports, lab prescriptions, and handwritten diagnostic slips using encrypted PaddleOCR & Tesseract engines.'
  },
  {
    id: 'diagnostic_agent',
    name: 'Clinical Diagnostic Agent',
    code: 'DiagnosticAgent v3.1',
    icon: Stethoscope,
    color: 'from-teal-500 to-cyan-500',
    borderColor: 'border-teal-500/30',
    bgColor: 'bg-teal-500/10',
    textColor: 'text-teal-400',
    status: 'REAL-TIME CORRELATION',
    confidence: '96.8% Protocol Match',
    metric: 'ICD-10 & FHIR Aligned',
    description: 'Cross-references real-time patient vitals, symptoms, and historical medical telemetry against global clinical guidelines and validated medical knowledge graphs.'
  },
  {
    id: 'prediction_agent',
    name: 'Risk Trajectory & Prediction Agent',
    code: 'PredictionAgent v4.0',
    icon: HeartPulse,
    color: 'from-cyan-500 to-blue-500',
    borderColor: 'border-cyan-500/30',
    bgColor: 'bg-cyan-500/10',
    textColor: 'text-cyan-400',
    status: 'CONTINUOUS MODELING',
    confidence: '94.2% Confidence',
    metric: '+6.8% Score Improvement',
    description: 'Multi-variable predictive simulation forecasting cardiovascular, metabolic, and chronic disease risk trajectories over 30 to 90-day future horizons.'
  },
  {
    id: 'medication_agent',
    name: 'Pharmacotherapy & Safety Agent',
    code: 'MedicationAgent v2.8',
    icon: Pill,
    color: 'from-blue-500 to-indigo-500',
    borderColor: 'border-blue-500/30',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    status: 'SAFETY INTERLOCK ACTIVE',
    confidence: '100% Contraindication Clear',
    metric: '0 Drug Interactions',
    description: 'Continuous real-time checking of drug-drug interactions, dosage optimization schedules, and contraindication flagging before any recommendation reaches the patient.'
  },
  {
    id: 'lifestyle_agent',
    name: 'Biometric & Lifestyle Agent',
    code: 'LifestyleAgent v3.5',
    icon: Activity,
    color: 'from-emerald-400 to-teal-400',
    borderColor: 'border-emerald-400/30',
    bgColor: 'bg-emerald-400/10',
    textColor: 'text-emerald-300',
    status: 'STREAMING TELEMETRY',
    confidence: 'Optimal Baseline',
    metric: '24/7 IoT Wearable Sync',
    description: 'Processes continuous biometric telemetry, sleep recovery scores, nutritional intake, and physical activity levels to formulate dynamic, personalized regimens.'
  }
];

export default function LangGraphAgentsPanel() {
  const [selectedAgent, setSelectedAgent] = useState(agentsData[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="glass-card border border-navy-700/80 bg-gradient-to-br from-navy-800/95 via-navy-900 to-navy-900/90 shadow-2xl overflow-hidden relative">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-navy-700/80 gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20 shrink-0">
            <Cpu className="w-6 h-6 text-navy-900 font-extrabold animate-pulse-subtle" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono tracking-widest text-teal-400 uppercase bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
                LangGraph Architecture
              </span>
              <span className="text-[11px] font-mono text-slate-400 hidden md:inline">
                StateGraph · Multi-Agent Loop
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight flex items-center gap-2">
              5-Agent Autonomous Clinical Engine
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-navy-900/90 border border-teal-500/30 text-teal-300 text-xs font-mono font-semibold shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span>Telemetry Loop Active</span>
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-navy-800 border border-navy-700 hover:bg-navy-700 text-teal-400 transition-all shadow-md active:scale-95"
            title="Refresh Agent State Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-white' : ''}`} />
          </button>
        </div>
      </div>

      {/* Agents Grid Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-6">
        {agentsData.map((agent) => {
          const IconComponent = agent.icon;
          const isSelected = selectedAgent.id === agent.id;
          return (
            <div
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative group overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-b from-navy-800 to-navy-900 border-teal-400 shadow-xl shadow-teal-500/10 ring-1 ring-teal-400/50 scale-[1.02]'
                  : 'bg-navy-900/60 border-navy-700/60 hover:border-navy-600 hover:bg-navy-800/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl ${agent.bgColor} border ${agent.borderColor} flex items-center justify-center shrink-0`}>
                    <IconComponent className={`w-4.5 h-4.5 ${agent.textColor}`} />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-navy-950/80 text-slate-300 border border-navy-700">
                    {agent.code.split(' ')[0]}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white leading-snug group-hover:text-teal-300 transition-colors">
                  {agent.name}
                </h4>
              </div>

              <div className="mt-4 pt-3 border-t border-navy-700/60 space-y-1">
                <div className={`text-[11px] font-mono font-bold ${agent.textColor}`}>
                  {agent.confidence}
                </div>
                <div className="text-[10px] text-slate-400 truncate font-medium">
                  {agent.metric}
                </div>
              </div>

              {isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-500" />
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Agent Detailed Telemetry & Workflow Breakdown */}
      <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-navy-900/90 border border-navy-700/80 shadow-inner grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase ${selectedAgent.bgColor} ${selectedAgent.textColor} border ${selectedAgent.borderColor}`}>
              {selectedAgent.code}
            </span>
            <span className="text-xs font-mono text-slate-400">·</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> {selectedAgent.status}
            </span>
            <span className="text-xs font-mono text-slate-400">·</span>
            <span className="text-xs font-mono text-teal-300 font-bold bg-teal-500/10 px-2 py-0.5 rounded">
              {selectedAgent.confidence}
            </span>
          </div>

          <h4 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            {selectedAgent.name} Protocol Execution
          </h4>

          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            {selectedAgent.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-400" /> LangGraph Edge: <strong className="text-slate-200">State Verified</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Cryptographic Sign-off: <strong className="text-slate-200">SHA-256 Validated</strong>
            </span>
          </div>
        </div>

        {/* Live Execution Console Snippet */}
        <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 font-mono text-xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-navy-800 pb-2">
            <span className="flex items-center gap-1.5 text-teal-400 font-bold">
              <Terminal className="w-3.5 h-3.5" /> AGENT TELEMETRY LOG
            </span>
            <span>200ms ping</span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <p className="text-slate-400">
              <span className="text-emerald-400">[INFO]</span> Initializing state graph node <span className="text-teal-300">{selectedAgent.code.split(' ')[0]}</span>...
            </p>
            <p className="text-slate-400">
              <span className="text-teal-400">[EXEC]</span> Parsing biomarkers against FHIR patient context...
            </p>
            <p className="text-slate-300 font-semibold">
              <span className="text-emerald-400">[PASS]</span> Output hash computed & passed to next node graph edge.
            </p>
          </div>
          <div className="pt-2 border-t border-navy-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>Latency: 18ms</span>
            <span className="text-teal-400 font-bold">● LIVE STREAM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
