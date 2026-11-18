import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Users,
  Zap,
  RefreshCw,
  BarChart2,
  MapPin,
  Download,
  Filter,
  Star,
  Gift,
  Clock,
  CreditCard,
  Phone,
  Mail,
  Calendar,
  Edit2,
  X,
  Check,
  CheckCircle2,
  Building2,
  Store,
  Trophy,
  Sun,
  Moon,
  Sparkles,
  FileText,
  MessageSquare,
  Ban,
  Send,
  Receipt,
  User,
  Lock,
  Wallet,
  Heart,
  ShieldCheck,
  Target,
  Plus,
  Info,
  SlidersHorizontal
} from 'lucide-react';
import {
  INITIAL_TABLET_CUSTOMERS,
  TabletCustomerItem,
  TabletCustomerWalletTx,
  TabletCustomerActivity
} from '../../data/customerTabletData';

export interface TabletCustomersViewProps {
  initialCustomerId?: string | null;
  onBackToList?: () => void;
}

interface LocationCampaignStat {
  name: string;
  count: number;
}

interface LocationAnalyticsItem {
  name: string;
  subtitle: string;
  status?: 'Active' | 'Inactive';
  manager?: string;
  address?: string;
  uniqueVisitors: number;
  recordedVisits: number;
  newCustomers: number;
  returning: number;
  topCampaigns: LocationCampaignStat[];
  timeOfDay: { morning: number; afternoon: number; evening: number };
  gender: { male: number; female: number; other: number };
  tiers: { vvip: number; vip: number; gold: number; silver: number; bronze: number };
  behaviour: { newCount: number; returning: number; active: number; inactive: number };
}

const STATE_ANALYTICS: LocationAnalyticsItem[] = [
  {
    name: 'Uttar Pradesh',
    subtitle: '7 branches · last 30 days',
    uniqueVisitors: 2250,
    recordedVisits: 7120,
    newCustomers: 350,
    returning: 1900,
    topCampaigns: [
      { name: 'Welcome Special', count: 485 },
      { name: 'Weekend Treat', count: 387 },
      { name: 'Happy Hours', count: 234 }
    ],
    timeOfDay: { morning: 2200, afternoon: 2480, evening: 2440 },
    gender: { male: 46, female: 49, other: 5 },
    tiers: { vvip: 100, vip: 320, gold: 560, silver: 720, bronze: 550 },
    behaviour: { newCount: 350, returning: 1900, active: 2250, inactive: 480 }
  },
  {
    name: 'Delhi',
    subtitle: '5 branches · last 30 days',
    uniqueVisitors: 1700,
    recordedVisits: 5100,
    newCustomers: 260,
    returning: 1440,
    topCampaigns: [
      { name: 'Coffee Club', count: 320 },
      { name: 'Monsoon Offer', count: 250 },
      { name: 'BOGO Burgers', count: 184 }
    ],
    timeOfDay: { morning: 1480, afternoon: 1750, evening: 1870 },
    gender: { male: 44, female: 51, other: 5 },
    tiers: { vvip: 70, vip: 250, gold: 410, silver: 550, bronze: 420 },
    behaviour: { newCount: 260, returning: 1440, active: 1700, inactive: 400 }
  },
  {
    name: 'Maharashtra',
    subtitle: '4 branches · last 30 days',
    uniqueVisitors: 1450,
    recordedVisits: 4200,
    newCustomers: 220,
    returning: 1230,
    topCampaigns: [
      { name: 'Happy Hours', count: 260 },
      { name: 'Birthday Special', count: 220 },
      { name: 'Weekend Treat', count: 195 }
    ],
    timeOfDay: { morning: 1260, afternoon: 1390, evening: 1550 },
    gender: { male: 47, female: 48, other: 5 },
    tiers: { vvip: 65, vip: 210, gold: 360, silver: 460, bronze: 355 },
    behaviour: { newCount: 220, returning: 1230, active: 1450, inactive: 380 }
  },
  {
    name: 'Karnataka',
    subtitle: '4 branches · last 30 days',
    uniqueVisitors: 1150,
    recordedVisits: 3100,
    newCustomers: 180,
    returning: 970,
    topCampaigns: [
      { name: 'Student Special', count: 190 },
      { name: 'South Indian Fest', count: 165 },
      { name: 'Combo Meals', count: 140 }
    ],
    timeOfDay: { morning: 940, afternoon: 1010, evening: 1150 },
    gender: { male: 49, female: 46, other: 5 },
    tiers: { vvip: 40, vip: 160, gold: 280, silver: 370, bronze: 300 },
    behaviour: { newCount: 180, returning: 970, active: 1150, inactive: 300 }
  }
];

const CITIES_BY_STATE: Record<string, LocationAnalyticsItem[]> = {
  'Uttar Pradesh': [
    {
      name: 'Noida',
      subtitle: '3 branches · last 30 days',
      uniqueVisitors: 1240,
      recordedVisits: 3680,
      newCustomers: 180,
      returning: 1060,
      topCampaigns: [
        { name: 'Welcome Special', count: 245 },
        { name: 'Weekend Treat', count: 182 },
        { name: 'Happy Hours', count: 124 }
      ],
      timeOfDay: { morning: 1100, afternoon: 1250, evening: 1330 },
      gender: { male: 45, female: 50, other: 5 },
      tiers: { vvip: 60, vip: 180, gold: 300, silver: 400, bronze: 300 },
      behaviour: { newCount: 180, returning: 1060, active: 1240, inactive: 260 }
    },
    {
      name: 'Lucknow',
      subtitle: '2 branches · last 30 days',
      uniqueVisitors: 760,
      recordedVisits: 2120,
      newCustomers: 110,
      returning: 650,
      topCampaigns: [
        { name: 'Welcome Special', count: 160 },
        { name: 'Weekend Treat', count: 110 },
        { name: 'Birthday Special', count: 90 }
      ],
      timeOfDay: { morning: 650, afternoon: 720, evening: 750 },
      gender: { male: 50, female: 45, other: 5 },
      tiers: { vvip: 25, vip: 100, gold: 190, silver: 245, bronze: 200 },
      behaviour: { newCount: 110, returning: 650, active: 760, inactive: 160 }
    },
    {
      name: 'Kanpur',
      subtitle: '2 branches · last 30 days',
      uniqueVisitors: 480,
      recordedVisits: 1320,
      newCustomers: 75,
      returning: 405,
      topCampaigns: [
        { name: 'Weekend Treat', count: 95 },
        { name: 'Welcome Special', count: 80 },
        { name: 'Happy Hours', count: 70 }
      ],
      timeOfDay: { morning: 450, afternoon: 510, evening: 360 },
      gender: { male: 43, female: 51, other: 6 },
      tiers: { vvip: 15, vip: 60, gold: 120, silver: 145, bronze: 140 },
      behaviour: { newCount: 75, returning: 405, active: 480, inactive: 110 }
    }
  ],
  Delhi: [
    {
      name: 'New Delhi',
      subtitle: '3 branches · last 30 days',
      uniqueVisitors: 1120,
      recordedVisits: 3420,
      newCustomers: 170,
      returning: 950,
      topCampaigns: [
        { name: 'Coffee Club', count: 210 },
        { name: 'Monsoon Offer', count: 165 },
        { name: 'BOGO Burgers', count: 120 }
      ],
      timeOfDay: { morning: 980, afternoon: 1140, evening: 1300 },
      gender: { male: 45, female: 50, other: 5 },
      tiers: { vvip: 48, vip: 162, gold: 270, silver: 360, bronze: 280 },
      behaviour: { newCount: 170, returning: 950, active: 1120, inactive: 240 }
    },
    {
      name: 'South Delhi',
      subtitle: '2 branches · last 30 days',
      uniqueVisitors: 580,
      recordedVisits: 1680,
      newCustomers: 90,
      returning: 490,
      topCampaigns: [
        { name: 'Coffee Club', count: 110 },
        { name: 'Weekend Treat', count: 85 },
        { name: 'Happy Hours', count: 64 }
      ],
      timeOfDay: { morning: 500, afternoon: 610, evening: 570 },
      gender: { male: 42, female: 53, other: 5 },
      tiers: { vvip: 22, vip: 88, gold: 140, silver: 190, bronze: 140 },
      behaviour: { newCount: 90, returning: 490, active: 580, inactive: 160 }
    }
  ],
  Maharashtra: [
    {
      name: 'Mumbai',
      subtitle: '2 branches · last 30 days',
      uniqueVisitors: 890,
      recordedVisits: 2640,
      newCustomers: 140,
      returning: 750,
      topCampaigns: [
        { name: 'Happy Hours', count: 168 },
        { name: 'Birthday Special', count: 142 },
        { name: 'Weekend Treat', count: 118 }
      ],
      timeOfDay: { morning: 760, afternoon: 880, evening: 1000 },
      gender: { male: 48, female: 47, other: 5 },
      tiers: { vvip: 42, vip: 135, gold: 220, silver: 285, bronze: 208 },
      behaviour: { newCount: 140, returning: 750, active: 890, inactive: 220 }
    },
    {
      name: 'Pune',
      subtitle: '2 branches · last 30 days',
      uniqueVisitors: 560,
      recordedVisits: 1560,
      newCustomers: 80,
      returning: 480,
      topCampaigns: [
        { name: 'Student Special', count: 112 },
        { name: 'Happy Hours', count: 92 },
        { name: 'Weekend Treat', count: 77 }
      ],
      timeOfDay: { morning: 500, afternoon: 510, evening: 550 },
      gender: { male: 46, female: 49, other: 5 },
      tiers: { vvip: 23, vip: 75, gold: 140, silver: 175, bronze: 147 },
      behaviour: { newCount: 80, returning: 480, active: 560, inactive: 160 }
    }
  ],
  Karnataka: [
    {
      name: 'Bengaluru',
      subtitle: '4 branches · last 30 days',
      uniqueVisitors: 1150,
      recordedVisits: 3100,
      newCustomers: 180,
      returning: 970,
      topCampaigns: [
        { name: 'Student Special', count: 190 },
        { name: 'South Indian Fest', count: 165 },
        { name: 'Combo Meals', count: 140 }
      ],
      timeOfDay: { morning: 940, afternoon: 1010, evening: 1150 },
      gender: { male: 49, female: 46, other: 5 },
      tiers: { vvip: 40, vip: 160, gold: 280, silver: 370, bronze: 300 },
      behaviour: { newCount: 180, returning: 970, active: 1150, inactive: 300 }
    }
  ]
};

const BRANCHES_BY_CITY: Record<string, LocationAnalyticsItem[]> = {
  Noida: [
    {
      name: 'Noida — Sector 18',
      subtitle: 'Sector 18, Noida · Manager: Rohit Mehta',
      address: 'Sector 18, Noida',
      manager: 'Rohit Mehta',
      status: 'Active',
      uniqueVisitors: 640,
      recordedVisits: 1820,
      newCustomers: 90,
      returning: 550,
      topCampaigns: [
        { name: 'Welcome Special', count: 86 },
        { name: 'Weekend Treat', count: 62 },
        { name: 'Happy Hours', count: 45 }
      ],
      timeOfDay: { morning: 520, afternoon: 610, evening: 690 },
      gender: { male: 45, female: 50, other: 5 },
      tiers: { vvip: 30, vip: 90, gold: 150, silver: 220, bronze: 150 },
      behaviour: { newCount: 90, returning: 550, active: 640, inactive: 110 }
    },
    {
      name: 'Noida — Sector 62',
      subtitle: 'Sector 62, Noida · Manager: Priya Sharma',
      address: 'Sector 62, Noida',
      manager: 'Priya Sharma',
      status: 'Active',
      uniqueVisitors: 520,
      recordedVisits: 1440,
      newCustomers: 65,
      returning: 455,
      topCampaigns: [
        { name: 'Welcome Special', count: 100 },
        { name: 'Weekend Treat', count: 80 },
        { name: 'Happy Hours', count: 50 }
      ],
      timeOfDay: { morning: 430, afternoon: 490, evening: 520 },
      gender: { male: 48, female: 47, other: 5 },
      tiers: { vvip: 20, vip: 80, gold: 130, silver: 160, bronze: 130 },
      behaviour: { newCount: 65, returning: 455, active: 520, inactive: 100 }
    },
    {
      name: 'Noida — Expressway',
      subtitle: 'Noida Expressway · Manager: Arjun Patel',
      address: 'Noida Expressway',
      manager: 'Arjun Patel',
      status: 'Inactive',
      uniqueVisitors: 320,
      recordedVisits: 420,
      newCustomers: 45,
      returning: 275,
      topCampaigns: [
        { name: 'Welcome Special', count: 59 },
        { name: 'Weekend Treat', count: 40 },
        { name: 'Happy Hours', count: 29 }
      ],
      timeOfDay: { morning: 150, afternoon: 150, evening: 120 },
      gender: { male: 38, female: 56, other: 6 },
      tiers: { vvip: 15, vip: 45, gold: 75, silver: 95, bronze: 90 },
      behaviour: { newCount: 45, returning: 275, active: 320, inactive: 85 }
    }
  ],
  Lucknow: [
    {
      name: 'Lucknow — Gomti Nagar',
      subtitle: 'Gomti Nagar, Lucknow · Manager: Vikram Singh',
      address: 'Gomti Nagar, Lucknow',
      manager: 'Vikram Singh',
      status: 'Active',
      uniqueVisitors: 440,
      recordedVisits: 1280,
      newCustomers: 65,
      returning: 375,
      topCampaigns: [
        { name: 'Welcome Special', count: 96 },
        { name: 'Weekend Treat', count: 68 },
        { name: 'Birthday Special', count: 52 }
      ],
      timeOfDay: { morning: 380, afternoon: 440, evening: 460 },
      gender: { male: 51, female: 44, other: 5 },
      tiers: { vvip: 15, vip: 60, gold: 110, silver: 145, bronze: 110 },
      behaviour: { newCount: 65, returning: 375, active: 440, inactive: 90 }
    },
    {
      name: 'Lucknow — Hazratganj',
      subtitle: 'Hazratganj, Lucknow · Manager: Ananya Verma',
      address: 'Hazratganj, Lucknow',
      manager: 'Ananya Verma',
      status: 'Active',
      uniqueVisitors: 320,
      recordedVisits: 840,
      newCustomers: 45,
      returning: 275,
      topCampaigns: [
        { name: 'Welcome Special', count: 64 },
        { name: 'Weekend Treat', count: 42 },
        { name: 'Birthday Special', count: 38 }
      ],
      timeOfDay: { morning: 270, afternoon: 280, evening: 290 },
      gender: { male: 49, female: 46, other: 5 },
      tiers: { vvip: 10, vip: 40, gold: 80, silver: 100, bronze: 90 },
      behaviour: { newCount: 45, returning: 275, active: 320, inactive: 70 }
    }
  ],
  Kanpur: [
    {
      name: 'Kanpur — Civil Lines',
      subtitle: 'Civil Lines, Kanpur · Manager: Rahul Tiwari',
      address: 'Civil Lines, Kanpur',
      manager: 'Rahul Tiwari',
      status: 'Active',
      uniqueVisitors: 480,
      recordedVisits: 1320,
      newCustomers: 75,
      returning: 405,
      topCampaigns: [
        { name: 'Weekend Treat', count: 95 },
        { name: 'Welcome Special', count: 80 },
        { name: 'Happy Hours', count: 70 }
      ],
      timeOfDay: { morning: 450, afternoon: 510, evening: 360 },
      gender: { male: 43, female: 51, other: 6 },
      tiers: { vvip: 15, vip: 60, gold: 120, silver: 145, bronze: 140 },
      behaviour: { newCount: 75, returning: 405, active: 480, inactive: 110 }
    }
  ]
};

