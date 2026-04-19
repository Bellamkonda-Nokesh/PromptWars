'use client';

import { useState, useEffect } from 'react';
import { MOCK_VENUE } from '@/lib/data';

type DensityLevel = 'empty' | 'low' | 'medium' | 'high' | 'critical';

interface Zone {
  id: string;
  name: string;
  gridPos: { col: number; row: number; colSpan?: number; rowSpan?: number };
  density: number;
  capacity: number;
  current: number;
  emoji: string;
}

function getDensityLevel(d: number): DensityLevel {
  if (d < 0.3) return 'empty';
  if (d < 0.5) return 'low';
  if (d < 0.7) return 'medium';
  if (d < 0.85) return 'high';
  return 'critical';
}

const ZONE_CONFIG: Zone[] = [
  { id: 'north', name: 'North Stand', gridPos: { col: 2, row: 1, colSpan: 2 }, density: 0.82, capacity: 15000, current: 12300, emoji: '🏟' },
  { id: 'west', name: 'West Wing', gridPos: { col: 1, row: 2, rowSpan: 2 }, density: 0.55, capacity: 12000, current: 6600, emoji: '🅦' },
  { id: 'pitch', name: 'PITCH', gridPos: { col: 2, row: 2, colSpan: 2, rowSpan: 2 }, density: 0, capacity: 0, current: 0, emoji: '⚽' },
  { id: 'east', name: 'East Wing', gridPos: { col: 4, row: 2, rowSpan: 2 }, density: 0.68, capacity: 12000, current: 8160, emoji: '🅔' },
  { id: 'south', name: 'South Stand', gridPos: { col: 2, row: 4, colSpan: 2 }, density: 0.91, capacity: 15000, current: 13650, emoji: '🏟' },
  { id: 'vip', name: 'VIP Lounge', gridPos: { col: 1, row: 1 }, density: 0.42, capacity: 8000, current: 3360, emoji: '⭐' },
  { id: 'concourse', name: 'Concourse', gridPos: { col: 4, row: 1 }, density: 0.75, capacity: 6000, current: 4500, emoji: '🚶' },
];

const DENSITY_STYLES: Record<DensityLevel, { bg: string; border: string; text: string; label: string }> = {
  empty: { bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.2)', text: '#94a3b8', label: 'Empty' },
  low: { bg: 'rgba(16,185,129,0.2)', border: 'rgba(16,185,129,0.5)', text: '#34d399', label: 'Low' },
  medium: { bg: 'rgba(245,158,11,0.2)', border: 'rgba(245,158,11,0.5)', text: '#fcd34d', label: 'Medium' },
  high: { bg: 'rgba(251,113,133,0.2)', border: 'rgba(251,113,133,0.5)', text: '#fb7185', label: 'High' },
  critical: { bg: 'rgba(244,63,94,0.35)', border: 'rgba(244,63,94,0.7)', text: '#f43f5e', label: 'Critical' },
};

