'use client';

import { useState } from 'react';
import { MOCK_REWARDS, RewardItem, MOCK_USER } from '@/lib/data';
import { Gift, Star, Zap, Trophy, ChevronRight } from 'lucide-react';

const TIER_CONFIG = {
  bronze: { color: '#cd7f32', bg: 'rgba(205,127,50,0.12)', border: 'rgba(205,127,50,0.3)', next: 'Silver', nextAt: 1000, icon: '🥉' },
  silver: { color: '#c0c0c0', bg: 'rgba(192,192,192,0.12)', border: 'rgba(192,192,192,0.3)', next: 'Gold', nextAt: 2000, icon: '🥈' },
  gold: { color: '#ffd700', bg: 'rgba(255,215,0,0.12)', border: 'rgba(255,215,0,0.3)', next: 'Platinum', nextAt: 3000, icon: '🥇' },
  platinum: { color: '#e5e4e2', bg: 'rgba(229,228,226,0.12)', border: 'rgba(229,228,226,0.3)', next: null, nextAt: null, icon: '💎' },
};

const CHALLENGES = [
  { id: 'c1', name: 'First Order', desc: 'Place your first pre-order this event', pts: 50, progress: 100, completed: true },
  { id: 'c2', name: 'Early Bird', desc: 'Arrive 30+ minutes before kickoff', pts: 100, progress: 100, completed: true },
  { id: 'c3', name: 'Explorer', desc: 'Visit 3 different concession zones', pts: 150, progress: 66, completed: false },
  { id: 'c4', name: 'Social Fan', desc: 'Share your seat view (optional)', pts: 75, progress: 0, completed: false },
  { id: 'c5', name: 'Match Day Hero', desc: 'Attend 5 events at this venue', pts: 500, progress: 80, completed: false },
];

