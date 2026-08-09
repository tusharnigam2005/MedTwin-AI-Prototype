import React from 'react';
import Navbar from '../components/Navbar';
import {
  Cpu, FileText, Activity, TrendingUp, Pill, Leaf, ShieldAlert,
  Layers, GitMerge, Database, ShieldCheck, CheckCircle2, ArrowDown
} from 'lucide-react';

const agentsList = [
  {
    num: '01',
    name: 'Medical Report Agent',
    icon: FileText,
    color: 'text-teal-400 bg-teal-500/15 border-teal-500/30',
    desc: 'Parses OCR extracted medical texts, lab values, reference ranges, symptoms, clinical findings, and diagnoses into a normalized schema.',
    inputs: 'PDF/Image OCR payload',
    outputs: 'Structured JSON entities & lab statuses',
  },
  {
    num: '02',
    name: 'Current Health Risk Analysis',
    icon: Activity,
    color: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
    desc: 'Performs multi-source risk assessment on current medical observations, calculating confidence scores and identifying out-of-range indicators.',
    inputs: 'Patient baseline & lab results',
    outputs: 'Observable risk assessments & flags',
  },
  {
    num: '03',
    name: 'Health Forecast Agent',
    icon: TrendingUp,
    color: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
    desc: 'Predicts potential future health risks and computes a 7-day health status trajectory based on current health evidence.',
    inputs: 'Medical data + risk assessments',
    outputs: 'Future risk list & Day 1 to Day 7 forecast',
  },
  {
    num: '04',
    name: 'Medication Agent',
    icon: Pill,
    color: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
    desc: 'Parses dosages, cross-checks drug-drug interactions, flags contraindications, and monitors prescription safety rules.',
    inputs: 'Documented medications & risks',
    outputs: 'Medication reviews & safety flags',
  },
  {
    num: '05',
    name: 'Lifestyle Optimization Agent',
    icon: Leaf,
    color: 'text-green-400 bg-green-500/15 border-green-500/30',
    desc: 'Generates evidence-backed lifestyle guidance across exercise, diet, water intake, sleep, and stress management.',
    inputs: 'Lab values, risks & medications',
    outputs: 'Prioritized lifestyle action list',
  },
  {
    num: '06',
    name: 'Emergency / Triage Agent',
    icon: ShieldAlert,
    color: 'text-red-400 bg-red-500/15 border-red-500/30',
    desc: 'Evaluates red-flag symptoms & vital spikes against deterministic rules to classify triage levels (Routine, Urgent, Emergency).',
    inputs: 'All previous agent outputs & vitals',
    outputs: 'Triage level & immediate emergency actions',
  },
];

const techStack = [
  { name: 'React + Tailwind CSS', category: 'Frontend SPA', desc: 'Glassmorphism UI, Recharts visualization, role-based dashboards.' },
  { name: 'FastAPI (Python)', category: 'Backend REST API', desc: 'Asynchronous API endpoints, document processing, pipeline bridge.' },
  { name: 'LangGraph Orchestrator', category: 'Multi-Agent Framework', desc: 'Stateful graph execution, memory checkpoints, conditional routing.' },
  { name: 'Gemini 3.1 Flash-Lite LLM', category: 'AI Reasoning Layer', desc: 'Constrained JSON schema outputs with 0-temperature inference.' },
  { name: 'PaddleOCR / PyMuPDF', category: 'Document OCR Pipeline', desc: 'Extracts tabular lab data and text from PDFs and scanned images.' },
  { name: 'Polygon Blockchain (EVM)', category: 'Trust & Verification', desc: 'Hashes records to MedTwinTrust.sol smart contract for tamper-proof auditing.' },
];

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-10">

        {/* Hero Header Banner */}
        <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2">
              <Cpu className="w-4 h-4" /> System Architecture & Engineering
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
              MedTwin AI <span className="gradient-text">6-Agent Pipeline</span> Architecture
            </h1>
            <p className="text-slate-300 mt-2 text-sm leading-relaxed">
              Explore how medical reports flow through document OCR, multi-agent reasoning, LangGraph state orchestration, recommendation merging, and Polygon blockchain verification.
            </p>
          </div>
        </div>

        {/* End-to-End Data Flow Pipeline (PDF Page 8) */}
        <div className="glass rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
            <GitMerge className="w-5 h-5 text-medteal-400" />
            End-to-End Data Lifecycle
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs">
            {[
              '1. Patient Upload',
              '2. OCR Pipeline',
              '3. Agent 1: Report',
              '4. Agent 2: Risk',
              '5. Agent 3: Forecast',
              '6. Agent 4: Meds',
              '7. Agent 5: Lifestyle',
              '8. Agent 6: Triage',
            ].map((step, i) => (
              <div key={i} className="glass-card rounded-xl p-3 border border-medteal-500/20">
                <span className="text-medteal-400 font-bold block mb-1 text-[11px]">{step}</span>
                <span className="text-slate-400 text-[10px]">Step {i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Deep Dive into 6 Specialized AI Agents (PDF Page 16-20) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white font-heading">
              The 6 Specialized AI Agents
            </h2>
            <span className="text-xs text-medteal-400 font-bold bg-medteal-500/10 border border-medteal-500/20 px-3 py-1 rounded-full">
              LangGraph State Graph
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {agentsList.map(({ num, name, icon: Icon, color, desc, inputs, outputs }) => (
              <div key={num} className="glass-card rounded-2xl p-6 space-y-4 relative group hover:border-medteal-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-slate-500 font-mono text-xs font-bold">AGENT {num}</span>
                </div>

                <div>
                  <h3 className="text-white font-bold text-base mb-1.5">{name}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 text-[11px] space-y-1">
                  <p className="text-slate-500"><span className="text-slate-300 font-semibold">Inputs:</span> {inputs}</p>
                  <p className="text-slate-500"><span className="text-slate-300 font-semibold">Outputs:</span> {outputs}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medical Knowledge Base & RAG Architecture (PDF Page 24) */}
        <div className="glass rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" />
              Medical Knowledge Base & RAG Grounding
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Why Retrieval-Augmented Generation grounds every LLM answer in curated clinical guidelines (WHO, CDC) to eliminate hallucinated medical claims.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: 'Clinical Guidelines', desc: 'WHO / CDC medical reference snippets' },
              { title: 'Disease Progression', desc: 'Structured profiles & risk factor libraries' },
              { title: 'Drug Interaction Database', desc: 'Prescription dosage & contraindication matrices' },
            ].map(({ title, desc }) => (
              <div key={title} className="glass-card rounded-2xl p-5 border border-cyan-500/20">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 mb-2" />
                <h4 className="text-white font-bold text-xs mb-1">{title}</h4>
                <p className="text-slate-400 text-[11px]">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Full Technology Stack Grid (PDF Page 31) */}
        <div className="glass rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-white font-heading">
            Technology Stack Breakdown
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStack.map(({ name, category, desc }) => (
              <div key={name} className="glass-card rounded-2xl p-4 border border-slate-800">
                <span className="text-medteal-400 text-[10px] font-bold uppercase tracking-wider block mb-1">
                  {category}
                </span>
                <h4 className="text-white font-bold text-sm mb-1">{name}</h4>
                <p className="text-slate-400 text-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        MedTwin AI · 6-Agent LangGraph Architecture · Technical Engineering Deck
      </footer>
    </div>
  );
}
