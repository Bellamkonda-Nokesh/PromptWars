// ─── Core Types ────────────────────────────────────────────────────────────────

export interface Venue {
  id: string;
  name: string;
  capacity: number;
  currentAttendance: number;
  event: string;
  status: 'live' | 'upcoming' | 'closed';
  sections: VenueSection[];
}

export interface VenueSection {
  id: string;
  name: string;
  density: number; // 0-1
  capacity: number;
  current: number;
}

export interface ConcessionStand {
  id: string;
  name: string;
  zone: string;
  waitTime: number; // minutes
  predictedWait15m: number;
  queueLength: number;
  status: 'open' | 'closed' | 'busy';
  type: 'food' | 'drinks' | 'snacks' | 'merch';
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  dietary: string[];
  popular: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export interface Incident {
  id: string;
  type: 'medical' | 'security' | 'crowd' | 'technical' | 'weather';
  severity: 1 | 2 | 3 | 4 | 5;
  zone: string;
  description: string;
  reportedAt: Date;
  status: 'active' | 'resolved' | 'investigating';
  staffId: string;
}

export interface GateStatus {
  id: string;
  name: string;
  queueLength: number;
  averageWait: number; // minutes
  throughput: number; // people/min
  status: 'open' | 'closed' | 'busy';
  recommendation?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  loyaltyPoints: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  ticket?: TicketInfo;
  preferences: UserPreferences;
}

export interface TicketInfo {
  eventId: string;
  section: string;
  row: string;
  seat: string;
  gate: string;
  qrCode: string;
}

export interface UserPreferences {
  language: string;
  dietary: string[];
  accessibility: boolean;
  notifications: boolean;
}

export interface AnalyticsData {
  label: string;
  value: number;
  change?: number;
}

export interface RewardItem {
  id: string;
  name: string;
  description: string;
  points: number;
  category: 'food' | 'merch' | 'upgrade' | 'experience';
  available: boolean;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

export const MOCK_VENUE: Venue = {
  id: 'arena-1',
  name: 'MetroArena Stadium',
  capacity: 68000,
  currentAttendance: 54200,
  event: 'Champions League Final — City FC vs United SC',
  status: 'live',
  sections: [
    { id: 'north', name: 'North Stand', density: 0.82, capacity: 15000, current: 12300 },
    { id: 'south', name: 'South Stand', density: 0.91, capacity: 15000, current: 13650 },
    { id: 'east', name: 'East Wing', density: 0.68, capacity: 12000, current: 8160 },
    { id: 'west', name: 'West Wing', density: 0.55, capacity: 12000, current: 6600 },
    { id: 'vip', name: 'VIP Lounge', density: 0.42, capacity: 8000, current: 3360 },
    { id: 'concourse', name: 'Main Concourse', density: 0.75, capacity: 6000, current: 4500 },
  ],
};

export const MOCK_QUEUES: ConcessionStand[] = [
  {
    id: 'stand-a1', name: 'Stadium Grill A1', zone: 'North Concourse', waitTime: 4,
    predictedWait15m: 7, queueLength: 12, status: 'open', type: 'food',
    items: [
      { id: 'b1', name: 'Stadium Burger', price: 14.99, category: 'mains', dietary: [], popular: true },
      { id: 'h1', name: 'Hot Dog Deluxe', price: 9.99, category: 'mains', dietary: [], popular: true },
      { id: 'v1', name: 'Veggie Wrap', price: 11.99, category: 'mains', dietary: ['vegetarian'], popular: false },
    ],
  },
  {
    id: 'stand-b2', name: 'Brew House B2', zone: 'South Concourse', waitTime: 18,
    predictedWait15m: 12, queueLength: 54, status: 'busy', type: 'drinks',
    items: [
      { id: 'dk1', name: 'Draft Beer', price: 8.99, category: 'drinks', dietary: [], popular: true },
      { id: 'dk2', name: 'Craft IPA', price: 10.99, category: 'drinks', dietary: [], popular: false },
      { id: 'dk3', name: 'Soft Drink', price: 4.99, category: 'drinks', dietary: ['vegan'], popular: true },
    ],
  },
  {
    id: 'stand-c3', name: 'Snack Zone C3', zone: 'East Wing', waitTime: 2,
    predictedWait15m: 3, queueLength: 6, status: 'open', type: 'snacks',
    items: [
      { id: 'sn1', name: 'Nachos & Salsa', price: 7.99, category: 'snacks', dietary: ['vegetarian'], popular: true },
      { id: 'sn2', name: 'Popcorn Mix', price: 5.99, category: 'snacks', dietary: ['vegan'], popular: true },
    ],
  },
  {
    id: 'stand-d4', name: 'Fan Fare D4', zone: 'West Wing', waitTime: 9,
    predictedWait15m: 6, queueLength: 27, status: 'open', type: 'food',
    items: [
      { id: 'p1', name: 'BBQ Nachos', price: 12.99, category: 'mains', dietary: [], popular: false },
      { id: 'p2', name: 'Loaded Fries', price: 8.99, category: 'sides', dietary: ['vegetarian'], popular: true },
    ],
  },
  {
    id: 'stand-e5', name: 'Metro Merch', zone: 'Main Entrance', waitTime: 5,
    predictedWait15m: 8, queueLength: 15, status: 'open', type: 'merch',
    items: [
      { id: 'm1', name: 'Team Jersey', price: 89.99, category: 'clothing', dietary: [], popular: true },
      { id: 'm2', name: 'Scarf', price: 24.99, category: 'accessories', dietary: [], popular: true },
    ],
  },
  {
    id: 'stand-f6', name: 'VIP Bar', zone: 'VIP Lounge', waitTime: 22,
    predictedWait15m: 28, queueLength: 66, status: 'busy', type: 'drinks',
    items: [
      { id: 'vb1', name: 'Cocktail', price: 15.99, category: 'cocktails', dietary: [], popular: true },
      { id: 'vb2', name: 'Champagne', price: 29.99, category: 'wine', dietary: [], popular: false },
    ],
  },
];

export const MOCK_GATES: GateStatus[] = [
  { id: 'gate-a', name: 'Gate A (North)', queueLength: 48, averageWait: 8, throughput: 6, status: 'busy', recommendation: 'Try Gate C — 50% shorter' },
  { id: 'gate-b', name: 'Gate B (South)', queueLength: 124, averageWait: 21, throughput: 6, status: 'busy', recommendation: undefined },
  { id: 'gate-c', name: 'Gate C (East)', queueLength: 23, averageWait: 4, throughput: 6, status: 'open', recommendation: '✓ Fastest entry' },
  { id: 'gate-d', name: 'Gate D (West)', queueLength: 67, averageWait: 11, throughput: 6, status: 'open', recommendation: undefined },
  { id: 'gate-vip', name: 'Gate VIP', queueLength: 8, averageWait: 1, throughput: 8, status: 'open', recommendation: undefined },
];

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'inc-1', type: 'medical', severity: 2, zone: 'Section B12',
    description: 'Fan requiring medical attention — paramedics dispatched',
    reportedAt: new Date(Date.now() - 1200000), status: 'investigating', staffId: 'staff-04',
  },
  {
    id: 'inc-2', type: 'crowd', severity: 3, zone: 'South Gate',
    description: 'Crowd surge at main entry — additional stewards deployed',
    reportedAt: new Date(Date.now() - 3600000), status: 'resolved', staffId: 'staff-07',
  },
  {
    id: 'inc-3', type: 'technical', severity: 1, zone: 'Concourse A',
    description: 'Turnstile malfunction on lane 3 — maintenance notified',
    reportedAt: new Date(Date.now() - 600000), status: 'active', staffId: 'staff-02',
  },
];

