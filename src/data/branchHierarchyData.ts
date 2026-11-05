export interface CampaignStat {
  id: string;
  name: string;
  discount?: string;
  redemptions: number;
  impact?: string;
  barColor?: string;
}

export interface BranchItem {
  id: string;
  name: string;
  shortName: string;
  city: string;
  state: string;
  status: 'Active' | 'Inactive';
  address: string;
  fullAddress: string;
  mall?: string;
  manager: string;
  phone: string;
  email?: string;
  image: string;
  revenue: number;
  revenueFormatted: string;
  revenueGrowth?: string;
  totalOrders: number;
  ordersGrowth?: string;
  avgOrderValue: number;
  avgOrderValueTarget?: string;
  footfall: number;
  footfallGrowth?: string;
  morningOrders: number;
  morningPct?: number;
  afternoonOrders: number;
  afternoonPct?: number;
  eveningOrders: number;
  eveningPct?: number;
  genderRatio: {
    male: number;
    female: number;
    other: number;
    maleCount?: number;
    femaleCount?: number;
    otherCount?: number;
  };
  topCampaigns: CampaignStat[];
  activeQrCodes?: number;
  tables?: number;
  counters?: number;
  operatingHours?: string;
  recentActivity?: {
    type: 'redemption' | 'order' | 'customer';
    title: string;
    timeAgo: string;
  }[];
}

export interface CityData {
  id: string;
  name: string;
  state: string;
  branchesCount: number;
  activeCount: number;
  inactiveCount: number;
  revenue: number;
  revenueFormatted: string;
  totalOrders: number;
  avgOrdersPerBranch: number;
  morningOrders: number;
  afternoonOrders: number;
  eveningOrders: number;
  genderRatio: {
    male: number;
    female: number;
    other: number;
  };
  topCampaigns: CampaignStat[];
  branches: BranchItem[];
}

export interface StateData {
  id: string;
  name: string;
  branchesCount: number;
  activeCount: number;
  inactiveCount: number;
  revenue: number;
  revenueFormatted: string;
  morningOrders: number;
  afternoonOrders: number;
  eveningOrders: number;
  genderRatio: {
    male: number;
    female: number;
    other: number;
  };
  topCampaigns: CampaignStat[];
  cities: CityData[];
}