export default function CrowdMap() {
  const [selected, setSelected] = useState<Zone | null>(null);
  const [densities, setDensities] = useState<Record<string, number>>(
    Object.fromEntries(ZONE_CONFIG.map(z => [z.id, z.density]))
  );
  const [tick, setTick] = useState(0);

  // Simulate real-time density changes
  useEffect(() => {
    const interval = setInterval(() => {
      setDensities(prev => {
        const next = { ...prev };
        ZONE_CONFIG.forEach(z => {
          if (z.id === 'pitch') return;
          const delta = (Math.random() - 0.48) * 0.04;
          next[z.id] = Math.max(0.1, Math.min(0.98, (prev[z.id] || z.density) + delta));
        });
        return next;
      });
      setTick(t => t + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black mb-1" style={{ fontFamily: 'Outfit, sans-serif', color: '#f1f5f9' }}>
            CrowdMap <span className="text-gradient-primary">Live</span>
          </h1>
          <div className="flex items-center gap-2">
            <span className="status-dot status-live" />
            <span className="text-sm" style={{ color: '#94a3b8' }}>
              {MOCK_VENUE.name} · {MOCK_VENUE.currentAttendance.toLocaleString()} attendees · Updated {tick}s ago
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 flex-wrap">
          {(['low', 'medium', 'high', 'critical'] as DensityLevel[]).map(level => (
            <div key={level} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ background: DENSITY_STYLES[level].bg, border: `1px solid ${DENSITY_STYLES[level].border}` }} />
              <span className="text-xs capitalize" style={{ color: '#94a3b8' }}>{DENSITY_STYLES[level].label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Grid */}
        <div className="lg:col-span-2 map-container p-6" style={{ minHeight: 420 }}>
          <div className="text-xs font-semibold mb-4 text-center uppercase tracking-widest" style={{ color: '#475569' }}>
            MetroArena Stadium — Live View
          </div>

          {/* Grid layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(4, 1fr)', gap: 8, height: 340 }}>
            {ZONE_CONFIG.map(zone => {
              const d = densities[zone.id] ?? zone.density;
              const level = zone.id === 'pitch' ? 'empty' : getDensityLevel(d);
              const style = DENSITY_STYLES[level];
              const isPitch = zone.id === 'pitch';

              return (
                <div
                  key={zone.id}
                  onClick={() => !isPitch && setSelected(zone)}
                  className="heatmap-cell rounded-xl"
                  style={{
                    gridColumn: `${zone.gridPos.col} / span ${zone.gridPos.colSpan || 1}`,
                    gridRow: `${zone.gridPos.row} / span ${zone.gridPos.rowSpan || 1}`,
                    background: isPitch
                      ? 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #052e16 100%)'
                      : style.bg,
                    border: isPitch
                      ? '2px solid rgba(34,197,94,0.4)'
                      : `1px solid ${style.border}`,
                    cursor: isPitch ? 'default' : 'pointer',
                    flexDirection: 'column',
                    gap: 4,
                    transition: 'all 0.5s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {isPitch ? (
                    <>
                      {/* Pitch markings */}
                      <div style={{
                        position: 'absolute', inset: '10%',
                        border: '1px solid rgba(34,197,94,0.3)', borderRadius: 4
                      }} />
                      <div style={{
                        position: 'absolute', top: '50%', left: 0, right: 0,
                        height: 1, background: 'rgba(34,197,94,0.3)',
                      }} />
                      <div style={{
                        position: 'absolute', top: '30%', bottom: '30%',
                        left: '50%', transform: 'translateX(-50%)',
                        width: '30%', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '50%'
                      }} />
                      <span style={{ color: 'rgba(34,197,94,0.6)', fontSize: 11, fontWeight: 700, position: 'relative', zIndex: 1 }}>⚽ PITCH</span>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: 18 }}>{zone.emoji}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: style.text, textAlign: 'center', lineHeight: 1.2 }}>{zone.name}</span>
                      <span style={{ fontSize: 11, fontWeight: 800, color: style.text }}>{Math.round(d * 100)}%</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Crowd flow arrows (decorative) */}
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="text-xs" style={{ color: '#475569' }}>← Gates A/B</div>
            <div className="text-xs" style={{ color: '#475569' }}>North Entry →</div>
            <div className="text-xs" style={{ color: '#475569' }}>← South Entry</div>
          </div>
        </div>

        {/* Zone detail panel */}
        <div>
          {selected ? (
            <div className="card" style={{ borderColor: 'rgba(99,102,241,0.3)' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold" style={{ color: '#f1f5f9' }}>{selected.name}</h3>
                <button onClick={() => setSelected(null)} className="text-sm" style={{ color: '#6366f1' }}>✕</button>
              </div>

              {(() => {
                const d = densities[selected.id] ?? selected.density;
                const level = getDensityLevel(d);
                const style = DENSITY_STYLES[level];
                return (
                  <>
                    <div className="p-4 rounded-xl mb-4" style={{ background: style.bg, border: `1px solid ${style.border}` }}>
                      <div className="text-3xl font-black" style={{ color: style.text, fontFamily: 'Outfit, sans-serif' }}>
                        {Math.round(d * 100)}%
                      </div>
                      <div className="text-sm font-semibold capitalize" style={{ color: style.text }}>{style.label} Density</div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span style={{ color: '#64748b' }}>Current Occupancy</span>
                        <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{Math.round(d * selected.capacity).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: '#64748b' }}>Section Capacity</span>
                        <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{selected.capacity.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: '#64748b' }}>Available Spaces</span>
                        <span style={{ color: '#10b981', fontWeight: 600 }}>
                          {Math.max(0, selected.capacity - Math.round(d * selected.capacity)).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {level === 'critical' && (
                      <div className="mt-4 p-3 rounded-xl" style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)' }}>
                        <p className="text-xs font-semibold" style={{ color: '#fda4af' }}>
                          ⚠️ Critical density detected. Staff have been alerted. Please use alternate routes.
                        </p>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="space-y-3">
              {ZONE_CONFIG.filter(z => z.id !== 'pitch').map(zone => {
                const d = densities[zone.id] ?? zone.density;
                const level = getDensityLevel(d);
                const style = DENSITY_STYLES[level];
                return (
                  <div key={zone.id}
                    onClick={() => setSelected(zone)}
                    className="p-4 rounded-xl cursor-pointer transition-all hover:translate-y-[-2px]"
                    style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold" style={{ color: '#f1f5f9' }}>{zone.name}</span>
                      <span className="badge text-xs" style={{
                        background: style.bg, border: `1px solid ${style.border}`, color: style.text,
                        padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700
                      }}>
                        {style.label}
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${d * 100}%`, background: style.text }} />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs" style={{ color: '#475569' }}>{Math.round(d * 100)}% full</span>
                      <span className="text-xs" style={{ color: '#475569' }}>{Math.round(d * zone.capacity).toLocaleString()} / {zone.capacity.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
