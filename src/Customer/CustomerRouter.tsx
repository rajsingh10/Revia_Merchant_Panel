import React, { useState } from 'react';
import {
  Home,
  Utensils,
  Zap,
  Ticket,
  Clock,
  User,
  Search,
  SlidersHorizontal,
  Heart,
  Plus,
  Minus,
  Trash2,
  Bell,
  Settings,
  Star,
  Gift,
  Wifi,
  Phone,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Copy,
  QrCode,
  Share2,
  Calendar,
  MapPin,
  Camera,
  Send,
  Coffee,
  Check,
  Award,
  CreditCard,
  X,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Users,
  Receipt,
  Sparkle
} from 'lucide-react';

interface Props {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

// Food Menu Item Model
interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  isVeg: boolean;
  isPopular?: boolean;
  isRecentlyAdded?: boolean;
}

// Initial Menu Data matching mockup
const MENU_ITEMS: MenuItem[] = [
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    category: 'Coffee',
    price: 180,
    description: 'Rich espresso topped with velvety steamed milk and deep foam layer.',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&auto=format&fit=crop&q=80',
    isVeg: true,
    isPopular: true
  },
  {
    id: 'iced-latte',
    name: 'Iced Latte',
    category: 'Coffee',
    price: 200,
    description: 'Chilled espresso over creamy cold milk and ice cubes with vanilla aroma.',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&auto=format&fit=crop&q=80',
    isVeg: true,
    isPopular: true
  },
  {
    id: 'blueberry-muffin',
    name: 'Blueberry Muffin',
    category: 'Desserts',
    price: 160,
    description: 'Freshly baked artisan muffin bursting with plump mountain blueberries.',
    image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&auto=format&fit=crop&q=80',
    isVeg: true,
    isPopular: true
  },
  {
    id: 'avocado-toast',
    name: 'Avocado Toast',
    category: 'Breakfast',
    price: 220,
    description: 'Sourdough toast with creamy smashed hass avocado and roasted seeds.',
    image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=400&auto=format&fit=crop&q=80',
    isVeg: true,
    isPopular: true
  },
  {
    id: 'truffle-pasta',
    name: 'Truffle Mushroom Pasta',
    category: 'Main Course',
    price: 420,
    description: 'Creamy sauce, fresh herbs, wild forest mushrooms and parmesan shavings.',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281226?w=400&auto=format&fit=crop&q=80',
    isVeg: true,
    isRecentlyAdded: true
  },
  {
    id: 'paneer-tikka',
    name: 'Paneer Tikka',
    category: 'Main Course',
    price: 350,
    description: 'Served with mint chutney, marinated red onions and lemon wedges.',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&auto=format&fit=crop&q=80',
    isVeg: true,
    isRecentlyAdded: true
  },
  {
    id: 'margherita-pizza',
    name: 'Classic Margherita Pizza',
    category: 'Main Course',
    price: 400,
    description: 'Fresh mozzarella, fragrant basil leaves and slow-cooked plum tomato sauce.',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&auto=format&fit=crop&q=80',
    isVeg: true
  },
  {
    id: 'chocolate-lava-cake',
    name: 'Chocolate Lava Cake',
    category: 'Desserts',
    price: 200,
    description: 'Warm molten chocolate center served with premium vanilla bean ice cream.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop&q=80',
    isVeg: true
  }
];

