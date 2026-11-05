export interface WebBranchItem {
  id: string;
  name: string;
  code: string;
  storeId: string;
  type: string;
  location: string;
  fullAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  status: 'Active' | 'Inactive';
  orders: number;
  ordersGrowth?: string;
  footfall: number;
  footfallGrowth?: string;
  revenue: number;
  revenueFormatted: string;
  revenueGrowth?: string;
  image: string;
  galleryImages: string[];
  description: string;
  operatingHours: string;
  operatingHoursList: {
    day: string;
    isOpen: boolean;
    openTime: string;
    closeTime: string;
  }[];
  posProvider?: string;
  posTerminalId?: string;
  syncMenuWithPos?: boolean;
  menuFile?: string;
  menuItemsCount?: number;
  recentActivity: {
    type: 'order' | 'campaign' | 'customer';
    title: string;
    subtitle: string;
    timeAgo: string;
  }[];
}

export const INITIAL_WEB_BRANCHES: WebBranchItem[] = [
  {
    id: 'br-001',
    name: 'Downtown Flagship',
    code: 'BR001',
    storeId: 'LA-DF-01',
    type: 'Dine-in & Takeaway',
    location: '428 S Spring St, Los Angeles, CA 90013',
    fullAddress: '428 S Spring St, Los Angeles, CA 90013, United States',
    city: 'Los Angeles',
    state: 'California',
    zipCode: '90013',
    country: 'United States',
    status: 'Active',
    orders: 892,
    ordersGrowth: '+12%',
    footfall: 1248,
    footfallGrowth: '+18%',
    revenue: 164000,
    revenueFormatted: '₹1.64L',
    revenueGrowth: '+16%',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80'
    ],
    description: 'Main outlet located in the heart of the city with premium dine-in, takeaway and special events.',
    operatingHours: 'Mon - Sun • 7:00 AM - 11:00 PM',
    operatingHoursList: [
      { day: 'Monday', isOpen: true, openTime: '07:00 AM', closeTime: '11:00 PM' },
      { day: 'Tuesday', isOpen: true, openTime: '07:00 AM', closeTime: '11:00 PM' },
      { day: 'Wednesday', isOpen: true, openTime: '07:00 AM', closeTime: '11:00 PM' },
      { day: 'Thursday', isOpen: true, openTime: '07:00 AM', closeTime: '11:00 PM' },
      { day: 'Friday', isOpen: true, openTime: '07:00 AM', closeTime: '11:00 PM' },
      { day: 'Saturday', isOpen: true, openTime: '07:00 AM', closeTime: '11:00 PM' },
      { day: 'Sunday', isOpen: false, openTime: '07:00 AM', closeTime: '11:00 PM' }
    ],
    posProvider: 'Square / Toast / Others',
    posTerminalId: 'POS-001',
    syncMenuWithPos: true,
    menuFile: 'Spring_Dinner_Menu_v2.pdf',
    menuItemsCount: 42,
    recentActivity: [
      {
        type: 'order',
        title: 'New order received',
        subtitle: 'Table 12 • 4 items • ₹1,420',
        timeAgo: '12 mins ago'
      },
      {
        type: 'campaign',
        title: 'Campaign created',
        subtitle: 'Weekend Special • Downtown Flagship',
        timeAgo: '1 hr ago'
      },
      {
        type: 'customer',
        title: 'New customer joined',
        subtitle: '+3 loyalty members',
        timeAgo: '2 hrs ago'
      }
    ]
  },
  {
    id: 'br-002',
    name: 'Westside Outlet',
    code: 'BR002',
    storeId: 'LA-WO-02',
    type: 'Café & Quick Service',
    location: '1201 W 5th St, Los Angeles, CA 90017',
    fullAddress: '1201 W 5th St, Los Angeles, CA 90017, United States',
    city: 'Los Angeles',
    state: 'California',
    zipCode: '90017',
    country: 'United States',
    status: 'Active',
    orders: 950,
    ordersGrowth: '+14%',
    footfall: 594,
    footfallGrowth: '+9%',
    revenue: 84000,
    revenueFormatted: '₹0.84L',
    revenueGrowth: '+11%',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=500&auto=format&fit=crop&q=80'
    ],
    description: 'Bustling café offering grab-and-go specialty coffees, brunch pastries and mobile pickup.',
    operatingHours: 'Mon - Sat • 6:30 AM - 9:00 PM',
    operatingHoursList: [
      { day: 'Monday', isOpen: true, openTime: '06:30 AM', closeTime: '09:00 PM' },
      { day: 'Tuesday', isOpen: true, openTime: '06:30 AM', closeTime: '09:00 PM' },
      { day: 'Wednesday', isOpen: true, openTime: '06:30 AM', closeTime: '09:00 PM' },
      { day: 'Thursday', isOpen: true, openTime: '06:30 AM', closeTime: '09:00 PM' },
      { day: 'Friday', isOpen: true, openTime: '06:30 AM', closeTime: '09:00 PM' },
      { day: 'Saturday', isOpen: true, openTime: '07:00 AM', closeTime: '09:00 PM' },
      { day: 'Sunday', isOpen: false, openTime: '07:00 AM', closeTime: '09:00 PM' }
    ],
    posProvider: 'Square',
    posTerminalId: 'POS-002',
    syncMenuWithPos: true,
    menuFile: 'Westside_Breakfast_Menu.pdf',
    menuItemsCount: 30,
    recentActivity: [
      {
        type: 'order',
        title: 'New order received',
        subtitle: 'Pickup #41 • 2 items • ₹450',
        timeAgo: '5 mins ago'
      },
      {
        type: 'customer',
        title: 'New customer joined',
        subtitle: '+1 loyalty member',
        timeAgo: '45 mins ago'
      }
    ]
  },
  {
    id: 'br-003',
    name: 'Sunset Square',
    code: 'BR003',
    storeId: 'LA-SS-03',
    type: 'Bistro & Lounge',
    location: '3333 Sunset Blvd, Los Angeles, CA 90026',
    fullAddress: '3333 Sunset Blvd, Los Angeles, CA 90026, United States',
    city: 'Los Angeles',
    state: 'California',
    zipCode: '90026',
    country: 'United States',
    status: 'Active',
    orders: 620,
    ordersGrowth: '+8%',
    footfall: 432,
    footfallGrowth: '+5%',
    revenue: 56000,
    revenueFormatted: '₹0.56L',
    revenueGrowth: '+7%',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1000&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80'
    ],
    description: 'Chic lounge terrace featuring evening cocktails, artisanal flatbreads and live acoustics.',
    operatingHours: 'Tue - Sun • 12:00 PM - 12:00 AM',
    operatingHoursList: [
      { day: 'Monday', isOpen: false, openTime: '12:00 PM', closeTime: '12:00 AM' },
      { day: 'Tuesday', isOpen: true, openTime: '12:00 PM', closeTime: '12:00 AM' },
      { day: 'Wednesday', isOpen: true, openTime: '12:00 PM', closeTime: '12:00 AM' },
      { day: 'Thursday', isOpen: true, openTime: '12:00 PM', closeTime: '12:00 AM' },
      { day: 'Friday', isOpen: true, openTime: '12:00 PM', closeTime: '01:00 AM' },
      { day: 'Saturday', isOpen: true, openTime: '12:00 PM', closeTime: '01:00 AM' },
      { day: 'Sunday', isOpen: true, openTime: '12:00 PM', closeTime: '11:00 PM' }
    ],
    posProvider: 'Toast',
    posTerminalId: 'POS-003',
    syncMenuWithPos: true,
    menuFile: 'Sunset_Evening_Lounge.pdf',
    menuItemsCount: 26,
    recentActivity: [
      {
        type: 'campaign',
        title: 'Happy Hours active',
        subtitle: '1+1 Cocktails tier enabled',
        timeAgo: '30 mins ago'
      }
    ]
  },
  {
    id: 'br-004',
    name: 'Riverside Dine',
    code: 'BR004',
    storeId: 'LA-RD-04',
    type: 'Dining & Events',
    location: '700 N Alameda St, Los Angeles, CA 90012',
    fullAddress: '700 N Alameda St, Los Angeles, CA 90012, United States',
    city: 'Los Angeles',
    state: 'California',
    zipCode: '90012',
    country: 'United States',
    status: 'Inactive',
    orders: 210,
    ordersGrowth: '-4%',
    footfall: 134,
    footfallGrowth: '-8%',
    revenue: 22000,
    revenueFormatted: '₹0.22L',
    revenueGrowth: '-2%',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=80'
    ],
    description: 'Scenic waterfront patio currently undergoing seasonal kitchen maintenance.',
    operatingHours: 'Fri - Sun • 4:00 PM - 10:00 PM',
    operatingHoursList: [
      { day: 'Monday', isOpen: false, openTime: '04:00 PM', closeTime: '10:00 PM' },
      { day: 'Tuesday', isOpen: false, openTime: '04:00 PM', closeTime: '10:00 PM' },
      { day: 'Wednesday', isOpen: false, openTime: '04:00 PM', closeTime: '10:00 PM' },
      { day: 'Thursday', isOpen: false, openTime: '04:00 PM', closeTime: '10:00 PM' },
      { day: 'Friday', isOpen: true, openTime: '04:00 PM', closeTime: '10:00 PM' },
      { day: 'Saturday', isOpen: true, openTime: '04:00 PM', closeTime: '10:00 PM' },
      { day: 'Sunday', isOpen: true, openTime: '04:00 PM', closeTime: '10:00 PM' }
    ],
    posProvider: 'Clover',
    posTerminalId: 'POS-004',
    syncMenuWithPos: false,
    menuFile: 'Riverside_Summer.pdf',
    menuItemsCount: 18,
    recentActivity: [
      {
        type: 'order',
        title: 'Maintenance ticket resolved',
        subtitle: 'KDS firmware updated',
        timeAgo: '1 day ago'
      }
    ]
  },
  {
    id: 'br-005',
    name: 'Beverly Atrium',
    code: 'BR005',
    storeId: 'LA-BA-05',
    type: 'Boutique Coffee',
    location: '8500 Beverly Blvd, Los Angeles, CA 90048',
    fullAddress: '8500 Beverly Blvd, Los Angeles, CA 90048, United States',
    city: 'Los Angeles',
    state: 'California',
    zipCode: '90048',
    country: 'United States',
    status: 'Active',
    orders: 740,
    ordersGrowth: '+10%',
    footfall: 910,
    footfallGrowth: '+12%',
    revenue: 112000,
    revenueFormatted: '₹1.12L',
    revenueGrowth: '+13%',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1000&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80'
    ],
    description: 'High-end mall atrium kiosk with luxury coffee beans, tasting flights and member loyalty discounts.',
    operatingHours: 'Mon - Sun • 9:00 AM - 9:00 PM',
    operatingHoursList: [
      { day: 'Monday', isOpen: true, openTime: '09:00 AM', closeTime: '09:00 PM' },
      { day: 'Tuesday', isOpen: true, openTime: '09:00 AM', closeTime: '09:00 PM' },
      { day: 'Wednesday', isOpen: true, openTime: '09:00 AM', closeTime: '09:00 PM' },
      { day: 'Thursday', isOpen: true, openTime: '09:00 AM', closeTime: '09:00 PM' },
      { day: 'Friday', isOpen: true, openTime: '09:00 AM', closeTime: '09:00 PM' },
      { day: 'Saturday', isOpen: true, openTime: '09:00 AM', closeTime: '09:00 PM' },
      { day: 'Sunday', isOpen: true, openTime: '10:00 AM', closeTime: '08:00 PM' }
    ],
    posProvider: 'Square',
    posTerminalId: 'POS-005',
    syncMenuWithPos: true,
    menuFile: 'Beverly_Beverages.pdf',
    menuItemsCount: 35,
    recentActivity: [
      {
        type: 'order',
        title: 'New order received',
        subtitle: 'Atrium Seat 4 • ₹890',
        timeAgo: '18 mins ago'
      }
    ]
  },
  {
    id: 'br-006',
    name: 'Santa Monica Beachwalk',
    code: 'BR006',
    storeId: 'LA-SM-06',
    type: 'Beachside Café',
    location: '1540 Ocean Ave, Santa Monica, CA 90401',
    fullAddress: '1540 Ocean Ave, Santa Monica, CA 90401, United States',
    city: 'Santa Monica',
    state: 'California',
    zipCode: '90401',
    country: 'United States',
    status: 'Active',
    orders: 810,
    ordersGrowth: '+15%',
    footfall: 1100,
    footfallGrowth: '+20%',
    revenue: 138000,
    revenueFormatted: '₹1.38L',
    revenueGrowth: '+18%',
    image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1000&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80'
    ],
    description: 'Popular beachfront spot serving organic acai bowls, cold brews, and coastal wraps.',
    operatingHours: 'Mon - Sun • 6:00 AM - 8:00 PM',
    operatingHoursList: [
      { day: 'Monday', isOpen: true, openTime: '06:00 AM', closeTime: '08:00 PM' },
      { day: 'Tuesday', isOpen: true, openTime: '06:00 AM', closeTime: '08:00 PM' },
      { day: 'Wednesday', isOpen: true, openTime: '06:00 AM', closeTime: '08:00 PM' },
      { day: 'Thursday', isOpen: true, openTime: '06:00 AM', closeTime: '08:00 PM' },
      { day: 'Friday', isOpen: true, openTime: '06:00 AM', closeTime: '08:00 PM' },
      { day: 'Saturday', isOpen: true, openTime: '06:00 AM', closeTime: '08:00 PM' },
      { day: 'Sunday', isOpen: true, openTime: '06:00 AM', closeTime: '08:00 PM' }
    ],
    posProvider: 'Toast',
    posTerminalId: 'POS-006',
    syncMenuWithPos: true,
    menuFile: 'Beachwalk_Menu_v3.pdf',
    menuItemsCount: 38,
    recentActivity: [
      {
        type: 'customer',
        title: 'New loyalty tier unlocked',
        subtitle: 'Gold Tier guest check-in',
        timeAgo: '1 hr ago'
      }
    ]
  }
];

