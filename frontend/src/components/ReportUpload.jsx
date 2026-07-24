import React, { useState, useRef } from 'react';
import { Upload, FileText, Image, X, Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

export default function ReportUpload({ onResult }) {
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
      } catch (e) {}
      
      formData.append('patient_id', patientId);

      setStatusStep('Processing AI analysis...');

      const response = await axios.post('http://localhost:8000/api/reports/upload', formData, {
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
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
          dragging ? 'border-sky-500 bg-sky-50' :
          file ? 'border-sky-300 bg-sky-50/50 cursor-default' :
          'border-slate-300 hover:border-sky-400 bg-white hover:bg-sky-50/30'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => e.target.files[0] && handleSelect(e.target.files[0])}
        />

        {file ? (
          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600">
                {file.type === 'application/pdf' ? <FileText className="w-5 h-5" /> : <Image className="w-5 h-5" />}
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-800 text-sm">{file.name}</p>
                <p className="text-slate-500 text-xs">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>

            {!loading && (
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null); setError(''); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 font-semibold text-xs border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
              >
                <X className="w-3 h-3" />
                <span>Change File</span>
              </button>
            )}
          </div>
        ) : (
          <div className="py-4 space-y-2">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-2">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-slate-800 font-semibold text-sm">
              Drag & Drop Medical Report / Lab Prescription
            </p>
            <p className="text-slate-500 text-xs">
              Supports PDF, JPG, JPEG, PNG (max 25 MB)
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

      {/* Loading Status */}
      {loading && (
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 space-y-2 text-xs text-sky-800">
          <div className="flex items-center gap-2 font-semibold">
            <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
            <span>{statusStep}</span>
          </div>
          <div className="w-full bg-sky-200 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-sky-500 rounded-full w-2/3 animate-pulse" />
          </div>
        </div>
      )}

      {/* Submit Button */}
      {file && !loading && (
        <button
          onClick={processReport}
          className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
        >
          <span>Run MedTwin AI Analysis</span>
        </button>
      )}
    </div>
  );
}