export const CustomerRouter: React.FC<Props> = ({ currentRoute, onNavigate }) => {
  // Desktop Primary Active Module Tab
  // 'home' | 'menu' | 'offers' | 'stamps' | 'tracker' | 'wallet' | 'call_staff' | 'profile' | 'feedback' | 'wifi'
  const [activeTab, setActiveTab] = useState<
    'home' | 'menu' | 'offers' | 'stamps' | 'tracker' | 'wallet' | 'call_staff' | 'profile' | 'feedback' | 'wifi'
  >('home');

  // Menu Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({
    'cappuccino': true,
    'truffle-pasta': true
  });

  // Cart & Order State
  const [cart, setCart] = useState<Record<string, number>>({
    'truffle-pasta': 1,
    'paneer-tikka': 1
  });
  const [waiterNote, setWaiterNote] = useState('');
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderStage, setOrderStage] = useState<1 | 2 | 3 | 4>(1); // 1: Received, 2: Preparing, 3: On the way, 4: Arriving soon

  // Offers State
  const [selectedOfferFilter, setSelectedOfferFilter] = useState('All Offers');
  const [viewingOfferDetail, setViewingOfferDetail] = useState<any | null>(null);

  // Staff Call State
  const [staffCategory, setStaffCategory] = useState<'waiter' | 'manager' | 'cashier' | 'cleaning' | 'other' | null>(null);
  const [isWaiterNotified, setIsWaiterNotified] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState<string | null>(null);
  const [staffTab, setStaffTab] = useState<'common' | 'custom'>('common');

  // Wi-Fi Copy Toast
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Feedback State
  const [overallRating, setOverallRating] = useState(4);
  const [foodRating, setFoodRating] = useState(4);
  const [ambienceRating, setAmbienceRating] = useState(4);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Cart Calculations
  const cartItemCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartSubtotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = MENU_ITEMS.find((m) => m.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const handleAddToCart = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Filtered Menu Items
  const filteredMenuItems = MENU_ITEMS.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-[#1E1548] font-sans antialiased flex flex-row select-none">
      {/* =========================================================================
          DESKTOP SIDEBAR NAVIGATION (Spacious, Uncongested Modern Workspace)
         ========================================================================= */}
      <aside className="w-72 shrink-0 bg-white border-r border-purple-100/80 flex flex-col h-screen sticky top-0 z-40 shadow-xs">
        {/* Brand Header */}
        <div className="p-5 border-b border-purple-50 flex items-center justify-between">
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF4E8D] to-[#7C3AED] text-white flex items-center justify-center shadow-md shadow-purple-900/20 group-hover:scale-105 transition-transform">
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-black text-sm tracking-tight text-[#1E1548]">
                Sly Granny Café
              </div>
              <div className="text-[11px] font-semibold text-gray-400">
                Good Food, Good Vibes
              </div>
            </div>
          </div>
        </div>

        {/* Live Table Dining Badge */}
        <div className="px-5 py-3 bg-[#FAF8FF] border-b border-purple-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-[#1E1548]">Table 04 • Indoor</span>
          </div>
          <span className="text-[10px] font-bold text-[#E11D48] bg-pink-50 border border-pink-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Guest Dining
          </span>
        </div>

        {/* Sidebar Nav Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {/* Main Experience Links */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">
              Explore &amp; Order
            </div>
            {[
              { id: 'home', label: 'Home Overview', icon: Home },
              { id: 'menu', label: 'Digital Menu', icon: Utensils, badge: cartItemCount > 0 ? `${cartItemCount}` : undefined },
              { id: 'tracker', label: 'Order Status', icon: Clock, badge: isOrderPlaced ? 'Live' : undefined },
              { id: 'offers', label: 'Offers & Deals', icon: Zap },
              { id: 'stamps', label: 'Loyalty Stamps', icon: Ticket },
              { id: 'wallet', label: 'My Wallet', icon: CreditCard },
            ].map((t) => {
              const isActive = activeTab === t.id;
              const IconComp = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id as any)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#5844A8] text-white shadow-sm'
                      : 'text-gray-600 hover:text-[#1E1548] hover:bg-purple-50/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    <span>{t.label}</span>
                  </div>
                  {t.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-white text-[#5844A8]' : 'bg-[#E11D48] text-white'
                    }`}>
                      {t.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Guest Services Links */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">
              Guest Services
            </div>
            {[
              { id: 'call_staff', label: 'Call Staff', icon: Bell },
              { id: 'wifi', label: 'Free Wi-Fi', icon: Wifi },
              { id: 'feedback', label: 'Review Us', icon: Star },
              { id: 'profile', label: 'Profile & Tier', icon: User },
            ].map((t) => {
              const isActive = activeTab === t.id;
              const IconComp = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id as any)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#5844A8] text-white shadow-sm'
                      : 'text-gray-600 hover:text-[#1E1548] hover:bg-purple-50/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    <span>{t.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer: Aarav Profile Dossier */}
        <div className="p-4 border-t border-purple-50 bg-[#FAF8FF]/60">
          <div
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-purple-100 hover:border-purple-300 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#FF4E8D] text-white font-black text-xs flex items-center justify-center">
              AS
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-black text-[#1E1548] truncate">Aarav Sharma</div>
              <div className="text-[10px] font-bold text-amber-600 flex items-center gap-1">
                <span>👑</span> Gold (320 pts)
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          MAIN DESKTOP CONTENT VIEWPORT
         ========================================================================= */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top Header Bar (Spacious Breadcrumb & Quick Action Status) */}
        <header className="h-16 px-8 bg-white/80 backdrop-blur-md border-b border-purple-50 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-black text-[#1E1548] capitalize">
              {activeTab === 'home' && 'Café Overview'}
              {activeTab === 'menu' && 'Digital Menu & Live Ordering'}
              {activeTab === 'tracker' && 'Live Kitchen Order Status'}
              {activeTab === 'offers' && 'Exclusive Offers & Rewards'}
              {activeTab === 'stamps' && 'Loyalty Stamp Cards'}
              {activeTab === 'wallet' && 'Digital Wallet & Ledger'}
              {activeTab === 'call_staff' && 'Call Staff & Amenities'}
              {activeTab === 'wifi' && 'High-Speed Free Wi-Fi'}
              {activeTab === 'feedback' && 'Customer Experience Review'}
              {activeTab === 'profile' && 'Guest Dossier & Membership'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Cart Pill */}
            <button
              type="button"
              onClick={() => setActiveTab('menu')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#5844A8] text-xs font-bold border border-purple-100 transition-colors cursor-pointer"
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Cart ({cartItemCount})</span>
              <span className="font-extrabold text-[#1E1548] ml-1">₹{cartSubtotal}</span>
            </button>

            {/* Quick Wi-Fi Button */}
            <button
              type="button"
              onClick={() => setActiveTab('wifi')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold border border-gray-200 transition-colors cursor-pointer"
            >
              <Wifi className="w-3.5 h-3.5 text-[#5844A8]" />
              <span>Wi-Fi</span>
            </button>

            {/* Quick Feedback */}
            <button
              type="button"
              onClick={() => setActiveTab('feedback')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold border border-gray-200 transition-colors cursor-pointer"
            >
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Review</span>
            </button>
          </div>
        </header>

        {/* MAIN BODY CONTENT CONTAINER */}
        <main className="flex-1 max-w-[1400px] w-full mx-auto p-6 lg:p-8 space-y-8">
        {/* =======================================================================
            MODULE 1: DESKTOP HOME / DASHBOARD (Expanded from iPad Image 1)
           ======================================================================= */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            {/* Desktop Hero Showcase Banner */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-purple-100 bg-white min-h-[300px] flex flex-col justify-end p-8 lg:p-10">
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1600&auto=format&fit=crop&q=80"
                alt="Café Ambience"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#120B24] via-[#1E1548]/60 to-transparent" />

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-18 h-18 rounded-3xl bg-gradient-to-br from-[#FF4E8D] to-[#7C3AED] p-1 shadow-2xl flex items-center justify-center border-4 border-white">
                    <Coffee className="w-9 h-9 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-pink-300 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                      Table 04 • Indoor Dining
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black mt-1">Sly Granny Café</h1>
                    <p className="text-sm text-purple-200 font-medium">
                      Good Food, Good Vibes • Artisan Coffee, Sourdough &amp; Comfort Dining
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('menu')}
                    className="px-6 py-3 bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold rounded-2xl shadow-lg shadow-purple-950/40 cursor-pointer flex items-center gap-2"
                  >
                    <Utensils className="w-4 h-4" />
                    <span>View Digital Menu</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('call_staff')}
                    className="px-5 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-xs font-bold rounded-2xl transition cursor-pointer flex items-center gap-2"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Call Staff</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Action Tiles (Expanded to Widescreen 4-Column Grid) */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black text-[#1E1548]">Quick Services &amp; Perks</h2>
                <span className="text-xs font-bold text-gray-400">Everything at your fingertips</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Start Earning Rewards */}
                <div
                  onClick={() => setActiveTab('stamps')}
                  className="bg-white rounded-3xl p-5 border border-purple-50 shadow-xs hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Gift className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-[#1E1548] group-hover:text-[#5844A8]">
                        Start Earning Rewards
                      </h3>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#5844A8]" />
                    </div>
                    <p className="text-[11px] text-gray-400 font-medium mt-1 leading-snug">
                      Collect stamps on every brew &amp; get free drinks.
                    </p>
                  </div>
                </div>

                {/* 2. Add a Review */}
                <div
                  onClick={() => setActiveTab('feedback')}
                  className="bg-white rounded-3xl p-5 border border-purple-50 shadow-xs hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Star className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-[#1E1548] group-hover:text-[#5844A8]">
                        Add a Review
                      </h3>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#5844A8]" />
                    </div>
                    <p className="text-[11px] text-gray-400 font-medium mt-1 leading-snug">
                      Share your experience &amp; help us improve.
                    </p>
                  </div>
                </div>

                {/* 3. View Menu */}
                <div
                  onClick={() => setActiveTab('menu')}
                  className="bg-white rounded-3xl p-5 border border-purple-50 shadow-xs hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#5844A8] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Utensils className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-[#1E1548] group-hover:text-[#5844A8]">
                        View Menu
                      </h3>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#5844A8]" />
                    </div>
                    <p className="text-[11px] text-gray-400 font-medium mt-1 leading-snug">
                      Explore our handcrafted food &amp; drinks.
                    </p>
                  </div>
                </div>

                {/* 4. Connect to Wi-Fi */}
                <div
                  onClick={() => setActiveTab('wifi')}
                  className="bg-white rounded-3xl p-5 border border-purple-50 shadow-xs hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Wifi className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-[#1E1548] group-hover:text-[#5844A8]">
                        Connect to Wi-Fi
                      </h3>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#5844A8]" />
                    </div>
                    <p className="text-[11px] text-gray-400 font-medium mt-1 leading-snug">
                      Fast free Wi-Fi while you dine and work.
                    </p>
                  </div>
                </div>

                {/* 5. Call Staff */}
                <div
                  onClick={() => setActiveTab('call_staff')}
                  className="bg-white rounded-3xl p-5 border border-purple-50 shadow-xs hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-[#1E1548] group-hover:text-[#5844A8]">
                        Call Staff
                      </h3>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#5844A8]" />
                    </div>
                    <p className="text-[11px] text-gray-400 font-medium mt-1 leading-snug">
                      Need assistance? Request waiter or amenities.
                    </p>
                  </div>
                </div>

                {/* 6. Play Games */}
                <div
                  onClick={() => alert('Sudoku & Table Games launched!')}
                  className="bg-white rounded-3xl p-5 border border-purple-50 shadow-xs hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-[#1E1548] group-hover:text-[#5844A8]">
                        Play Games
                      </h3>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#5844A8]" />
                    </div>
                    <p className="text-[11px] text-gray-400 font-medium mt-1 leading-snug">
                      Sudoku, trivia &amp; fun table puzzles.
                    </p>
                  </div>
                </div>

                {/* 7. Suggestion Box */}
                <div
                  onClick={() => setActiveTab('feedback')}
                  className="bg-white rounded-3xl p-5 border border-purple-50 shadow-xs hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-[#1E1548] group-hover:text-[#5844A8]">
                        Suggestion Box
                      </h3>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#5844A8]" />
                    </div>
                    <p className="text-[11px] text-gray-400 font-medium mt-1 leading-snug">
                      We would love to hear your thoughts.
                    </p>
                  </div>
                </div>

                {/* 8. Offers */}
                <div
                  onClick={() => setActiveTab('offers')}
                  className="bg-white rounded-3xl p-5 border border-purple-50 shadow-xs hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#E11D48] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-[#1E1548] group-hover:text-[#5844A8]">
                        Exclusive Offers
                      </h3>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#5844A8]" />
                    </div>
                    <p className="text-[11px] text-gray-400 font-medium mt-1 leading-snug">
                      Discover BOGO, cashback &amp; daily deals.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Channels Showcase (Image 1 Bottom) */}
            <div className="bg-white rounded-3xl p-6 border border-purple-50 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#5844A8] flex items-center justify-center">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1E1548]">Follow Our Channel</h4>
                  <p className="text-[11px] text-gray-400">Get updates, events &amp; exclusive member offers</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="#instagram"
                  onClick={(e) => e.preventDefault()}
                  className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xs hover:scale-105 transition-transform"
                >
                  <Camera className="w-4 h-4" />
                </a>
                <a
                  href="#facebook"
                  onClick={(e) => e.preventDefault()}
                  className="w-9 h-9 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shadow-xs hover:scale-105 transition-transform"
                >
                  <Share2 className="w-4 h-4" />
                </a>
                <a
                  href="#youtube"
                  onClick={(e) => e.preventDefault()}
                  className="w-9 h-9 rounded-xl bg-[#FF0000] text-white flex items-center justify-center shadow-xs hover:scale-105 transition-transform"
                >
                  <Sparkles className="w-4 h-4" />
                </a>
                <a
                  href="#whatsapp"
                  onClick={(e) => e.preventDefault()}
                  className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-xs hover:scale-105 transition-transform"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* =======================================================================
            MODULE 2: DIGITAL MENU & TABLE ORDERING (Expanded from iPad Images 2, 3, 4)
           ======================================================================= */}
        {activeTab === 'menu' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Columns: Search, Category Pills & Food Grid */}
            <div className="lg:col-span-8 space-y-6">
              {/* Search & Filter Header */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-purple-50 shadow-xs">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for food or drinks..."
                    className="w-full bg-[#FAF8FF] border border-purple-50 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-2.5 rounded-2xl bg-[#FAF8FF] text-gray-500 hover:text-[#5844A8] border border-purple-50 flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </div>

              {/* Category Pills (Horizontal Scroll) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {[
                  'All',
                  'Coffee',
                  'Main Course',
                  'Desserts',
                  'Breakfast',
                  'Snacks',
                  'Cold Drinks',
                  'Tea'
                ].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#5844A8] text-white shadow-xs'
                        : 'bg-white text-gray-600 hover:bg-[#FAF8FF] border border-purple-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Food Menu Items (Responsive Grid: 1 col on mobile, 2 col on tablet, 3 col on large desktop) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredMenuItems.map((item) => {
                  const qty = cart[item.id] || 0;
                  const isFav = favorites[item.id];
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-3xl overflow-hidden border border-purple-50/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div className="relative h-44 overflow-hidden bg-gray-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Veg Badge */}
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg border border-white shadow-2xs flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-600" />
                          <span className="text-[10px] font-bold text-gray-700">Veg</span>
                        </div>

                        {/* Recently Added Badge */}
                        {item.isRecentlyAdded && (
                          <div className="absolute top-3 left-18 bg-[#E11D48] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                            Recently Added
                          </div>
                        )}

                        {/* Favorite Button */}
                        <button
                          type="button"
                          onClick={() => toggleFavorite(item.id)}
                          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                            isFav ? 'bg-[#FF4E8D] text-white' : 'bg-white/80 backdrop-blur-md text-gray-500 hover:text-black'
                          }`}
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>

                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-[#1E1548] leading-snug">
                              {item.name}
                            </h3>
                            <span className="text-sm font-black text-[#5844A8]">
                              ₹{item.price}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 font-medium mt-1 leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-purple-50 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-gray-400">
                            {item.category}
                          </span>

                          {qty === 0 ? (
                            <button
                              type="button"
                              onClick={() => handleAddToCart(item.id)}
                              className="px-3.5 py-1.5 bg-pink-50 hover:bg-[#E11D48] text-[#E11D48] hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add</span>
                            </button>
                          ) : (
                            /* Interactive Quantity Stepper */
                            <div className="flex items-center gap-2 bg-[#FAF8FF] border border-purple-100 rounded-xl px-2 py-1 shadow-2xs">
                              <button
                                type="button"
                                onClick={() => handleUpdateQty(item.id, -1)}
                                className="w-5 h-5 rounded-md bg-white text-[#5844A8] font-bold flex items-center justify-center shadow-2xs hover:bg-purple-100 cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-black text-[#1E1548] w-4 text-center">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleUpdateQty(item.id, 1)}
                                className="w-5 h-5 rounded-md bg-[#5844A8] text-white font-bold flex items-center justify-center shadow-2xs hover:bg-[#47368E] cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right 4 Columns: Desktop Cart & Waiter Order Drawer (Image 4) */}
            <div className="lg:col-span-4 sticky top-24 bg-white rounded-3xl p-6 border border-purple-50 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#5844A8] flex items-center justify-center">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1E1548]">
                    Your Order ({cartItemCount} items)
                  </h3>
                </div>
                {cartItemCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setCart({})}
                    className="text-[11px] font-bold text-rose-500 hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Items List */}
              {cartItemCount === 0 ? (
                <div className="py-10 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-300 mx-auto flex items-center justify-center">
                    <Utensils className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-gray-500">Your table tray is empty</div>
                  <div className="text-[11px] text-gray-400">
                    Add dishes from the menu to place an order with your server.
                  </div>
                </div>
              ) : (
                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                  {Object.entries(cart).map(([id, qty]) => {
                    const item = MENU_ITEMS.find((m) => m.id === id);
                    if (!item) return null;
                    return (
                      <div
                        key={id}
                        className="bg-[#FAF8FF] rounded-2xl p-3 border border-purple-50 flex items-center justify-between gap-3"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-[#1E1548] truncate">
                            {item.name}
                          </h4>
                          <span className="text-xs font-bold text-[#5844A8]">
                            ₹{item.price * qty}
                          </span>
                        </div>

                        {/* Stepper & Trash */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(id, -1)}
                            className="w-5 h-5 rounded-md bg-white border border-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-xs font-black w-4 text-center">{qty}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(id, 1)}
                            className="w-5 h-5 rounded-md bg-[#5844A8] text-white flex items-center justify-center text-xs font-bold cursor-pointer"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(id, -qty)}
                            className="p-1 text-gray-400 hover:text-rose-500 cursor-pointer ml-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Special Request for Waiter */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-[11px] font-bold text-gray-600">
                  Add a note for the waiter (optional)
                </label>
                <input
                  type="text"
                  value={waiterNote}
                  onChange={(e) => setWaiterNote(e.target.value)}
                  placeholder="e.g. Less spicy, no onion, extra sauce..."
                  className="w-full bg-[#FAF8FF] border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-medium text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                />
              </div>

              {/* Subtotal & Action */}
              <div className="pt-3 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-500">Order Subtotal</span>
                  <span className="font-black text-sm text-[#1E1548]">₹{cartSubtotal}</span>
                </div>

                <button
                  type="button"
                  disabled={cartItemCount === 0}
                  onClick={() => {
                    setIsOrderPlaced(true);
                    setOrderStage(1);
                    setActiveTab('tracker');
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-[#7C3AED] to-[#E11D48] text-white text-xs font-bold rounded-2xl shadow-md shadow-purple-900/20 hover:opacity-95 disabled:opacity-40 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  <span>Call Waiter to Place Order</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =======================================================================
            MODULE 3: REAL-TIME KITCHEN ORDER TRACKER (iPad Images 5, 6, 7, 8, 9)
           ======================================================================= */}
        {activeTab === 'tracker' && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Header with Table Indicator */}
            <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-purple-50 shadow-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-[#1E1548]">Live Kitchen Connection</span>
              </div>
              <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">
                Table 04 • Indoor Dining
              </span>
            </div>

            {/* Stage Selector (To let the client test all 4 mockup states live!) */}
            <div className="bg-[#FAF8FF] p-1.5 rounded-2xl border border-purple-100 flex items-center justify-between gap-1 text-[11px] font-bold">
              <span className="text-gray-400 pl-2">Preview Stage:</span>
              {[
                { s: 1, label: '1. Received' },
                { s: 2, label: '2. Preparing' },
                { s: 3, label: '3. On the Way' },
                { s: 4, label: '4. Arriving Soon' }
              ].map((item) => (
                <button
                  key={item.s}
                  type="button"
                  onClick={() => setOrderStage(item.s as any)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    orderStage === item.s
                      ? 'bg-[#5844A8] text-white shadow-2xs font-black'
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Central Tracker Card Matching Mockups */}
            <div className="bg-white rounded-3xl p-8 border border-purple-50 shadow-md text-center space-y-6">
              {/* Dynamic Hero Illustration according to stage */}
              {orderStage === 1 && (
                /* Stage 1: Order Received (Clipboard with purple checkmark) */
                <div className="space-y-3">
                  <div className="relative w-28 h-28 mx-auto flex items-center justify-center bg-purple-50 rounded-3xl border border-purple-100">
                    <div className="w-16 h-20 bg-white rounded-xl shadow-md border border-purple-100 flex flex-col justify-between p-2">
                      <div className="w-6 h-1.5 bg-purple-300 rounded-full mx-auto" />
                      <div className="space-y-1">
                        <div className="w-full h-1 bg-gray-100 rounded-full" />
                        <div className="w-3/4 h-1 bg-gray-100 rounded-full" />
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#5844A8] text-white flex items-center justify-center shadow-md">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-black text-[#1E1548]">Order Received</h2>
                  <p className="text-xs text-gray-500 font-medium">
                    Your order has been received by the kitchen.
                  </p>
                </div>
              )}

              {orderStage === 2 && (
                /* Stage 2: Being Prepared (Chef cooking pan) */
                <div className="space-y-3">
                  <div className="w-28 h-28 mx-auto rounded-3xl bg-amber-50 border border-amber-100 flex flex-col items-center justify-center shadow-sm">
                    <Utensils className="w-10 h-10 text-amber-500 mb-1" />
                    <span className="text-[10px] font-black text-amber-600 uppercase">Chef At Work</span>
                  </div>
                  <h2 className="text-2xl font-black text-[#1E1548]">Being Prepared</h2>
                  <p className="text-xs text-gray-500 font-medium">
                    Your food is being prepared fresh. This won&apos;t take long!
                  </p>
                </div>
              )}

              {orderStage === 3 && (
                /* Stage 3: On the Way (Waiter serving platter with 5 min ETA) */
                <div className="space-y-3">
                  <div className="w-28 h-28 mx-auto rounded-3xl bg-purple-50 border border-purple-100 flex flex-col items-center justify-center shadow-sm">
                    <Coffee className="w-10 h-10 text-[#5844A8] mb-1" />
                    <span className="text-[10px] font-black text-purple-600 uppercase">On Tray</span>
                  </div>
                  <h2 className="text-2xl font-black text-[#1E1548]">On the Way</h2>
                  <p className="text-xs text-gray-500 font-medium">
                    Your order is on the way to your table.
                  </p>
                </div>
              )}

              {orderStage === 4 && (
                /* Stage 4: Arriving Soon (Serving cloche with green pill) */
                <div className="space-y-3">
                  <div className="w-28 h-28 mx-auto rounded-3xl bg-emerald-50 border border-emerald-100 flex flex-col items-center justify-center shadow-sm">
                    <Sparkles className="w-10 h-10 text-emerald-600 mb-1" />
                    <span className="text-[10px] font-black text-emerald-700 uppercase">Arrived</span>
                  </div>
                  <h2 className="text-2xl font-black text-[#1E1548]">Arriving Soon!</h2>
                  <p className="text-xs text-gray-500 font-medium">
                    Good news! Your order will reach earlier than expected.
                  </p>
                </div>
              )}

              {/* 4-Stage Horizontal Stepper */}
              <div className="py-2">
                <div className="relative flex items-center justify-between max-w-lg mx-auto">
                  <div className="absolute top-4 left-6 right-6 h-0.5 bg-gray-200 z-0" />
                  {[
                    { id: 1, label: 'Order Received' },
                    { id: 2, label: 'Being Prepared' },
                    { id: 3, label: 'On the Way' },
                    { id: 4, label: 'Arriving Soon' }
                  ].map((st) => {
                    const isDone = orderStage >= st.id;
                    const isCurrent = orderStage === st.id;
                    return (
                      <div key={st.id} className="flex flex-col items-center relative z-10">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-2xs ${
                            isDone
                              ? orderStage === 4 && st.id === 4
                                ? 'bg-emerald-600 text-white'
                                : 'bg-[#5844A8] text-white ring-4 ring-purple-100'
                              : 'bg-white border-2 border-gray-200 text-gray-400'
                          }`}
                        >
                          {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : st.id}
                        </div>
                        <span
                          className={`text-[10px] font-bold mt-2 whitespace-nowrap ${
                            isCurrent
                              ? orderStage === 4
                                ? 'text-emerald-700 font-black'
                                : 'text-[#5844A8] font-black'
                              : 'text-gray-400'
                          }`}
                        >
                          {st.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Highlight Card */}
              {orderStage >= 3 && (
                <div
                  className={`p-4 rounded-2xl border text-left flex items-center justify-between ${
                    orderStage === 4
                      ? 'bg-emerald-50/80 border-emerald-100 text-emerald-900'
                      : 'bg-white border-purple-100 text-[#1E1548]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white shadow-xs flex items-center justify-center">
                      <Clock className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">
                        {orderStage === 4 ? 'Arriving in 3 mins early' : 'ARRIVING IN 5 mins'}
                      </div>
                      <div className="text-[11px] opacity-80">
                        {orderStage === 4
                          ? "We're on our way to your table."
                          : 'Your food will reach your table soon.'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-full border shadow-2xs">
                    ● Fast prep
                  </span>
                </div>
              )}

              {/* Order Dossier Card */}
              <div className="bg-[#FAF8FF] rounded-2xl p-4 border border-purple-50 flex items-center justify-between text-left">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#5844A8] flex items-center justify-center shadow-xs">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1E1548]">Order #1024</h4>
                    <p className="text-[11px] text-gray-400 font-medium">
                      3 items • Table 04 • Indoor Dining Section
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('menu')}
                  className="text-xs font-bold text-[#5844A8] hover:underline cursor-pointer"
                >
                  Add More Items &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =======================================================================
            MODULE 4: LOYALTY STAMP CARDS (iPad Image 10)
           ======================================================================= */}
        {activeTab === 'stamps' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Active Program Banner */}
            <div className="rounded-3xl p-6 lg:p-7 bg-gradient-to-r from-[#2D124D] via-[#4A154B] to-[#7C3AED] text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl border border-white/20">
                  ☕
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-pink-300">
                    Active Program
                  </span>
                  <h3 className="text-xl font-black">1 Stamp Away from Free Coffee!</h3>
                  <p className="text-xs text-purple-200 mt-0.5">
                    Collect your 6th stamp today with any artisan roast brew.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="text-right">
                  <div className="text-xs font-black text-amber-300">Overall Progress</div>
                  <div className="text-lg font-black">5 / 6 Stamps</div>
                </div>
                <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="w-[83%] h-full bg-amber-400" />
                </div>
              </div>
            </div>

            {/* Side-by-side Desktop Stamp Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Coffee Stamp Card (6 Stamps) */}
              <div className="bg-white rounded-3xl p-6 border border-purple-50 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-[#5844A8]" />
                    <h4 className="text-xs font-bold text-[#1E1548]">Coffee Stamp Card</h4>
                  </div>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                    Next: Free Coffee
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">Collect 6 stamps and get a free artisan brew!</p>

                {/* 6 Circles Grid */}
                <div className="grid grid-cols-6 gap-2 pt-2">
                  {[1, 2, 3, 4, 5].map((idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-2xl bg-[#5844A8] text-white flex flex-col items-center justify-center shadow-xs"
                    >
                      <Coffee className="w-4 h-4" />
                      <span className="text-[9px] font-bold mt-1">#{idx}</span>
                    </div>
                  ))}
                  {/* 6th Slot: Target Free Reward */}
                  <div className="aspect-square rounded-2xl border-2 border-dashed border-[#FF4E8D] bg-pink-50/50 text-[#FF4E8D] flex flex-col items-center justify-center shadow-xs animate-pulse">
                    <Gift className="w-4 h-4" />
                    <span className="text-[9px] font-black mt-1">#6 Free</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Specials Stamp Card (8 Stamps) */}
              <div className="bg-white rounded-3xl p-6 border border-purple-50 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#5844A8]" />
                    <h4 className="text-xs font-bold text-[#1E1548]">Specials Stamp Card</h4>
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    6 stamps remaining
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">Collect 8 stamps and get 15% off your total!</p>

                {/* 8 Circles Grid */}
                <div className="grid grid-cols-8 gap-2 pt-2">
                  {[1, 2].map((idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-xl bg-[#5844A8] text-white flex flex-col items-center justify-center shadow-xs"
                    >
                      <Utensils className="w-3 h-3" />
                      <span className="text-[8px] font-bold">#{idx}</span>
                    </div>
                  ))}
                  {[3, 4, 5, 6, 7].map((idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-xl border border-gray-200 bg-[#FAF8FF] text-gray-300 flex items-center justify-center text-[9px] font-bold"
                    >
                      #{idx}
                    </div>
                  ))}
                  <div className="aspect-square rounded-xl border-2 border-dashed border-rose-300 bg-rose-50 text-[#E11D48] flex items-center justify-center text-[8px] font-black">
                    15%
                  </div>
                </div>
              </div>
            </div>

            {/* In-Store QR Scan Trigger */}
            <div className="bg-[#FAF8FF] rounded-3xl p-6 border border-purple-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white text-[#5844A8] flex items-center justify-center shadow-xs">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1E1548]">Dining in right now?</h4>
                  <p className="text-[11px] text-gray-400">
                    Scan the QR code at your table to collect instant loyalty stamps.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert('Table QR Scanner simulated! Stamp +1 collected.')}
                className="px-5 py-2.5 bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
              >
                Scan Now
              </button>
            </div>
          </div>
        )}

        {/* =======================================================================
            MODULE 5: OFFERS & REWARDS CATALOG (iPad Image 11 & 13)
           ======================================================================= */}
        {activeTab === 'offers' && (
          <div className="space-y-6">
            {/* Header with Gold Member Points Pill */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-purple-50 shadow-xs">
              <div>
                <h2 className="text-xl font-black text-[#1E1548]">Your Exclusive Offers</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Handcrafted deals tailored to your dining preferences.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-gradient-to-r from-[#FAF5FF] to-[#FAF8FF] border border-purple-100 p-2 rounded-2xl">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-white flex items-center justify-center font-bold">
                  👑
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400">Gold Member</div>
                  <div className="text-xs font-black text-[#1E1548]">320 Points</div>
                </div>
              </div>
            </div>

            {/* Offer Categories Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {[
                'All Offers',
                'Cashback',
                'Free Items',
                'Buy 1 Get 1',
                'Combo Offers',
                'Happy Hours'
              ].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setSelectedOfferFilter(filter)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedOfferFilter === filter
                      ? 'bg-[#5844A8] text-white shadow-xs'
                      : 'bg-white text-gray-600 hover:bg-[#FAF8FF] border border-purple-50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* 8 Offers Grid (Widescreen 4-Column Layout) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  id: 'off-1',
                  title: '20% OFF on Total Bill',
                  category: 'Cashback',
                  badge: 'Popular',
                  badgeColor: 'bg-rose-500 text-white',
                  desc: 'Get 20% cashback on your total bill.',
                  validTill: '30 Apr 2025',
                  image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&auto=format&fit=crop&q=80'
                },
                {
                  id: 'off-2',
                  title: 'Buy 1 Get 1 Free',
                  category: 'Buy 1 Get 1',
                  badge: 'New',
                  badgeColor: 'bg-blue-600 text-white',
                  desc: 'Buy any muffin and get another one free.',
                  validTill: '25 Apr 2025',
                  image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&auto=format&fit=crop&q=80'
                },
                {
                  id: 'off-3',
                  title: 'Free Iced Coffee',
                  category: 'Free Items',
                  badge: 'Limited Time',
                  badgeColor: 'bg-amber-500 text-white',
                  desc: 'Get a free iced coffee on orders above ₹300.',
                  validTill: '20 Apr 2025',
                  image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&auto=format&fit=crop&q=80'
                },
                {
                  id: 'off-4',
                  title: 'Pizza Combo Offer',
                  category: 'Combo Offers',
                  badge: 'Featured',
                  badgeColor: 'bg-purple-600 text-white',
                  desc: 'Get Margherita Pizza + Cold Drink at just ₹299.',
                  validTill: '28 Apr 2025',
                  image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&auto=format&fit=crop&q=80'
                },
                {
                  id: 'off-5',
                  title: 'Flat 15% OFF Happy Hours',
                  category: 'Happy Hours',
                  badge: 'Happy Hours',
                  badgeColor: 'bg-emerald-600 text-white',
                  desc: 'Enjoy 15% off all beverages from 4 PM - 7 PM.',
                  validTill: '30 Apr 2025',
                  image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&auto=format&fit=crop&q=80'
                },
                {
                  id: 'off-6',
                  title: 'Complimentary Birthday Dessert',
                  category: 'Free Items',
                  badge: 'For You',
                  badgeColor: 'bg-pink-600 text-white',
                  desc: 'Celebrate your special day with a free dessert.',
                  validTill: 'Valid for 7 days',
                  image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop&q=80'
                },
                {
                  id: 'off-7',
                  title: 'Earn 50 Bonus Points',
                  category: 'Rewards Points',
                  badge: 'Rewards',
                  badgeColor: 'bg-indigo-600 text-white',
                  desc: 'Place an order above ₹250 and earn 50 reward points.',
                  validTill: '30 Apr 2025',
                  image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&auto=format&fit=crop&q=80'
                },
                {
                  id: 'off-8',
                  title: '30% OFF Gourmet Sandwiches',
                  category: 'Selected Items',
                  badge: 'Special',
                  badgeColor: 'bg-teal-600 text-white',
                  desc: 'Flat 30% off on all sourdough sandwiches.',
                  validTill: '27 Apr 2025',
                  image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=400&auto=format&fit=crop&q=80'
                }
              ].map((off) => (
                <div
                  key={off.id}
                  className="bg-white rounded-3xl overflow-hidden border border-purple-50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={off.image}
                      alt={off.title}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className={`absolute top-3 left-3 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs ${off.badgeColor}`}
                    >
                      {off.badge}
                    </span>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#1E1548] line-clamp-1">
                        {off.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 font-medium mt-1 line-clamp-2">
                        {off.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-purple-50 flex items-center justify-between text-[10px]">
                      <span className="text-gray-400 font-medium">Valid: {off.validTill}</span>
                      <button
                        type="button"
                        onClick={() => setViewingOfferDetail(off)}
                        className="text-[#5844A8] font-bold hover:underline cursor-pointer"
                      >
                        View Offer &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Offer Detail Modal (Image 13) */}
            {viewingOfferDetail && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-purple-100 animate-in fade-in zoom-in-95 duration-200">
                  <div className="relative h-48 bg-gray-900">
                    <img
                      src={viewingOfferDetail.image}
                      alt={viewingOfferDetail.title}
                      className="w-full h-full object-cover opacity-90"
                    />
                    <button
                      type="button"
                      onClick={() => setViewingOfferDetail(null)}
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-4 left-4 text-white">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
                        {viewingOfferDetail.category}
                      </span>
                      <h3 className="text-xl font-black mt-1">{viewingOfferDetail.title}</h3>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <p className="text-xs text-gray-600 leading-relaxed font-medium">
                      {viewingOfferDetail.desc} A perfect treat for your coffee dates and food moments!
                    </p>

                    <div className="bg-[#FAF8FF] p-4 rounded-2xl border border-purple-50 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Validity:</span>
                        <span className="font-bold text-[#1E1548]">{viewingOfferDetail.validTill}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Applicable On:</span>
                        <span className="font-bold text-[#1E1548]">Dine-in Only</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Minimum Bill:</span>
                        <span className="font-bold text-[#1E1548]">No minimum order value</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Usage Limit:</span>
                        <span className="font-bold text-[#1E1548]">1 time per customer</span>
                      </div>
                    </div>

                    <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100 text-xs text-[#1E1548] space-y-1">
                      <div className="font-bold text-[#E11D48] mb-1">How to Redeem?</div>
                      <p>1. Show this offer at the counter before billing.</p>
                      <p>2. Dine in and enjoy your meal.</p>
                      <p>3. Instant cashback will be credited to your wallet.</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        alert('Offer redeemed successfully! Code SGC-OFFER-20 unlocked.');
                        setViewingOfferDetail(null);
                      }}
                      className="w-full py-3 bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold rounded-2xl shadow-md shadow-purple-900/20 cursor-pointer"
                    >
                      Redeem Offer Now
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =======================================================================
            MODULE 6: FREE IN-STORE WI-FI (iPad Image 12)
           ======================================================================= */}
        {activeTab === 'wifi' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5844A8] bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                📶 Stay Connected
              </span>
              <h2 className="text-2xl font-black text-[#1E1548]">Enjoy Free Wi-Fi at Sly Granny Café</h2>
              <p className="text-xs text-gray-500 font-medium">
                Relax, work or catch up with your loved ones while enjoying great food and good vibes.
              </p>
            </div>

            {/* Credentials Card */}
            <div className="bg-white rounded-3xl p-6 border border-purple-50 shadow-md space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#FAF8FF] rounded-2xl border border-purple-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#5844A8] flex items-center justify-center font-bold">
                    <Wifi className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-400">Network Name</div>
                    <div className="text-sm font-black text-[#1E1548]">SlyGranny_Cafe</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard('SlyGranny_Cafe', 'net')}
                  className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-[#5844A8] cursor-pointer flex items-center gap-1 text-xs font-bold"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedKey === 'net' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#FAF8FF] rounded-2xl border border-purple-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#5844A8] flex items-center justify-center font-bold">
                    🔑
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-400">Password</div>
                    <div className="text-sm font-black text-[#1E1548]">goodvibes123</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard('goodvibes123', 'pass')}
                  className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-[#5844A8] cursor-pointer flex items-center gap-1 text-xs font-bold"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedKey === 'pass' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => alert('Connected automatically to SlyGranny_Cafe!')}
                className="w-full py-3 bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold rounded-2xl shadow-md shadow-purple-900/20 cursor-pointer"
              >
                Connect to Wi-Fi
              </button>
            </div>

            {/* QR Scan Card */}
            <div className="bg-white rounded-3xl p-6 border border-purple-50 shadow-sm flex items-center gap-5">
              <div className="w-20 h-20 bg-purple-50 rounded-2xl p-2 border border-purple-100 flex items-center justify-center shrink-0">
                <QrCode className="w-16 h-16 text-[#5844A8]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1E1548]">Scan to Connect</h4>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                  Open your camera and scan this QR code to automatically connect to our high-speed guest Wi-Fi.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =======================================================================
            MODULE 7: CALL STAFF & AMENITIES REQUEST (iPad Images 7, 8, 9)
           ======================================================================= */}
        {activeTab === 'call_staff' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-purple-50 shadow-xs">
              <div>
                <h2 className="text-xl font-black text-[#1E1548]">Table Assistance</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Request items or call a staff member to Table 04.
                </p>
              </div>

              {/* Segmented Switcher */}
              <div className="flex items-center bg-[#FAF8FF] p-1 rounded-2xl border border-purple-100">
                <button
                  type="button"
                  onClick={() => setStaffTab('common')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    staffTab === 'common'
                      ? 'bg-[#5844A8] text-white shadow-xs'
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  Common Amenities
                </button>
                <button
                  type="button"
                  onClick={() => setStaffTab('custom')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    staffTab === 'custom'
                      ? 'bg-[#5844A8] text-white shadow-xs'
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  Staff Roles
                </button>
              </div>
            </div>

            {/* 3x3 Grid of Common Amenities (Image 8) */}
            {staffTab === 'common' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { name: 'Tissue', icon: '🧻', desc: 'Box of facial tissues' },
                  { name: 'Salt', icon: '🧂', desc: 'Table salt shaker' },
                  { name: 'Pepper', icon: '🌶️', desc: 'Fresh ground black pepper' },
                  { name: 'Cutlery', icon: '🍴', desc: 'Extra forks and spoons' },
                  { name: 'Water', icon: '🥛', desc: 'Chilled drinking water' },
                  { name: 'Extra Napkins', icon: '📑', desc: 'Paper dinner napkins' },
                  { name: 'Sauce', icon: '🥣', desc: 'Ketchup & chili dips' },
                  { name: 'High Chair', icon: '🪑', desc: 'Toddler dining high chair' },
                  { name: 'Baby Chair', icon: '👶', desc: 'Infant booster seat' }
                ].map((item) => (
                  <div
                    key={item.name}
                    onClick={() => {
                      setSelectedAmenity(item.name);
                      setIsWaiterNotified(true);
                    }}
                    className="bg-white rounded-3xl p-5 border border-purple-50 shadow-xs hover:border-[#5844A8] hover:shadow-md transition-all cursor-pointer text-center space-y-2 group"
                  >
                    <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h3 className="text-xs font-bold text-[#1E1548] group-hover:text-[#5844A8]">
                      {item.name}
                    </h3>
                    <p className="text-[10px] text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Staff Roles Selection (Image 7) */}
            {staffTab === 'custom' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'waiter', title: 'Waiter', desc: 'Take my order / General assistance', icon: '🛎️' },
                  { id: 'manager', title: 'Floor Manager', desc: 'For special requests or concerns', icon: '👥' },
                  { id: 'cashier', title: 'Cashier', desc: 'For billing & payment requests', icon: '🧾' },
                  { id: 'cleaning', title: 'Cleaning Staff', desc: 'For table cleaning & wipes', icon: '🧹' }
                ].map((role) => (
                  <div
                    key={role.id}
                    onClick={() => {
                      setStaffCategory(role.id as any);
                      setIsWaiterNotified(true);
                    }}
                    className="bg-white rounded-3xl p-5 border border-purple-50 shadow-xs hover:border-[#5844A8] hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl w-10 h-10 rounded-2xl bg-[#FAF8FF] flex items-center justify-center">
                        {role.icon}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#1E1548] group-hover:text-[#5844A8]">
                          {role.title}
                        </h4>
                        <p className="text-[11px] text-gray-400">{role.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#5844A8]" />
                  </div>
                ))}
              </div>
            )}

            {/* Waiter Notified Popup Modal (Image 9) */}
            {isWaiterNotified && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-purple-100 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-xs">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#1E1548]">Waiter Notified!</h3>
                    <p className="text-xs text-gray-500 font-medium mt-1">
                      A waiter is on the way to Table 04 to assist you
                      {selectedAmenity ? ` with ${selectedAmenity}` : ''}.
                    </p>
                  </div>
                  <div className="bg-[#FAF8FF] py-2 px-4 rounded-xl border border-purple-50 text-xs font-bold text-purple-700 flex items-center justify-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Estimated Arrival: 2 - 3 mins</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsWaiterNotified(false);
                      setSelectedAmenity(null);
                    }}
                    className="w-full py-2.5 bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                  >
                    Okay
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =======================================================================
            MODULE 8: FEEDBACK & REVIEW (iPad Image 6)
           ======================================================================= */}
        {activeTab === 'feedback' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                ⭐ Voice of Guest
              </span>
              <h2 className="text-2xl font-black text-[#1E1548]">Your feedback matters!</h2>
              <p className="text-xs text-gray-500 font-medium">
                Help us serve you better by sharing your experience at Sly Granny Café.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-50 shadow-md space-y-6">
              {/* Overall Rating */}
              <div className="text-center space-y-2 pb-4 border-b border-gray-100">
                <div className="text-xs font-bold text-[#1E1548]">Overall Experience</div>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setOverallRating(star)}
                      className="text-2xl transition-transform hover:scale-125 cursor-pointer"
                    >
                      {star <= overallRating ? (
                        <span className="text-pink-500">★</span>
                      ) : (
                        <span className="text-gray-300">☆</span>
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-gray-400">
                  How would you rate your overall experience at Sly Granny Café?
                </p>
              </div>

              {/* Sub-ratings Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#FAF8FF] p-4 rounded-2xl border border-purple-50 space-y-1.5 text-center">
                  <div className="text-xs font-bold text-[#1E1548]">Food Quality</div>
                  <div className="flex justify-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFoodRating(s)}
                        className={`text-lg cursor-pointer ${s <= foodRating ? 'text-pink-500' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-[#FAF8FF] p-4 rounded-2xl border border-purple-50 space-y-1.5 text-center">
                  <div className="text-xs font-bold text-[#1E1548]">Ambience</div>
                  <div className="flex justify-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setAmbienceRating(s)}
                        className={`text-lg cursor-pointer ${s <= ambienceRating ? 'text-pink-500' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comments Textarea */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-[#1E1548]">Additional Comments (Optional)</span>
                  <span className="text-gray-400 font-mono text-[10px]">{feedbackComment.length}/500</span>
                </div>
                <textarea
                  rows={4}
                  maxLength={500}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Tell us more about your experience at Sly Granny Café..."
                  className="w-full bg-[#FAF8FF] border border-gray-200 rounded-2xl p-3.5 text-xs font-medium text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => alert('Photo attachment uploader opened')}
                  className="px-4 py-3 border border-gray-200 hover:bg-gray-50 rounded-2xl text-xs font-bold text-gray-700 flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Camera className="w-4 h-4 text-gray-500" />
                  <span>Add Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFeedbackSubmitted(true);
                    setTimeout(() => setFeedbackSubmitted(false), 3000);
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-[#7C3AED] to-[#E11D48] text-white text-xs font-bold rounded-2xl shadow-md shadow-purple-900/20 hover:opacity-95 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Feedback</span>
                </button>
              </div>

              {feedbackSubmitted && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl text-center">
                  Thank you! Your feedback has been sent to the manager.
                </div>
              )}
            </div>
          </div>
        )}

        {/* =======================================================================
            MODULE 9: DIGITAL WALLET & TRANSACTION HISTORY (iPad Images 5 & 14)
           ======================================================================= */}
        {activeTab === 'wallet' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* 3 Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white rounded-3xl p-6 border border-purple-50 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-gray-400">Reward Points</div>
                  <div className="text-2xl font-black text-[#5844A8] mt-1">320 pts</div>
                  <div className="text-[11px] text-gray-400 mt-1">180 points to next reward</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#5844A8] flex items-center justify-center text-xl font-bold">
                  👑
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-purple-50 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-gray-400">Available Cashback</div>
                  <div className="text-2xl font-black text-emerald-600 mt-1">₹150</div>
                  <div className="text-[11px] text-gray-400 mt-1">Total earned ₹850</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold">
                  ₹
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-purple-50 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-gray-400">Active Offers</div>
                  <div className="text-2xl font-black text-amber-500 mt-1">5 Offers</div>
                  <div className="text-[11px] text-gray-400 mt-1">Ready for redemption</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-xl font-bold">
                  🏷️
                </div>
              </div>
            </div>

            {/* Transactions Ledger Table */}
            <div className="bg-white rounded-3xl p-6 border border-purple-50 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#1E1548]">Recent Transactions</h3>
                <span className="text-xs font-bold text-[#5844A8]">April 2025</span>
              </div>

              <div className="space-y-2">
                {[
                  {
                    desc: '20% OFF Cashback (Order #SGC1287)',
                    date: '12 Apr 2025 • 04:20 PM',
                    type: 'Cashback',
                    amount: '+ ₹80',
                    color: 'text-emerald-600'
                  },
                  {
                    desc: 'Reward Points Earned (Order #SGC1274)',
                    date: '10 Apr 2025 • 01:15 PM',
                    type: 'Points',
                    amount: '+ 50 pts',
                    color: 'text-[#5844A8]'
                  },
                  {
                    desc: 'Free Coffee Offer Used (Order #SGC1260)',
                    date: '08 Apr 2025 • 07:10 PM',
                    type: 'Offer',
                    amount: '- 1 Offer',
                    color: 'text-rose-500'
                  },
                  {
                    desc: 'Tier Bonus Points (Gold Member Reward)',
                    date: '05 Apr 2025 • 02:45 PM',
                    type: 'Points',
                    amount: '+ 100 pts',
                    color: 'text-[#5844A8]'
                  },
                  {
                    desc: 'Happy Hours Cashback (Order #SGC1229)',
                    date: '01 Apr 2025 • 11:20 AM',
                    type: 'Cashback',
                    amount: '+ ₹50',
                    color: 'text-emerald-600'
                  }
                ].map((row, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#FAF8FF] rounded-2xl border border-purple-50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-[#1E1548]">{row.desc}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{row.date}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-bold bg-white px-2 py-0.5 rounded-full border border-purple-100">
                        {row.type}
                      </span>
                      <span className={`font-black text-sm ${row.color}`}>{row.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =======================================================================
            MODULE 10: CUSTOMER PROFILE & LOYALTY TIER HUB (iPad Image 5)
           ======================================================================= */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* User Profile Dossier */}
            <div className="bg-white rounded-3xl p-6 border border-purple-50 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#1E1548] text-white flex items-center justify-center font-black text-lg">
                  AS
                </div>
                <div>
                  <h3 className="text-base font-black text-[#1E1548]">Aarav Sharma</h3>
                  <p className="text-xs text-gray-400">aarav@example.com • +91 98765 43210</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert('Edit profile dialog')}
                className="px-3.5 py-1.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Edit
              </button>
            </div>

            {/* Gold Member Loyalty Tier Card */}
            <div className="bg-gradient-to-br from-[#FFF9E6] to-[#FFF3CC] rounded-3xl p-6 border border-amber-200 shadow-xs space-y-4 text-amber-950">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">👑</span>
                  <div>
                    <h4 className="text-sm font-black">Gold Member</h4>
                    <p className="text-xs font-bold text-amber-800">320 Points</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Tier benefits breakdown: 15% bonus stamps, birthday gift, free priority tables.')}
                  className="text-xs font-bold text-amber-900 hover:underline cursor-pointer"
                >
                  Tier Benefits &rarr;
                </button>
              </div>

              {/* Progress scale */}
              <div>
                <div className="flex justify-between text-[11px] font-bold text-amber-800 mb-1">
                  <span>Gold (250 pts)</span>
                  <span>Platinum (500 pts)</span>
                </div>
                <div className="w-full h-2.5 bg-amber-200 rounded-full overflow-hidden">
                  <div className="w-[64%] h-full bg-[#5844A8]" />
                </div>
                <p className="text-[10px] text-amber-700 font-medium mt-1">180 points to next reward tier</p>
              </div>
            </div>

            {/* Settings Tiles */}
            <div className="bg-white rounded-3xl p-4 border border-purple-50 shadow-xs divide-y divide-gray-100">
              {[
                { title: 'Digital Wallet', desc: 'Points, cashback & more', tab: 'wallet' },
                { title: 'Stamp Cards', desc: 'Active stamp cards and rewards', tab: 'stamps' },
                { title: 'Call Staff & Amenities', desc: 'Water, condiments, cutlery', tab: 'call_staff' },
                { title: 'Wi-Fi Credentials', desc: 'SlyGranny_Cafe login', tab: 'wifi' }
              ].map((item) => (
                <div
                  key={item.title}
                  onClick={() => setActiveTab(item.tab as any)}
                  className="py-3.5 px-3 flex items-center justify-between hover:bg-[#FAF8FF] rounded-2xl cursor-pointer group"
                >
                  <div>
                    <div className="text-xs font-bold text-[#1E1548] group-hover:text-[#5844A8]">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-gray-400">{item.desc}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#5844A8]" />
                </div>
              ))}

              <div
                onClick={() => onNavigate('/')}
                className="py-3.5 px-3 flex items-center justify-between hover:bg-rose-50 rounded-2xl cursor-pointer text-rose-600"
              >
                <div>
                  <div className="text-xs font-bold">Exit Guest Session</div>
                  <div className="text-[11px] text-rose-400">Return to landing page</div>
                </div>
                <ChevronRight className="w-4 h-4 text-rose-400" />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =========================================================================
          DESKTOP FOOTER
         ========================================================================= */}
      <footer className="bg-white border-t border-purple-100 py-6 text-center text-xs text-gray-400">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © {new Date().getFullYear()} Sly Granny Café • Powered by <span className="font-bold text-[#5844A8]">Revia Unified Commerce</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-bold text-gray-500">
            <button onClick={() => setActiveTab('menu')} className="hover:text-[#5844A8] cursor-pointer">Menu</button>
            <button onClick={() => setActiveTab('offers')} className="hover:text-[#5844A8] cursor-pointer">Offers</button>
            <button onClick={() => setActiveTab('stamps')} className="hover:text-[#5844A8] cursor-pointer">Stamps</button>
            <button onClick={() => setActiveTab('wifi')} className="hover:text-[#5844A8] cursor-pointer">Wi-Fi</button>
            <button onClick={() => setActiveTab('feedback')} className="hover:text-[#5844A8] cursor-pointer">Review Us</button>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
};
