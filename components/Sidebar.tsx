'use client';

import { useState } from 'react';
import {
  LayoutDashboard, Map, MessageSquare, ShoppingCart, Shield,
  BarChart3, Gift, Zap, Menu, X, ChevronRight, Bell,
  Activity, LogOut, Settings, Users, Radio
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  userMode: 'fan' | 'staff' | 'admin';
  onModeChange: (mode: 'fan' | 'staff' | 'admin') => void;
}

const FAN_NAV = [
  { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard },
  { id: 'crowdmap', label: 'CrowdMap', icon: Map },
  { id: 'flowbot', label: 'FlowBot AI', icon: MessageSquare, badge: 'AI' },
  { id: 'queues', label: 'QueueSense', icon: Activity },
  { id: 'order', label: 'Food & Drinks', icon: ShoppingCart },
  { id: 'rewards', label: 'RewardFlow', icon: Gift },
  { id: 'safety', label: 'Safety Info', icon: Shield },
];

const STAFF_NAV = [
  { id: 'ops', label: 'Ops Overview', icon: LayoutDashboard },
  { id: 'crowdmap', label: 'Live Heatmap', icon: Map },
  { id: 'incidents', label: 'Incidents', icon: Shield },
  { id: 'broadcast', label: 'PA Broadcast', icon: Radio },
  { id: 'gates', label: 'Gate Status', icon: Zap },
];

const ADMIN_NAV = [
  { id: 'analytics', label: 'VenueIQ Dashboard', icon: BarChart3 },
  { id: 'crowdmap', label: 'Live Heatmap', icon: Map },
  { id: 'incidents', label: 'Incident Log', icon: Shield },
  { id: 'gates', label: 'Gate Intelligence', icon: Zap },
  { id: 'staff', label: 'Staff Management', icon: Users },
  { id: 'broadcast', label: 'Broadcast', icon: Radio },
];

export default function Sidebar({ activeView, onNavigate, userMode, onModeChange }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifCount] = useState(3);

  const navItems = userMode === 'fan' ? FAN_NAV : userMode === 'staff' ? STAFF_NAV : ADMIN_NAV;

  const modeLabels = { fan: 'Fan Mode', staff: 'Staff Mode', admin: 'Admin Mode' };
  const modeColors = {
    fan: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    staff: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    admin: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center glow-purple"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-black text-lg" style={{ fontFamily: 'Outfit, sans-serif', color: '#f1f5f9', letterSpacing: '-0.5px' }}>
              VenueFlow
            </div>
            <div className="text-xs font-semibold" style={{ color: '#6366f1' }}>AI · POWERED</div>
          </div>
          {/* Mobile close */}
          <button onClick={() => setMobileOpen(false)} className="ml-auto lg:hidden" style={{ color: '#64748b' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode switcher */}
        <div className="relative">
          <div className="flex rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {(['fan', 'staff', 'admin'] as const).map(m => (
              <button
                key={m}
                onClick={() => onModeChange(m)}
                className="flex-1 py-1.5 text-xs font-semibold capitalize transition-all"
                style={userMode === m
                  ? { background: '#6366f1', color: 'white', borderRadius: '6px' }
                  : { color: '#64748b' }
                }
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 py-3 overflow-y-auto">
        <div className="px-4 mb-2">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#475569' }}>
            {modeLabels[userMode]}
          </span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => { onNavigate(item.id); setMobileOpen(false); }}
              className={`nav-item w-full ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-4 h-4" style={{ flexShrink: 0 }} />
              <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
              {'badge' in item && item.badge && (
                <span className="badge badge-purple text-[10px]">{item.badge}</span>
              )}
              {isActive && <ChevronRight className="w-3 h-3" style={{ opacity: 0.5 }} />}
            </button>
          );
        })}
      </div>

      {/* Bottom section */}
      <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        {/* Notification bar */}
        <div className="flex items-center gap-3 p-3 rounded-xl mb-3 cursor-pointer"
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <Bell className="w-4 h-4" style={{ color: '#f59e0b' }} />
          <span className="text-sm flex-1" style={{ color: '#fcd34d' }}>Alerts</span>
          <span className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
            style={{ background: '#f59e0b', color: '#000' }}>{notifCount}</span>
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }}>
            AR
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate" style={{ color: '#f1f5f9' }}>Alex Rivera</div>
            <div className="text-xs" style={{ color: '#f59e0b' }}>⭐ Gold Tier · 2,840 pts</div>
          </div>
          <button className="p-1 rounded-lg" style={{ color: '#64748b' }}>
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-xl"
        style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <Menu className="w-5 h-5" style={{ color: '#f1f5f9' }} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setMobileOpen(false)} />
      )}

      {/* Desktop sidebar */}
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`} style={{ zIndex: 50 }}>
        <SidebarContent />
      </aside>
    </>
  );
}