export const TabletCustomersView: React.FC<TabletCustomersViewProps> = ({
  initialCustomerId = null,
  onBackToList
}) => {
  // Primary customer sub-views matching all 10 Figma iPad Pro screens:
  // 'insights' (79) | 'states' (76) | 'cities' (78) | 'branches' (77) | 'directory' (65) | 'profile' (66-69) | 'gift_points' (70)
  const [activeView, setActiveView] = useState<
    'insights' | 'states' | 'cities' | 'branches' | 'directory' | 'profile' | 'gift_points'
  >(initialCustomerId ? 'profile' : 'insights');

  const [customers, setCustomers] = useState<TabletCustomerItem[]>(INITIAL_TABLET_CUSTOMERS);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    initialCustomerId || INITIAL_TABLET_CUSTOMERS[0].id
  );
  const [profileTab, setProfileTab] = useState<'overview' | 'campaigns' | 'activity' | 'wallet'>('overview');

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Insights state
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [trendRange, setTrendRange] = useState<'6m' | '3m' | '12m'>('6m');

  // Location drilldown state
  const [selectedState, setSelectedState] = useState('Uttar Pradesh');
  const [selectedCity, setSelectedCity] = useState('Noida');
  const [locationSearch, setLocationSearch] = useState('');

  // Directory state (65.png)
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'All' | 'VVIP' | 'VIP' | 'Gold' | 'Silver' | 'Bronze'>('All');
  const [branchFilter, setBranchFilter] = useState('All Branches');
  const [activityFilter, setActivityFilter] = useState('All Activity');
  const [joinDateFilter, setJoinDateFilter] = useState('Join Date');
  const [walletStatusFilter, setWalletStatusFilter] = useState('Wallet Status');

  // Profile sub-states (66-69.png)
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [campaignFilter, setCampaignFilter] = useState<'All' | 'Available' | 'Locked' | 'Used' | 'Expired'>('All');
  const [activitySubFilter, setActivitySubFilter] = useState<'All' | 'Visits' | 'Orders' | 'Campaigns' | 'Rewards'>('All');
  const [walletTxFilter, setWalletTxFilter] = useState<'All' | 'points' | 'cashback'>('All');
  const [blockedCustomerIds, setBlockedCustomerIds] = useState<string[]>([]);

  // Gift Points screen state (70.png)
  const [giftPointsInput, setGiftPointsInput] = useState('200');
  const [giftReason, setGiftReason] = useState('Birthday Gift');
  const [giftNote, setGiftNote] = useState('Thank you for being a loyal customer!');
  const [giftExpiry, setGiftExpiry] = useState('');

  const activeCustomer = useMemo(
    () => customers.find((c) => c.id === selectedCustomerId || c.customerId === selectedCustomerId) || customers[0],
    [customers, selectedCustomerId]
  );

  const isBlocked = blockedCustomerIds.includes(activeCustomer.id);

  // Reusable Multi-Segment SVG Donut helper
  const renderDonut = (
    segments: { value: number; color: string }[],
    size: number,
    stroke: number,
    centerTitle?: string,
    centerSub?: string
  ) => {
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const total = segments.reduce((acc, s) => acc + s.value, 0) || 1;
    let offset = 0;

    return (
      <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#F3EEFA" strokeWidth={stroke} />
          {segments.map((seg, idx) => {
            const len = (seg.value / total) * circumference;
            const dashOffset = -offset;
            offset += len;
            if (seg.value <= 0) return null;
            return (
              <circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={stroke}
                strokeDasharray={`${len} ${circumference}`}
                strokeDashoffset={dashOffset}
              />
            );
          })}
        </svg>
        {centerTitle && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-lg font-black text-[#1E1548] leading-none">{centerTitle}</span>
            {centerSub && <span className="text-[10px] font-semibold text-[#8C84A0] mt-1">{centerSub}</span>}
          </div>
        )}
      </div>
    );
  };

  // Tier Badge Renderer matching Figma
  const renderTierBadge = (tier: string) => {
    switch (tier) {
      case 'VVIP':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF1F2] text-[#E11D48] border border-[#FECDD3]">VVIP</span>;
      case 'VIP':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FEFCE8] text-[#B45309] border border-[#FEF08A]">VIP</span>;
      case 'Gold':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]">Gold</span>;
      case 'Silver':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]">Silver</span>;
      case 'Bronze':
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF7ED] text-[#C2410C] border border-[#FED7AA]">Bronze</span>;
    }
  };

  // Filtered Directory Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesQ =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.customerId.toLowerCase().includes(q);
      const matchesTier = tierFilter === 'All' || c.tier === tierFilter;
      const matchesBranch =
        branchFilter === 'All Branches' ||
        c.preferredBranch.toLowerCase().includes(branchFilter.toLowerCase()) ||
        c.city.toLowerCase().includes(branchFilter.toLowerCase());
      const matchesActivity =
        activityFilter === 'All Activity' ||
        (activityFilter === 'Frequent (20+ visits)' && c.visits >= 20) ||
        (activityFilter === 'High Spend (₹20k+)' && c.lifetimeSpend >= 20000);
      const matchesWallet =
        walletStatusFilter === 'Wallet Status' ||
        (walletStatusFilter === 'Has Cashback' && c.cashback > 0) ||
        (walletStatusFilter === '1,000+ Points' && c.points >= 1000);
      return matchesQ && matchesTier && matchesBranch && matchesActivity && matchesWallet;
    });
  }, [customers, searchQuery, tierFilter, branchFilter, activityFilter, walletStatusFilter]);

  const openCustomerProfile = (id: string, tab: 'overview' | 'campaigns' | 'activity' | 'wallet' = 'overview') => {
    setSelectedCustomerId(id);
    setProfileTab(tab);
    setIsMoreActionsOpen(false);
    setIsEditingNote(false);
    setIsEditingPersonal(false);
    setActiveView('profile');
  };

  const handleConfirmGiftPoints = () => {
    const pts = Math.max(0, parseInt(giftPointsInput, 10) || 0);
    if (pts <= 0) {
      triggerToast('Enter a valid point amount greater than 0');
      return;
    }

    const newTx: TabletCustomerWalletTx = {
      id: `tx-gift-${Date.now()}`,
      title: 'Gifted Reward Points',
      subtitle: `By Merchant (${giftReason}) • Today`,
      value: `+${pts} pts`,
      isPositive: true,
      type: 'points'
    };

    const newAct: TabletCustomerActivity = {
      id: `act-gift-${Date.now()}`,
      type: 'points',
      title: `Received ${pts} Gifted Points`,
      subtitle: `${activeCustomer.preferredBranch} • Just now • ${giftReason}`,
      value: `+${pts} pts`,
      valueType: 'positive'
    };

    setCustomers((prev) =>
      prev.map((c) =>
        c.id === activeCustomer.id
          ? {
              ...c,
              points: c.points + pts,
              walletTransactions: [newTx, ...c.walletTransactions],
              activities: [newAct, ...c.activities]
            }
          : c
      )
    );

    setActiveView('profile');
    setProfileTab('wallet');
    triggerToast(`+${pts} reward points credited to ${activeCustomer.name}'s wallet!`);
  };

  // Reusable Location Analytics Card (used for States 76.png & Cities 78.png)
  const renderLocationAnalyticsCard = (item: LocationAnalyticsItem, onClick: () => void) => (
    <div
      key={item.name}
      onClick={onClick}
      className="bg-white rounded-3xl p-4 sm:p-5 border border-[#DFD4F7] hover:border-[#5844A8] shadow-2xs hover:shadow-sm transition-all cursor-pointer space-y-4"
    >
      {/* Title Row */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-base font-black text-[#1E1548]">{item.name}</div>
          <div className="text-[11px] font-semibold text-[#8C84A0] mt-0.5">{item.subtitle}</div>
        </div>
        <ChevronRight className="w-4 h-4 text-[#8C84A0] mt-1 shrink-0" />
      </div>

      {/* 4 Tinted KPI Tiles */}
      <div className="grid grid-cols-4 gap-2">
        <div className="p-2.5 rounded-2xl bg-[#F8F5FF] border border-[#EFE9FC]">
          <div className="text-sm sm:text-base font-black text-[#1E1548]">{item.uniqueVisitors.toLocaleString()}</div>
          <div className="text-[9.5px] font-semibold text-[#7B748C] mt-0.5 leading-tight">Unique visitors</div>
        </div>
        <div className="p-2.5 rounded-2xl bg-[#F4F8FF] border border-[#E6EEFE]">
          <div className="text-sm sm:text-base font-black text-[#1E1548]">{item.recordedVisits.toLocaleString()}</div>
          <div className="text-[9.5px] font-semibold text-[#7B748C] mt-0.5 leading-tight">Recorded visits</div>
        </div>
        <div className="p-2.5 rounded-2xl bg-[#FFF8F3] border border-[#FDECE0]">
          <div className="text-sm sm:text-base font-black text-[#1E1548]">{item.newCustomers.toLocaleString()}</div>
          <div className="text-[9.5px] font-semibold text-[#7B748C] mt-0.5 leading-tight">New</div>
        </div>
        <div className="p-2.5 rounded-2xl bg-[#F6F5FF] border border-[#EAE8FD]">
          <div className="text-sm sm:text-base font-black text-[#1E1548]">{item.returning.toLocaleString()}</div>
          <div className="text-[9.5px] font-semibold text-[#7B748C] mt-0.5 leading-tight">Returning</div>
        </div>
      </div>

      {/* Top 3 Campaigns + Visits by Time of Day */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-black text-[#1E1548] flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-500" /> Top 3 Campaigns
            </span>
            <span className="text-[#9890A8] font-medium">Redemptions</span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            {item.topCampaigns.map((c, idx) => (
              <div key={c.name} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 font-semibold text-[#5E5870] truncate">
                  <span className="w-4 h-4 rounded-full bg-[#FDE8F0] text-[#E11D48] text-[9px] font-black flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="truncate">{c.name}</span>
                </span>
                <span className="font-black text-[#1E1548] shrink-0">{c.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-[10px] font-black text-[#1E1548] flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#8C84A0]" /> Visits by Time of Day
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-center">
            <div className="p-2 rounded-xl bg-[#F7F5FF] border border-[#ECE7FC]">
              <Sun className="w-3 h-3 text-[#7C3AED] mx-auto" />
              <div className="text-[11px] font-black text-[#1E1548] mt-1">{item.timeOfDay.morning.toLocaleString()}</div>
              <div className="text-[8.5px] font-semibold text-[#8C84A0]">Morning</div>
            </div>
            <div className="p-2 rounded-xl bg-[#FFF4F7] border border-[#FCE1E9]">
              <Sun className="w-3 h-3 text-[#EC4899] mx-auto" />
              <div className="text-[11px] font-black text-[#1E1548] mt-1">{item.timeOfDay.afternoon.toLocaleString()}</div>
              <div className="text-[8.5px] font-semibold text-[#8C84A0]">Afternoon</div>
            </div>
            <div className="p-2 rounded-xl bg-[#F4F6FF] border border-[#E5EAFF]">
              <Moon className="w-3 h-3 text-[#4F46E5] mx-auto" />
              <div className="text-[11px] font-black text-[#1E1548] mt-1">{item.timeOfDay.evening.toLocaleString()}</div>
              <div className="text-[8.5px] font-semibold text-[#8C84A0]">Evening</div>
            </div>
          </div>
        </div>
      </div>

      {/* Visitor Gender Donut + Loyalty Tiers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-[#F4F0FA]">
        <div className="space-y-2">
          <div className="text-[10px] font-black text-[#1E1548]">
            Visitor Gender <span className="font-medium text-[#9890A8]">· recorded visits</span>
          </div>
          <div className="flex items-center gap-3">
            {renderDonut(
              [
                { value: item.gender.male, color: '#240B4C' },
                { value: item.gender.female, color: '#EC4899' },
                { value: item.gender.other, color: '#CBD5E1' }
              ],
              52,
              8
            )}
            <div className="flex-1 space-y-1 text-[10px]">
              <div className="flex justify-between"><span className="flex items-center gap-1 text-[#5E5870] font-semibold"><span className="w-1.5 h-1.5 rounded-full bg-[#240B4C]" /> Male</span><span className="font-black text-[#1E1548]">{item.gender.male}%</span></div>
              <div className="flex justify-between"><span className="flex items-center gap-1 text-[#5E5870] font-semibold"><span className="w-1.5 h-1.5 rounded-full bg-[#EC4899]" /> Female</span><span className="font-black text-[#1E1548]">{item.gender.female}%</span></div>
              <div className="flex justify-between"><span className="flex items-center gap-1 text-[#5E5870] font-semibold"><span className="w-1.5 h-1.5 rounded-full bg-[#CBD5E1]" /> Other</span><span className="font-black text-[#1E1548]">{item.gender.other}%</span></div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-[10px] font-black text-[#1E1548]">
            Loyalty Tiers <span className="font-medium text-[#9890A8]">· unique</span>
          </div>
          <div className="grid grid-cols-5 gap-1 text-center">
            {[
              { label: 'VVIP', val: item.tiers.vvip },
              { label: 'VIP', val: item.tiers.vip },
              { label: 'GOLD', val: item.tiers.gold },
              { label: 'SILV', val: item.tiers.silver },
              { label: 'BRZ', val: item.tiers.bronze }
            ].map((t) => (
              <div key={t.label} className="py-1.5 px-1 rounded-lg bg-[#F8F6FC] border border-[#EFEAF7]">
                <div className="text-[10px] font-black text-[#1E1548]">{t.val}</div>
                <div className="text-[7.5px] font-bold text-[#8C84A0]">{t.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Behaviour Bottom Strip */}
      <div className="pt-2 border-t border-[#F4F0FA] space-y-1.5">
        <div className="text-[10px] font-black text-[#1E1548]">Customer Behaviour</div>
        <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
          <div className="py-1.5 px-1 rounded-xl bg-[#F8F6FC]"><strong className="text-[#1E1548]">{item.behaviour.newCount}</strong> <span className="text-[#8C84A0]">New</span></div>
          <div className="py-1.5 px-1 rounded-xl bg-[#F8F6FC]"><strong className="text-[#1E1548]">{item.behaviour.returning.toLocaleString()}</strong> <span className="text-[#8C84A0]">Ret</span></div>
          <div className="py-1.5 px-1 rounded-xl bg-[#F8F6FC]"><strong className="text-[#1E1548]">{item.behaviour.active.toLocaleString()}</strong> <span className="text-[#8C84A0]">Active</span></div>
          <div className="py-1.5 px-1 rounded-xl bg-[#F8F6FC]"><strong className="text-[#1E1548]">{item.behaviour.inactive}</strong> <span className="text-[#8C84A0]">Inact</span></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#FAF8FF] text-[#1E1548] flex flex-col font-sans pb-4 lg:pb-8 relative">
      {/* Floating Toast */}
      {toastMsg && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 bg-[#240B4C] text-white px-4 py-2.5 rounded-2xl shadow-lg border border-purple-400/20 flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Tablet Navigation Header (Loyaltics hidden on mobile, visible on tablet md+) */}
      <div className="bg-white/95 backdrop-blur-md border-b border-[#EFEAF7] px-3.5 sm:px-6 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-2.5 md:sticky md:top-0 z-20 shadow-2xs">
        <div className="hidden md:flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-[#5844A8] to-[#EC4899] flex items-center justify-center text-white shadow-xs shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-black text-[#1E1548] flex items-center gap-1.5">
              <span>Loyaltics</span>
              <span className="text-[10px] bg-[#F3EEFA] text-[#5844A8] px-2 py-0.5 rounded-full font-bold">
                Merchant App
              </span>
            </div>
            <div className="text-[10px] text-[#8C84A0] font-bold">
              {activeView === 'insights' && 'Customer Insights & Loyalty Analytics'}
              {activeView === 'states' && 'Customers by State Coverage'}
              {activeView === 'cities' && `Cities in ${selectedState}`}
              {activeView === 'branches' && `Branches in ${selectedCity}`}
              {activeView === 'directory' && 'Customer Directory & Member Profiles'}
              {activeView === 'profile' && `${activeCustomer.name} • Customer Profile`}
              {activeView === 'gift_points' && `Gift Reward Points • ${activeCustomer.name}`}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-2">
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none bg-white border border-[#E5DEF5] rounded-xl pl-3 pr-8 py-1.5 text-xs font-bold text-[#1E1548] outline-none cursor-pointer shadow-2xs"
            >
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 90 Days">Last 90 Days</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#8C84A0] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={() => triggerToast('Customer analytics report downloaded (PDF)')}
            className="px-3.5 py-1.5 sm:py-2 bg-[#240B4C] hover:bg-[#321266] text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Pills Bar (Insights | Directory | By Location) — keeps 1 common tablet bottom bar */}
      <div className="bg-white border-b border-[#EFEAF7] px-3.5 sm:px-6 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'insights', label: 'Customer Insights', icon: BarChart2, active: activeView === 'insights' },
          { id: 'directory', label: 'Customer Directory', icon: Users, active: activeView === 'directory' || activeView === 'profile' || activeView === 'gift_points' },
          { id: 'states', label: 'By Location', icon: MapPin, active: activeView === 'states' || activeView === 'cities' || activeView === 'branches' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setLocationSearch('');
              setActiveView(tab.id as any);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              tab.active
                ? 'bg-[#5844A8] text-white shadow-xs'
                : 'bg-[#F8F6FC] text-[#6B657E] hover:text-[#1E1548] hover:bg-[#EFEAF7]'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content Container */}
      <div className="flex-1 p-3.5 sm:p-5 md:p-6 max-w-[1400px] mx-auto w-full">
        {/* ================================================================= */}
        {/* SCREEN 1: CUSTOMER INSIGHTS (iPad Pro 12.9_ - 79.png)             */}
        {/* ================================================================= */}
        {activeView === 'insights' && (
          <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#1E1548] tracking-tight">Customer Insights</h1>
              <p className="text-xs text-[#7B748C] mt-0.5">
                Track customer engagement, loyalty and repeat visits across all branches.
              </p>
            </div>

            {/* 4 KPI Cards (md:grid-cols-4) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-3.5">
              {[
                { label: 'Total Customers', value: '2,482', delta: '↑ 12%', icon: Users, iconBg: 'bg-[#F3EEFA] text-[#5844A8]' },
                { label: 'Active Customers', value: '1,320', delta: '↑ 8%', icon: Zap, iconBg: 'bg-pink-50 text-pink-600' },
                { label: 'Repeat Customers', value: '640', delta: '↑ 10%', icon: RefreshCw, iconBg: 'bg-sky-50 text-sky-600' },
                { label: 'Avg Visits / Customer', value: '3.8', delta: '↑ 9%', icon: BarChart2, iconBg: 'bg-[#F3EEFA] text-[#5844A8]' }
              ].map((kpi) => (
                <div key={kpi.label} className="bg-white p-4 rounded-2xl border border-[#EFEAF7] shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between gap-2 text-[#7B748C]">
                    <span className="text-[11px] font-bold truncate">{kpi.label}</span>
                    <span className={`p-1.5 rounded-xl shrink-0 ${kpi.iconBg}`}>
                      <kpi.icon className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="text-xl sm:text-2xl font-black text-[#1E1548] leading-tight">{kpi.value}</div>
                    <div className="text-[10px] font-bold text-emerald-600 mt-1">
                      {kpi.delta} <span className="text-[#9890A8] font-medium">vs. previous period</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Explore Customers by Location Card */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF1F5] text-[#EC4899] flex items-center justify-center shrink-0 border border-[#FCE1E9]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-black text-[#1E1548]">Explore Customers by Location</h2>
                    <p className="text-xs text-[#7B748C]">Understand customer behaviour across states, cities and branches.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveView('states')}
                  className="self-start sm:self-auto px-4 py-2 bg-[#240B4C] hover:bg-[#321266] text-white rounded-full text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
                >
                  <span>Explore Locations</span>
                  <span>→</span>
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setActiveView('states')}
                  className="p-3.5 rounded-2xl bg-[#FAF8FF] hover:bg-[#F3EEFA] border border-[#EFEAF7] flex items-center gap-3 text-left cursor-pointer transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#E5DAF9] text-[#5844A8] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-base font-black text-[#1E1548] leading-none">4</div>
                    <div className="text-[11px] font-semibold text-[#7B748C] mt-1">States</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveView('cities')}
                  className="p-3.5 rounded-2xl bg-[#FAF8FF] hover:bg-[#F3EEFA] border border-[#EFEAF7] flex items-center gap-3 text-left cursor-pointer transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#E5DAF9] text-[#7C3AED] flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-base font-black text-[#1E1548] leading-none">12</div>
                    <div className="text-[11px] font-semibold text-[#7B748C] mt-1">Cities</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveView('branches')}
                  className="p-3.5 rounded-2xl bg-[#FAF8FF] hover:bg-[#F3EEFA] border border-[#EFEAF7] flex items-center gap-3 text-left cursor-pointer transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#E5DAF9] text-[#EC4899] flex items-center justify-center shrink-0">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-base font-black text-[#1E1548] leading-none">21</div>
                    <div className="text-[11px] font-semibold text-[#7B748C] mt-1">Branches</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setBranchFilter('Noida – Sector 18');
                    setActiveView('directory');
                  }}
                  className="p-3.5 rounded-2xl bg-[#FFFDF9] hover:bg-[#FFF7ED] border border-[#F3E5D8] flex items-center justify-between gap-2 text-left cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[#9A3412] text-white font-black text-[10px] flex items-center justify-center shrink-0">
                      BR
                    </div>
                    <div className="min-w-0">
                      <div className="text-[8.5px] font-extrabold uppercase tracking-wider text-[#9890A8] truncate">
                        Most Engaged Branch
                      </div>
                      <div className="text-xs font-black text-[#1E1548] truncate">Noida – Sector 18</div>
                      <div className="text-[9.5px] text-[#7B748C] truncate">640 customers · 1,820 visits</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8C84A0] shrink-0" />
                </button>
              </div>
            </div>

            {/* Row 3: Customer Tier Distribution & Repeat Customer Trend */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: Customer Tier Distribution */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs flex flex-col justify-between gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-black text-[#1E1548]">Customer Tier Distribution</h3>
                  <button
                    type="button"
                    onClick={() => setActiveView('directory')}
                    className="text-xs font-bold text-[#5844A8] hover:underline cursor-pointer"
                  >
                    View Details →
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5 pt-1">
                  {renderDonut(
                    [
                      { value: 120, color: '#E11D48' },
                      { value: 370, color: '#EC4899' },
                      { value: 620, color: '#F59E0B' },
                      { value: 830, color: '#8A94A6' },
                      { value: 542, color: '#6366F1' }
                    ],
                    136,
                    18,
                    '2,482',
                    'Customers'
                  )}

                  <div className="flex-1 w-full space-y-2 text-xs">
                    {[
                      { label: 'VVIP', count: '120', pct: '5%', dot: 'bg-[#E11D48]' },
                      { label: 'VIP', count: '370', pct: '15%', dot: 'bg-[#EC4899]' },
                      { label: 'Gold', count: '620', pct: '25%', dot: 'bg-[#F59E0B]' },
                      { label: 'Silver', count: '830', pct: '33%', dot: 'bg-[#8A94A6]' },
                      { label: 'Bronze', count: '542', pct: '22%', dot: 'bg-[#6366F1]' }
                    ].map((t) => (
                      <div key={t.label} className="flex items-center justify-between">
                        <span className="flex items-center gap-2 font-bold text-[#5E5870]">
                          <span className={`w-2.5 h-2.5 rounded-full ${t.dot}`} />
                          {t.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-[#1E1548]">{t.count}</span>
                          <span className="text-[#9890A8] text-[11px] font-bold w-8 text-right">{t.pct}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Repeat Customer Trend */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs flex flex-col justify-between gap-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm sm:text-base font-black text-[#1E1548]">Repeat Customer Trend</h3>
                  <button
                    type="button"
                    onClick={() => setTrendRange((prev) => (prev === '6m' ? '3m' : prev === '3m' ? '12m' : '6m'))}
                    className="px-2.5 py-1 rounded-xl border border-[#EFEAF7] text-[11px] font-bold text-[#5E5870] hover:border-[#5844A8]/40 flex items-center gap-1 bg-white cursor-pointer"
                  >
                    <span>
                      {trendRange === '6m' ? 'Last 6 Months' : trendRange === '3m' ? 'Last 3 Months' : 'Last 12 Months'}
                    </span>
                    <ChevronDown className="w-3 h-3 text-[#8C84A0]" />
                  </button>
                </div>

                <div className="flex items-stretch gap-2.5 h-44 pt-2">
                  <div className="flex flex-col justify-between text-[10px] font-bold text-[#9890A8] pb-5 pr-1 text-right shrink-0">
                    <span>800</span>
                    <span>600</span>
                    <span>400</span>
                    <span>200</span>
                    <span>0</span>
                  </div>
                  <div className="flex-1 relative flex items-end justify-between gap-2.5 px-1">
                    <div className="absolute inset-x-0 top-0 bottom-5 flex flex-col justify-between pointer-events-none">
                      <div className="border-t border-dashed border-[#EFEAF7]" />
                      <div className="border-t border-dashed border-[#EFEAF7]" />
                      <div className="border-t border-dashed border-[#EFEAF7]" />
                      <div className="border-t border-dashed border-[#EFEAF7]" />
                      <div className="border-t border-[#EFEAF7]" />
                    </div>
                    {(trendRange === '3m'
                      ? [
                          { month: 'Aug', count: 580, h: '72%' },
                          { month: 'Sep', count: 620, h: '78%' },
                          { month: 'Oct', count: 640, h: '82%' }
                        ]
                      : trendRange === '12m'
                      ? [
                          { month: 'Q1', count: 400, h: '50%' },
                          { month: 'Q2', count: 500, h: '63%' },
                          { month: 'Q3', count: 590, h: '74%' },
                          { month: 'Oct', count: 640, h: '80%' },
                          { month: 'Nov', count: 700, h: '88%' },
                          { month: 'Dec', count: 760, h: '95%' }
                        ]
                      : [
                          { month: 'May', count: 420, h: '52%' },
                          { month: 'Jun', count: 480, h: '60%' },
                          { month: 'Jul', count: 520, h: '65%' },
                          { month: 'Aug', count: 580, h: '73%' },
                          { month: 'Sep', count: 620, h: '78%' },
                          { month: 'Oct', count: 640, h: '82%' }
                        ]
                    ).map((bar) => (
                      <div key={bar.month} className="relative z-10 flex-1 flex flex-col items-center gap-1 h-full justify-end">
                        <span className="text-[10px] font-extrabold text-[#5E5870]">{bar.count}</span>
                        <div
                          style={{ height: bar.h }}
                          className="w-full max-w-[32px] rounded-t-xl bg-gradient-to-t from-[#F9A8D4]/50 via-[#F472B6] to-[#EC4899] shadow-xs"
                        />
                        <span className="text-[10px] font-bold text-[#7B748C] mt-0.5">{bar.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Row 4: 3-Column Widgets (Top Performing Campaigns | Visits by Time of Day | Gender Distribution) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Top Performing Campaigns */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-[#1E1548]">Top Performing Campaigns</h3>
                  <button
                    type="button"
                    onClick={() => openCustomerProfile(customers[0].id, 'campaigns')}
                    className="text-[11px] font-bold text-[#5844A8] hover:underline cursor-pointer"
                  >
                    View All →
                  </button>
                </div>
                <div className="space-y-2.5">
                  {[
                    { rank: 1, title: 'Birthday Special', sub: '320 redemptions', img: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=100&q=80' },
                    { rank: 2, title: 'Weekend Offer', sub: '280 redemptions', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=100&q=80' },
                    { rank: 3, title: 'Spend ₹500, Get ₹100 Off', sub: '240 redemptions', img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=100&q=80' }
                  ].map((c) => (
                    <div key={c.rank} className="flex items-center gap-2.5">
                      <span className="text-[11px] font-bold text-[#9890A8] w-3 shrink-0">{c.rank}</span>
                      <img src={c.img} alt={c.title} className="w-10 h-10 rounded-xl object-cover shrink-0 border border-[#EFEAF7]" />
                      <div className="min-w-0">
                        <div className="text-xs font-black text-[#1E1548] truncate">{c.title}</div>
                        <div className="text-[10px] text-[#8C84A0] font-semibold">{c.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visits by Time of Day */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs flex flex-col justify-between gap-3">
                <h3 className="text-sm font-black text-[#1E1548]">Visits by Time of Day</h3>
                <div className="grid grid-cols-3 gap-2 flex-1 items-stretch">
                  <div className="p-3 rounded-2xl bg-[#FFFDF2] border border-[#FEF0C7] flex flex-col items-center justify-center text-center">
                    <div className="w-7 h-7 rounded-full bg-[#FEF0C7] text-amber-600 flex items-center justify-center">
                      <Sun className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-sm font-black text-[#1E1548] mt-2">4,520</div>
                    <div className="text-[8.5px] font-bold uppercase text-[#8C84A0] mt-0.5">Morning</div>
                    <div className="text-[10px] font-black text-amber-600 mt-1">36%</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FFF5F7] border border-[#FCE1E9] flex flex-col items-center justify-center text-center">
                    <div className="w-7 h-7 rounded-full bg-[#FCE1E9] text-rose-500 flex items-center justify-center">
                      <Sun className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-sm font-black text-[#1E1548] mt-2">5,180</div>
                    <div className="text-[8.5px] font-bold uppercase text-[#8C84A0] mt-0.5">Afternoon</div>
                    <div className="text-[10px] font-black text-rose-500 mt-1">32%</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#F5F6FF] border border-[#E5E8FF] flex flex-col items-center justify-center text-center">
                    <div className="w-7 h-7 rounded-full bg-[#E5E8FF] text-indigo-600 flex items-center justify-center">
                      <Moon className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-sm font-black text-[#1E1548] mt-2">4,980</div>
                    <div className="text-[8.5px] font-bold uppercase text-[#8C84A0] mt-0.5">Evening</div>
                    <div className="text-[10px] font-black text-indigo-600 mt-1">30%</div>
                  </div>
                </div>
              </div>

              {/* Gender Distribution */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs flex flex-col justify-between gap-3">
                <h3 className="text-sm font-black text-[#1E1548]">Gender Distribution</h3>
                <div className="flex items-center gap-4 my-auto">
                  {renderDonut(
                    [
                      { value: 45, color: '#240B4C' },
                      { value: 49, color: '#EC4899' },
                      { value: 6, color: '#CBD5E1' }
                    ],
                    96,
                    14
                  )}
                  <div className="flex-1 space-y-2 text-xs">
                    <div className="flex justify-between"><span className="flex items-center gap-1.5 font-bold text-[#5E5870]"><span className="w-2 h-2 rounded-full bg-[#240B4C]" /> Male</span><span className="font-black text-[#1E1548]">45%</span></div>
                    <div className="flex justify-between"><span className="flex items-center gap-1.5 font-bold text-[#5E5870]"><span className="w-2 h-2 rounded-full bg-[#EC4899]" /> Female</span><span className="font-black text-[#1E1548]">49%</span></div>
                    <div className="flex justify-between"><span className="flex items-center gap-1.5 font-bold text-[#5E5870]"><span className="w-2 h-2 rounded-full bg-[#CBD5E1]" /> Other</span><span className="font-black text-[#1E1548]">6%</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 5: Recent Customer Activity & Reward & Wallet Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Recent Customer Activity */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-black text-[#1E1548]">Recent Customer Activity</h3>
                  <button
                    type="button"
                    onClick={() => openCustomerProfile(customers[0].id, 'activity')}
                    className="text-xs font-bold text-[#5844A8] hover:underline cursor-pointer"
                  >
                    View All →
                  </button>
                </div>
                <div className="divide-y divide-[#F5F2FA] text-xs">
                  {[
                    { custId: 'cust-1', initials: 'NG', bg: 'bg-purple-100 text-[#5844A8]', name: 'Neha Gupta', action: 'visited Sector 18, Noida', sub: 'Redeemed Birthday Special · 200 pts', time: '2 hours ago' },
                    { custId: 'cust-2', initials: 'RK', bg: 'bg-indigo-100 text-indigo-700', name: 'Rahul Kumar', action: 'visited Expressway, Noida', sub: '3rd visit this month', time: '6 hours ago' },
                    { custId: 'cust-3', initials: 'PS', bg: 'bg-pink-100 text-pink-700', name: 'Priya Singh', action: 'earned 50 reward points', sub: 'Completed a purchase of ₹1,280', time: '4 hours ago' },
                    { custId: 'cust-4', initials: 'KV', bg: 'bg-emerald-100 text-emerald-700', name: 'Karan Verma', action: 'upgraded to Gold Tier', sub: 'Crossed ₹30,000 lifetime spend', time: '1 day ago' }
                  ].map((act, idx) => (
                    <div
                      key={idx}
                      onClick={() => openCustomerProfile(act.custId, 'activity')}
                      className="py-2.5 flex items-center justify-between gap-2.5 hover:bg-[#FAF8FF] -mx-2 px-2 rounded-xl cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-[11px] shrink-0 ${act.bg}`}>
                          {act.initials}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-extrabold text-[#1E1548] truncate">
                            {act.name} <span className="font-medium text-[#7B748C]">{act.action}</span>
                          </div>
                          <div className="text-[10px] text-[#9890A8] truncate">{act.sub}</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#9890A8] font-semibold whitespace-nowrap shrink-0">{act.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reward & Wallet Insights */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between pb-3">
                    <h3 className="text-sm sm:text-base font-black text-[#1E1548]">Reward &amp; Wallet Insights</h3>
                    <button
                      type="button"
                      onClick={() => openCustomerProfile(customers[0].id, 'wallet')}
                      className="text-xs font-bold text-[#5844A8] hover:underline cursor-pointer"
                    >
                      View Details →
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-2xl bg-[#F0FDF4] border border-[#DCFCE7]">
                      <span className="text-[10px] font-bold text-[#6B657E] block">Reward Points Issued</span>
                      <div className="text-lg font-black text-[#1E1548] mt-1">12,560</div>
                      <span className="text-[10px] font-bold text-emerald-600">↑ 10% vs. prev</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#FFF5F7] border border-[#FCE1E9]">
                      <span className="text-[10px] font-bold text-[#6B657E] block">Cashback Issued</span>
                      <div className="text-lg font-black text-[#1E1548] mt-1">₹3,200</div>
                      <span className="text-[10px] font-bold text-emerald-600">↑ 12% vs. prev</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#F5F8FF] border border-[#E5EEFF]">
                      <span className="text-[10px] font-bold text-[#6B657E] block">Cashback Redeemed</span>
                      <div className="text-lg font-black text-[#1E1548] mt-1">₹2,680</div>
                      <span className="text-[10px] font-bold text-emerald-600">↑ 8% vs. prev</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#FAF5FF] border border-[#EFE3FB]">
                      <span className="text-[10px] font-bold text-[#6B657E] block">Active Wallet Users</span>
                      <div className="text-lg font-black text-[#1E1548] mt-1">1,250</div>
                      <span className="text-[10px] font-bold text-emerald-600">↑ 14% vs. prev</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF8FF] border border-[#EFEAF7] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#1E1548]">
                    <span>50% of customers have an active wallet</span>
                    <span className="text-[#5844A8] font-black">1,250 / 2,482</span>
                  </div>
                  <div className="w-full h-2 bg-[#ECE6F8] rounded-full overflow-hidden">
                    <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-[#5844A8] to-[#EC4899]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* SCREEN 2: CUSTOMERS BY STATE (iPad Pro 12.9_ - 76.png)            */}
        {/* ================================================================= */}
        {activeView === 'states' && (
          <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setActiveView('insights')}
                className="text-xs font-bold text-[#5844A8] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Customers
              </button>
              <h1 className="text-xl sm:text-2xl font-black text-[#1E1548] tracking-tight">Customers by State</h1>
              <p className="text-xs text-[#7B748C]">Customer activity across the merchant&apos;s locations</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#EFEAF7] text-xs text-[#6B657E] shadow-2xs">
              <strong className="text-[#1E1548]">Browse by location.</strong> Each card shows unique visitors, completed campaign redemptions, visit-time patterns, gender of recorded visits, and customer classifications.
            </div>

            <div className="bg-white border border-[#EFEAF7] rounded-2xl px-4 py-2.5 flex items-center gap-2.5 shadow-2xs">
              <Search className="w-4 h-4 text-[#8C84A0] shrink-0" />
              <input
                type="text"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                placeholder="Search states by name..."
                className="bg-transparent outline-none w-full text-xs text-[#1E1548] placeholder:text-[#9890A8] font-medium"
              />
              <SlidersHorizontal className="w-4 h-4 text-[#8C84A0] shrink-0" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {STATE_ANALYTICS.filter((st) => st.name.toLowerCase().includes(locationSearch.toLowerCase())).map((st) =>
                renderLocationAnalyticsCard(st, () => {
                  setSelectedState(st.name);
                  setLocationSearch('');
                  setActiveView('cities');
                })
              )}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* SCREEN 3: CUSTOMERS IN STATE / CITIES (iPad Pro 12.9_ - 78.png)   */}
        {/* ================================================================= */}
        {activeView === 'cities' && (() => {
          const currentStateObj = STATE_ANALYTICS.find((s) => s.name === selectedState) || STATE_ANALYTICS[0];
          const citiesList = CITIES_BY_STATE[selectedState] || CITIES_BY_STATE['Uttar Pradesh'];

          return (
            <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setLocationSearch('');
                    setActiveView('states');
                  }}
                  className="text-xs font-bold text-[#5844A8] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Customers / By State
                </button>
                <h1 className="text-xl sm:text-2xl font-black text-[#1E1548] tracking-tight">
                  Customers in {selectedState}
                </h1>
                <p className="text-xs text-[#7B748C]">State → Cities · Customer analytics</p>
              </div>

              {/* State Switcher Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
                {STATE_ANALYTICS.map((st) => (
                  <button
                    key={st.name}
                    type="button"
                    onClick={() => setSelectedState(st.name)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedState === st.name
                        ? 'bg-[#240B4C] text-white shadow-xs'
                        : 'bg-[#F3EEFA] text-[#5E5870] hover:bg-[#E9E0FB]'
                    }`}
                  >
                    {st.name}
                  </button>
                ))}
              </div>

              {/* 4 Top KPI Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-[#F6F3FF] p-4 rounded-2xl border border-[#EAE2FB]">
                  <div className="text-xl font-black text-[#1E1548]">{currentStateObj.uniqueVisitors.toLocaleString()}</div>
                  <div className="text-[11px] font-semibold text-[#7B748C] mt-1">Unique visitors</div>
                </div>
                <div className="bg-[#F4F8FF] p-4 rounded-2xl border border-[#E5EEFE]">
                  <div className="text-xl font-black text-[#1E1548]">{currentStateObj.recordedVisits.toLocaleString()}</div>
                  <div className="text-[11px] font-semibold text-[#7B748C] mt-1">Recorded visits</div>
                </div>
                <div className="bg-[#FFF6F3] p-4 rounded-2xl border border-[#FDE8E1]">
                  <div className="text-xl font-black text-[#1E1548]">{currentStateObj.newCustomers.toLocaleString()}</div>
                  <div className="text-[11px] font-semibold text-[#7B748C] mt-1">New customers</div>
                </div>
                <div className="bg-[#F6F5FF] p-4 rounded-2xl border border-[#EAE7FC]">
                  <div className="text-xl font-black text-[#1E1548]">{currentStateObj.returning.toLocaleString()}</div>
                  <div className="text-[11px] font-semibold text-[#7B748C] mt-1">Returning visitors</div>
                </div>
              </div>

              {/* Search Cities */}
              <div className="bg-white border border-[#EFEAF7] rounded-2xl px-4 py-2.5 flex items-center gap-2.5 shadow-2xs">
                <Search className="w-4 h-4 text-[#8C84A0] shrink-0" />
                <input
                  type="text"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  placeholder={`Search cities in ${selectedState}...`}
                  className="bg-transparent outline-none w-full text-xs text-[#1E1548] placeholder:text-[#9890A8] font-medium"
                />
              </div>

              {/* 2-Column City Cards + Location-specific insights helper card (78.png) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {citiesList
                  .filter((ct) => ct.name.toLowerCase().includes(locationSearch.toLowerCase()))
                  .map((ct) =>
                    renderLocationAnalyticsCard(ct, () => {
                      setSelectedCity(ct.name);
                      setLocationSearch('');
                      setActiveView('branches');
                    })
                  )}

                {/* Location-specific insights card */}
                <div className="bg-[#F8F5FF] rounded-3xl p-6 border border-[#E5DAF9] flex flex-col items-center justify-center text-center space-y-3 min-h-[260px]">
                  <div className="w-12 h-12 rounded-full bg-[#FFE4EA] text-[#E11D48] flex items-center justify-center">
                    <Target className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-[#1E1548]">Location-specific insights</h3>
                  <p className="text-xs text-[#6B657E] max-w-xs leading-relaxed">
                    State totals deduplicate customers who visited multiple cities. Visit totals sum across the cities.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCity(citiesList[0]?.name || 'Noida');
                      setActiveView('branches');
                    }}
                    className="px-5 py-2.5 bg-[#240B4C] hover:bg-[#321266] text-white rounded-full text-xs font-black shadow-sm cursor-pointer transition-colors"
                  >
                    Select a city to view its branches →
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ================================================================= */}
        {/* SCREEN 4: CUSTOMERS IN CITY / BRANCHES (iPad Pro 12.9_ - 77.png)  */}
        {/* ================================================================= */}
        {activeView === 'branches' && (() => {
          const cityBranches = BRANCHES_BY_CITY[selectedCity] || BRANCHES_BY_CITY['Noida'];
          const availableCities = Object.keys(BRANCHES_BY_CITY);

          return (
            <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setLocationSearch('');
                    setActiveView('cities');
                  }}
                  className="text-xs font-bold text-[#5844A8] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Customers / By Cities
                </button>
                <h1 className="text-xl sm:text-2xl font-black text-[#1E1548] tracking-tight">
                  Customers in {selectedCity}
                </h1>
                <p className="text-xs text-[#7B748C]">
                  {selectedState} → {selectedCity} → Branches
                </p>
              </div>

              {/* City Switcher Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
                {availableCities.map((ct) => (
                  <button
                    key={ct}
                    type="button"
                    onClick={() => setSelectedCity(ct)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCity === ct
                        ? 'bg-[#240B4C] text-white shadow-xs'
                        : 'bg-[#F3EEFA] text-[#5E5870] hover:bg-[#E9E0FB]'
                    }`}
                  >
                    {ct}
                  </button>
                ))}
              </div>

              {/* 4 City Summary KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-[#F6F3FF] p-4 rounded-2xl border border-[#EAE2FB]">
                  <div className="text-xl font-black text-[#1E1548]">1,240</div>
                  <div className="text-[11px] font-semibold text-[#7B748C] mt-1">Unique visitors</div>
                </div>
                <div className="bg-[#F4F8FF] p-4 rounded-2xl border border-[#E5EEFE]">
                  <div className="text-xl font-black text-[#1E1548]">3,680</div>
                  <div className="text-[11px] font-semibold text-[#7B748C] mt-1">Recorded visits</div>
                </div>
                <div className="bg-[#FFF6F3] p-4 rounded-2xl border border-[#FDE8E1]">
                  <div className="text-xl font-black text-[#1E1548]">180</div>
                  <div className="text-[11px] font-semibold text-[#7B748C] mt-1">New customers</div>
                </div>
                <div className="bg-[#F6F5FF] p-4 rounded-2xl border border-[#EAE7FC]">
                  <div className="text-xl font-black text-[#1E1548]">1,060</div>
                  <div className="text-[11px] font-semibold text-[#7B748C] mt-1">Returning visitors</div>
                </div>
              </div>

              {/* Search Branches or Managers */}
              <div className="bg-white border border-[#EFEAF7] rounded-2xl px-4 py-2.5 flex items-center gap-2.5 shadow-2xs">
                <Search className="w-4 h-4 text-[#8C84A0] shrink-0" />
                <input
                  type="text"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  placeholder="Search branches or managers..."
                  className="bg-transparent outline-none w-full text-xs text-[#1E1548] placeholder:text-[#9890A8] font-medium"
                />
              </div>

              {/* Full-Width Rich Branch Cards (77.png) */}
              <div className="space-y-4">
                {cityBranches
                  .filter(
                    (br) =>
                      br.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
                      (br.manager || '').toLowerCase().includes(locationSearch.toLowerCase())
                  )
                  .map((br) => (
                    <div
                      key={br.name}
                      className="bg-white rounded-3xl p-4 sm:p-5 border border-[#DFD4F7] hover:border-[#5844A8] shadow-2xs transition-all space-y-4"
                    >
                      {/* Top Row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-[#F3EEFA] text-[#5844A8] flex items-center justify-center shrink-0">
                            <Store className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm sm:text-base font-black text-[#1E1548]">{br.name}</div>
                            <div className="text-[11px] text-[#8C84A0] font-semibold">{br.subtitle}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                              br.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-600 border border-rose-200'
                            }`}
                          >
                            {br.status}
                          </span>
                          <ChevronRight className="w-4 h-4 text-[#8C84A0]" />
                        </div>
                      </div>

                      {/* 4 Tinted Metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <div className="p-3 rounded-2xl bg-[#F8F5FF] border border-[#EFE9FC]">
                          <div className="text-base font-black text-[#1E1548]">{br.uniqueVisitors}</div>
                          <div className="text-[10px] font-semibold text-[#7B748C]">Unique visitors</div>
                        </div>
                        <div className="p-3 rounded-2xl bg-[#F4F8FF] border border-[#E6EEFE]">
                          <div className="text-base font-black text-[#1E1548]">{br.recordedVisits.toLocaleString()}</div>
                          <div className="text-[10px] font-semibold text-[#7B748C]">Recorded visits</div>
                        </div>
                        <div className="p-3 rounded-2xl bg-[#FFF7F3] border border-[#FDECE0]">
                          <div className="text-base font-black text-[#1E1548]">{br.newCustomers}</div>
                          <div className="text-[10px] font-semibold text-[#7B748C]">New customers</div>
                        </div>
                        <div className="p-3 rounded-2xl bg-[#F6F5FF] border border-[#EAE8FD]">
                          <div className="text-base font-black text-[#1E1548]">{br.returning}</div>
                          <div className="text-[10px] font-semibold text-[#7B748C]">Returning</div>
                        </div>
                      </div>

                      {/* 3-Column Row: Top Campaigns | Time of Day | Visitor Gender */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                        {/* Top 3 Campaigns */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-black text-[#1E1548] flex items-center gap-1">
                              <Trophy className="w-3 h-3 text-amber-500" /> Top 3 Campaigns
                            </span>
                            <span className="text-[#9890A8]">Redemptions</span>
                          </div>
                          <div className="space-y-1.5 text-[11px]">
                            {br.topCampaigns.map((c, idx) => (
                              <div key={c.name} className="flex items-center justify-between">
                                <span className="flex items-center gap-1.5 font-semibold text-[#5E5870]">
                                  <span className="w-4 h-4 rounded-full bg-[#FDE8F0] text-[#E11D48] text-[9px] font-black flex items-center justify-center">
                                    {idx + 1}
                                  </span>
                                  {c.name}
                                </span>
                                <span className="font-black text-[#1E1548]">{c.count}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Time of Day */}
                        <div className="space-y-2">
                          <div className="text-[10px] font-black text-[#1E1548] flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#8C84A0]" /> Visits by Time of Day
                          </div>
                          <div className="grid grid-cols-3 gap-1.5 text-center">
                            <div className="p-2 rounded-xl bg-[#F7F5FF] border border-[#ECE7FC]">
                              <Sun className="w-3 h-3 text-[#7C3AED] mx-auto" />
                              <div className="text-xs font-black text-[#1E1548] mt-1">{br.timeOfDay.morning}</div>
                              <div className="text-[9px] font-semibold text-[#8C84A0]">Morning</div>
                            </div>
                            <div className="p-2 rounded-xl bg-[#FFF4F7] border border-[#FCE1E9]">
                              <Sun className="w-3 h-3 text-[#EC4899] mx-auto" />
                              <div className="text-xs font-black text-[#1E1548] mt-1">{br.timeOfDay.afternoon}</div>
                              <div className="text-[9px] font-semibold text-[#8C84A0]">Afternoon</div>
                            </div>
                            <div className="p-2 rounded-xl bg-[#F4F6FF] border border-[#E5EAFF]">
                              <Moon className="w-3 h-3 text-[#4F46E5] mx-auto" />
                              <div className="text-xs font-black text-[#1E1548] mt-1">{br.timeOfDay.evening}</div>
                              <div className="text-[9px] font-semibold text-[#8C84A0]">Evening</div>
                            </div>
                          </div>
                        </div>

                        {/* Gender */}
                        <div className="space-y-2">
                          <div className="text-[10px] font-black text-[#1E1548]">
                            Visitor Gender <span className="font-medium text-[#9890A8]">· recorded visits</span>
                          </div>
                          <div className="flex items-center gap-3">
                            {renderDonut(
                              [
                                { value: br.gender.male, color: '#240B4C' },
                                { value: br.gender.female, color: '#EC4899' },
                                { value: br.gender.other, color: '#CBD5E1' }
                              ],
                              54,
                              8
                            )}
                            <div className="flex-1 space-y-1 text-[11px]">
                              <div className="flex justify-between"><span className="flex items-center gap-1.5 text-[#5E5870] font-semibold"><span className="w-1.5 h-1.5 rounded-full bg-[#240B4C]" /> Male</span><span className="font-black text-[#1E1548]">{br.gender.male}%</span></div>
                              <div className="flex justify-between"><span className="flex items-center gap-1.5 text-[#5E5870] font-semibold"><span className="w-1.5 h-1.5 rounded-full bg-[#EC4899]" /> Female</span><span className="font-black text-[#1E1548]">{br.gender.female}%</span></div>
                              <div className="flex justify-between"><span className="flex items-center gap-1.5 text-[#5E5870] font-semibold"><span className="w-1.5 h-1.5 rounded-full bg-[#CBD5E1]" /> Other</span><span className="font-black text-[#1E1548]">{br.gender.other}%</span></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row: Tiers + Behaviour + View Customers CTA */}
                      <div className="pt-3 border-t border-[#F4F0FA] flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-1">
                            {[
                              { l: 'VVIP', v: br.tiers.vvip },
                              { l: 'VIP', v: br.tiers.vip },
                              { l: 'Gold', v: br.tiers.gold },
                              { l: 'Silver', v: br.tiers.silver },
                              { l: 'Bronze', v: br.tiers.bronze }
                            ].map((t) => (
                              <div key={t.l} className="px-2 py-1 rounded-lg bg-[#F8F6FC] border border-[#EFEAF7] text-center">
                                <div className="text-[10px] font-black text-[#1E1548] leading-none">{t.v}</div>
                                <div className="text-[8px] font-semibold text-[#8C84A0] mt-0.5">{t.l}</div>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px]">
                            <span className="px-2 py-1 rounded-lg bg-[#F8F6FC] font-bold text-[#1E1548]">{br.behaviour.newCount} <span className="text-[#8C84A0] font-normal">New</span></span>
                            <span className="px-2 py-1 rounded-lg bg-[#F8F6FC] font-bold text-[#1E1548]">{br.behaviour.returning} <span className="text-[#8C84A0] font-normal">Returning</span></span>
                            <span className="px-2 py-1 rounded-lg bg-[#F8F6FC] font-bold text-[#1E1548]">{br.behaviour.active} <span className="text-[#8C84A0] font-normal">Active</span></span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setBranchFilter(selectedCity);
                            setActiveView('directory');
                            triggerToast(`Showing customers in ${br.name}`);
                          }}
                          className="self-start md:self-auto px-5 py-2 bg-[#240B4C] hover:bg-[#321266] text-white rounded-full text-xs font-black shadow-sm cursor-pointer transition-colors shrink-0"
                        >
                          View Customers →
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          );
        })()}

        {/* ================================================================= */}
        {/* SCREEN 5: CUSTOMER DIRECTORY (iPad Pro 12.9_ - 65.png)            */}
        {/* ================================================================= */}
        {activeView === 'directory' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#1E1548] tracking-tight">Customer Directory</h1>
                <p className="text-xs text-[#7B748C] mt-0.5">Search, filter and manage all your customers</p>
              </div>
              {branchFilter !== 'All Branches' && (
                <button
                  type="button"
                  onClick={() => setBranchFilter('All Branches')}
                  className="self-start sm:self-auto px-3 py-1.5 rounded-full bg-[#F3EEFA] text-[#5844A8] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{branchFilter}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Search + Filter Icon */}
            <div className="flex items-center gap-2.5">
              <div className="flex-1 bg-white border border-[#EFEAF7] focus-within:border-[#5844A8]/50 rounded-2xl px-4 py-2.5 sm:py-3 flex items-center gap-2.5 shadow-2xs transition-colors">
                <Search className="w-4 h-4 text-[#8C84A0] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, phone, email or loyalty ID..."
                  className="bg-transparent outline-none w-full text-xs text-[#1E1548] placeholder:text-[#9890A8] font-medium"
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery('')} className="text-[#8C84A0] cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setTierFilter('All');
                  setBranchFilter('All Branches');
                  setActivityFilter('All Activity');
                  setWalletStatusFilter('Wallet Status');
                  triggerToast('All directory filters reset');
                }}
                title="Reset Filters"
                className="w-11 h-11 rounded-2xl bg-white border border-[#EFEAF7] hover:border-[#5844A8]/50 flex items-center justify-center text-[#5E5870] shadow-2xs cursor-pointer shrink-0"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>

            {/* Tier Filter Pills (65.png) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
              {[
                { label: 'All', count: '2,482' },
                { label: 'VVIP', count: '120' },
                { label: 'VIP', count: '310' },
                { label: 'Gold', count: '620' },
                { label: 'Silver', count: '820' },
                { label: 'Bronze', count: '612' }
              ].map((t) => (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => setTierFilter(t.label as any)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    tierFilter === t.label
                      ? 'bg-[#240B4C] text-white shadow-xs'
                      : 'bg-white border border-[#E5DEF5] text-[#5E5870] hover:border-[#5844A8]/40'
                  }`}
                >
                  {t.label} ({t.count})
                </button>
              ))}
            </div>

            {/* 4 Dropdowns Row (65.png) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {[
                { val: branchFilter, set: setBranchFilter, opts: ['All Branches', 'Noida – Sector 18', 'Connaught Place', 'DLF Mall of India', 'Noida'] },
                { val: activityFilter, set: setActivityFilter, opts: ['All Activity', 'Frequent (20+ visits)', 'High Spend (₹20k+)'] },
                { val: joinDateFilter, set: setJoinDateFilter, opts: ['Join Date', 'Last 30 Days', 'Last 6 Months', '2024 Members'] },
                { val: walletStatusFilter, set: setWalletStatusFilter, opts: ['Wallet Status', 'Has Cashback', '1,000+ Points'] }
              ].map((d, idx) => (
                <div key={idx} className="relative">
                  <select
                    value={d.val}
                    onChange={(e) => d.set(e.target.value)}
                    className="w-full appearance-none bg-white border border-[#EFEAF7] rounded-xl px-3.5 py-2 pr-8 text-xs font-bold text-[#5E5870] outline-none cursor-pointer shadow-2xs"
                  >
                    {d.opts.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#8C84A0] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              ))}
            </div>

            {/* 2-Column Customer Cards Grid (65.png) */}
            {filteredCustomers.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-[#EFEAF7] text-center space-y-2">
                <div className="text-sm font-black text-[#1E1548]">No customers found</div>
                <p className="text-xs text-[#8C84A0]">Try clearing the search query or tier filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCustomers.map((cust) => (
                  <div
                    key={cust.id}
                    onClick={() => openCustomerProfile(cust.id, 'overview')}
                    className="bg-white rounded-3xl p-4 sm:p-5 border border-[#DFD4F7] hover:border-[#5844A8] shadow-2xs hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between gap-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-11 h-11 rounded-full ${cust.avatarBg} ${cust.avatarColor} font-black text-sm flex items-center justify-center shrink-0`}>
                          {cust.initials}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-black text-[#1E1548] truncate">{cust.name}</h3>
                            {renderTierBadge(cust.tier)}
                          </div>
                          <div className="text-xs text-[#8C84A0] font-medium mt-0.5">{cust.phone}</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-[#9890A8] shrink-0">
                        Last visit: {cust.lastVisit}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 pt-3 border-t border-[#F4F0FA] text-center">
                      <div>
                        <div className="text-[10px] font-semibold text-[#9890A8]">Visits</div>
                        <div className="text-sm font-black text-[#1E1548] mt-0.5">{cust.visits}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold text-[#9890A8]">Lifetime Spend</div>
                        <div className="text-sm font-black text-[#1E1548] mt-0.5">₹{cust.lifetimeSpend.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold text-[#9890A8]">Points</div>
                        <div className="text-sm font-black text-[#1E1548] mt-0.5">{cust.points.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold text-[#9890A8]">Cashback</div>
                        <div className="text-sm font-black text-[#1E1548] mt-0.5">₹{cust.cashback}</div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <span className="text-xs font-black text-[#5844A8] flex items-center gap-0.5">
                        View Profile <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* SCREENS 6–9: CUSTOMER PROFILE (66, 67, 68, 69.png)                */}
        {/* ================================================================= */}
        {activeView === 'profile' && (
          <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
            {/* Top Bar: Back to Directory + More Actions */}
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  if (initialCustomerId && onBackToList) {
                    onBackToList();
                  } else {
                    setActiveView('directory');
                  }
                }}
                className="text-xs font-bold text-[#5E5870] hover:text-[#1E1548] flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Directory</span>
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsMoreActionsOpen((prev) => !prev)}
                  className="px-4 py-2 bg-white border border-[#E5DEF5] hover:border-[#5844A8]/50 rounded-full text-xs font-bold text-[#1E1548] flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <span>More Actions</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#8C84A0]" />
                </button>
                {isMoreActionsOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-[#EFEAF7] shadow-lg py-1.5 z-30 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMoreActionsOpen(false);
                        setProfileTab('overview');
                        setIsEditingPersonal(true);
                      }}
                      className="w-full px-3.5 py-2 text-left font-bold text-[#1E1548] hover:bg-[#FAF8FF] flex items-center gap-2 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#5844A8]" /> Edit Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMoreActionsOpen(false);
                        setActiveView('gift_points');
                      }}
                      className="w-full px-3.5 py-2 text-left font-bold text-[#1E1548] hover:bg-[#FAF8FF] flex items-center gap-2 cursor-pointer"
                    >
                      <Gift className="w-3.5 h-3.5 text-[#5844A8]" /> Gift Reward Points
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMoreActionsOpen(false);
                        triggerToast(`Customer summary downloaded for ${activeCustomer.name}`);
                      }}
                      className="w-full px-3.5 py-2 text-left font-bold text-[#1E1548] hover:bg-[#FAF8FF] flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-[#5844A8]" /> Download Report
                    </button>
                    <div className="my-1 border-t border-[#F4F0FA]" />
                    <button
                      type="button"
                      onClick={() => {
                        setIsMoreActionsOpen(false);
                        setBlockedCustomerIds((prev) =>
                          prev.includes(activeCustomer.id)
                            ? prev.filter((id) => id !== activeCustomer.id)
                            : [...prev, activeCustomer.id]
                        );
                        triggerToast(isBlocked ? `${activeCustomer.name} unblocked` : `${activeCustomer.name} blocked`);
                      }}
                      className="w-full px-3.5 py-2 text-left font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Ban className="w-3.5 h-3.5" /> {isBlocked ? 'Unblock Customer' : 'Block Customer'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Hero Card (66-69.png) */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={activeCustomer.avatar}
                    alt={activeCustomer.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#F3EEFA] shadow-xs"
                  />
                  <span className="w-5 h-5 rounded-full bg-[#240B4C] text-white flex items-center justify-center absolute bottom-0 right-0 ring-2 ring-white">
                    <Sparkles className="w-2.5 h-2.5" />
                  </span>
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg sm:text-xl font-black text-[#1E1548]">{activeCustomer.name}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF1F5] text-[#E11D48] border border-[#FCE1E9]">
                      👑 {activeCustomer.tier} Member
                    </span>
                    {isBlocked && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                        Blocked
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#6B657E] font-medium">
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-[#5844A8]" /> {activeCustomer.phone}</span>
                    <span>•</span>
                    <span className="truncate">{activeCustomer.email}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#8C84A0] font-semibold">
                    <span>Member since {activeCustomer.memberSince}</span>
                    <span>|</span>
                    <span>Customer ID: <strong className="text-[#1E1548]">{activeCustomer.customerId}</strong></span>
                  </div>
                </div>
              </div>

              {/* Right Editable Note Box */}
              <div className="md:max-w-sm w-full p-3.5 rounded-2xl bg-[#FAF8FF] border border-[#EFEAF7] flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#F3EEFA] text-[#5844A8] flex items-center justify-center shrink-0">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                {isEditingNote ? (
                  <div className="flex-1 space-y-2">
                    <textarea
                      rows={2}
                      value={activeCustomer.note}
                      onChange={(e) =>
                        setCustomers((prev) =>
                          prev.map((c) => (c.id === activeCustomer.id ? { ...c, note: e.target.value } : c))
                        )
                      }
                      className="w-full text-xs text-[#1E1548] bg-white border border-[#D9CEF2] rounded-lg p-2 outline-none resize-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingNote(false);
                        triggerToast('Customer note updated');
                      }}
                      className="px-3 py-1 bg-[#240B4C] text-white rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      Save Note
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-[#5E5870] leading-relaxed flex-1">{activeCustomer.note}</p>
                    <button
                      type="button"
                      onClick={() => setIsEditingNote(true)}
                      className="text-[#8C84A0] hover:text-[#5844A8] p-1 cursor-pointer shrink-0"
                      aria-label="Edit note"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* 4 Profile Tabs (Overview | Campaigns | Activity | Wallet) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
              {[
                { id: 'overview' as const, label: 'Overview', icon: User },
                { id: 'campaigns' as const, label: 'Campaigns', icon: Gift },
                { id: 'activity' as const, label: 'Activity', icon: Clock },
                { id: 'wallet' as const, label: 'Wallet', icon: Wallet }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setProfileTab(t.id)}
                  className={`px-4 py-2 rounded-full text-xs font-black flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                    profileTab === t.id
                      ? 'bg-[#240B4C] text-white shadow-sm'
                      : 'text-[#6B657E] hover:bg-white hover:text-[#1E1548]'
                  }`}
                >
                  <t.icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* ================================================= */}
            {/* PROFILE TAB 1: OVERVIEW (66.png)                  */}
            {/* ================================================= */}
            {profileTab === 'overview' && (
              <div className="space-y-4">
                {/* 6 KPI Stat Cards (md:grid-cols-6) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                  <div className="bg-white p-3.5 rounded-2xl border border-[#EFEAF7] shadow-2xs space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#7B748C]">
                      <span className="p-1 rounded-lg bg-[#F3EEFA] text-[#5844A8]"><Users className="w-3 h-3" /></span>
                      <span>Total Visits</span>
                    </div>
                    <div className="text-lg font-black text-[#1E1548]">{activeCustomer.visits}</div>
                    <div className="text-[9.5px] font-bold text-emerald-600">↑ 12% vs last 3m</div>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-[#EFEAF7] shadow-2xs space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#7B748C]">
                      <span className="p-1 rounded-lg bg-pink-50 text-pink-600"><Receipt className="w-3 h-3" /></span>
                      <span>Lifetime Spend</span>
                    </div>
                    <div className="text-lg font-black text-[#1E1548]">₹{activeCustomer.lifetimeSpend.toLocaleString()}</div>
                    <div className="text-[9.5px] font-bold text-emerald-600">↑ 18%</div>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-[#EFEAF7] shadow-2xs space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#7B748C]">
                      <span className="p-1 rounded-lg bg-blue-50 text-blue-600"><ShieldCheck className="w-3 h-3" /></span>
                      <span>Avg. Bill Value</span>
                    </div>
                    <div className="text-lg font-black text-[#1E1548]">₹{activeCustomer.avgBillValue}</div>
                    <div className="text-[9.5px] font-bold text-emerald-600">↑ 8%</div>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-[#EFEAF7] shadow-2xs space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#7B748C]">
                      <span className="p-1 rounded-lg bg-purple-50 text-purple-600"><Calendar className="w-3 h-3" /></span>
                      <span>Last Visit</span>
                    </div>
                    <div className="text-sm font-black text-[#1E1548] pt-0.5">{activeCustomer.lastVisit}</div>
                    <div className="text-[9.5px] font-semibold text-[#9890A8]">24 Oct 2026</div>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-[#EFEAF7] shadow-2xs space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#7B748C]">
                      <span className="p-1 rounded-lg bg-rose-50 text-rose-500"><Heart className="w-3 h-3" /></span>
                      <span>Favourite Items</span>
                    </div>
                    <div className="text-[11px] font-black text-[#1E1548] leading-snug line-clamp-2">
                      {activeCustomer.favouriteItems.join(', ')}
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-[#EFEAF7] shadow-2xs space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#7B748C]">
                      <span className="p-1 rounded-lg bg-[#F3EEFA] text-[#5844A8]"><MapPin className="w-3 h-3" /></span>
                      <span>Preferred Branch</span>
                    </div>
                    <div className="text-xs font-black text-[#1E1548] truncate">{activeCustomer.preferredBranch}</div>
                    <div className="text-[9.5px] font-semibold text-[#9890A8]">{activeCustomer.branchesVisitedCount} branches visited</div>
                  </div>
                </div>

                {/* Row 2: Membership & Tier | Wallet Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Membership & Tier */}
                  <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-[#1E1548]">Membership &amp; Tier</h3>
                      <ChevronRight className="w-4 h-4 text-[#9890A8]" />
                    </div>

                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-amber-500 flex items-center justify-center text-lg shrink-0">
                          👑
                        </div>
                        <div className="text-sm font-black text-[#1E1548]">{activeCustomer.tier} Member</div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-[11px]">
                        <div>
                          <div className="text-[#9890A8] font-semibold">Current Tier</div>
                          <div className="font-black text-[#1E1548]">{activeCustomer.tier}</div>
                          <div className="text-[#9890A8] font-semibold mt-1.5">Next Tier</div>
                          <div className="font-black text-[#E11D48]">VVIP</div>
                        </div>
                        <div>
                          <div className="text-[#9890A8] font-semibold">Joined On</div>
                          <div className="font-black text-[#1E1548]">{activeCustomer.memberSince}</div>
                          <div className="text-[#9890A8] font-semibold mt-1.5">Customer Since</div>
                          <div className="font-black text-[#1E1548]">1 yr 6 mos</div>
                        </div>
                        <div>
                          <div className="text-[#9890A8] font-semibold">Tier Valid Till</div>
                          <div className="font-black text-[#1E1548]">{activeCustomer.tierValidTill}</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="w-full h-2 rounded-full bg-[#F3EEFA] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#E11D48] to-[#EC4899]"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round((activeCustomer.qualifyingPoints / activeCustomer.maxQualifyingPoints) * 100)
                            )}%`
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#8C84A0] font-semibold">
                          {activeCustomer.qualifyingPoints} / {activeCustomer.maxQualifyingPoints} qualifying points
                        </span>
                        <span className="font-black text-[#1E1548]">
                          {Math.round((activeCustomer.qualifyingPoints / activeCustomer.maxQualifyingPoints) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Wallet Summary */}
                  <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs flex flex-col justify-between gap-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-[#1E1548]">Wallet Summary</h3>
                      <button
                        type="button"
                        onClick={() => setProfileTab('wallet')}
                        className="text-xs font-bold text-[#5844A8] hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        View Wallet <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-2xl bg-[#FAF8FF] border border-[#EFEAF7] flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white border border-[#E5DAF9] text-[#5844A8] flex items-center justify-center shrink-0">
                          <Star className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] font-semibold text-[#8C84A0]">Reward Points</div>
                          <div className="text-base font-black text-[#1E1548]">{activeCustomer.points.toLocaleString()} pts</div>
                          <div className="text-[9.5px] text-[#9890A8]">Expiry: 31 Dec 2026</div>
                        </div>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-[#FFF8FA] border border-[#FCE1E9] flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white border border-[#FCE1E9] text-[#E11D48] flex items-center justify-center shrink-0">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] font-semibold text-[#8C84A0]">Cashback</div>
                          <div className="text-base font-black text-[#1E1548]">₹{activeCustomer.cashback}</div>
                          <div className="text-[9.5px] text-[#9890A8]">Expiry: 31 Mar 2027</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 3: Campaign Participation | Branch Engagement */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Campaign Participation */}
                  <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-[#1E1548]">Campaign Participation</h3>
                      <button
                        type="button"
                        onClick={() => setProfileTab('campaigns')}
                        className="text-xs font-bold text-[#5844A8] hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        View All <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2.5 text-center">
                      <div className="p-3 rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5]">
                        <div className="text-lg font-black text-[#059669]">{activeCustomer.campaignsCount.active}</div>
                        <div className="text-[10px] font-bold text-[#059669]">Active</div>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#FFF1F2] border border-[#FFE4E6]">
                        <div className="text-lg font-black text-[#E11D48]">{activeCustomer.campaignsCount.locked}</div>
                        <div className="text-[10px] font-bold text-[#E11D48]">Locked</div>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#F5F3FF] border border-[#EDE9FE]">
                        <div className="text-lg font-black text-[#5844A8]">{activeCustomer.campaignsCount.used}</div>
                        <div className="text-[10px] font-bold text-[#5844A8]">Used</div>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#FFF5F5] border border-[#FEE2E2]">
                        <div className="text-lg font-black text-[#DC2626]">{activeCustomer.campaignsCount.expired}</div>
                        <div className="text-[10px] font-bold text-[#DC2626]">Expired</div>
                      </div>
                    </div>
                  </div>

                  {/* Branch Engagement */}
                  <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3">
                    <h3 className="text-sm font-black text-[#1E1548]">Branch Engagement</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                      <div className="sm:col-span-5 space-y-2 text-xs">
                        <div>
                          <div className="text-[10px] text-[#9890A8] font-semibold">Preferred Branch</div>
                          <div className="font-black text-[#1E1548] flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#5844A8]" /> {activeCustomer.preferredBranch}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-[#9890A8] font-semibold">Total Branches Visited</div>
                          <div className="text-lg font-black text-[#1E1548]">{activeCustomer.branchesVisitedCount}</div>
                        </div>
                      </div>
                      <div className="sm:col-span-7 space-y-2 text-[11px]">
                        <div className="text-[10px] text-[#9890A8] font-semibold">Branch Visit Split</div>
                        {activeCustomer.branchVisits.map((bv) => (
                          <div key={bv.branch} className="space-y-1">
                            <div className="flex justify-between font-bold text-[#1E1548]">
                              <span className="truncate">{bv.branch}</span>
                              <span>{bv.percent}%</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-[#F3EEFA] overflow-hidden">
                              <div className="h-full rounded-full bg-[#240B4C]" style={{ width: `${bv.percent}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 4: Recent Activity Horizontal Strip (66.png) */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-[#1E1548]">Recent Activity</h3>
                    <button
                      type="button"
                      onClick={() => setProfileTab('activity')}
                      className="text-xs font-bold text-[#5844A8] hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      View All <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-stretch gap-3 overflow-x-auto pb-1 no-scrollbar">
                    {activeCustomer.activities.slice(0, 6).map((act) => (
                      <div
                        key={act.id}
                        onClick={() => setProfileTab('activity')}
                        className="min-w-[165px] max-w-[180px] p-3 rounded-2xl bg-[#FAF8FF] border border-[#EFEAF7] hover:border-[#D9CEF2] shrink-0 space-y-2 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#7B748C]">
                          <span className="w-5 h-5 rounded-lg bg-white border border-[#EFEAF7] flex items-center justify-center text-[#5844A8]">
                            {act.type === 'points' ? <Star className="w-3 h-3 text-amber-500" /> : act.type === 'redeem' ? <Gift className="w-3 h-3 text-pink-500" /> : <Receipt className="w-3 h-3" />}
                          </span>
                          <span className="truncate">{act.title}</span>
                        </div>
                        <div className={`text-sm font-black ${act.valueType === 'positive' ? 'text-emerald-600' : 'text-[#1E1548]'}`}>
                          {act.value}
                        </div>
                        <div className="text-[9.5px] text-[#9890A8] truncate">{act.subtitle}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Row 5: Personal Information | Quick Actions (66.png) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Personal Information */}
                  <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-[#1E1548]">Personal Information</h3>
                      <button
                        type="button"
                        onClick={() => {
                          if (isEditingPersonal) {
                            setIsEditingPersonal(false);
                            triggerToast('Customer details saved');
                          } else {
                            setIsEditingPersonal(true);
                          }
                        }}
                        className="text-xs font-bold text-[#5844A8] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> {isEditingPersonal ? 'Save' : 'Edit'}
                      </button>
                    </div>
                    <div className="divide-y divide-[#F5F2FA] text-xs">
                      {[
                        { label: 'Full Name', field: 'name' as const, val: activeCustomer.name, icon: User },
                        { label: 'Phone Number', field: 'phone' as const, val: activeCustomer.phone, icon: Phone },
                        { label: 'Email Address', field: 'email' as const, val: activeCustomer.email, icon: Mail },
                        { label: 'Date of Birth', field: 'dob' as const, val: activeCustomer.dob, icon: Calendar },
                        { label: 'Gender', field: 'gender' as const, val: activeCustomer.gender, icon: User },
                        { label: 'City', field: 'city' as const, val: `${activeCustomer.city}, ${activeCustomer.state}`, icon: MapPin }
                      ].map((row) => (
                        <div key={row.label} className="py-2 flex items-center justify-between gap-2">
                          <span className="text-[#8C84A0] font-semibold flex items-center gap-1.5">
                            <row.icon className="w-3.5 h-3.5 text-[#5844A8]" /> {row.label}
                          </span>
                          {isEditingPersonal && row.field !== 'city' ? (
                            <input
                              type="text"
                              value={activeCustomer[row.field]}
                              onChange={(e) =>
                                setCustomers((prev) =>
                                  prev.map((c) => (c.id === activeCustomer.id ? { ...c, [row.field]: e.target.value } : c))
                                )
                              }
                              className="bg-[#FAF8FF] border border-[#D9CEF2] rounded-lg px-2 py-1 text-xs font-black text-[#1E1548] text-right outline-none"
                            />
                          ) : (
                            <span className="font-black text-[#1E1548] text-right truncate">{row.val}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions (4x2 Grid) */}
                  <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3">
                    <h3 className="text-sm font-black text-[#1E1548]">Quick Actions</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px]">
                      {[
                        { label: 'Call', icon: Phone, cls: 'text-[#5844A8]', onClick: () => triggerToast(`Calling ${activeCustomer.phone}...`) },
                        { label: 'Message', icon: MessageSquare, cls: 'text-[#5844A8]', onClick: () => triggerToast(`Message composer opened for ${activeCustomer.name}`) },
                        { label: 'Add Note', icon: Edit2, cls: 'text-[#5844A8]', onClick: () => setIsEditingNote(true) },
                        { label: 'Change Tier', icon: Star, cls: 'text-[#5844A8]', onClick: () => triggerToast(`${activeCustomer.name} tier review opened`) },
                        {
                          label: isBlocked ? 'Unblock' : 'Block Customer',
                          icon: Ban,
                          cls: 'text-rose-600',
                          onClick: () => {
                            setBlockedCustomerIds((prev) =>
                              prev.includes(activeCustomer.id)
                                ? prev.filter((id) => id !== activeCustomer.id)
                                : [...prev, activeCustomer.id]
                            );
                            triggerToast(isBlocked ? `${activeCustomer.name} unblocked` : `${activeCustomer.name} blocked`);
                          }
                        },
                        { label: 'Download Report', icon: Download, cls: 'text-[#5844A8]', onClick: () => triggerToast(`Downloaded PDF report for ${activeCustomer.name}`) },
                        { label: 'Transactions', icon: Receipt, cls: 'text-[#5844A8]', onClick: () => setProfileTab('wallet') },
                        { label: 'Send Offer', icon: Send, cls: 'text-[#5844A8]', onClick: () => setActiveView('gift_points') }
                      ].map((qa) => (
                        <button
                          key={qa.label}
                          type="button"
                          onClick={qa.onClick}
                          className="p-3 rounded-2xl bg-[#FAF8FF] hover:bg-[#F3EEFA] border border-[#EFEAF7] flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer transition-colors"
                        >
                          <qa.icon className={`w-4 h-4 ${qa.cls}`} />
                          <span className="font-bold text-[#1E1548] leading-tight">{qa.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================= */}
            {/* PROFILE TAB 2: CAMPAIGNS (67.png)                 */}
            {/* ================================================= */}
            {profileTab === 'campaigns' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
                  {[
                    { id: 'All' as const, label: `All (${activeCustomer.campaigns.length})` },
                    { id: 'Available' as const, label: `Available (${activeCustomer.campaigns.filter((c) => c.status === 'Available' || c.status === 'In Progress').length})` },
                    { id: 'Locked' as const, label: `Locked (${activeCustomer.campaigns.filter((c) => c.status === 'Locked').length})` },
                    { id: 'Used' as const, label: `Used (${activeCustomer.campaigns.filter((c) => c.status === 'Used').length})` },
                    { id: 'Expired' as const, label: `Expired (${activeCustomer.campaigns.filter((c) => c.status === 'Expired').length})` }
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setCampaignFilter(f.id)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        campaignFilter === f.id
                          ? 'bg-[#240B4C] text-white shadow-xs'
                          : 'bg-white border border-[#E5DEF5] text-[#5E5870]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeCustomer.campaigns
                    .filter((c) => {
                      if (campaignFilter === 'All') return true;
                      if (campaignFilter === 'Available') return c.status === 'Available' || c.status === 'In Progress';
                      return c.status === campaignFilter;
                    })
                    .map((camp) => (
                      <div
                        key={camp.id}
                        onClick={() => triggerToast(`${camp.title} — Status: ${camp.status}`)}
                        className="bg-white rounded-3xl p-4 border border-[#EFEAF7] hover:border-[#5844A8]/50 shadow-2xs flex items-center gap-3.5 cursor-pointer transition-all"
                      >
                        <img
                          src={camp.image}
                          alt={camp.title}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 border border-[#EFEAF7]"
                        />
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="text-xs sm:text-sm font-black text-[#1E1548] truncate">{camp.title}</div>
                            <span
                              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                                camp.status === 'Available'
                                  ? 'bg-blue-50 text-blue-600'
                                  : camp.status === 'Used'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : camp.status === 'In Progress'
                                  ? 'bg-[#F3EEFA] text-[#5844A8]'
                                  : 'bg-rose-50 text-rose-600'
                              }`}
                            >
                              {camp.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#7B748C] line-clamp-2">{camp.desc}</p>
                          {typeof camp.progressPercent === 'number' && (
                            <div className="space-y-1 pt-0.5">
                              <div className="w-full h-1.5 rounded-full bg-[#F3EEFA] overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-[#E11D48] to-[#EC4899]"
                                  style={{ width: `${camp.progressPercent}%` }}
                                />
                              </div>
                              <div className="text-right text-[10px] font-bold text-[#9890A8]">{camp.progressPercent}%</div>
                            </div>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#9890A8] shrink-0" />
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* ================================================= */}
            {/* PROFILE TAB 3: ACTIVITY (68.png)                  */}
            {/* ================================================= */}
            {profileTab === 'activity' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
                  {[
                    { id: 'All' as const, label: `All (${activeCustomer.activities.length})` },
                    { id: 'Visits' as const, label: 'Visits (18)' },
                    { id: 'Orders' as const, label: 'Orders (18)' },
                    { id: 'Campaigns' as const, label: 'Campaigns (4)' },
                    { id: 'Rewards' as const, label: 'Rewards (8)' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setActivitySubFilter(f.id)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        activitySubFilter === f.id
                          ? 'bg-[#240B4C] text-white shadow-xs'
                          : 'bg-white border border-[#E5DEF5] text-[#5E5870]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-2.5">
                  {activeCustomer.activities
                    .filter((act) => {
                      if (activitySubFilter === 'All') return true;
                      if (activitySubFilter === 'Visits') return act.type === 'visit';
                      if (activitySubFilter === 'Orders') return act.type === 'order';
                      if (activitySubFilter === 'Campaigns') return act.type === 'redeem' || act.type === 'locked';
                      if (activitySubFilter === 'Rewards') return act.type === 'points' || act.type === 'cashback' || act.type === 'tier';
                      return true;
                    })
                    .map((act) => (
                      <div
                        key={act.id}
                        className="bg-white rounded-2xl p-4 border border-[#EFEAF7] shadow-2xs flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              act.type === 'order'
                                ? 'bg-[#F3EEFA] text-[#5844A8]'
                                : act.type === 'redeem' || act.type === 'locked'
                                ? 'bg-rose-50 text-rose-500'
                                : act.type === 'points' || act.type === 'tier'
                                ? 'bg-amber-50 text-amber-500'
                                : act.type === 'cashback'
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {act.type === 'order' ? (
                              <FileText className="w-4 h-4" />
                            ) : act.type === 'redeem' || act.type === 'locked' ? (
                              <Gift className="w-4 h-4" />
                            ) : act.type === 'points' || act.type === 'tier' ? (
                              <Star className="w-4 h-4" />
                            ) : act.type === 'cashback' ? (
                              <Wallet className="w-4 h-4" />
                            ) : (
                              <MapPin className="w-4 h-4" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-black text-[#1E1548] truncate">{act.title}</div>
                            <div className="text-[11px] text-[#8C84A0] truncate mt-0.5">{act.subtitle}</div>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          {act.valueType === 'badge' ? (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FFF1F5] text-[#E11D48]">
                              {act.value}
                            </span>
                          ) : act.valueType === 'positive' ? (
                            <span className="text-xs sm:text-sm font-black text-emerald-600">{act.value}</span>
                          ) : act.valueType === 'neutral' ? (
                            <span className="text-xs font-semibold text-[#9890A8]">{act.value}</span>
                          ) : (
                            <span className="text-xs sm:text-sm font-black text-[#1E1548]">{act.value}</span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* ================================================= */}
            {/* PROFILE TAB 4: WALLET (69.png)                    */}
            {/* ================================================= */}
            {profileTab === 'wallet' && (
              <div className="space-y-4">
                {/* 2 Balance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-3xl p-5 border border-[#EFEAF7] shadow-2xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-amber-500 flex items-center justify-center shrink-0">
                      <Star className="w-5 h-5 fill-amber-400" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#7B748C]">Reward Points</div>
                      <div className="text-2xl font-black text-[#1E1548]">
                        {activeCustomer.points.toLocaleString()} <span className="text-xs font-bold text-[#7B748C]">pts</span>
                      </div>
                      <div className="text-[11px] text-[#9890A8]">Available balance</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-5 border border-[#EFEAF7] shadow-2xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF1F5] border border-[#FCE1E9] text-[#E11D48] flex items-center justify-center shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#7B748C]">Cashback</div>
                      <div className="text-2xl font-black text-[#1E1548]">₹{activeCustomer.cashback}</div>
                      <div className="text-[11px] text-[#9890A8]">Available balance</div>
                    </div>
                  </div>
                </div>

                {/* Gift Reward Points CTA Banner */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#FFF1F5] text-[#EC4899] flex items-center justify-center shrink-0">
                      <Gift className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-[#1E1548]">Gift Reward Points</div>
                      <div className="text-xs text-[#7B748C]">Credit additional reward points to this customer&apos;s wallet.</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveView('gift_points')}
                    className="self-start sm:self-auto px-5 py-2.5 bg-[#240B4C] hover:bg-[#321266] text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Gift Points</span>
                  </button>
                </div>

                {/* Wallet Redemption Rules (4-col) */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-[#1E1548]">Wallet Redemption Rules</h3>
                    <span className="text-xs font-bold text-[#5844A8]">Set by Merchant ›</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'Min. Order Value', value: '₹300' },
                      { label: 'Max. Redeemable', value: '10% of bill' },
                      { label: 'Point Value', value: '1 pt = ₹1' },
                      { label: 'Cashback Limit', value: '₹200 per order' }
                    ].map((rule) => (
                      <div key={rule.label} className="bg-white p-3.5 rounded-2xl border border-[#EFEAF7] shadow-2xs">
                        <div className="text-[10px] font-semibold text-[#9890A8]">{rule.label}</div>
                        <div className="text-sm font-black text-[#1E1548] mt-1">{rule.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Wallet Transactions */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-black text-[#1E1548]">Wallet Transactions</h3>
                    <div className="relative">
                      <select
                        value={walletTxFilter}
                        onChange={(e) => setWalletTxFilter(e.target.value as any)}
                        className="appearance-none bg-white border border-[#E5DEF5] rounded-xl px-3 py-1.5 pr-7 text-xs font-bold text-[#1E1548] outline-none cursor-pointer"
                      >
                        <option value="All">All Transactions</option>
                        <option value="points">Reward Points</option>
                        <option value="cashback">Cashback</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-[#8C84A0] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {activeCustomer.walletTransactions
                      .filter((tx) => walletTxFilter === 'All' || tx.type === walletTxFilter)
                      .map((tx) => (
                        <div
                          key={tx.id}
                          className="bg-white rounded-2xl p-4 border border-[#EFEAF7] shadow-2xs flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                tx.isPositive
                                  ? tx.type === 'points'
                                    ? 'bg-emerald-50 text-emerald-600'
                                    : 'bg-teal-50 text-teal-600'
                                  : 'bg-rose-50 text-rose-500'
                              }`}
                            >
                              {tx.type === 'points' ? <Star className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs sm:text-sm font-black text-[#1E1548] truncate">{tx.title}</div>
                              <div className="text-[11px] text-[#8C84A0] truncate mt-0.5">{tx.subtitle}</div>
                            </div>
                          </div>
                          <span className={`text-xs sm:text-sm font-black shrink-0 ${tx.isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
                            {tx.value}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* SCREEN 10: GIFT REWARD POINTS (iPad Pro 12.9_ - 70.png)           */}
        {/* ================================================================= */}
        {activeView === 'gift_points' && (() => {
          const giftPtsNum = Math.max(0, parseInt(giftPointsInput, 10) || 0);
          const projectedBalance = activeCustomer.points + giftPtsNum;

          return (
            <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200 max-w-4xl mx-auto">
              {/* Top Row */}
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('profile');
                    setProfileTab('wallet');
                  }}
                  className="text-xs font-bold text-[#5E5870] hover:text-[#1E1548] flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Wallet</span>
                </button>
                <span className="px-3.5 py-1.5 bg-white border border-[#E5DEF5] rounded-full text-xs font-bold text-[#1E1548] flex items-center gap-1.5 shadow-2xs">
                  <MapPin className="w-3.5 h-3.5 text-[#5844A8]" />
                  <span>{activeCustomer.preferredBranch}</span>
                </span>
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#1E1548] tracking-tight">Gift Reward Points</h1>
                <p className="text-xs text-[#7B748C] mt-0.5">
                  Credit additional reward points directly to this customer&apos;s digital wallet.
                </p>
              </div>

              {/* Customer Summary Banner */}
              <div className="bg-white rounded-3xl p-4 border border-[#EFEAF7] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={activeCustomer.avatar}
                    alt={activeCustomer.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#F3EEFA]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-[#1E1548]">{activeCustomer.name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF1F5] text-[#E11D48]">
                        ★ {activeCustomer.tier} Member
                      </span>
                    </div>
                    <div className="text-[11px] text-[#7B748C] mt-0.5">
                      {activeCustomer.phone} • Customer ID: <strong className="text-[#1E1548]">{activeCustomer.customerId}</strong>
                    </div>
                  </div>
                </div>
                <div className="p-2.5 rounded-2xl bg-[#FAF8FF] border border-[#EFEAF7] text-[11px] text-[#6B657E] max-w-xs line-clamp-2">
                  {activeCustomer.note}
                </div>
              </div>

              {/* 2-Column Split: Form Left | Balance Preview Right */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                {/* Left Form (7 cols) */}
                <div className="md:col-span-7 bg-white rounded-3xl p-4 sm:p-6 border border-[#EFEAF7] shadow-2xs space-y-4">
                  {/* Points to Gift */}
                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#5E5870] block mb-1.5">
                      Points to Gift <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center justify-between bg-[#FAF8FF] border border-[#E5DEF5] focus-within:border-[#5844A8] rounded-xl px-4 py-3">
                      <input
                        type="number"
                        min={1}
                        value={giftPointsInput}
                        onChange={(e) => setGiftPointsInput(e.target.value)}
                        className="w-full bg-transparent text-lg font-black text-[#1E1548] outline-none"
                      />
                      <span className="text-xs font-bold text-[#8C84A0] ml-2">pts</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap mt-2.5">
                      <span className="text-[11px] font-semibold text-[#8C84A0]">Quick Add:</span>
                      {['50', '100', '200', '500'].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setGiftPointsInput(amt)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            giftPointsInput === amt
                              ? 'bg-[#F3EEFA] border-[#7C3AED] text-[#5844A8]'
                              : 'bg-[#FAF8FF] border-[#EFEAF7] text-[#5E5870] hover:border-[#D9CEF2]'
                          }`}
                        >
                          +{amt} pts
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#5E5870] block mb-1.5">
                      Reason <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={giftReason}
                        onChange={(e) => setGiftReason(e.target.value)}
                        className="w-full appearance-none bg-[#FAF8FF] border border-[#E5DEF5] rounded-xl px-3.5 py-2.5 pr-9 text-xs font-bold text-[#1E1548] outline-none cursor-pointer"
                      >
                        <option value="Birthday Gift">Birthday Gift</option>
                        <option value="VIP Appreciation">VIP Appreciation</option>
                        <option value="Service Recovery">Service Recovery</option>
                        <option value="Referral Bonus">Referral Bonus</option>
                        <option value="Festive Bonus">Festive Bonus</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#8C84A0] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Note */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#5E5870]">
                        Note <span className="font-normal text-[#9890A8]">(Optional)</span>
                      </label>
                      <span className="text-[10px] font-semibold text-[#9890A8]">{giftNote.length}/200</span>
                    </div>
                    <textarea
                      rows={3}
                      maxLength={200}
                      value={giftNote}
                      onChange={(e) => setGiftNote(e.target.value)}
                      className="w-full bg-[#FAF8FF] border border-[#E5DEF5] focus:border-[#5844A8] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#1E1548] outline-none resize-none"
                    />
                  </div>

                  {/* Expiry Date */}
                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#5E5870] block mb-1.5">
                      Expiry Date <span className="font-normal text-[#9890A8]">(Optional)</span>
                    </label>
                    <input
                      type="date"
                      value={giftExpiry}
                      onChange={(e) => setGiftExpiry(e.target.value)}
                      className="w-full bg-[#FAF8FF] border border-[#E5DEF5] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1E1548] outline-none"
                    />
                    <p className="text-[10px] text-[#9890A8] mt-1">
                      Leave empty to use regular store policy expiry (1 year from issue date).
                    </p>
                  </div>
                </div>

                {/* Right Balance Preview (5 cols) */}
                <div className="md:col-span-5 space-y-4">
                  <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#5E5870]">
                      Balance Preview
                    </div>

                    {/* Current Balance */}
                    <div className="p-3.5 rounded-2xl bg-[#FAF8FF] border border-[#EFEAF7] flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-[#E5DAF9] text-[#5844A8] flex items-center justify-center shrink-0">
                        <Wallet className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[9.5px] font-bold uppercase text-[#8C84A0]">Current Balance</div>
                        <div className="text-base font-black text-[#1E1548]">{activeCustomer.points.toLocaleString()} pts</div>
                      </div>
                    </div>

                    {/* Gift Amount */}
                    <div className="p-3.5 rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white text-emerald-600 flex items-center justify-center shrink-0">
                          <Plus className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[9.5px] font-bold uppercase text-emerald-700">Gift Amount</div>
                          <div className="text-base font-black text-emerald-700">+{giftPtsNum.toLocaleString()} pts</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white text-emerald-700">
                        Pending
                      </span>
                    </div>

                    {/* New Balance Dark Purple Card */}
                    <div className="p-4 rounded-2xl bg-[#240B4C] text-white flex items-center justify-between gap-2 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[9.5px] font-bold uppercase text-purple-200">New Balance</div>
                          <div className="text-lg font-black">{projectedBalance.toLocaleString()} pts</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white/15 text-purple-100">
                        After Credit
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#FAF8FF] border border-[#EFEAF7] flex items-start gap-2 text-[11px] text-[#6B657E]">
                      <Info className="w-3.5 h-3.5 text-[#5844A8] shrink-0 mt-0.5" />
                      <span>
                        Points will be instantly credited and an SMS notification will be dispatched automatically to the registered phone number.
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveView('profile');
                        setProfileTab('wallet');
                      }}
                      className="px-5 py-2.5 bg-white border border-[#E5DEF5] hover:border-[#5844A8]/50 text-[#1E1548] rounded-xl text-xs font-black cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmGiftPoints}
                      className="px-5 py-2.5 bg-[#240B4C] hover:bg-[#321266] text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>Confirm &amp; Add Points</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default TabletCustomersView;
