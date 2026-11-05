export interface TabletCustomerCampaign {
  id: string;
  title: string;
  desc: string;
  status: 'Available' | 'Locked' | 'Used' | 'Expired' | 'In Progress';
  image: string;
  progressPercent?: number;
  progressText?: string;
  tag?: string;
  minBill?: number;
  rewardValue?: string;
  validity?: string;
}

export interface TabletCustomerActivity {
  id: string;
  type: 'order' | 'redeem' | 'points' | 'cashback' | 'visit' | 'locked' | 'tier';
  title: string;
  subtitle: string;
  value: string;
  valueType?: 'amount' | 'positive' | 'negative' | 'badge' | 'neutral';
}

export interface TabletCustomerWalletTx {
  id: string;
  title: string;
  subtitle: string;
  value: string;
  isPositive: boolean;
  type: 'points' | 'cashback';
}

export interface TabletCustomerItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  initials: string;
  avatarBg: string;
  avatarColor: string;
  tier: 'VVIP' | 'VIP' | 'Gold' | 'Silver' | 'Bronze';
  lastVisit: string;
  visits: number;
  lifetimeSpend: number;
  points: number;
  cashback: number;
  customerId: string;
  memberSince: string;
  note: string;
  avgBillValue: number;
  favouriteItems: string[];
  preferredBranch: string;
  branchesVisitedCount: number;
  tierValidTill: string;
  qualifyingPoints: number;
  maxQualifyingPoints: number;
  campaignsCount: {
    active: number;
    locked: number;
    used: number;
    expired: number;
  };
  branchVisits: {
    branch: string;
    percent: number;
  }[];
  dob: string;
  gender: string;
  city: string;
  state: string;
  campaigns: TabletCustomerCampaign[];
  activities: TabletCustomerActivity[];
  walletTransactions: TabletCustomerWalletTx[];
}