export const BRANCH_HIERARCHY_DATA: StateData[] = [
  {
    id: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    branchesCount: 8,
    activeCount: 5,
    inactiveCount: 3,
    revenue: 724500,
    revenueFormatted: '₹7,24,500',
    morningOrders: 560,
    afternoonOrders: 630,
    eveningOrders: 630,
    genderRatio: { male: 46, female: 49, other: 5 },
    topCampaigns: [
      { id: 'c1', name: 'Welcome Special', redemptions: 245, discount: '20% Off', impact: '+14% vs avg', barColor: '#8B5CF6' },
      { id: 'c2', name: 'Weekend Treat', redemptions: 182, discount: 'Flat ₹150', impact: 'Consistent', barColor: '#F43F5E' },
      { id: 'c3', name: 'Happy Hours', redemptions: 124, discount: '1+1 Drinks', impact: '+8% weekly', barColor: '#8B5CF6' }
    ],
    cities: [
      {
        id: 'noida',
        name: 'Noida',
        state: 'Uttar Pradesh',
        branchesCount: 3,
        activeCount: 2,
        inactiveCount: 1,
        revenue: 324500,
        revenueFormatted: '₹3,24,500',
        totalOrders: 600,
        avgOrdersPerBranch: 200,
        morningOrders: 240,
        afternoonOrders: 290,
        eveningOrders: 290,
        genderRatio: { male: 46, female: 49, other: 5 },
        topCampaigns: [
          { id: 'c1', name: 'Welcome Special', redemptions: 161, discount: '20% Off', impact: '+14% vs avg', barColor: '#8B5CF6' },
          { id: 'c2', name: 'Weekend Treat', redemptions: 120, discount: 'Flat ₹150', impact: 'Consistent', barColor: '#F43F5E' },
          { id: 'c3', name: 'Happy Hours', redemptions: 80, discount: '1+1 Drinks', impact: '+8% weekly', barColor: '#8B5CF6' }
        ],
        branches: [
          {
            id: 'noida-sec-18',
            name: 'Noida — Sector 18',
            shortName: 'Sector 18',
            city: 'Noida',
            state: 'Uttar Pradesh',
            status: 'Active',
            address: 'Sector 18, Noida',
            fullAddress: 'Shop 12, Logix Mall, Sector 18, Noida, Uttar Pradesh',
            mall: 'Logix Mall',
            manager: 'Rohit Mehta',
            phone: '+91 98765 43210',
            email: 'rohit.mehta@revia.com',
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
            revenue: 162400,
            revenueFormatted: '₹1,62,400',
            revenueGrowth: '+12.4% vs last mo',
            totalOrders: 320,
            ordersGrowth: '+8.1% vs last mo',
            avgOrderValue: 507,
            avgOrderValueTarget: 'Stable • ₹500 target',
            footfall: 186,
            footfallGrowth: '+15 new guests',
            morningOrders: 120,
            morningPct: 37,
            afternoonOrders: 110,
            afternoonPct: 34,
            eveningOrders: 90,
            eveningPct: 28,
            genderRatio: {
              male: 45,
              female: 50,
              other: 5,
              maleCount: 84,
              femaleCount: 93,
              otherCount: 9
            },
            topCampaigns: [
              { id: 'c1', name: 'Welcome Special', discount: '20% Off', redemptions: 86, impact: '+14% vs avg', barColor: '#8B5CF6' },
              { id: 'c2', name: 'Weekend Treat', discount: 'Flat ₹150', redemptions: 62, impact: 'Consistent', barColor: '#F43F5E' },
              { id: 'c3', name: 'Happy Hours', discount: '1+1 Drinks', redemptions: 45, impact: '+8% weekly', barColor: '#8B5CF6' }
            ],
            activeQrCodes: 3,
            tables: 12,
            counters: 2,
            operatingHours: '11:00 AM - 11:00 PM',
            recentActivity: [
              { type: 'redemption', title: 'Welcome Special redeemed', timeAgo: '2 hours ago' },
              { type: 'order', title: 'Order #320 placed', timeAgo: '4 hours ago' },
              { type: 'customer', title: 'Customer registered via QR', timeAgo: '6 hours ago' }
            ]
          },
          {
            id: 'noida-sec-62',
            name: 'Noida — Sector 62',
            shortName: 'Sector 62',
            city: 'Noida',
            state: 'Uttar Pradesh',
            status: 'Active',
            address: 'Sector 62, Noida',
            fullAddress: 'Tower B, Stellar IT Park, Sector 62, Noida, Uttar Pradesh',
            manager: 'Priya Sharma',
            phone: '+91 98765 12345',
            email: 'priya.sharma@revia.com',
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
            revenue: 112800,
            revenueFormatted: '₹1,12,800',
            revenueGrowth: '+6.5% vs last mo',
            totalOrders: 280,
            ordersGrowth: '+4.2% vs last mo',
            avgOrderValue: 402,
            avgOrderValueTarget: 'Stable • ₹400 target',
            footfall: 142,
            footfallGrowth: '+10 new guests',
            morningOrders: 80,
            morningPct: 29,
            afternoonOrders: 100,
            afternoonPct: 36,
            eveningOrders: 100,
            eveningPct: 36,
            genderRatio: {
              male: 48,
              female: 47,
              other: 5,
              maleCount: 68,
              femaleCount: 67,
              otherCount: 7
            },
            topCampaigns: [
              { id: 'c1', name: 'Welcome Special', discount: '20% Off', redemptions: 50, impact: '+10% vs avg', barColor: '#8B5CF6' },
              { id: 'c2', name: 'Weekend Treat', discount: 'Flat ₹150', redemptions: 33, impact: 'Moderate', barColor: '#F43F5E' },
              { id: 'c3', name: 'Happy Hours', discount: '1+1 Drinks', redemptions: 20, impact: '+5% weekly', barColor: '#8B5CF6' }
            ],
            activeQrCodes: 2,
            tables: 10,
            counters: 1,
            operatingHours: '10:00 AM - 10:00 PM',
            recentActivity: [
              { type: 'redemption', title: 'Happy Hours redeemed', timeAgo: '1 hour ago' },
              { type: 'order', title: 'Order #279 placed', timeAgo: '3 hours ago' }
            ]
          },
          {
            id: 'noida-expressway',
            name: 'Noida — Expressway',
            shortName: 'Expressway',
            city: 'Noida',
            state: 'Uttar Pradesh',
            status: 'Inactive',
            address: 'Expressway, Noida',
            fullAddress: 'Plot 4, Sector 135, Noida Expressway, Uttar Pradesh',
            manager: 'Arjun Patel',
            phone: '+91 98765 67890',
            email: 'arjun.patel@revia.com',
            image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600&auto=format&fit=crop&q=80',
            revenue: 49300,
            revenueFormatted: '₹49,300',
            revenueGrowth: '-2.1% vs last mo',
            totalOrders: 220,
            ordersGrowth: '-5.0% vs last mo',
            avgOrderValue: 224,
            avgOrderValueTarget: 'Below target • ₹350 target',
            footfall: 95,
            footfallGrowth: '-8 vs last mo',
            morningOrders: 40,
            morningPct: 18,
            afternoonOrders: 80,
            afternoonPct: 36,
            eveningOrders: 100,
            eveningPct: 45,
            genderRatio: {
              male: 46,
              female: 48,
              other: 6,
              maleCount: 44,
              femaleCount: 46,
              otherCount: 5
            },
            topCampaigns: [
              { id: 'c2', name: 'Weekend Treat', discount: 'Flat ₹150', redemptions: 25, impact: 'Stable', barColor: '#F43F5E' },
              { id: 'c1', name: 'Welcome Special', discount: '20% Off', redemptions: 24, impact: '+2% vs avg', barColor: '#8B5CF6' },
              { id: 'c3', name: 'Happy Hours', discount: '1+1 Drinks', redemptions: 15, impact: 'Needs Boost', barColor: '#8B5CF6' }
            ],
            activeQrCodes: 2,
            tables: 8,
            counters: 1,
            operatingHours: '12:00 PM - 9:00 PM',
            recentActivity: [
              { type: 'order', title: 'Order #219 placed', timeAgo: '8 hours ago' }
            ]
          }
        ]
      },
      {
        id: 'lucknow',
        name: 'Lucknow',
        state: 'Uttar Pradesh',
        branchesCount: 5,
        activeCount: 4,
        inactiveCount: 1,
        revenue: 324500,
        revenueFormatted: '₹3,24,500',
        totalOrders: 510,
        avgOrdersPerBranch: 102,
        morningOrders: 320,
        afternoonOrders: 420,
        eveningOrders: 500,
        genderRatio: { male: 43, female: 52, other: 5 },
        topCampaigns: [
          { id: 'c4', name: 'Coffee Club', redemptions: 210, discount: '15% Off', barColor: '#8B5CF6' },
          { id: 'c5', name: 'Monsoon Offer', redemptions: 166, discount: 'Special Combo', barColor: '#F43F5E' },
          { id: 'c6', name: 'BOGO Burgers', redemptions: 96, discount: 'Buy 1 Get 1', barColor: '#8B5CF6' }
        ],
        branches: [
          {
            id: 'lko-hazratganj',
            name: 'Lucknow — Hazratganj',
            shortName: 'Hazratganj',
            city: 'Lucknow',
            state: 'Uttar Pradesh',
            status: 'Active',
            address: 'Hazratganj, Lucknow',
            fullAddress: 'MG Road, Hazratganj, Lucknow, Uttar Pradesh',
            manager: 'Kabir Singh',
            phone: '+91 98765 22334',
            image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
            revenue: 145000,
            revenueFormatted: '₹1,45,000',
            totalOrders: 210,
            avgOrderValue: 690,
            footfall: 160,
            morningOrders: 80,
            afternoonOrders: 110,
            eveningOrders: 130,
            genderRatio: { male: 42, female: 53, other: 5 },
            topCampaigns: [
              { id: 'c4', name: 'Coffee Club', redemptions: 110, barColor: '#8B5CF6' }
            ]
          }
        ]
      },
      {
        id: 'kanpur',
        name: 'Kanpur',
        state: 'Uttar Pradesh',
        branchesCount: 4,
        activeCount: 3,
        inactiveCount: 1,
        revenue: 320400,
        revenueFormatted: '₹3,20,400',
        totalOrders: 480,
        avgOrdersPerBranch: 120,
        morningOrders: 300,
        afternoonOrders: 630,
        eveningOrders: 630,
        genderRatio: { male: 46, female: 46, other: 5 },
        topCampaigns: [
          { id: 'c3', name: 'Happy Hours', redemptions: 142, barColor: '#8B5CF6' },
          { id: 'c7', name: 'Birthday Special', redemptions: 110, barColor: '#F43F5E' },
          { id: 'c2', name: 'Weekend Treat', redemptions: 88, barColor: '#8B5CF6' }
        ],
        branches: []
      },
      {
        id: 'bareilly',
        name: 'Bareilly',
        state: 'Uttar Pradesh',
        branchesCount: 4,
        activeCount: 4,
        inactiveCount: 0,
        revenue: 217300,
        revenueFormatted: '₹2,17,300',
        totalOrders: 390,
        avgOrdersPerBranch: 97,
        morningOrders: 180,
        afternoonOrders: 200,
        eveningOrders: 160,
        genderRatio: { male: 48, female: 47, other: 5 },
        topCampaigns: [
          { id: 'c8', name: 'South Indian Fest', redemptions: 102, barColor: '#8B5CF6' },
          { id: 'c9', name: 'Combo Meals', redemptions: 86, barColor: '#F43F5E' },
          { id: 'c10', name: 'Student Special', redemptions: 61, barColor: '#8B5CF6' }
        ],
        branches: []
      },
      {
        id: 'greater-noida',
        name: 'Greater Noida',
        state: 'Uttar Pradesh',
        branchesCount: 4,
        activeCount: 4,
        inactiveCount: 0,
        revenue: 217300,
        revenueFormatted: '₹2,17,300',
        totalOrders: 410,
        avgOrdersPerBranch: 102,
        morningOrders: 180,
        afternoonOrders: 200,
        eveningOrders: 160,
        genderRatio: { male: 48, female: 47, other: 5 },
        topCampaigns: [
          { id: 'c8', name: 'South Indian Fest', redemptions: 102, barColor: '#8B5CF6' },
          { id: 'c9', name: 'Combo Meals', redemptions: 86, barColor: '#F43F5E' },
          { id: 'c10', name: 'Student Special', redemptions: 61, barColor: '#8B5CF6' }
        ],
        branches: []
      },
      {
        id: 'ayodhya',
        name: 'Ayodhya',
        state: 'Uttar Pradesh',
        branchesCount: 4,
        activeCount: 4,
        inactiveCount: 0,
        revenue: 217300,
        revenueFormatted: '₹2,17,300',
        totalOrders: 380,
        avgOrdersPerBranch: 95,
        morningOrders: 180,
        afternoonOrders: 200,
        eveningOrders: 160,
        genderRatio: { male: 48, female: 47, other: 5 },
        topCampaigns: [
          { id: 'c8', name: 'South Indian Fest', redemptions: 102, barColor: '#8B5CF6' },
          { id: 'c9', name: 'Combo Meals', redemptions: 86, barColor: '#F43F5E' },
          { id: 'c10', name: 'Student Special', redemptions: 61, barColor: '#8B5CF6' }
        ],
        branches: []
      }
    ]
  },
  {
    id: 'delhi',
    name: 'Delhi',
    branchesCount: 5,
    activeCount: 4,
    inactiveCount: 1,
    revenue: 324500,
    revenueFormatted: '₹3,24,500',
    morningOrders: 320,
    afternoonOrders: 420,
    eveningOrders: 500,
    genderRatio: { male: 43, female: 52, other: 5 },
    topCampaigns: [
      { id: 'c4', name: 'Coffee Club', redemptions: 210, discount: '15% Off', barColor: '#8B5CF6' },
      { id: 'c5', name: 'Monsoon Offer', redemptions: 166, discount: 'Combo Special', barColor: '#F43F5E' },
      { id: 'c6', name: 'BOGO Burgers', redemptions: 96, discount: 'Buy 1 Get 1', barColor: '#8B5CF6' }
    ],
    cities: [
      {
        id: 'connaught-place',
        name: 'Central Delhi (CP)',
        state: 'Delhi',
        branchesCount: 3,
        activeCount: 3,
        inactiveCount: 0,
        revenue: 185000,
        revenueFormatted: '₹1,85,000',
        totalOrders: 320,
        avgOrdersPerBranch: 107,
        morningOrders: 140,
        afternoonOrders: 190,
        eveningOrders: 220,
        genderRatio: { male: 45, female: 50, other: 5 },
        topCampaigns: [
          { id: 'c4', name: 'Coffee Club', redemptions: 120, barColor: '#8B5CF6' }
        ],
        branches: [
          {
            id: 'delhi-cp-inner',
            name: 'Delhi — Connaught Place',
            shortName: 'Connaught Place',
            city: 'Central Delhi',
            state: 'Delhi',
            status: 'Active',
            address: 'Connaught Circle, New Delhi',
            fullAddress: 'Block A, Inner Circle, Connaught Place, New Delhi',
            manager: 'Vikas Khanna',
            phone: '+91 98111 22334',
            image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80',
            revenue: 120000,
            revenueFormatted: '₹1,20,000',
            totalOrders: 180,
            avgOrderValue: 666,
            footfall: 140,
            morningOrders: 60,
            afternoonOrders: 80,
            eveningOrders: 90,
            genderRatio: { male: 44, female: 51, other: 5 },
            topCampaigns: [
              { id: 'c4', name: 'Coffee Club', redemptions: 75, barColor: '#8B5CF6' }
            ]
          }
        ]
      },
      {
        id: 'south-delhi',
        name: 'South Delhi (Saket)',
        state: 'Delhi',
        branchesCount: 2,
        activeCount: 1,
        inactiveCount: 1,
        revenue: 139500,
        revenueFormatted: '₹1,39,500',
        totalOrders: 190,
        avgOrdersPerBranch: 95,
        morningOrders: 80,
        afternoonOrders: 110,
        eveningOrders: 130,
        genderRatio: { male: 42, female: 53, other: 5 },
        topCampaigns: [
          { id: 'c5', name: 'Monsoon Offer', redemptions: 66, barColor: '#F43F5E' }
        ],
        branches: []
      }
    ]
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    branchesCount: 4,
    activeCount: 3,
    inactiveCount: 1,
    revenue: 320400,
    revenueFormatted: '₹3,20,400',
    morningOrders: 300,
    afternoonOrders: 630,
    eveningOrders: 630,
    genderRatio: { male: 46, female: 46, other: 5 },
    topCampaigns: [
      { id: 'c3', name: 'Happy Hours', redemptions: 142, barColor: '#8B5CF6' },
      { id: 'c7', name: 'Birthday Special', redemptions: 110, barColor: '#F43F5E' },
      { id: 'c2', name: 'Weekend Treat', redemptions: 88, barColor: '#8B5CF6' }
    ],
    cities: [
      {
        id: 'mumbai',
        name: 'Mumbai',
        state: 'Maharashtra',
        branchesCount: 2,
        activeCount: 2,
        inactiveCount: 0,
        revenue: 210000,
        revenueFormatted: '₹2,10,000',
        totalOrders: 350,
        avgOrdersPerBranch: 175,
        morningOrders: 160,
        afternoonOrders: 220,
        eveningOrders: 240,
        genderRatio: { male: 47, female: 48, other: 5 },
        topCampaigns: [],
        branches: []
      },
      {
        id: 'pune',
        name: 'Pune',
        state: 'Maharashtra',
        branchesCount: 2,
        activeCount: 1,
        inactiveCount: 1,
        revenue: 110400,
        revenueFormatted: '₹1,10,400',
        totalOrders: 210,
        avgOrdersPerBranch: 105,
        morningOrders: 90,
        afternoonOrders: 140,
        eveningOrders: 150,
        genderRatio: { male: 45, female: 49, other: 6 },
        topCampaigns: [],
        branches: []
      }
    ]
  },
  {
    id: 'karnataka',
    name: 'Karnataka',
    branchesCount: 4,
    activeCount: 4,
    inactiveCount: 0,
    revenue: 217300,
    revenueFormatted: '₹2,17,300',
    morningOrders: 180,
    afternoonOrders: 200,
    eveningOrders: 160,
    genderRatio: { male: 48, female: 47, other: 5 },
    topCampaigns: [
      { id: 'c8', name: 'South Indian Fest', redemptions: 102, barColor: '#8B5CF6' },
      { id: 'c9', name: 'Combo Meals', redemptions: 86, barColor: '#F43F5E' },
      { id: 'c10', name: 'Student Special', redemptions: 61, barColor: '#8B5CF6' }
    ],
    cities: [
      {
        id: 'bengaluru',
        name: 'Bengaluru',
        state: 'Karnataka',
        branchesCount: 4,
        activeCount: 4,
        inactiveCount: 0,
        revenue: 217300,
        revenueFormatted: '₹2,17,300',
        totalOrders: 390,
        avgOrdersPerBranch: 97,
        morningOrders: 180,
        afternoonOrders: 200,
        eveningOrders: 160,
        genderRatio: { male: 48, female: 47, other: 5 },
        topCampaigns: [],
        branches: []
      }
    ]
  },
  {
    id: 'bihar',
    name: 'Bihar',
    branchesCount: 4,
    activeCount: 4,
    inactiveCount: 0,
    revenue: 217300,
    revenueFormatted: '₹2,17,300',
    morningOrders: 180,
    afternoonOrders: 200,
    eveningOrders: 160,
    genderRatio: { male: 48, female: 47, other: 5 },
    topCampaigns: [
      { id: 'c8', name: 'South Indian Fest', redemptions: 102, barColor: '#8B5CF6' },
      { id: 'c9', name: 'Combo Meals', redemptions: 86, barColor: '#F43F5E' },
      { id: 'c10', name: 'Student Special', redemptions: 61, barColor: '#8B5CF6' }
    ],
    cities: [
      {
        id: 'patna',
        name: 'Patna',
        state: 'Bihar',
        branchesCount: 4,
        activeCount: 4,
        inactiveCount: 0,
        revenue: 217300,
        revenueFormatted: '₹2,17,300',
        totalOrders: 390,
        avgOrdersPerBranch: 97,
        morningOrders: 180,
        afternoonOrders: 200,
        eveningOrders: 160,
        genderRatio: { male: 48, female: 47, other: 5 },
        topCampaigns: [],
        branches: []
      }
    ]
  },
  {
    id: 'madhya-pradesh',
    name: 'Madhya Pradesh',
    branchesCount: 4,
    activeCount: 4,
    inactiveCount: 0,
    revenue: 217300,
    revenueFormatted: '₹2,17,300',
    morningOrders: 180,
    afternoonOrders: 200,
    eveningOrders: 160,
    genderRatio: { male: 48, female: 47, other: 5 },
    topCampaigns: [
      { id: 'c8', name: 'South Indian Fest', redemptions: 102, barColor: '#8B5CF6' },
      { id: 'c9', name: 'Combo Meals', redemptions: 86, barColor: '#F43F5E' },
      { id: 'c10', name: 'Student Special', redemptions: 61, barColor: '#8B5CF6' }
    ],
    cities: [
      {
        id: 'indore',
        name: 'Indore',
        state: 'Madhya Pradesh',
        branchesCount: 2,
        activeCount: 2,
        inactiveCount: 0,
        revenue: 120000,
        revenueFormatted: '₹1,20,000',
        totalOrders: 200,
        avgOrdersPerBranch: 100,
        morningOrders: 90,
        afternoonOrders: 110,
        eveningOrders: 110,
        genderRatio: { male: 47, female: 48, other: 5 },
        topCampaigns: [],
        branches: []
      },
      {
        id: 'bhopal',
        name: 'Bhopal',
        state: 'Madhya Pradesh',
        branchesCount: 2,
        activeCount: 2,
        inactiveCount: 0,
        revenue: 97300,
        revenueFormatted: '₹97,300',
        totalOrders: 180,
        avgOrdersPerBranch: 90,
        morningOrders: 80,
        afternoonOrders: 90,
        eveningOrders: 80,
        genderRatio: { male: 49, female: 46, other: 5 },
        topCampaigns: [],
        branches: []
      }
    ]
  }
];

