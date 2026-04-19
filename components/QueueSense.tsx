'use client';

import { useState, useEffect } from 'react';
import { MOCK_QUEUES, ConcessionStand } from '@/lib/data';
import { TrendingDown, TrendingUp, Clock, ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react';

function WaitBar({ waitTime, maxWait = 25 }: { waitTime: number; maxWait?: number }) {
  const pct = Math.min((waitTime / maxWait) * 100, 100);
  const color = waitTime <= 5 ? '#10b981' : waitTime <= 12 ? '#f59e0b' : '#f43f5e';
  return (
    <div className="queue-bar-track">
      <div className="progress-fill transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function StandCard({ stand, onOrder }: { stand: ConcessionStand; onOrder: (stand: ConcessionStand) => void }) {
  const [expanded, setExpanded] = useState(false);
  const color = stand.waitTime <= 5 ? '#10b981' : stand.waitTime <= 12 ? '#f59e0b' : '#f43f5e';
  const trend = stand.predictedWait15m > stand.waitTime;
  const typeEmoji = stand.type === 'food' ? '🍔' : stand.type === 'drinks' ? '🍺' : stand.type === 'snacks' ? '🍿' : '👕';

  return (
    <div className="card cursor-pointer" onClick={() => setExpanded(e => !e)} style={{ transition: 'all 0.2s ease' }}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: '#0d1421', border: '1px solid rgba(255,255,255,0.06)' }}>
          {typeEmoji}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <div className="text-sm font-bold" style={{ color: '#f1f5f9' }}>{stand.name}</div>
              <div className="text-xs" style={{ color: '#475569' }}>{stand.zone}</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xl font-black" style={{ color, fontFamily: 'Outfit, sans-serif' }}>{stand.waitTime}m</div>
              <div className="text-xs" style={{ color: '#475569' }}>{stand.queueLength} in queue</div>
            </div>
          </div>

          <WaitBar waitTime={stand.waitTime} />

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1.5">
              {trend ? (
                <><TrendingUp className="w-3 h-3" style={{ color: '#f43f5e' }} /><span className="text-xs" style={{ color: '#94a3b8' }}>→ {stand.predictedWait15m}m in 15min</span></>
              ) : (
                <><TrendingDown className="w-3 h-3" style={{ color: '#10b981' }} /><span className="text-xs" style={{ color: '#94a3b8' }}>→ {stand.predictedWait15m}m in 15min</span></>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="badge" style={{
                background: stand.status === 'open' ? 'rgba(16,185,129,0.12)' : stand.status === 'busy' ? 'rgba(245,158,11,0.12)' : 'rgba(244,63,94,0.12)',
                border: `1px solid ${stand.status === 'open' ? 'rgba(16,185,129,0.3)' : stand.status === 'busy' ? 'rgba(245,158,11,0.3)' : 'rgba(244,63,94,0.3)'}`,
                color: stand.status === 'open' ? '#34d399' : stand.status === 'busy' ? '#fcd34d' : '#fda4af',
                padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
              }}>
                {stand.status}
              </span>
              {expanded ? <ChevronUp className="w-4 h-4" style={{ color: '#475569' }} /> : <ChevronDown className="w-4 h-4" style={{ color: '#475569' }} />}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded menu */}
      {expanded && (
        <div className="mt-4 pt-4 animate-fade-in" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#475569' }}>Menu</div>
          <div className="space-y-2">
            {stand.items.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: '#0d1421', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div>
                  <div className="text-sm font-medium" style={{ color: '#f1f5f9' }}>
                    {item.name}
                    {item.popular && <span className="ml-2 text-xs" style={{ color: '#f59e0b' }}>🔥 Popular</span>}
                  </div>
                  {item.dietary.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {item.dietary.map(d => <span key={d} className="text-xs" style={{ color: '#10b981' }}>🌿 {d}</span>)}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold" style={{ color: '#f1f5f9' }}>£{item.price.toFixed(2)}</span>
                  <button
                    onClick={e => { e.stopPropagation(); onOrder(stand); }}
                    className="text-xs px-3 py-1.5 rounded-lg transition-all hover:translate-y-[-1px]"
                    style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', fontWeight: 600 }}>
                    + Add
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={e => { e.stopPropagation(); onOrder(stand); }}
            className="btn-primary w-full mt-3 justify-center"
          >
            <ShoppingCart className="w-4 h-4" />
            Pre-order to Seat — Skip the Queue
          </button>
        </div>
      )}
    </div>
  );
}

export default function QueueSense() {
  const [queues, setQueues] = useState<ConcessionStand[]>(MOCK_QUEUES);
  const [filter, setFilter] = useState<'all' | 'food' | 'drinks' | 'snacks' | 'merch'>('all');
  const [sortBy, setSortBy] = useState<'wait' | 'queue'>('wait');
  const [orderModal, setOrderModal] = useState<ConcessionStand | null>(null);
  const [tick, setTick] = useState(0);

  // Live queue simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setQueues(prev => prev.map(q => ({
        ...q,
        waitTime: Math.max(1, q.waitTime + Math.round((Math.random() - 0.45) * 3)),
        queueLength: Math.max(1, q.queueLength + Math.round((Math.random() - 0.45) * 8)),
      })));
      setTick(t => t + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filtered = queues
    .filter(q => filter === 'all' || q.type === filter)
    .sort((a, b) => sortBy === 'wait' ? a.waitTime - b.waitTime : a.queueLength - b.queueLength);

  const avgWait = Math.round(queues.reduce((s, q) => s + q.waitTime, 0) / queues.length);
  const bestStand = [...queues].sort((a, b) => a.waitTime - b.waitTime)[0];

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black mb-1" style={{ fontFamily: 'Outfit, sans-serif', color: '#f1f5f9' }}>
            QueueSense <span className="text-gradient-primary">AI</span>
          </h1>
          <div className="flex items-center gap-2">
            <span className="status-dot status-live" />
            <span className="text-sm" style={{ color: '#94a3b8' }}>Live queue intelligence · Updated {tick}s ago</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#475569' }}>Sort:</div>
          {(['wait', 'queue'] as const).map(s => (
            <button key={s} onClick={() => setSortBy(s)}
              className="text-xs px-3 py-2 rounded-lg capitalize font-semibold transition-all"
              style={sortBy === s
                ? { background: '#6366f1', color: 'white' }
                : { background: '#111827', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }
              }>
              {s === 'wait' ? '⏱ Wait Time' : '👥 Queue Size'}
            </button>
          ))}
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="stat-card text-center">
          <div className="text-3xl font-black mb-1" style={{ color: '#f59e0b', fontFamily: 'Outfit, sans-serif' }}>{avgWait}m</div>
          <div className="text-xs" style={{ color: '#64748b' }}>Average Wait</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-3xl font-black mb-1" style={{ color: '#10b981', fontFamily: 'Outfit, sans-serif' }}>{bestStand.waitTime}m</div>
          <div className="text-xs" style={{ color: '#64748b' }}>Shortest Queue</div>
          <div className="text-xs mt-0.5" style={{ color: '#475569' }}>{bestStand.name}</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-3xl font-black mb-1" style={{ color: '#6366f1', fontFamily: 'Outfit, sans-serif' }}>
            {queues.filter(q => q.status !== 'closed').length}
          </div>
          <div className="text-xs" style={{ color: '#64748b' }}>Stands Open</div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['all', 'food', 'drinks', 'snacks', 'merch'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="text-sm px-4 py-2 rounded-xl capitalize font-semibold transition-all"
            style={filter === f
              ? { background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.35)', color: '#a5b4fc' }
              : { background: '#111827', border: '1px solid rgba(255,255,255,0.06)', color: '#64748b' }
            }>
            {f === 'all' ? '🔍 All' : f === 'food' ? '🍔 Food' : f === 'drinks' ? '🍺 Drinks' : f === 'snacks' ? '🍿 Snacks' : '👕 Merch'}
          </button>
        ))}
      </div>

      {/* Queue cards */}
      <div className="space-y-4">
        {filtered.map(stand => (
          <StandCard key={stand.id} stand={stand} onOrder={(s) => setOrderModal(s)} />
        ))}
      </div>

      {/* Order modal */}
      {orderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setOrderModal(null)}>
          <div className="card p-6 w-full max-w-md" onClick={e => e.stopPropagation()}
            style={{ borderColor: 'rgba(99,102,241,0.3)' }}>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#f1f5f9' }}>Pre-Order to Seat</h3>
            <p className="text-sm mb-4" style={{ color: '#94a3b8' }}>
              Order from <strong style={{ color: '#a5b4fc' }}>{orderModal.name}</strong> and skip the queue — delivered straight to your seat.
            </p>
            <div className="p-3 rounded-xl mb-4" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <div className="text-sm font-semibold" style={{ color: '#34d399' }}>📍 Delivery: North Stand, Row H, Seat 24</div>
              <div className="text-xs mt-1" style={{ color: '#94a3b8' }}>Estimated delivery: 12–15 minutes from order</div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setOrderModal(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button onClick={() => { alert('🎉 Order placed! Your food will be delivered to Seat 24 in ~12 minutes.'); setOrderModal(null); }}
                className="btn-primary flex-1 justify-center">
                <ShoppingCart className="w-4 h-4" />
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
