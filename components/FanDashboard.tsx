'use client';

import { MOCK_VENUE, MOCK_QUEUES, MOCK_GATES, MOCK_USER } from '@/lib/data';
import { Activity, Users, Clock, TrendingUp, AlertTriangle, Zap, MapPin, Star } from 'lucide-react';

function StatCard({ label, value, sub, color, icon: Icon, trend }: {
  label: string; value: string; sub?: string; color: string; icon: any; trend?: number;
}) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-xl" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {trend !== undefined && (
          <span className="text-xs font-semibold" style={{ color: trend >= 0 ? '#10b981' : '#f43f5e' }}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 28, fontWeight: 800, color: '#f1f5f9', lineHeight: 1 }}>{value}</div>
      <div className="text-sm font-semibold mt-1" style={{ color: '#94a3b8' }}>{label}</div>
      {sub && <div className="text-xs mt-1" style={{ color: '#475569' }}>{sub}</div>}
    </div>
  );
}

function GateBar({ gate }: { gate: typeof MOCK_GATES[0] }) {
  const maxWait = 25;
  const pct = Math.min((gate.averageWait / maxWait) * 100, 100);
  const color = gate.averageWait <= 5 ? '#10b981' : gate.averageWait <= 12 ? '#f59e0b' : '#f43f5e';
  return (
    <div className="p-4 rounded-xl mb-2" style={{ background: '#0d1421', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-sm font-semibold" style={{ color: '#f1f5f9' }}>{gate.name}</span>
          {gate.recommendation && (
            <span className="ml-2 text-xs" style={{ color: '#10b981' }}>{gate.recommendation}</span>
          )}
        </div>
        <div className="text-right">
          <span className="text-sm font-bold" style={{ color }}>{gate.averageWait}m wait</span>
          <div className="text-xs" style={{ color: '#475569' }}>{gate.queueLength} in queue</div>
        </div>
      </div>
      <div className="queue-bar-track">
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export default function FanDashboard() {
  const venue = MOCK_VENUE;
  const queues = MOCK_QUEUES;
  const gates = MOCK_GATES;
  const user = MOCK_USER;

  const bestQueue = [...queues].filter(q => q.status !== 'closed').sort((a, b) => a.waitTime - b.waitTime)[0];
  const occupancy = Math.round((venue.currentAttendance / venue.capacity) * 100);

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="status-dot status-live" />
              <span className="text-sm font-semibold" style={{ color: '#10b981' }}>LIVE EVENT</span>
            </div>
            <h1 className="text-3xl font-black mb-1" style={{ fontFamily: 'Outfit, sans-serif', color: '#f1f5f9', letterSpacing: '-1px' }}>
              Welcome back, <span className="text-gradient-primary">Alex</span> 👋
            </h1>
            <p className="text-sm" style={{ color: '#94a3b8' }}>{venue.event}</p>
          </div>

          {/* Ticket card */}
          {user.ticket && (
            <div className="ticket-card" style={{ minWidth: 220 }}>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4" style={{ color: '#6366f1' }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6366f1' }}>My Ticket</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-xs" style={{ color: '#475569' }}>Section</div>
                  <div className="text-sm font-bold" style={{ color: '#f1f5f9' }}>North</div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: '#475569' }}>Row</div>
                  <div className="text-sm font-bold" style={{ color: '#f1f5f9' }}>H</div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: '#475569' }}>Seat</div>
                  <div className="text-sm font-bold" style={{ color: '#f1f5f9' }}>24</div>
                </div>
              </div>
              <div className="mt-3 pt-3 flex items-center gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <MapPin className="w-3 h-3" style={{ color: '#6366f1' }} />
                <span className="text-xs" style={{ color: '#94a3b8' }}>Enter via {user.ticket.gate}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Attendance" value={venue.currentAttendance.toLocaleString()} sub={`${occupancy}% capacity`} color="#6366f1" icon={Users} trend={2.4} />
        <StatCard label="Your Gate Wait" value="8 min" sub="Gate A — try Gate C!" color="#f59e0b" icon={Clock} />
        <StatCard label="Fastest Queue" value={`${bestQueue.waitTime}m`} sub={bestQueue.name} color="#10b981" icon={Activity} />
        <StatCard label="Loyalty Points" value="2,840" sub="Gold Tier · 160 to Platinum" color="#ffd700" icon={Star} trend={12} />
      </div>

      {/* Gate status + Queue overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gates */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold" style={{ color: '#f1f5f9' }}>🚪 Gate Intelligence</h2>
            <span className="badge badge-emerald">SmartGate</span>
          </div>
          {gates.slice(0, 4).map(gate => <GateBar key={gate.id} gate={gate} />)}
        </div>

        {/* Quick queues */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold" style={{ color: '#f1f5f9' }}>🍔 Concession Queues</h2>
            <span className="badge badge-cyan">QueueSense</span>
          </div>
          <div className="space-y-3">
            {queues.map(q => {
              const waitColor = q.waitTime <= 5 ? '#10b981' : q.waitTime <= 12 ? '#f59e0b' : '#f43f5e';
              return (
                <div key={q.id} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: '#0d1421', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className="text-lg">
                    {q.type === 'food' ? '🍔' : q.type === 'drinks' ? '🍺' : q.type === 'snacks' ? '🍿' : '👕'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate" style={{ color: '#f1f5f9' }}>{q.name}</div>
                    <div className="text-xs" style={{ color: '#475569' }}>{q.zone}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold" style={{ color: waitColor }}>{q.waitTime}m</div>
                    <div className="text-xs" style={{ color: '#475569' }}>{q.queueLength} ahead</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Alert banner */}
      <div className="alert-emergency flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 mt-0.5" style={{ color: '#f43f5e', flexShrink: 0 }} />
        <div>
          <span className="text-sm font-bold" style={{ color: '#fda4af' }}>SmartGate Alert — </span>
          <span className="text-sm" style={{ color: '#fda4af' }}>
            Gate B is experiencing high congestion (21-min wait). <strong>Gate C recommended</strong> — only 4 minutes!
          </span>
        </div>
      </div>
    </div>
  );
}
