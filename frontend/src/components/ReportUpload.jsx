import React, { useState, useRef } from 'react';
import { Upload, FileText, Image, X, Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

export default function ReportUpload({ onResult, onBlockchainData }) {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusStep, setStatusStep] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef();

  const validateFile = (f) => {
    if (!ACCEPTED_TYPES.includes(f.type) && !f.name.endsWith('.pdf') && !f.name.endsWith('.png') && !f.name.endsWith('.jpg') && !f.name.endsWith('.jpeg')) {
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
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleSelect(f);
  };

  const processReport = async () => {
    if (!file) return;
    setLoading(true);
    setError('');

    try {
      setStatusStep('Uploading report...');
      await new Promise(r => setTimeout(r, 600));

      setStatusStep('Extracting medical document text...');
      const formData = new FormData();
      formData.append('file', file);

      // The backend expects a patient_id in the form data
      // We can grab it from local storage, or pass a default mock for now if not found
      let patientId = '1';
      try {
        const userStr = localStorage.getItem('medtwin_auth_user');
        if (userStr) {
          const u = JSON.parse(userStr);
          // Assuming ID format like PT-101
          if (u.id && u.id.startsWith('PT-')) {
            patientId = u.id.split('-')[1];
          }
        }
      } catch (e) { }

      formData.append('patient_id', patientId);

      setStatusStep('Processing AI analysis...');

      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const response = await axios.post(`${baseUrl}/api/reports/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setStatusStep('Analysis complete.');
      await new Promise(r => setTimeout(r, 400));

      // The new endpoint returns the result inside 'prediction.details'
      // If we need to support both for a bit, check which format it is:
      if (response.data && response.data.prediction && response.data.prediction.details) {
        onResult(response.data.prediction.details);
      } else {
        onResult(response.data);
      }
      if (onBlockchainData && response.data.report_id) {
        onBlockchainData(response.data.report_id, response.data.blockchain_verification);
      }
      setLoading(false);

    } catch (err) {
      setLoading(false);
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to the backend server. Ensure FastAPI is running on http://localhost:8000.');
      } else {
        setError(err.response?.data?.detail || 'Failed to process report. Please verify the file and try again.');
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !file && !loading && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all duration-300 cursor-pointer relative overflow-hidden ${
          dragging ? 'border-sky-400 bg-sky-50/80 scale-[1.02]' :
            file ? 'border-sky-200 bg-slate-50/50 cursor-default' :
              'border-slate-300 hover:border-sky-400 bg-white/50 hover:bg-white backdrop-blur-sm shadow-sm hover:shadow-md'
          }`}
      >
        {dragging && <div className="absolute inset-0 bg-sky-400/10 animate-pulse-slow" />}
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => e.target.files[0] && handleSelect(e.target.files[0])}
        />

        {file ? (
          <div className="flex items-center justify-between bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] relative z-10 animate-scale-in">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-100 to-indigo-100 flex items-center justify-center text-sky-600 shadow-inner">
                {file.type === 'application/pdf' ? <FileText className="w-6 h-6" /> : <Image className="w-6 h-6" />}
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-800 text-sm tracking-tight">{file.name}</p>
                <p className="text-slate-500 text-xs font-medium">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>

            {!loading && (
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null); setError(''); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-slate-500 hover:text-red-500 font-bold text-xs bg-slate-50 hover:bg-red-50 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Remove</span>
              </button>
            )}
          </div>
        ) : (
          <div className="py-6 space-y-3 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-100 to-indigo-50 text-sky-600 flex items-center justify-center mx-auto mb-4 shadow-sm border border-white">
              <Upload className="w-8 h-8" />
            </div>
            <p className="text-slate-900 font-bold text-base">
              Drag & Drop Medical Report
            </p>
            <p className="text-slate-500 text-xs font-medium">
              Supports PDF, JPG, PNG up to 25 MB
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-xs flex items-center gap-2">
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}

      {/* Premium Loading Spinner */}
      {loading && (
        <div className="glass-panel rounded-2xl p-6 text-center space-y-4 animate-scale-in border border-sky-200 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-100/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" style={{ animationName: 'shimmer', animationDuration: '2s', animationIterationCount: 'infinite' }} />
          
          <div className="relative inline-flex items-center justify-center w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-sky-100" />
            <div className="absolute inset-0 rounded-full border-4 border-sky-500 border-t-transparent animate-spin" />
            <div className="absolute inset-0 bg-sky-500/20 rounded-full animate-pulse-slow blur-md" />
          </div>
          
          <div>
            <p className="font-extrabold text-slate-900 text-sm">{statusStep}</p>
            <p className="text-xs text-sky-600 font-semibold mt-1 animate-pulse">Running 6-Agent AI Pipeline...</p>
          </div>
          
          <style>{`
            @keyframes shimmer {
              100% { transform: translateX(100%); }
            }
          `}</style>
        </div>
      )}

      {/* Submit Button */}
      {file && !loading && (
        <button
          onClick={processReport}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white font-bold text-sm shadow-[0_8px_16px_-6px_rgba(14,165,233,0.5)] hover:shadow-[0_12px_20px_-8px_rgba(14,165,233,0.6)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 animate-scale-in"
        >
          <span>Run MedTwin AI Analysis</span>
        </button>
      )}
    </div>
  );
}