function RewardCard({ reward, userPoints, onRedeem }: { reward: RewardItem; userPoints: number; onRedeem: (r: RewardItem) => void }) {
  const canRedeem = userPoints >= reward.points && reward.available;
  const emoji = reward.category === 'food' ? '🍔' : reward.category === 'merch' ? '👕' : reward.category === 'upgrade' ? '⬆️' : '🌟';

  return (
    <div className="gradient-border p-5 transition-all" style={{
      background: '#111827',
      opacity: reward.available ? 1 : 0.5,
    }}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: '#0d1421', border: '1px solid rgba(255,255,255,0.06)' }}>
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-sm font-bold" style={{ color: '#f1f5f9' }}>{reward.name}</div>
              <div className="text-xs mt-0.5" style={{ color: '#64748b' }}>{reward.description}</div>
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="flex items-center gap-1" style={{ color: '#ffd700' }}>
                <Star className="w-3 h-3" />
                <span className="text-sm font-bold">{reward.points.toLocaleString()}</span>
              </div>
              <div className="text-xs mt-0.5" style={{ color: '#475569' }}>pts</div>
            </div>
          </div>

          {!reward.available && (
            <div className="text-xs mt-2" style={{ color: '#f43f5e' }}>Currently unavailable</div>
          )}

          {reward.available && !canRedeem && (
            <div className="progress-bar mt-3">
              <div className="progress-fill" style={{
                width: `${Math.min((userPoints / reward.points) * 100, 100)}%`,
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6)'
              }} />
            </div>
          )}

          {canRedeem && (
            <button
              onClick={() => onRedeem(reward)}
              className="btn-primary mt-3 text-xs"
              style={{ padding: '6px 14px' }}
            >
              <Zap className="w-3 h-3" />
              Redeem Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RewardFlow() {
  const user = MOCK_USER;
  const tier = TIER_CONFIG[user.tier];
  const [points, setPoints] = useState(user.loyaltyPoints);
  const [redeemed, setRedeemed] = useState<string[]>([]);

  const handleRedeem = (reward: RewardItem) => {
    if (points < reward.points) return;
    setPoints(p => p - reward.points);
    setRedeemed(prev => [...prev, reward.id]);
    alert(`🎉 Reward redeemed! "${reward.name}" has been added to your wallet. Show this to venue staff.`);
  };

  const progressToNext = tier.nextAt ? Math.min((points / tier.nextAt) * 100, 100) : 100;

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black mb-1" style={{ fontFamily: 'Outfit, sans-serif', color: '#f1f5f9' }}>
            <span className="text-gradient-gold">RewardFlow</span> Loyalty
          </h1>
          <p className="text-sm" style={{ color: '#94a3b8' }}>Earn points, unlock rewards, level up your fan status</p>
        </div>
        <div className="badge badge-amber">
          <Trophy className="w-3 h-3" />
          {user.tier.charAt(0).toUpperCase() + user.tier.slice(1)} Tier
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Tier card */}
        <div className="lg:col-span-1">
          <div className="p-6 rounded-2xl text-center" style={{ background: tier.bg, border: `1px solid ${tier.border}` }}>
            <div className="text-5xl mb-3">{tier.icon}</div>
            <div className="text-2xl font-black capitalize" style={{ color: tier.color, fontFamily: 'Outfit, sans-serif' }}>
              {user.tier}
            </div>
            <div className="text-4xl font-black mt-2" style={{ color: '#f1f5f9', fontFamily: 'Outfit, sans-serif' }}>
              {points.toLocaleString()}
            </div>
            <div className="text-sm" style={{ color: '#64748b' }}>loyalty points</div>

            {tier.next && (
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-2" style={{ color: '#64748b' }}>
                  <span>{user.tier}</span>
                  <span>{tier.next}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progressToNext}%`, background: `linear-gradient(90deg, ${tier.color}, #f1f5f9)` }} />
                </div>
                <div className="text-xs mt-2" style={{ color: '#94a3b8' }}>
                  {tier.nextAt ? Math.max(0, tier.nextAt - points).toLocaleString() : 0} pts to {tier.next}
                </div>
              </div>
            )}
          </div>

          {/* Recent activity */}
          <div className="card mt-4">
            <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#475569' }}>Recent Activity</div>
            <div className="space-y-3">
              {[
                { desc: 'Match Day Check-in', pts: +100, time: '14:32' },
                { desc: 'Pre-order placed', pts: +50, time: '15:10' },
                { desc: 'Explorer Challenge', pts: +150, time: '15:45' },
              ].map((a, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm" style={{ color: '#f1f5f9' }}>{a.desc}</div>
                    <div className="text-xs" style={{ color: '#475569' }}>{a.time}</div>
                  </div>
                  <span className="text-sm font-bold" style={{ color: '#10b981' }}>+{a.pts}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Challenges + Rewards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active challenges */}
          <div className="card">
            <h2 className="font-bold mb-4" style={{ color: '#f1f5f9' }}>🎯 Today's Challenges</h2>
            <div className="space-y-4">
              {CHALLENGES.map(c => (
                <div key={c.id} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={c.completed
                      ? { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }
                      : { background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }
                    }>
                    {c.completed ? '✓' : '○'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-semibold" style={{ color: c.completed ? '#34d399' : '#f1f5f9' }}>{c.name}</div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Star className="w-3 h-3" style={{ color: '#ffd700' }} />
                        <span className="text-xs font-bold" style={{ color: '#fcd34d' }}>+{c.pts}</span>
                      </div>
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: '#475569' }}>{c.desc}</div>
                    {!c.completed && (
                      <div className="progress-bar mt-2">
                        <div className="progress-fill" style={{
                          width: `${c.progress}%`,
                          background: 'linear-gradient(90deg, #6366f1, #8b5cf6)'
                        }} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rewards shop */}
          <div>
            <h2 className="font-bold mb-4" style={{ color: '#f1f5f9' }}>
              <Gift className="w-4 h-4 inline mr-2" style={{ color: '#6366f1' }} />
              Reward Store
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {MOCK_REWARDS.map(reward => (
                <RewardCard key={reward.id} reward={reward} userPoints={points} onRedeem={handleRedeem} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
