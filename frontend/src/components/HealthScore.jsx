import React, { useState, useEffect } from 'react';
import { Activity, Upload, Sparkles, AlertCircle, CheckCircle, Flame, ArrowUpRight } from 'lucide-react';

export default function HealthScore({ result, onUploadClick }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  const rawScore = result?.health_prediction?.health_score;
  const targetScore = typeof rawScore === 'number' ? Math.round(rawScore) : null;

  useEffect(() => {
    if (targetScore === null) return;

    let current = 0;
    const duration = 1200; // ms
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = targetScore / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetScore) {
        setAnimatedScore(targetScore);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [targetScore]);

  // Extract key influencing factors from real result data
  const getKeyFactors = () => {
    if (!result) return [];

    const factors = [];

    // Check lab results
    const labs = result.medical_report?.lab_results || [];
    labs.forEach((lab) => {
      if (lab.status === 'high' || lab.status === 'low') {
        factors.push({
          name: lab.test_name,
          value: `${lab.value} ${lab.unit || ''}`,
          status: lab.status,
          impact: lab.status === 'high' ? 'High marker' : 'Low marker',
        });
      }
    });

    // Check risk assessments
    const risks = result.health_prediction?.risk_assessments || [];
    risks.forEach((r) => {
      if (factors.length < 3 && r.risk) {
        factors.push({
          name: r.risk,
          value: r.level ? `${r.level} risk` : 'Flagged',
          status: (r.level || '').toLowerCase() === 'high' ? 'high' : 'moderate',
          impact: 'Risk factor',
        });
      }
    });

    // If still less than 3, add routine markers
    if (factors.length === 0 && labs.length > 0) {
      labs.slice(0, 3).forEach((lab) => {
        factors.push({
          name: lab.test_name,
          value: `${lab.value} ${lab.unit || ''}`,
          status: 'normal',
          impact: 'Within range',
        });
      });
    }

    if (factors.length === 0) {
      return [
        { name: 'Blood Glucose', value: 'Normal', status: 'normal', impact: 'Baseline' },
        { name: 'Cholesterol', value: 'Optimal', status: 'normal', impact: 'Baseline' },
        { name: 'Vitamin D', value: 'Sufficient', status: 'normal', impact: 'Baseline' },
      ];
    }

    return factors.slice(0, 3);
  };

  // Determine risk category
  const getCategory = (score) => {
    if (score < 50) return { label: 'High Risk Category', color: 'text-rose-600 bg-rose-50 border-rose-200' };
    if (score < 75) return { label: 'Moderate Risk Category', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Optimal / Low Risk', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  };

  // Empty state if no report uploaded
  if (!result || targetScore === null) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 medtwin-hover-glow transition-all">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500 shrink-0 mx-auto sm:mx-0">
            <Activity className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">Your Health Score will appear here</h3>
            <p className="text-xs text-slate-500 max-w-md">
              Upload your first medical report to generate your personalized health analysis and 6-agent insights.
            </p>
          </div>
        </div>

        {onUploadClick && (
          <button
            onClick={onUploadClick}
            className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 shrink-0"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Medical Report</span>
          </button>
        )}
      </div>
    );
  }

  const category = getCategory(targetScore);
  const keyFactors = getKeyFactors();

  // SVG Circular Gauge calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5 medtwin-hover-glow transition-all">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-500" />
          <h2 className="text-base font-bold text-slate-900">MedTwin Health Score</h2>
        </div>
        <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${category.color}`}>
          {category.label}
        </span>
      </div>

      <div className="grid sm:grid-cols-12 gap-6 items-center">
        {/* Radial Progress Gauge */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center p-2 border-r-0 sm:border-r border-slate-100">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Track */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-slate-100"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Progress Bar */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className={
                  targetScore < 50
                    ? 'text-rose-500'
                    : targetScore < 75
                    ? 'text-amber-500'
                    : 'text-emerald-500'
                }
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {animatedScore}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                / 100
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-2">Personalized Health Index</p>
        </div>

        {/* Key Influencing Factors */}
        <div className="sm:col-span-7 space-y-3">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Key Influencing Factors
          </p>
          <div className="space-y-2">
            {keyFactors.map((factor, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      factor.status === 'high'
                        ? 'bg-rose-500'
                        : factor.status === 'low'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                  <span className="font-semibold text-slate-800">{factor.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-mono text-[11px]">{factor.value}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                      factor.status === 'high'
                        ? 'bg-rose-100 text-rose-700'
                        : factor.status === 'low'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {factor.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
