'use client';

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { CROWD_TIMELINE, REVENUE_DATA } from '@/lib/data';
import { TrendingUp, Users, DollarSign, Activity, AlertTriangle, Clock } from 'lucide-react';

const QUEUE_HISTORY = [
  { time: '14:00', stand_a: 8, stand_b: 12, stand_c: 3, vip: 20 },
  { time: '15:00', stand_a: 14, stand_b: 22, stand_c: 5, vip: 28 },
  { time: '16:00', stand_a: 9, stand_b: 18, stand_c: 2, vip: 22 },
  { time: '17:00', stand_a: 4, stand_b: 18, stand_c: 2, vip: 22 },
  { time: '18:00', stand_a: 11, stand_b: 21, stand_c: 4, vip: 25 },
  { time: 'Now', stand_a: 4, stand_b: 18, stand_c: 2, vip: 22 },
  { time: '+15m', stand_a: 7, stand_b: 12, stand_c: 3, vip: 28 },
];

const GATE_THROUGHPUT = [
  { gate: 'Gate A', throughput: 87, capacity: 100 },
  { gate: 'Gate B', throughput: 94, capacity: 100 },
  { gate: 'Gate C', throughput: 62, capacity: 100 },
  { gate: 'Gate D', throughput: 71, capacity: 100 },
  { gate: 'Gate VIP', throughput: 45, capacity: 100 },
];

const PIE_DATA = [
  { name: 'Food', value: 487200, color: '#6366f1' },
  { name: 'Drinks', value: 329800, color: '#06b6d4' },
  { name: 'Merch', value: 156400, color: '#10b981' },
  { name: 'Upgrades', value: 92600, color: '#f59e0b' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong p-3 rounded-xl text-sm" style={{ zIndex: 99 }}>
      <div className="font-bold mb-1" style={{ color: '#f1f5f9' }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' && p.value > 1000 ? p.value.toLocaleString() : p.value}
        </div>
      ))}
    </div>
  );
};

function KpiCard({ label, value, sub, color, icon: Icon, trend }: any) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-xl" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        {trend && (
          <span className="text-xs font-semibold" style={{ color: trend > 0 ? '#10b981' : '#f43f5e' }}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>{value}</div>
      <div className="text-sm font-medium mt-1" style={{ color: '#94a3b8' }}>{label}</div>
      {sub && <div className="text-xs mt-0.5" style={{ color: '#475569' }}>{sub}</div>}
    </div>
  );
}

export default function VenueIQ() {
  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black mb-1" style={{ fontFamily: 'Outfit, sans-serif', color: '#f1f5f9' }}>
            VenueIQ <span className="text-gradient-primary">Dashboard</span>
          </h1>
          <div className="flex items-center gap-2">
            <span className="status-dot status-live" />
            <span className="text-sm" style={{ color: '#94a3b8' }}>
              Champion League Final — Live Analytics · BigQuery powered
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-purple">BigQuery</span>
          <span className="badge badge-cyan">Vertex AI</span>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Total Attendance" value="54,200" sub="79.7% of capacity" color="#6366f1" icon={Users} trend={2.4} />
        <KpiCard label="Revenue (Live)" value="£1.07M" sub="↑ 12.3% vs last match" color="#10b981" icon={DollarSign} trend={12.3} />
        <KpiCard label="Avg Queue Wait" value="8.2m" sub="All concession stands" color="#f59e0b" icon={Clock} trend={-18} />
        <KpiCard label="Active Incidents" value="2" sub="1 medical, 1 technical" color="#f43f5e" icon={AlertTriangle} />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Crowd over time */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold" style={{ color: '#f1f5f9' }}>Attendance Over Time</h2>
            <span className="badge badge-purple">Live</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={CROWD_TIMELINE}>
              <defs>
                <linearGradient id="crowdGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" name="Attendees" stroke="#6366f1" fill="url(#crowdGrad)" strokeWidth={2} dot={{ fill: '#6366f1', r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue breakdown */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold" style={{ color: '#f1f5f9' }}>Revenue Breakdown</h2>
            <span className="badge badge-emerald">+12.3%</span>
          </div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="45%" height={180}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={75}
                  dataKey="value" stroke="none">
                  {PIE_DATA.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => `£${(v / 1000).toFixed(0)}k`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {PIE_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                    <span className="text-sm" style={{ color: '#94a3b8' }}>{item.name}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: '#f1f5f9' }}>
                    £{(item.value / 1000).toFixed(0)}k
                  </span>
                </div>
              ))}
              <div className="pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold" style={{ color: '#64748b' }}>Total</span>
                  <span className="text-sm font-black" style={{ color: '#f1f5f9' }}>
                    £{(PIE_DATA.reduce((s, d) => s + d.value, 0) / 1000).toFixed(0)}k
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Queue prediction */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold" style={{ color: '#f1f5f9' }}>Queue Prediction (BigQuery ML)</h2>
            <span className="badge badge-amber">15-min forecast</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={QUEUE_HISTORY}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} unit="m" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
              <Bar dataKey="stand_a" name="Grill A" fill="#6366f1" radius={[3, 3, 0, 0]} />
              <Bar dataKey="stand_b" name="Brew House B" fill="#f43f5e" radius={[3, 3, 0, 0]} />
              <Bar dataKey="stand_c" name="Snack Zone C" fill="#10b981" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gate throughput */}
        <div className="card">
          <h2 className="font-bold mb-4" style={{ color: '#f1f5f9' }}>Gate Throughput (%)</h2>
          <div className="space-y-4">
            {GATE_THROUGHPUT.map(gate => {
              const color = gate.throughput >= 90 ? '#f43f5e' : gate.throughput >= 70 ? '#f59e0b' : '#10b981';
              return (
                <div key={gate.gate}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm font-medium" style={{ color: '#94a3b8' }}>{gate.gate}</span>
                    <span className="text-sm font-bold" style={{ color }}>{gate.throughput}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${gate.throughput}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 rounded-xl" style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)' }}>
            <p className="text-xs" style={{ color: '#fda4af' }}>
              ⚠️ Gate B is at 94% capacity. Consider diverting traffic to Gate C (62%).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
