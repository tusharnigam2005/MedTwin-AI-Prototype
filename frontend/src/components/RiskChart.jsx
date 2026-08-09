import React from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';

const LEVEL_COLOR = {
  high: '#ef4444',
  moderate: '#f59e0b',
  low: '#22c55e',
  unknown: '#64748b',
};

export default function RiskChart({ risks = [], forecast = [] }) {

  // Radar data from risk assessments
  const radarData = risks.slice(0, 6).map((r) => ({
    subject: r.risk?.slice(0, 24) || 'Risk',
    value: r.level === 'high' ? 90 : r.level === 'moderate' ? 55 : 25,
    confidence: Math.round((r.confidence || 0.5) * 100),
  }));

  // Bar data from 7-day forecast
  const barData = forecast.map((d) => ({
    name: `D${d.day}`,
    risk: d.risk_level === 'high' ? 85 : d.risk_level === 'moderate' ? 55 : d.risk_level === 'uncertain' ? 40 : 20,
    level: d.risk_level,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="glass rounded-lg px-3 py-2 text-xs text-slate-300">
        <p className="font-semibold">{label}</p>
        <p className="text-teal-400">Risk: {payload[0]?.value}</p>
      </div>
    );
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">

      {/* Radar chart */}
      {radarData.length > 0 && (
        <div className="glass-light rounded-2xl p-5">
          <h4 className="text-sm font-semibold text-slate-300 mb-4">Risk Radar</h4>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickLine={false}
              />
              <Radar
                name="Risk"
                dataKey="value"
                stroke="#14b8a6"
                fill="#14b8a6"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 7-day bar chart */}
      {barData.length > 0 && (
        <div className="glass-light rounded-2xl p-5">
          <h4 className="text-sm font-semibold text-slate-300 mb-4">7-Day Risk Trend</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barSize={24}>
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="risk" radius={[6, 6, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={LEVEL_COLOR[entry.level] || '#64748b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            {Object.entries(LEVEL_COLOR).map(([level, color]) => (
              <div key={level} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
                <span className="text-slate-500 text-xs capitalize">{level}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
