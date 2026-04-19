'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import HeroPage from '@/components/HeroPage';
import Sidebar from '@/components/Sidebar';

// Lazy load heavy components
const FanDashboard = dynamic(() => import('@/components/FanDashboard'), { ssr: false });
const CrowdMap = dynamic(() => import('@/components/CrowdMap'), { ssr: false });
const FlowBot = dynamic(() => import('@/components/FlowBot'), { ssr: false });
const QueueSense = dynamic(() => import('@/components/QueueSense'), { ssr: false });
const SafetyNet = dynamic(() => import('@/components/SafetyNet'), { ssr: false });
const VenueIQ = dynamic(() => import('@/components/VenueIQ'), { ssr: false });
const RewardFlow = dynamic(() => import('@/components/RewardFlow'), { ssr: false });
const OpsCenter = dynamic(() => import('@/components/OpsCenter'), { ssr: false });

type UserMode = 'fan' | 'staff' | 'admin';

export default function Home() {
  const [mode, setMode] = useState<UserMode | null>(null);
  const [activeView, setActiveView] = useState('dashboard');

  const handleEnter = (selectedMode: UserMode) => {
    setMode(selectedMode);
    setActiveView(selectedMode === 'fan' ? 'dashboard' : selectedMode === 'staff' ? 'ops' : 'analytics');
  };

  const handleModeChange = (newMode: UserMode) => {
    setMode(newMode);
    setActiveView(newMode === 'fan' ? 'dashboard' : newMode === 'staff' ? 'ops' : 'analytics');
  };

  if (!mode) {
    return <HeroPage onEnter={handleEnter} />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <FanDashboard />;
      case 'crowdmap': return <CrowdMap />;
      case 'flowbot': return <FlowBot />;
      case 'queues': return <QueueSense />;
      case 'order': return <QueueSense />;
      case 'safety': return <SafetyNet />;
      case 'incidents': return <SafetyNet />;
      case 'analytics': return <VenueIQ />;
      case 'rewards': return <RewardFlow />;
      case 'ops': return <OpsCenter />;
      case 'broadcast': return <OpsCenter />;
      case 'gates': return <OpsCenter />;
      case 'staff': return <OpsCenter />;
      default: return <FanDashboard />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#080c14' }}>
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        userMode={mode}
        onModeChange={handleModeChange}
      />
      <main className="main-content">
        {renderView()}
      </main>
    </div>
  );
}
