export interface WebCustomerOffer {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  validity: string;
  isExpired: boolean;
}

export interface WebCustomerOrder {
  id: string;
  branch: string;
  dateTime: string;
  itemName: string;
  itemCategory: string;
  itemImage: string;
  amount: number;
  paymentMethod: 'Card' | 'UPI' | 'Cash';
  pointsEarned: number;
}

export interface WebCustomerItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  initials: string;
  avatarBg: string;
  avatarColor: string;
  memberId: string;
  memberSince: string;
  tier: 'Gold' | 'Silver' | 'Platinum' | 'Bronze';
  status: 'Active' | 'Inactive';
  offersUsed: number;
  pointsBalance: number;
  preferredBranch: string;
  totalSpend: number;
  totalOrders: number;
  activeOffers: WebCustomerOffer[];
  expiredOffers: WebCustomerOffer[];
  purchaseHistory: WebCustomerOrder[];
}

export const INITIAL_WEB_CUSTOMERS: WebCustomerItem[] = [
  {
    id: 'cust-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@gmail.com',
    phone: '98765 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    initials: 'AS',
    avatarBg: 'bg-[#EDE9FE]',
    avatarColor: 'text-[#7C3AED]',
    memberId: 'LC10024',
    memberSince: 'Oct 5, 2024',
    tier: 'Gold',
    status: 'Active',
    offersUsed: 12,
    pointsBalance: 850,
    preferredBranch: 'Connaught Place',
    totalSpend: 2450,
    totalOrders: 12,
    activeOffers: [
      {
        id: 'off-1',
        title: 'Get 1 Free Coffee',
        subtitle: 'On orders above ₹199',
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=300&q=80',
        validity: 'Valid till 20 Oct 2024',
        isExpired: false
      },
      {
        id: 'off-2',
        title: '20% OFF',
        subtitle: 'On bakery items',
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=300&q=80',
        validity: 'Valid till 15 Oct 2024',
        isExpired: false
      },
      {
        id: 'off-3',
        title: 'Buy 1 Get 1',
        subtitle: 'On selected items',
        image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=300&q=80',
        validity: 'Valid till 15 Oct 2024',
        isExpired: false
      }
    ],
    expiredOffers: [
      {
        id: 'exp-1',
        title: 'Flat 50% OFF',
        subtitle: 'On pizzas',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80',
        validity: 'Expired on 10 Sep 2024',
        isExpired: true
      },
      {
        id: 'exp-2',
        title: 'Free Dessert',
        subtitle: 'On orders above ₹499',
        image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=300&q=80',
        validity: 'Expired on 25 Aug 2024',
        isExpired: true
      }
    ],
    purchaseHistory: [
      {
        id: 'OD12456',
        branch: 'Connaught Place',
        dateTime: '20 Oct 2024, 02:30 PM',
        itemName: 'Hot Coffee Latte',
        itemCategory: 'Beverages',
        itemImage: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=150&q=80',
        amount: 199,
        paymentMethod: 'Card',
        pointsEarned: 20
      },
      {
        id: 'OD12412',
        branch: 'CP – Bakery',
        dateTime: '15 Oct 2024, 11:15 AM',
        itemName: 'Blueberry Muffin',
        itemCategory: 'Bakery',
        itemImage: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=150&q=80',
        amount: 349,
        paymentMethod: 'UPI',
        pointsEarned: 35
      },
      {
        id: 'OD12390',
        branch: 'Connaught Place',
        dateTime: '08 Oct 2024, 05:45 PM',
        itemName: 'Avocado Toast & Cold Brew',
        itemCategory: 'Combos',
        itemImage: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=150&q=80',
        amount: 420,
        paymentMethod: 'Card',
        pointsEarned: 40
      }
    ]
  },
  {
    id: 'cust-2',
    name: 'Priya Kapoor',
    email: 'priya.k@gmail.com',
    phone: '98765 43111',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    initials: 'PK',
    avatarBg: 'bg-[#E0E7FF]',
    avatarColor: 'text-[#4F46E5]',
    memberId: 'LC10025',
    memberSince: 'Aug 12, 2024',
    tier: 'Silver',
    status: 'Active',
    offersUsed: 8,
    pointsBalance: 520,
    preferredBranch: 'Cyber Hub',
    totalSpend: 1820,
    totalOrders: 9,
    activeOffers: [
      {
        id: 'off-pk-1',
        title: '15% OFF Next Order',
        subtitle: 'Valid on all breakfast items',
        image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=300&q=80',
        validity: 'Valid till 30 Oct 2024',
        isExpired: false
      }
    ],
    expiredOffers: [
      {
        id: 'exp-pk-1',
        title: 'Free Donut',
        subtitle: 'On orders above ₹250',
        image: 'https://images.unsplash.com/photo-1527515862127-a4fc05baf7a5?auto=format&fit=crop&w=300&q=80',
        validity: 'Expired on 15 Sep 2024',
        isExpired: true
      }
    ],
    purchaseHistory: [
      {
        id: 'OD12380',
        branch: 'Cyber Hub',
        dateTime: '18 Oct 2024, 01:20 PM',
        itemName: 'Iced Caramel Macchiato',
        itemCategory: 'Beverages',
        itemImage: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=150&q=80',
        amount: 250,
        paymentMethod: 'UPI',
        pointsEarned: 25
      }
    ]
  },
  {
    id: 'cust-3',
    name: 'Rohit Mehta',
    email: 'rohit.m@gmail.com',
    phone: '98765 43987',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    initials: 'RN',
    avatarBg: 'bg-[#D1FAE5]',
    avatarColor: 'text-[#059669]',
    memberId: 'LC10026',
    memberSince: 'Jul 20, 2024',
    tier: 'Platinum',
    status: 'Active',
    offersUsed: 20,
    pointsBalance: 1420,
    preferredBranch: 'Indiranagar',
    totalSpend: 4680,
    totalOrders: 24,
    activeOffers: [
      {
        id: 'off-rm-1',
        title: 'VIP Lounge Pass & Coffee',
        subtitle: 'Complimentary pour over tasting',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=300&q=80',
        validity: 'Valid till 31 Oct 2024',
        isExpired: false
      }
    ],
    expiredOffers: [],
    purchaseHistory: [
      {
        id: 'OD12310',
        branch: 'Indiranagar',
        dateTime: '19 Oct 2024, 04:10 PM',
        itemName: 'Artisan Sourdough Sandwich',
        itemCategory: 'Food',
        itemImage: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=150&q=80',
        amount: 380,
        paymentMethod: 'Card',
        pointsEarned: 38
      }
    ]
  },
  {
    id: 'cust-4',
    name: 'Sneha Nair',
    email: 'sneha.n@gmail.com',
    phone: '98765 44123',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
    initials: 'SN',
    avatarBg: 'bg-[#FFE4E6]',
    avatarColor: 'text-[#E11D48]',
    memberId: 'LC10027',
    memberSince: 'Sep 10, 2024',
    tier: 'Bronze',
    status: 'Inactive',
    offersUsed: 2,
    pointsBalance: 110,
    preferredBranch: 'Connaught Place',
    totalSpend: 480,
    totalOrders: 3,
    activeOffers: [],
    expiredOffers: [
      {
        id: 'exp-sn-1',
        title: 'Welcome 10% Discount',
        subtitle: 'On first purchase',
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=300&q=80',
        validity: 'Expired on 20 Sep 2024',
        isExpired: true
      }
    ],
    purchaseHistory: [
      {
        id: 'OD12100',
        branch: 'Connaught Place',
        dateTime: '11 Sep 2024, 03:00 PM',
        itemName: 'Espresso Single Shot',
        itemCategory: 'Beverages',
        itemImage: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=150&q=80',
        amount: 140,
        paymentMethod: 'Cash',
        pointsEarned: 10
      }
    ]
  },
  {
    id: 'cust-5',
    name: 'Vikram Singh',
    email: 'vikram.s@gmail.com',
    phone: '98765 44567',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    initials: 'VK',
    avatarBg: 'bg-[#FEF3C7]',
    avatarColor: 'text-[#D97706]',
    memberId: 'LC10028',
    memberSince: 'Jun 14, 2024',
    tier: 'Gold',
    status: 'Active',
    offersUsed: 15,
    pointsBalance: 960,
    preferredBranch: 'Cyber Hub',
    totalSpend: 3120,
    totalOrders: 16,
    activeOffers: [
      {
        id: 'off-vs-1',
        title: 'Double Points Friday',
        subtitle: 'All gourmet beverages',
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=300&q=80',
        validity: 'Valid till 28 Oct 2024',
        isExpired: false
      }
    ],
    expiredOffers: [],
    purchaseHistory: [
      {
        id: 'OD12250',
        branch: 'Cyber Hub',
        dateTime: '14 Oct 2024, 06:15 PM',
        itemName: 'Cold Brew Vanilla Cream',
        itemCategory: 'Beverages',
        itemImage: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=150&q=80',
        amount: 220,
        paymentMethod: 'UPI',
        pointsEarned: 22
      }
    ]
  }
];