export const MOCK_USER: UserProfile = {
  id: 'user-001',
  name: 'Alex Rivera',
  email: 'alex.rivera@email.com',
  avatar: 'AR',
  loyaltyPoints: 2840,
  tier: 'gold',
  ticket: {
    eventId: 'evt-champions-final',
    section: 'North Stand',
    row: 'H',
    seat: '24',
    gate: 'Gate A',
    qrCode: 'VF-2026-NS-H24',
  },
  preferences: {
    language: 'en',
    dietary: ['vegetarian'],
    accessibility: false,
    notifications: true,
  },
};

export const MOCK_REWARDS: RewardItem[] = [
  { id: 'r1', name: 'Free Soft Drink', description: 'Any standard soft drink at any stand', points: 200, category: 'food', available: true },
  { id: 'r2', name: 'Nachos Upgrade', description: 'Large nachos with 3 dipping sauces', points: 350, category: 'food', available: true },
  { id: 'r3', name: 'Team Scarf', description: 'Official club scarf — any color', points: 800, category: 'merch', available: true },
  { id: 'r4', name: 'Seat Upgrade', description: 'Move to premium seating (subject to availability)', points: 1500, category: 'upgrade', available: false },
  { id: 'r5', name: 'Pitch-side Experience', description: 'Post-match pitch access for 30 minutes', points: 3000, category: 'experience', available: true },
  { id: 'r6', name: 'VIP Lounge Pass', description: 'Single-match VIP lounge access', points: 2500, category: 'upgrade', available: true },
];

export const CROWD_TIMELINE: AnalyticsData[] = [
  { label: '12:00', value: 8200 },
  { label: '13:00', value: 15400 },
  { label: '14:00', value: 28900 },
  { label: '15:00', value: 41200 },
  { label: '16:00', value: 52100 },
  { label: '17:00', value: 54200 },
  { label: '18:00', value: 53800 },
  { label: '19:00', value: 49200 },
];

export const REVENUE_DATA: AnalyticsData[] = [
  { label: 'Food', value: 487200, change: 12.4 },
  { label: 'Drinks', value: 329800, change: 8.1 },
  { label: 'Merch', value: 156400, change: -3.2 },
  { label: 'Upgrade', value: 92600, change: 22.7 },
];

export const FLOWBOT_SUGGESTIONS = [
  'Where is my seat?',
  'Shortest queue for food',
  'Nearest restroom',
  'Emergency exits',
  'Check my loyalty points',
  'Best time to leave',
];

export const INITIAL_BOT_MESSAGE: ChatMessage = {
  id: 'bot-0',
  role: 'assistant',
  content: `👋 Hi Alex! I'm **FlowBot**, your AI venue assistant. I can see you're in **Section North Stand, Row H, Seat 24** for today's **Champions League Final**!

Here's what's happening right now:
- 🟡 **Gate A** has an 8-min wait — Gate C is faster right now
- 🟢 **Snack Zone C3** has only a 2-min queue
- 🏅 You have **2,840 loyalty points** — only 160 away from your next reward!

How can I help you today?`,
  timestamp: new Date(),
  suggestions: [...FLOWBOT_SUGGESTIONS],
};
