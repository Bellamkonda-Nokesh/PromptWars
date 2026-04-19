'use client';

import { useState } from 'react';
import { MOCK_INCIDENTS, Incident } from '@/lib/data';
import { Shield, AlertTriangle, CheckCircle, Radio, MapPin, Clock, Plus } from 'lucide-react';

type IncidentType = 'medical' | 'security' | 'crowd' | 'technical' | 'weather';

const TYPE_CONFIG: Record<IncidentType, { color: string; bg: string; border: string; icon: string }> = {
  medical: { color: '#f43f5e', bg: 'rgba(244,63,94,0.1)', border: 'rgba(244,63,94,0.3)', icon: '🏥' },
  security: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', icon: '🔒' },
  crowd: { color: '#fb923c', bg: 'rgba(251,146,60,0.1)', border: 'rgba(251,146,60,0.3)', icon: '👥' },
  technical: { color: '#6366f1', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.3)', icon: '⚙️' },
  weather: { color: '#06b6d4', bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.3)', icon: '🌩️' },
};

function IncidentCard({ incident }: { incident: Incident }) {
  const cfg = TYPE_CONFIG[incident.type];
  const age = Math.round((Date.now() - incident.reportedAt.getTime()) / 60000);

  return (
    <div className="p-4 rounded-xl" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
      <div className="flex items-start gap-3">
        <div className="text-xl">{cfg.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold capitalize" style={{ color: cfg.color }}>{incident.type}</span>
              <span className="badge text-xs" style={{
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                color: '#94a3b8', padding: '1px 8px', borderRadius: 20,
              }}>
                Sev {incident.severity}
              </span>
            </div>
            <span className="badge text-xs" style={{
              background: incident.status === 'resolved' ? 'rgba(16,185,129,0.15)' : incident.status === 'active' ? 'rgba(244,63,94,0.15)' : 'rgba(245,158,11,0.15)',
              border: `1px solid ${incident.status === 'resolved' ? 'rgba(16,185,129,0.4)' : incident.status === 'active' ? 'rgba(244,63,94,0.4)' : 'rgba(245,158,11,0.4)'}`,
              color: incident.status === 'resolved' ? '#34d399' : incident.status === 'active' ? '#fda4af' : '#fcd34d',
              padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
            }}>
              {incident.status}
            </span>
          </div>
          <p className="text-sm" style={{ color: '#cbd5e1' }}>{incident.description}</p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-xs" style={{ color: '#64748b' }}>
              <MapPin className="w-3 h-3" />
              {incident.zone}
            </div>
            <div className="flex items-center gap-1 text-xs" style={{ color: '#64748b' }}>
              <Clock className="w-3 h-3" />
              {age < 60 ? `${age}m ago` : `${Math.round(age / 60)}h ago`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const EVACUATION_ROUTES = [
  { zone: 'North Stand', exits: ['Exit N1 (East)', 'Exit N2 (West)'], assembly: 'Car Park A (North)' },
  { zone: 'South Stand', exits: ['Exit S1 (Main)', 'Exit S2 (East)'], assembly: 'Car Park B (South)' },
  { zone: 'East Wing', exits: ['Exit E1 (Lower)', 'Exit E2 (Upper)'], assembly: 'Street D (East)' },
  { zone: 'West Wing', exits: ['Exit W1 (Level 1)', 'Exit W2 (Level 2)'], assembly: 'Car Park C (West)' },
  { zone: 'VIP Lounge', exits: ['Exit VIP-1 (Private)'], assembly: 'VIP Assembly Point' },
];

export default function SafetyNet() {
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [showReport, setShowReport] = useState(false);
  const [reportForm, setReportForm] = useState({ type: 'medical' as IncidentType, zone: '', description: '', severity: '2' });
  const [broadcastSent, setBroadcastSent] = useState(false);

  const activeIncidents = incidents.filter(i => i.status !== 'resolved');
  const resolvedIncidents = incidents.filter(i => i.status === 'resolved');

  const submitReport = () => {
    if (!reportForm.zone || !reportForm.description) return;
    const newIncident: Incident = {
      id: `inc-${Date.now()}`,
      type: reportForm.type,
      severity: parseInt(reportForm.severity) as 1 | 2 | 3 | 4 | 5,
      zone: reportForm.zone,
      description: reportForm.description,
      reportedAt: new Date(),
      status: 'active',
      staffId: 'staff-current',
    };
    setIncidents(prev => [newIncident, ...prev]);
    setShowReport(false);
    setReportForm({ type: 'medical', zone: '', description: '', severity: '2' });
    alert('✅ Incident reported and logged. Relevant staff have been notified.');
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black mb-1" style={{ fontFamily: 'Outfit, sans-serif', color: '#f1f5f9' }}>
            <span style={{ color: '#f43f5e' }}>SafetyNet</span> Command
          </h1>
          <p className="text-sm" style={{ color: '#94a3b8' }}>Emergency coordination, incident reporting, evacuation routing</p>
        </div>
        <div className="flex items-center gap-3">
          {activeIncidents.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)' }}>
              <span className="status-dot status-danger" />
              <span className="text-sm font-semibold" style={{ color: '#fda4af' }}>
                {activeIncidents.length} Active Incident{activeIncidents.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
          <button onClick={() => setShowReport(true)} className="btn-primary" style={{ background: 'linear-gradient(135deg, #f43f5e, #e11d48)' }}>
            <Plus className="w-4 h-4" />
            Report Incident
          </button>
        </div>
      </div>

      {/* Emergency broadcast */}
      <div className="card mb-6" style={{ borderColor: 'rgba(244,63,94,0.25)' }}>
        <div className="flex items-center gap-3 mb-4">
          <Radio className="w-5 h-5" style={{ color: '#f43f5e' }} />
          <h2 className="font-bold" style={{ color: '#f1f5f9' }}>Emergency Broadcast (PA + FCM)</h2>
        </div>
        <div className="flex gap-3">
          <input placeholder="Type emergency message for all attendees..." className="input-field flex-1" />
          <button
            className="btn-primary"
            style={{ background: 'linear-gradient(135deg, #f43f5e, #e11d48)', padding: '12px 18px', flexShrink: 0 }}
            onClick={() => { setBroadcastSent(true); setTimeout(() => setBroadcastSent(false), 3000); }}
          >
            <Radio className="w-4 h-4" />
            Broadcast
          </button>
        </div>
        {broadcastSent && (
          <div className="mt-3 p-3 rounded-xl animate-fade-in" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <span className="text-sm font-semibold" style={{ color: '#34d399' }}>
              ✅ Broadcast sent to 54,200 attendees via PA system and push notifications
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active incidents */}
        <div>
          <h2 className="font-bold mb-4" style={{ color: '#f1f5f9' }}>
            <AlertTriangle className="w-4 h-4 inline mr-2" style={{ color: '#f43f5e' }} />
            Active Incidents ({activeIncidents.length})
          </h2>
          <div className="space-y-3">
            {activeIncidents.length === 0 ? (
              <div className="p-8 text-center rounded-xl" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <CheckCircle className="w-8 h-8 mx-auto mb-2" style={{ color: '#10b981' }} />
                <div className="text-sm font-semibold" style={{ color: '#34d399' }}>All clear — no active incidents</div>
              </div>
            ) : (
              activeIncidents.map(i => <IncidentCard key={i.id} incident={i} />)
            )}
          </div>

          {resolvedIncidents.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-sm mb-3" style={{ color: '#64748b' }}>
                <CheckCircle className="w-3.5 h-3.5 inline mr-1.5" />
                Resolved ({resolvedIncidents.length})
              </h3>
              <div className="space-y-2">
                {resolvedIncidents.map(i => <IncidentCard key={i.id} incident={i} />)}
              </div>
            </div>
          )}
        </div>

        {/* Evacuation routes */}
        <div>
          <h2 className="font-bold mb-4" style={{ color: '#f1f5f9' }}>
            <Shield className="w-4 h-4 inline mr-2" style={{ color: '#6366f1' }} />
            Evacuation Routing
          </h2>
          <div className="space-y-3">
            {EVACUATION_ROUTES.map((route, i) => (
              <div key={i} className="p-4 rounded-xl" style={{ background: '#0d1421', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex items-start justify-between">
                  <div className="text-sm font-bold mb-2" style={{ color: '#f1f5f9' }}>{route.zone}</div>
                  <span className="badge badge-cyan text-xs">Zone {String.fromCharCode(65 + i)}</span>
                </div>
                <div className="space-y-1">
                  {route.exits.map(exit => (
                    <div key={exit} className="flex items-center gap-2 text-xs" style={{ color: '#94a3b8' }}>
                      <div className="w-1 h-1 rounded-full" style={{ background: '#6366f1' }} />
                      {exit}
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-xs" style={{ color: '#64748b' }}>
                  Assembly: <span style={{ color: '#34d399' }}>{route.assembly}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report modal */}
      {showReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)' }}>
          <div className="card p-6 w-full max-w-lg" style={{ borderColor: 'rgba(244,63,94,0.3)' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#f1f5f9' }}>Report Incident</h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest mb-2 block" style={{ color: '#64748b' }}>Incident Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(TYPE_CONFIG) as IncidentType[]).map(t => (
                    <button key={t} onClick={() => setReportForm(f => ({ ...f, type: t }))}
                      className="p-2 rounded-xl text-xs font-semibold capitalize transition-all"
                      style={reportForm.type === t
                        ? { background: TYPE_CONFIG[t].bg, border: `1px solid ${TYPE_CONFIG[t].border}`, color: TYPE_CONFIG[t].color }
                        : { background: '#0d1421', border: '1px solid rgba(255,255,255,0.06)', color: '#64748b' }
                      }>
                      {TYPE_CONFIG[t].icon} {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest mb-2 block" style={{ color: '#64748b' }}>Zone / Location</label>
                <input
                  className="input-field"
                  value={reportForm.zone}
                  onChange={e => setReportForm(f => ({ ...f, zone: e.target.value }))}
                  placeholder="e.g. Section B12, Gate C entrance..."
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest mb-2 block" style={{ color: '#64748b' }}>Severity (1–5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} onClick={() => setReportForm(f => ({ ...f, severity: String(s) }))}
                      className="w-9 h-9 rounded-xl text-sm font-bold transition-all"
                      style={reportForm.severity === String(s)
                        ? { background: s <= 2 ? '#10b981' : s <= 3 ? '#f59e0b' : '#f43f5e', color: 'white' }
                        : { background: '#0d1421', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }
                      }>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest mb-2 block" style={{ color: '#64748b' }}>Description</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={reportForm.description}
                  onChange={e => setReportForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Describe what you observed..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowReport(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button onClick={submitReport} className="btn-primary flex-1 justify-center"
                style={{ background: 'linear-gradient(135deg, #f43f5e, #e11d48)' }}>
                <AlertTriangle className="w-4 h-4" />
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
