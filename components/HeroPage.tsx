'use client';

import { useState, useEffect } from 'react';
import { Zap, Map, MessageSquare, Activity, Shield, BarChart3, Gift, ChevronRight, Star, Users, Clock } from 'lucide-react';

interface HeroProps {
  onEnter: (mode: 'fan' | 'staff' | 'admin') => void;
}

const TICKER_ITEMS = [
  '⚡ Gate C fastest entry — 4 min wait',
  '🍔 Snack Zone C3 open — only 2 min queue!',
  '🏅 Alex, you\'re 160 pts from Platinum!',
  '📍 North Stand: 82% full — crowd building',
  '🤖 FlowBot available — ask anything!',
];

const FEATURES = [
  { icon: Map, title: 'CrowdMap Live', desc: 'Real-time stadium heatmaps powered by Firebase & sensor fusion', color: '#6366f1' },
  { icon: MessageSquare, title: 'FlowBot AI', desc: 'Context-aware Gemini 1.5 Flash assistant that knows your seat, queue & preferences', color: '#06b6d4' },
  { icon: Activity, title: 'QueueSense', desc: 'ML-powered wait time predictions 15 minutes ahead at every concession stand', color: '#10b981' },
  { icon: Shield, title: 'SafetyNet', desc: 'Instant emergency coordination, evacuation routing, and PA broadcast', color: '#f43f5e' },
  { icon: BarChart3, title: 'VenueIQ Dashboard', desc: 'BigQuery-powered analytics for revenue, crowd flow, and operational intelligence', color: '#f59e0b' },
  { icon: Gift, title: 'RewardFlow', desc: 'Gamified loyalty system with challenges, points, and premium venue rewards', color: '#8b5cf6' },
];

export default function HeroPage({ onEnter }: HeroProps) {
  const [tickerIndex, setTickerIndex] = useState(0);
  const [tickerVisible, setTickerVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerVisible(false);
      setTimeout(() => {
        setTickerIndex(i => (i + 1) % TICKER_ITEMS.length);
        setTickerVisible(true);
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{
      background: 'radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(6,182,212,0.08) 0%, transparent 50%), #080c14'
    }}>
      {/* Animated background orbs */}
      <div className="orb orb-purple" style={{ width: 600, height: 600, top: -200, left: -200 }} />
      <div className="orb orb-cyan" style={{ width: 400, height: 400, bottom: 0, right: -100 }} />
      <div className="orb orb-emerald" style={{ width: 300, height: 300, top: '50%', left: '60%' }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center glow-purple"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-black text-xl" style={{ fontFamily: 'Outfit, sans-serif', color: '#f1f5f9', letterSpacing: '-0.5px' }}>
              VenueFlow AI
            </div>
            <div className="text-xs font-bold" style={{ color: '#6366f1' }}>HACKATHON 2026</div>
          </div>
        </div>

        {/* Live ticker */}
        <div className="hidden md:flex items-center gap-3 px-5 py-2.5 rounded-2xl"
          style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
          <span className="status-dot status-live" />
          <span className="text-sm font-medium transition-opacity duration-400" style={{ color: '#94a3b8', opacity: tickerVisible ? 1 : 0 }}>
            {TICKER_ITEMS[tickerIndex]}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge badge-purple hidden sm:flex">Google Cloud</span>
          <span className="badge badge-cyan hidden sm:flex">Gemini AI</span>
        </div>
      </header>

      {/* Hero section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
        {/* Top badge */}
        <div className="flex items-center gap-2 px-5 py-2 rounded-full mb-8"
          style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)' }}>
          <Star className="w-4 h-4" style={{ color: '#818cf8' }} />
          <span className="text-sm font-semibold" style={{ color: '#818cf8' }}>
            Physical Event Experience · Large-Scale Sporting Venues
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-2px' }}>
          <span className="text-gradient-hero">Smart Venue,</span>
          <br />
          <span style={{ color: '#f1f5f9' }}>Seamless Experience</span>
        </h1>

        <p className="text-lg sm:text-xl max-w-2xl mb-12 leading-relaxed" style={{ color: '#94a3b8' }}>
          AI-powered navigation, crowd intelligence, and personalized assistance for every fan at every moment — from parking lot to final whistle.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <button
            id="enter-fan-mode"
            onClick={() => onEnter('fan')}
            className="btn-primary text-base px-8 py-4"
            style={{ borderRadius: 14, fontSize: 16 }}
          >
            <Zap className="w-5 h-5" />
            Enter as Fan
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            id="enter-staff-mode"
            onClick={() => onEnter('staff')}
            className="btn-secondary text-base px-8 py-4"
            style={{ borderRadius: 14, fontSize: 16 }}
          >
            <Shield className="w-5 h-5" />
            Staff / Admin View
          </button>
        </div>

        {/* Social proof */}
        <div className="flex items-center gap-8 mb-16 flex-wrap justify-center">
          {[
            { icon: Users, value: '100K+', label: 'Concurrent Fans' },
            { icon: Clock, value: '47m', label: 'Queue Time Saved/Game' },
            { icon: Activity, value: '6', label: 'Google Services' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-3 text-center">
              <div className="p-2 rounded-xl" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                <s.icon className="w-4 h-4" style={{ color: '#818cf8' }} />
              </div>
              <div>
                <div className="text-xl font-black" style={{ color: '#f1f5f9', fontFamily: 'Outfit, sans-serif' }}>{s.value}</div>
                <div className="text-xs" style={{ color: '#64748b' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl w-full">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="gradient-border p-5 text-left hover:translate-y-[-3px] transition-transform"
                style={{ background: '#111827' }}>
                <div className="p-2 rounded-xl mb-3 w-fit" style={{ background: `${f.color}15`, border: `1px solid ${f.color}25` }}>
                  <Icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <div className="text-sm font-bold mb-1" style={{ color: '#f1f5f9' }}>{f.title}</div>
                <div className="text-xs leading-relaxed" style={{ color: '#64748b' }}>{f.desc}</div>
              </div>
            );
          })}
        </div>

        {/* Google stack */}
        <div className="mt-12 flex items-center gap-3 flex-wrap justify-center">
          <span className="text-xs uppercase tracking-widest" style={{ color: '#334155' }}>Powered by</span>
          {['Google Maps', 'Gemini AI', 'Firebase', 'Cloud Run', 'BigQuery', 'Pub/Sub'].map(s => (
            <span key={s} className="text-xs px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}>
              {s}
            </span>
          ))}
        </div>
      </main>

      <footer className="relative z-10 text-center py-6 text-xs" style={{ color: '#334155' }}>
        VenueFlow AI · Google Cloud Hackathon 2026 · Built for fans, powered by AI
      </footer>
    </div>
  );
}
