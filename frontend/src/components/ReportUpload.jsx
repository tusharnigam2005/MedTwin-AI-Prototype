import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Image, X, Loader2, CheckCircle2, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import axios from 'axios';

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

export default function ReportUpload({ onResult, onBlockchainData }) {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [state, setState] = useState('EMPTY'); // 'EMPTY' | 'DRAGGING' | 'SELECTED' | 'ANALYZING' | 'COMPLETE'
  const [analyzingStep, setAnalyzingStep] = useState(0); // 0..5 agents
  const [error, setError] = useState('');
  const inputRef = useRef();

  const agentsList = [
    'Report Analysis',
    'Risk Analysis',
    'Health Forecast',
    'Medication Analysis',
    'Lifestyle Analysis',
    'Emergency Assessment',
  ];

  const validateFile = (f) => {
    if (
      !ACCEPTED_TYPES.includes(f.type) &&
      !f.name.endsWith('.pdf') &&
      !f.name.endsWith('.png') &&
      !f.name.endsWith('.jpg') &&
      !f.name.endsWith('.jpeg')
    ) {
      setError('Please select a supported file format: PDF, JPG, or PNG.');
      return false;
    }
    if (f.size > 25 * 1024 * 1024) {
      setError('File size exceeds 25 MB limit.');
      return false;
    }
    return true;
  };

  const handleSelect = (f) => {
    setError('');
    if (validateFile(f)) {
      setFile(f);
      setState('SELECTED');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleSelect(f);
    else setState(file ? 'SELECTED' : 'EMPTY');
  };

  const processReport = async () => {
    if (!file) return;
    setState('ANALYZING');
    setError('');
    setAnalyzingStep(0);

    // Step animation timer simulation sync'd with async request
    const stepInterval = setInterval(() => {
      setAnalyzingStep((prev) => {
        if (prev < agentsList.length - 1) return prev + 1;
        return prev;
      });
    }, 450);

    try {
      const formData = new FormData();
      formData.append('file', file);

      let patientId = '1';
      try {
        const userStr = localStorage.getItem('medtwin_auth_user');
        if (userStr) {
          const u = JSON.parse(userStr);
          if (u.id && u.id.startsWith('PT-')) {
            patientId = u.id.split('-')[1];
          }
        }
      } catch (e) {}

      formData.append('patient_id', patientId);

      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const response = await axios.post(`${baseUrl}/api/reports/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      clearInterval(stepInterval);
      setAnalyzingStep(agentsList.length);
      setState('COMPLETE');

      const payload = response.data?.prediction?.details || response.data;
      const reportId = response.data?.report_id;
      const bcData = response.data?.blockchain_verification;

      // Small delay before returning result to let user see "COMPLETE" state
      setTimeout(() => {
        if (onResult) onResult(payload);
        if (onBlockchainData && reportId) {
          onBlockchainData(reportId, bcData);
        }
      }, 700);

    } catch (err) {
      clearInterval(stepInterval);
      setState('SELECTED');
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to backend server. Ensure FastAPI is running on http://localhost:8000.');
      } else {
        setError(err.response?.data?.detail || 'Failed to process report. Please verify the file and try again.');
      }
    }
  };

  const handleReset = (e) => {
    e?.stopPropagation();
    setFile(null);
    setError('');
    setState('EMPTY');
  };

  return (
    <div className="space-y-4">
      {/* Upload Dropzone Container */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
          if (state !== 'ANALYZING' && state !== 'COMPLETE') setState('DRAGGING');
        }}
        onDragLeave={() => {
          setDragging(false);
          if (state === 'DRAGGING') setState(file ? 'SELECTED' : 'EMPTY');
        }}
        onDrop={handleDrop}
        onClick={() => state === 'EMPTY' && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${
          state === 'DRAGGING'
            ? 'border-sky-500 bg-sky-50/80 scale-[1.01] shadow-lg shadow-sky-500/10'
            : state === 'SELECTED'
            ? 'border-sky-300 bg-sky-50/40 cursor-default'
            : state === 'ANALYZING' || state === 'COMPLETE'
            ? 'border-sky-200 bg-slate-50 cursor-default'
            : 'border-slate-300 hover:border-sky-400 bg-white hover:bg-sky-50/30 cursor-pointer'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => e.target.files[0] && handleSelect(e.target.files[0])}
        />

        {/* STATE 1: EMPTY */}
        {state === 'EMPTY' && (
          <div className="py-4 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto shadow-sm">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-800 font-bold text-sm">Upload Medical Report</p>
              <p className="text-slate-500 text-xs mt-0.5">Drag & drop or browse files</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] text-slate-400 font-medium">
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600">PDF, JPG, PNG</span>
              <span>•</span>
              <span>Max 25 MB</span>
            </div>
            <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Your medical documents are handled securely.</span>
            </div>
          </div>
        )}

        {/* STATE 2: DRAGGING */}
        {state === 'DRAGGING' && (
          <div className="py-6 space-y-2 animate-bounce">
            <div className="w-14 h-14 rounded-2xl bg-sky-500 text-white flex items-center justify-center mx-auto shadow-md">
              <Upload className="w-7 h-7" />
            </div>
            <p className="text-sky-800 font-extrabold text-base">Drop your report here</p>
            <p className="text-sky-600 text-xs">Release to select document for AI analysis</p>
          </div>
        )}

        {/* STATE 3: FILE SELECTED */}
        {state === 'SELECTED' && file && (
          <div className="p-2 space-y-4">
            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                  {file.type === 'application/pdf' ? <FileText className="w-5 h-5" /> : <Image className="w-5 h-5" />}
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-800 text-sm truncate max-w-xs">{file.name}</p>
                  <p className="text-slate-500 text-xs">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 font-semibold text-xs border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>

            <button
              onClick={processReport}
              className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze Report</span>
            </button>
          </div>
        )}

        {/* STATE 4: ANALYZING */}
        {state === 'ANALYZING' && (
          <div className="py-4 space-y-5">
            <div className="flex items-center justify-center gap-2 text-sky-700 font-bold text-sm">
              <Loader2 className="w-5 h-5 animate-spin text-sky-500" />
              <span>Analyzing your medical report...</span>
            </div>

            {/* 6 AI Agents Progress Step Checklist */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-lg mx-auto text-left">
              {agentsList.map((agentName, idx) => {
                const isDone = idx < analyzingStep;
                const isCurrent = idx === analyzingStep;

                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 transition-all ${
                      isDone
                        ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800 font-semibold'
                        : isCurrent
                        ? 'bg-sky-50 border-sky-300 text-sky-800 font-bold shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-sky-500 animate-spin shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-300 text-[10px] flex items-center justify-center text-slate-400 shrink-0">
                        {idx + 1}
                      </span>
                    )}
                    <span className="truncate">{agentName}</span>
                  </div>
                );
              })}
            </div>

            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden max-w-md mx-auto">
              <div
                className="h-full bg-sky-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(10, ((analyzingStep + 1) / agentsList.length) * 100))}%` }}
              />
            </div>
          </div>
        )}

        {/* STATE 5: COMPLETE */}
        {state === 'COMPLETE' && (
          <div className="py-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <p className="text-emerald-800 font-extrabold text-base">Analysis Complete</p>
            <p className="text-slate-500 text-xs">Redirecting to Health Insights...</p>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-3 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