export const INITIAL_TABLET_CUSTOMERS: TabletCustomerItem[] = [
  {
    id: 'cust-1',
    name: 'Neha Gupta',
    phone: '+91 87654 32109',
    email: 'neha.gupta@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    initials: 'NG',
    avatarBg: 'bg-[#FAF5FF]',
    avatarColor: 'text-[#8B5CF6]',
    tier: 'VIP',
    lastVisit: '2 days ago',
    visits: 28,
    lifetimeSpend: 24850,
    points: 1250,
    cashback: 320,
    customerId: 'CUS1024',
    memberSince: '12 Apr 2024',
    note: 'Loves coffee and Italian food. Prefers Noida branch. Usually visits on weekends with friends.',
    avgBillValue: 887,
    favouriteItems: ['Pasta', 'Cold Coffee', 'Margherita Pizza'],
    preferredBranch: 'Noida – Sector 18',
    branchesVisitedCount: 3,
    tierValidTill: '11 Apr 2025',
    qualifyingPoints: 320,
    maxQualifyingPoints: 500,
    campaignsCount: {
      active: 3,
      locked: 1,
      used: 8,
      expired: 2
    },
    branchVisits: [
      { branch: 'Noida – Sector 18', percent: 68 },
      { branch: 'Connaught Place', percent: 21 },
      { branch: 'DLF Mall of India', percent: 11 }
    ],
    dob: '14 May 1998',
    gender: 'Female',
    city: 'Noida',
    state: 'Uttar Pradesh',
    campaigns: [
      {
        id: 'camp-1',
        title: 'Spend ₹500, Get ₹100 Off',
        desc: 'Minimum bill of ₹500 • Valid till 30 Oct 2026',
        status: 'Locked',
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=200&q=80',
        progressPercent: 64,
        minBill: 500,
        rewardValue: '₹100 Off',
        validity: '01 Oct 2026 – 30 Oct 2026'
      },
      {
        id: 'camp-2',
        title: 'Birthday Special',
        desc: 'Free dessert on birthday • Used on 10 Oct 2026',
        status: 'Used',
        image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=200&q=80'
      },
      {
        id: 'camp-3',
        title: 'Weekend Offer',
        desc: '15% off on total bill • Valid this weekend',
        status: 'Available',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80'
      },
      {
        id: 'camp-4',
        title: 'Coffee Rewards',
        desc: 'Buy 5 coffees, get 1 free • 3 / 5 completed',
        status: 'In Progress',
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=200&q=80',
        progressPercent: 60
      },
      {
        id: 'camp-5',
        title: 'Welcome Offer',
        desc: '20% off on first visit • Used on 12 Apr 2024',
        status: 'Used',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=80'
      },
      {
        id: 'camp-6',
        title: 'Festive Delight – 25% Off',
        desc: '25% off on bills above ₹1,000 • Valid till 15 Nov 2026',
        status: 'Available',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80'
      },
      {
        id: 'camp-7',
        title: 'Double Points Tuesday',
        desc: 'Earn 2x loyalty points on all orders',
        status: 'Expired',
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=200&q=80'
      },
      {
        id: 'camp-8',
        title: 'VIP Exclusive Tasting',
        desc: 'Chef signature tasting platter • Requires VVIP Tier',
        status: 'Locked',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80',
        progressPercent: 64
      }
    ],
    activities: [
      {
        id: 'act-1',
        type: 'order',
        title: 'Placed an order',
        subtitle: 'Noida – Sector 18 • 24 Oct 2026, 12:30 PM • Order #N181245',
        value: '₹1,240',
        valueType: 'amount'
      },
      {
        id: 'act-2',
        type: 'redeem',
        title: 'Redeemed Birthday Special',
        subtitle: 'Noida – Sector 18 • 21 Oct 2026, 07:15 PM',
        value: 'Free Dessert',
        valueType: 'badge'
      },
      {
        id: 'act-3',
        type: 'points',
        title: 'Earned 50 Reward Points',
        subtitle: 'Connaught Place • 18 Oct 2026, 02:20 PM',
        value: '+50 pts',
        valueType: 'positive'
      },
      {
        id: 'act-4',
        type: 'cashback',
        title: 'Earned ₹40 Cashback',
        subtitle: 'Noida – Expressway • 15 Oct 2026, 01:10 PM',
        value: '+₹40',
        valueType: 'positive'
      },
      {
        id: 'act-5',
        type: 'visit',
        title: 'Visited branch',
        subtitle: 'DLF Mall of India • 10 Oct 2026, 08:45 PM',
        value: 'No order',
        valueType: 'neutral'
      },
      {
        id: 'act-6',
        type: 'locked',
        title: 'Locked an offer',
        subtitle: 'Spend ₹500, Get ₹100 Off • 08 Oct 2026',
        value: 'Locked',
        valueType: 'badge'
      },
      {
        id: 'act-7',
        type: 'redeem',
        title: 'Redeemed Weekend Offer',
        subtitle: 'Noida – Sector 18 • 05 Oct 2026, 08:15 PM • Order #N180912',
        value: '15% Off (Saved ₹185)',
        valueType: 'positive'
      },
      {
        id: 'act-8',
        type: 'points',
        title: 'Earned 100 Bonus Points',
        subtitle: 'Campaign: Festival Bonus • 01 Oct 2026, 11:00 AM',
        value: '+100 pts',
        valueType: 'positive'
      },
      {
        id: 'act-9',
        type: 'tier',
        title: 'Tier Upgraded to VIP',
        subtitle: 'Loyalty Milestone • 28 Sep 2026, 04:30 PM',
        value: 'VIP Member',
        valueType: 'badge'
      },
      {
        id: 'act-10',
        type: 'order',
        title: 'Placed an order',
        subtitle: 'Noida – Sector 18 • 22 Sep 2026, 01:45 PM • Order #N179834',
        value: '₹950',
        valueType: 'amount'
      }
    ],
    walletTransactions: [
      {
        id: 'tx-1',
        title: 'Earned Reward Points',
        subtitle: 'Order #N181245 • 24 Oct 2026',
        value: '+50 pts',
        isPositive: true,
        type: 'points'
      },
      {
        id: 'tx-2',
        title: 'Redeemed Cashback',
        subtitle: 'Order #N171980 • 21 Oct 2026',
        value: '-₹100',
        isPositive: false,
        type: 'cashback'
      },
      {
        id: 'tx-3',
        title: 'Gifted Reward Points',
        subtitle: 'By Rohit Mehta • 12 Oct 2026',
        value: '+200 pts',
        isPositive: true,
        type: 'points'
      },
      {
        id: 'tx-4',
        title: 'Earned Cashback',
        subtitle: 'Order #N165432 • 05 Oct 2026',
        value: '+₹40',
        isPositive: true,
        type: 'cashback'
      },
      {
        id: 'tx-5',
        title: 'Redeemed Reward Points',
        subtitle: 'Order #N158912 • 28 Sep 2026',
        value: '-150 pts',
        isPositive: false,
        type: 'points'
      },
      {
        id: 'tx-6',
        title: 'Welcome Bonus Cashback',
        subtitle: 'Campaign: First Visit • 12 Apr 2024',
        value: '+₹100',
        isPositive: true,
        type: 'cashback'
      }
    ]
  },
  {
    id: 'cust-2',
    name: 'Rohan Mehta',
    phone: '+91 94291 09876',
    email: 'rohan.mehta@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    initials: 'RM',
    avatarBg: 'bg-[#EFF6FF]',
    avatarColor: 'text-[#3B82F6]',
    tier: 'Gold',
    lastVisit: '5 days ago',
    visits: 18,
    lifetimeSpend: 16420,
    points: 640,
    cashback: 120,
    customerId: 'CUS1025',
    memberSince: '20 May 2024',
    note: 'Frequent breakfast visitor, prefers artisanal espresso and muffins.',
    avgBillValue: 912,
    favouriteItems: ['Espresso', 'Blueberry Muffin'],
    preferredBranch: 'Connaught Place',
    branchesVisitedCount: 2,
    tierValidTill: '20 May 2025',
    qualifyingPoints: 180,
    maxQualifyingPoints: 300,
    campaignsCount: { active: 2, locked: 2, used: 4, expired: 1 },
    branchVisits: [
      { branch: 'Connaught Place', percent: 75 },
      { branch: 'Noida – Sector 18', percent: 25 }
    ],
    dob: '11 Aug 1995',
    gender: 'Male',
    city: 'Delhi',
    state: 'Delhi',
    campaigns: [],
    activities: [],
    walletTransactions: []
  },
  {
    id: 'cust-3',
    name: 'Priya Singh',
    phone: '+91 98765 42210',
    email: 'priya.singh@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    initials: 'PS',
    avatarBg: 'bg-[#ECFEFF]',
    avatarColor: 'text-[#06B6D4]',
    tier: 'Silver',
    lastVisit: '1 day ago',
    visits: 24,
    lifetimeSpend: 18230,
    points: 820,
    cashback: 210,
    customerId: 'CUS1026',
    memberSince: '18 Jun 2024',
    note: 'Regular evening guest, likes mocktails and desserts.',
    avgBillValue: 759,
    favouriteItems: ['Cold Brew', 'Brownie Sundae'],
    preferredBranch: 'Cyber Hub',
    branchesVisitedCount: 1,
    tierValidTill: '18 Jun 2025',
    qualifyingPoints: 240,
    maxQualifyingPoints: 300,
    campaignsCount: { active: 4, locked: 0, used: 6, expired: 3 },
    branchVisits: [{ branch: 'Cyber Hub', percent: 100 }],
    dob: '23 Sep 1999',
    gender: 'Female',
    city: 'Gurugram',
    state: 'Haryana',
    campaigns: [],
    activities: [],
    walletTransactions: []
  },
  {
    id: 'cust-4',
    name: 'Karan Verma',
    phone: '+91 94291 09876',
    email: 'karan.verma@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    initials: 'KV',
    avatarBg: 'bg-[#F0FDF4]',
    avatarColor: 'text-[#16A34A]',
    tier: 'Gold',
    lastVisit: '3 days ago',
    visits: 32,
    lifetimeSpend: 31500,
    points: 1040,
    cashback: 450,
    customerId: 'CUS1027',
    memberSince: '02 Feb 2024',
    note: 'Corporate group lunch host, large average order volume.',
    avgBillValue: 984,
    favouriteItems: ['Club Sandwich', 'Frappe'],
    preferredBranch: 'Noida – Sector 62',
    branchesVisitedCount: 2,
    tierValidTill: '02 Feb 2025',
    qualifyingPoints: 310,
    maxQualifyingPoints: 350,
    campaignsCount: { active: 3, locked: 1, used: 7, expired: 1 },
    branchVisits: [
      { branch: 'Noida – Sector 62', percent: 80 },
      { branch: 'Sector 18', percent: 20 }
    ],
    dob: '05 Dec 1992',
    gender: 'Male',
    city: 'Noida',
    state: 'Uttar Pradesh',
    campaigns: [],
    activities: [],
    walletTransactions: []
  },
  {
    id: 'cust-5',
    name: 'Aarav Sharma',
    phone: '+91 87654 32109',
    email: 'aarav.sharma@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
    initials: 'AS',
    avatarBg: 'bg-[#FEFCE8]',
    avatarColor: 'text-[#CA8A04]',
    tier: 'VVIP',
    lastVisit: '6 days ago',
    visits: 46,
    lifetimeSpend: 58200,
    points: 2450,
    cashback: 680,
    customerId: 'CUS1028',
    memberSince: '10 Jan 2024',
    note: 'Top loyalty spender, invited to all private tastings.',
    avgBillValue: 1265,
    favouriteItems: ['Speciality Pour Over', 'Avocado Toast'],
    preferredBranch: 'Connaught Place',
    branchesVisitedCount: 4,
    tierValidTill: '10 Jan 2026',
    qualifyingPoints: 500,
    maxQualifyingPoints: 500,
    campaignsCount: { active: 5, locked: 0, used: 12, expired: 1 },
    branchVisits: [
      { branch: 'Connaught Place', percent: 70 },
      { branch: 'Noida', percent: 30 }
    ],
    dob: '18 Mar 1990',
    gender: 'Male',
    city: 'Delhi',
    state: 'Delhi',
    campaigns: [],
    activities: [],
    walletTransactions: []
  },
  {
    id: 'cust-6',
    name: 'Neha Taneja',
    phone: '+91 65422 10917',
    email: 'neha.taneja@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
    initials: 'NT',
    avatarBg: 'bg-[#FAF5FF]',
    avatarColor: 'text-[#A855F7]',
    tier: 'Bronze',
    lastVisit: '10 days ago',
    visits: 6,
    lifetimeSpend: 4320,
    points: 120,
    cashback: 50,
    customerId: 'CUS1029',
    memberSince: '14 Sep 2024',
    note: 'New student patron, prefers afternoon discounts.',
    avgBillValue: 720,
    favouriteItems: ['Iced Latte', 'Croissant'],
    preferredBranch: 'Indiranagar',
    branchesVisitedCount: 1,
    tierValidTill: '14 Sep 2025',
    qualifyingPoints: 60,
    maxQualifyingPoints: 200,
    campaignsCount: { active: 2, locked: 1, used: 1, expired: 0 },
    branchVisits: [{ branch: 'Indiranagar', percent: 100 }],
    dob: '02 Jul 2002',
    gender: 'Female',
    city: 'Bengaluru',
    state: 'Karnataka',
    campaigns: [],
    activities: [],
    walletTransactions: []
  },
  {
    id: 'cust-7',
    name: 'Aditya Roy',
    phone: '+91 98112 34567',
    email: 'aditya.roy@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=250&q=80',
    initials: 'AR',
    avatarBg: 'bg-[#FAF5FF]',
    avatarColor: 'text-[#7C3AED]',
    tier: 'VVIP',
    lastVisit: 'Yesterday',
    visits: 52,
    lifetimeSpend: 64200,
    points: 2890,
    cashback: 850,
    customerId: 'CUS1030',
    memberSince: '05 Nov 2023',
    note: 'VIP customer across Delhi & Noida branches.',
    avgBillValue: 1234,
    favouriteItems: ['Handcrafted Cappuccino', 'Sourdough Panini'],
    preferredBranch: 'Noida – Sector 18',
    branchesVisitedCount: 3,
    tierValidTill: '05 Nov 2025',
    qualifyingPoints: 500,
    maxQualifyingPoints: 500,
    campaignsCount: { active: 4, locked: 0, used: 15, expired: 2 },
    branchVisits: [
      { branch: 'Noida – Sector 18', percent: 60 },
      { branch: 'Connaught Place', percent: 40 }
    ],
    dob: '12 Jan 1988',
    gender: 'Male',
    city: 'Noida',
    state: 'Uttar Pradesh',
    campaigns: [],
    activities: [],
    walletTransactions: []
  },
  {
    id: 'cust-8',
    name: 'Meera Kapoor',
    phone: '+91 97180 54321',
    email: 'meera.k@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    initials: 'MK',
    avatarBg: 'bg-[#FEFCE8]',
    avatarColor: 'text-[#D97706]',
    tier: 'Gold',
    lastVisit: '3 days ago',
    visits: 19,
    lifetimeSpend: 19850,
    points: 780,
    cashback: 240,
    customerId: 'CUS1031',
    memberSince: '15 Mar 2024',
    note: 'Weekend brunch enthusiast, loves customized herbal teas.',
    avgBillValue: 1045,
    favouriteItems: ['Matcha Latte', 'Avocado Crostini'],
    preferredBranch: 'DLF Mall of India',
    branchesVisitedCount: 2,
    tierValidTill: '15 Mar 2025',
    qualifyingPoints: 220,
    maxQualifyingPoints: 350,
    campaignsCount: { active: 3, locked: 1, used: 5, expired: 1 },
    branchVisits: [
      { branch: 'DLF Mall of India', percent: 85 },
      { branch: 'Sector 18', percent: 15 }
    ],
    dob: '08 Oct 1994',
    gender: 'Female',
    city: 'Noida',
    state: 'Uttar Pradesh',
    campaigns: [],
    activities: [],
    walletTransactions: []
  }
];

