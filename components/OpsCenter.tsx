'use client';

import { useState } from 'react';
import { MOCK_INCIDENTS, MOCK_GATES } from '@/lib/data';
import { Users, Activity, AlertTriangle, Zap, Radio, Eye } from 'lucide-react';

export default function OpsCenter() {
  const [broadcast, setBroadcast] = useState('');
  const [sent, setSent] = useState(false);

  const active = MOCK_INCIDENTS.filter(i => i.status !== 'resolved');
  const resolved = MOCK_INCIDENTS.filter(i => i.status === 'resolved');

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black mb-1" style={{ fontFamily: 'Outfit, sans-serif', color: '#f1f5f9' }}>
            Operations <span className="text-gradient-primary">Command Center</span>
          </h1>
          <div className="flex items-center gap-2">
            <span className="status-dot status-live" />
            <span className="text-sm" style={{ color: '#94a3b8' }}>Champions League Final · Staff Dashboard</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-rose">
            <AlertTriangle className="w-3 h-3" />
            {active.length} Active
          </span>
        </div>
      </div>

      {/* Status row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Attendance', value: '54,200', color: '#6366f1', icon: Users },
          { label: 'Active Incidents', value: String(active.length), color: '#f43f5e', icon: AlertTriangle },
          { label: 'Gates Open', value: `${MOCK_GATES.filter(g => g.status !== 'closed').length}/5`, color: '#10b981', icon: Zap },
          { label: 'Avg Gate Wait', value: `${Math.round(MOCK_GATES.reduce((s, g) => s + g.averageWait, 0) / MOCK_GATES.length)}m`, color: '#f59e0b', icon: Activity },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="p-2 rounded-xl mb-3 w-fit" style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}>
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', fontFamily: 'Outfit, sans-serif' }}>{s.value}</div>
            <div className="text-sm" style={{ color: '#94a3b8' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident log */}
        <div className="card">
          <h2 className="font-bold mb-4 flex items-center gap-2" style={{ color: '#f1f5f9' }}>
            <AlertTriangle className="w-4 h-4" style={{ color: '#f43f5e' }} />
            Incident Log
          </h2>
          <div className="space-y-3">
            {MOCK_INCIDENTS.map(inc => (
              <div key={inc.id} className="p-3 rounded-xl flex items-center gap-3"
                style={{ background: '#0d1421', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{
                  background: inc.status === 'active' ? '#f43f5e' : inc.status === 'investigating' ? '#f59e0b' : '#10b981'
                }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold capitalize" style={{ color: '#f1f5f9' }}>{inc.type} — {inc.zone}</div>
                  <div className="text-xs truncate" style={{ color: '#64748b' }}>{inc.description}</div>
                </div>
                <span className="badge text-xs capitalize flex-shrink-0" style={{
                  background: inc.status === 'resolved' ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)',
                  border: `1px solid ${inc.status === 'resolved' ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'}`,
                  color: inc.status === 'resolved' ? '#34d399' : '#fda4af',
                  padding: '2px 8px', borderRadius: 20, fontSize: 10,
                }}>
                  {inc.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Gate status */}
        <div className="card">
          <h2 className="font-bold mb-4 flex items-center gap-2" style={{ color: '#f1f5f9' }}>
            <Zap className="w-4 h-4" style={{ color: '#6366f1' }} />
            Gate Status
          </h2>
          <div className="space-y-3">
            {MOCK_GATES.map(gate => {
              const color = gate.averageWait <= 5 ? '#10b981' : gate.averageWait <= 12 ? '#f59e0b' : '#f43f5e';
              return (
                <div key={gate.id} className="p-3 rounded-xl"
                  style={{ background: '#0d1421', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold" style={{ color: '#f1f5f9' }}>{gate.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold" style={{ color }}>{gate.averageWait}m</span>
                      <span className="text-xs" style={{ color: '#64748b' }}>{gate.queueLength} in queue</span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{
                      width: `${Math.min((gate.averageWait / 25) * 100, 100)}%`,
                      background: color
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PA Broadcast */}
        <div className="card lg:col-span-2">
          <h2 className="font-bold mb-4 flex items-center gap-2" style={{ color: '#f1f5f9' }}>
            <Radio className="w-4 h-4" style={{ color: '#06b6d4' }} />
            PA Broadcast & Push Notifications
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
            {[
              '⚠️ Enhanced security screening at Gate B — please use Gate C',
              '🍺 Happy Hour! 2-for-1 drinks at all East Wing stands until 17:00',
              '🏥 Medical team required at Section B12 — please clear the aisle',
            ].map((template, i) => (
              <button key={i} onClick={() => setBroadcast(template)}
                className="p-3 rounded-xl text-left text-xs transition-all"
                style={{ background: '#0d1421', border: '1px solid rgba(255,255,255,0.06)', color: '#94a3b8' }}>
                {template}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <textarea
              rows={2}
              value={broadcast}
              onChange={e => setBroadcast(e.target.value)}
              className="input-field flex-1"
              placeholder="Type PA message or push notification text..."
            />
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { setSent(true); setTimeout(() => setSent(false), 3000); }}
                className="btn-primary"
                style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', padding: '10px 16px' }}>
                <Radio className="w-4 h-4" />
                PA
              </button>
              <button
                onClick={() => { setSent(true); setTimeout(() => setSent(false), 3000); }}
                className="btn-primary"
                style={{ padding: '10px 16px' }}>
                Push
              </button>
            </div>
          </div>

          {sent && (
            <div className="mt-3 p-3 rounded-xl animate-fade-in" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
              <span className="text-sm font-semibold" style={{ color: '#34d399' }}>
                ✅ Broadcast sent to 54,200 attendees successfully
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
