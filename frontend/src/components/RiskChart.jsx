import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', riskScore: 88, vitals: 120 },
  { month: 'Feb', riskScore: 85, vitals: 118 },
  { month: 'Mar', riskScore: 84, vitals: 122 },
  { month: 'Apr', riskScore: 82, vitals: 116 },
  { month: 'May', riskScore: 82, vitals: 115 },
];

export default function RiskChart() {
  return (
    <div className="glass-card h-80 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-white text-lg">Health Trajectory Modeling</h3>
          <p className="text-xs text-slate-400">Continuous digital twin score progression over time</p>
        </div>
        <span className="px-3 py-1 rounded-lg bg-teal-500/10 text-teal-400 font-semibold text-xs">
          +6.8% Improvement
        </span>
      </div>

      <div className="flex-1 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00E5AC" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#00E5AC" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#131E3D" vertical={false} />
            <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={12} tickLine={false} domain={[60, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0B1329',
                borderColor: '#1D2D5A',
                borderRadius: '0.75rem',
                color: '#fff',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)'
              }}
            />
            <Area type="monotone" dataKey="riskScore" stroke="#00E5AC" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
