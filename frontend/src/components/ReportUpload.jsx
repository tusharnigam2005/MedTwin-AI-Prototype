import React, { useState, useRef } from 'react';
import { Upload, FileText, Image, X, Loader2, CheckCircle2, AlertCircle, Pill } from 'lucide-react';
import axios from 'axios';

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

export default function ReportUpload({ onResult, onBlockchainData }) {
  const [reportFile, setReportFile] = useState(null);
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [activeUpload, setActiveUpload] = useState(null); // 'report' or 'prescription'
  
  const [loading, setLoading] = useState(false);
  const [statusStep, setStatusStep] = useState('');
  const [error, setError] = useState('');
  
  const reportRef = useRef();
  const prescriptionRef = useRef();

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

  const handleSelectReport = (e) => {
    setError('');
    const f = e.target.files[0];
    if (f && validateFile(f)) setReportFile(f);
  };

  const handleSelectPrescription = (e) => {
    setError('');
    const f = e.target.files[0];
    if (f && validateFile(f)) setPrescriptionFile(f);
  };

  const processFile = async (file, type) => {
    if (!file) return;
    setLoading(true);
    setError('');
    setActiveUpload(type);

    try {
      setStatusStep(`Uploading ${type}...`);
      await new Promise(r => setTimeout(r, 600));

      setStatusStep('Extracting medical document text...');
      const formData = new FormData();
      formData.append('files', file);

      let patientId = '1';
      try {
        const userStr = localStorage.getItem('medtwin_auth_user');
        if (userStr) {
          const u = JSON.parse(userStr);
          if (u.id && u.id.startsWith('PT-')) {
            patientId = u.id.split('-')[1];
          }
        }
      } catch (e) { }

      formData.append('patient_id', patientId);

      setStatusStep('Processing AI analysis...');

      const rawToken = localStorage.getItem('medtwin_token') || localStorage.getItem('medtwin_jwt') || localStorage.getItem('token');
      const token = rawToken ? rawToken.replace(/['"]+/g, '') : null;

      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      
      const authHeader = token && token !== 'null' && token !== 'undefined' ? `Bearer ${token}` : null;
      console.log("DEBUG AUTH: token from localStorage is:", token);
      console.log("DEBUG AUTH: Sending Authorization header:", authHeader);

      const response = await axios.post(`${baseUrl}/api/reports/upload`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          ...(authHeader ? { 'Authorization': authHeader } : {})
        },
      });

      setStatusStep('Analysis complete.');
      await new Promise(r => setTimeout(r, 400));

      if (response.data && response.data.prediction && response.data.prediction.details) {
        onResult(response.data.prediction.details);
      } else {
        onResult(response.data);
      }
      if (onBlockchainData && response.data.report_id) {
        onBlockchainData(response.data.report_id, response.data.blockchain_verification);
      }
      setLoading(false);
      setActiveUpload(null);

    } catch (err) {
      setLoading(false);
      setActiveUpload(null);
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to the backend server. Ensure FastAPI is running on http://localhost:8000.');
      } else {
        setError(err.response?.data?.detail || 'Failed to process document. Please verify the file and try again.');
      }
    }
  };

  const FileCard = ({ file, onRemove, title, icon: Icon, colorClass, onProcess }) => (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex flex-col flex-1 bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] relative z-10 animate-scale-in">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-4 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner shrink-0 ${colorClass.bg} ${colorClass.text}`}>
            {file.type === 'application/pdf' ? <FileText className="w-6 h-6" /> : <Image className="w-6 h-6" />}
          </div>
          <div className="text-left overflow-hidden">
            <p className="font-bold text-slate-800 text-sm tracking-tight truncate">{file.name}</p>
            <p className="text-slate-500 text-xs font-medium">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
          </div>
        </div>

        {!loading && (
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); setError(''); }}
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-slate-500 hover:text-red-500 font-bold text-xs bg-slate-50 hover:bg-red-50 transition-colors mt-auto"
          >
            <X className="w-4 h-4" />
            <span>Remove {title}</span>
          </button>
        )}
      </div>
      
      {!loading && (
        <button
          onClick={() => onProcess()}
          className={`w-full py-3.5 rounded-2xl text-white font-bold text-sm transition-all flex items-center justify-center gap-2 animate-scale-in shadow-lg hover:-translate-y-0.5 ${colorClass.btn}`}
        >
          <span>Run {title} Analysis</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <input ref={reportRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleSelectReport} />
      <input ref={prescriptionRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleSelectPrescription} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Medical Report Column */}
        <div className="flex flex-col">
          {reportFile ? (
            <FileCard 
              file={reportFile} 
              onRemove={() => setReportFile(null)} 
              title="Report" 
              icon={FileText} 
              colorClass={{ bg: 'bg-sky-100', text: 'text-sky-600', btn: 'bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 shadow-sky-500/30' }}
              onProcess={() => processFile(reportFile, 'report')}
            />
          ) : (
            <div
              onClick={() => !loading && reportRef.current?.click()}
              className={`h-full min-h-[160px] border-2 border-dashed rounded-2xl p-5 text-center transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col items-center justify-center ${
                'border-slate-300 hover:border-sky-400 bg-white/50 hover:bg-white backdrop-blur-sm shadow-sm hover:shadow-md'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-100 to-indigo-50 text-sky-600 flex items-center justify-center mx-auto mb-3 shadow-sm border border-white">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-slate-900 font-bold text-sm">
                Upload Medical Report
              </p>
              <p className="text-slate-500 text-[11px] font-medium">
                Lab Results, Blood Tests
              </p>
            </div>
          )}
        </div>

        {/* Prescription Column */}
        <div className="flex flex-col">
          {prescriptionFile ? (
            <FileCard 
              file={prescriptionFile} 
              onRemove={() => setPrescriptionFile(null)} 
              title="Prescription" 
              icon={Pill} 
              colorClass={{ bg: 'bg-purple-100', text: 'text-purple-600', btn: 'bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 shadow-purple-500/30' }}
              onProcess={() => processFile(prescriptionFile, 'prescription')}
            />
          ) : (
            <div
              onClick={() => !loading && prescriptionRef.current?.click()}
              className={`h-full min-h-[160px] border-2 border-dashed rounded-2xl p-5 text-center transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col items-center justify-center ${
                'border-slate-300 hover:border-purple-400 bg-white/50 hover:bg-white backdrop-blur-sm shadow-sm hover:shadow-md'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-fuchsia-50 text-purple-600 flex items-center justify-center mx-auto mb-3 shadow-sm border border-white">
                <Pill className="w-6 h-6" />
              </div>
              <p className="text-slate-900 font-bold text-sm">
                Upload Prescription
              </p>
              <p className="text-slate-500 text-[11px] font-medium">
                Doctor's Notes, Meds
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="glass-panel rounded-2xl p-6 text-center space-y-4 animate-scale-in border border-sky-200 relative overflow-hidden mt-4">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-100/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" style={{ animationName: 'shimmer', animationDuration: '2s', animationIterationCount: 'infinite' }} />
          
          <div className="relative inline-flex items-center justify-center w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-sky-100" />
            <div className="absolute inset-0 rounded-full border-4 border-sky-500 border-t-transparent animate-spin" />
            <div className="absolute inset-0 bg-sky-500/20 rounded-full animate-pulse-slow blur-md" />
          </div>
          
          <div>
            <p className="font-extrabold text-slate-900 text-sm">{statusStep}</p>
            <p className="text-xs text-sky-600 font-semibold mt-1 animate-pulse">Running 6-Agent AI Pipeline on {activeUpload}...</p>
          </div>
          
          <style>{`
            @keyframes shimmer {
              100% { transform: translateX(100%); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
