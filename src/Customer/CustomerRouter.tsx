import React, { useState, useEffect } from 'react';
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
  Sparkle,
  Tablet,
  Monitor,
  BookOpen,
  Gamepad2,
  Megaphone,
  Tag,
  ShoppingBag,
  Pin,
  Percent,
  Crown,
  AlertCircle,
  LogOut,
  Edit3,
  FileText,
  Menu as MenuIcon
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
  // Auto-detect Viewport Mode: 'desktop' (>= 1024px) | 'tablet' (640px to 1023px) | 'mobile' (< 640px)
  const getViewport = (): 'desktop' | 'tablet' | 'mobile' => {
    if (typeof window === 'undefined') return 'desktop';
    const w = window.innerWidth;
    if (w >= 1024) return 'desktop';
    if (w >= 640) return 'tablet';
    return 'mobile';
  };

  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>(getViewport);

  useEffect(() => {
    const handleResize = () => {
      setViewportMode(getViewport());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mobile Customer Experience Navigation & States (Matching 17 Reference Screens)
  const [mobileTab, setMobileTab] = useState<string>('home'); // 'home' | 'offers' | 'menu' | 'profile' | 'offer_detail' | 'cart' | 'tracker' | 'call_waiter' | 'request_items' | 'order_completed' | 'wallet_history' | 'stamps' | 'partner_hub'
  const [mobileOffersFilter, setMobileOffersFilter] = useState<'active' | 'expired'>('active');
  const [mobileCategory, setMobileCategory] = useState<string>('All');
  const [mobileSearchText, setMobileSearchText] = useState('');
  const [mobileShowQrModal, setMobileShowQrModal] = useState(false);
  const [mobileAssignedWaiter, setMobileAssignedWaiter] = useState('Rohit Sharma');
  const [mobileWaiterState, setMobileWaiterState] = useState<'sent' | 'on_the_way' | 'arrived'>('on_the_way');
  const [mobileIsLateOrder, setMobileIsLateOrder] = useState(false);
  const [mobileTableAmenities, setMobileTableAmenities] = useState({
    tissue: true,
    salt: false,
    waterQty: 1,
    platesQty: 1
  });
  const [mobileCustomAmenityText, setMobileCustomAmenityText] = useState('');
  const [mobileReviewRatings, setMobileReviewRatings] = useState({
    service: 5,
    food: 5,
    ambience: 4
  });
  const [mobileReviewText, setMobileReviewText] = useState('');
  const [mobileWalletTabFilter, setMobileWalletTabFilter] = useState<'all' | 'orders' | 'rewards' | 'offers'>('all');
  const [mobileGreenSpoonTabFilter, setMobileGreenSpoonTabFilter] = useState<'all' | 'earned' | 'redeemed' | 'tier'>('all');
  const [mobileFavoriteItems, setMobileFavoriteItems] = useState<Record<string, boolean>>({
    cappuccino: true,
    brownie: true
  });

  // Desktop Primary Active Module Tab
  // 'home' | 'menu' | 'offers' | 'stamps' | 'tracker' | 'wallet' | 'call_staff' | 'profile' | 'feedback' | 'wifi'
  const [activeTab, setActiveTab] = useState<
    'home' | 'menu' | 'offers' | 'stamps' | 'tracker' | 'wallet' | 'call_staff' | 'profile' | 'feedback' | 'wifi'
  >('home');

  // Tablet / iPad Active Module Tab: 'home' | 'menu' | 'offers' | 'stamps' | 'history' | 'profile' | 'tracker' | 'call_staff' | 'wifi' | 'feedback'
  const [tabletTab, setTabletTab] = useState<
    'home' | 'menu' | 'offers' | 'stamps' | 'history' | 'profile' | 'tracker' | 'call_staff' | 'wifi' | 'feedback'
  >('home');
  const [tabletCategory, setTabletCategory] = useState('All');
  const [tabletOfferFilter, setTabletOfferFilter] = useState('All Offers');
  const [tabletHistoryFilter, setTabletHistoryFilter] = useState('All');
  const [tabletSearch, setTabletSearch] = useState('');
  const [showGameModal, setShowGameModal] = useState(false);

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

  const filteredTabletMenuItems = MENU_ITEMS.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(tabletSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(tabletSearch.toLowerCase());
    const matchesCategory = tabletCategory === 'All' || item.category === tabletCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredMobileMenuItems = MENU_ITEMS.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(mobileSearchText.toLowerCase()) ||
      item.description.toLowerCase().includes(mobileSearchText.toLowerCase());
    const matchesCategory = mobileCategory === 'All' || item.category === mobileCategory;
    return matchesSearch && matchesCategory;
  });

  // =========================================================================
  // 1. MOBILE VIEWPORT (< 640px) - Exact match to 17 Mobile Reference Screenshots
  // =========================================================================
  if (viewportMode === 'mobile') {
    return (
      <div className="min-h-screen bg-[#FAF8FF] text-[#1E1548] font-sans antialiased flex flex-col select-none relative pb-24">
        {/* Mobile Header: Home Screen vs Sub-Screens */}
        {mobileTab === 'home' ? (
          <header className="px-4 py-3 bg-white/95 backdrop-blur-md border-b border-purple-100/70 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
            <button
              type="button"
              onClick={() => setMobileTab('partner_hub')}
              className="w-9 h-9 rounded-full bg-purple-50 hover:bg-purple-100 flex items-center justify-center text-[#5844A8] cursor-pointer shadow-2xs transition"
              title="Partner Merchant Hub"
            >
              <MenuIcon className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setMobileTab('home')}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF4E8D] to-[#7C3AED] p-0.5 flex items-center justify-center shadow-xs">
                <Coffee className="w-4 h-4 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-xs font-black text-[#1E1548] tracking-tight leading-none">
                  Sly Granny
                </h1>
                <span className="text-[9px] font-bold text-pink-600 block -mt-0.5">— Cafe —</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileTab('tracker')}
              className="w-9 h-9 rounded-full bg-purple-50 hover:bg-purple-100 flex items-center justify-center text-[#5844A8] cursor-pointer shadow-2xs relative transition"
              title="Track Order"
            >
              <Bell className="w-4 h-4" />
              {isOrderPlaced && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E11D48] rounded-full animate-ping" />
              )}
            </button>
          </header>
        ) : (
          <header className="px-4 py-3 bg-white/95 backdrop-blur-md border-b border-purple-100/70 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
            <button
              type="button"
              onClick={() => {
                if (['call_waiter', 'request_items'].includes(mobileTab)) {
                  setMobileTab('tracker');
                } else if (['cart', 'offer_detail'].includes(mobileTab)) {
                  setMobileTab('menu');
                } else {
                  setMobileTab('home');
                }
              }}
              className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-[#1E1548] shadow-2xs cursor-pointer transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setMobileTab('home')}>
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#FF4E8D] to-[#7C3AED] p-0.5 flex items-center justify-center shadow-xs">
                <Coffee className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-xs font-black text-[#1E1548] tracking-tight leading-none">
                  Sly Granny
                </h1>
                <span className="text-[9px] font-bold text-pink-600 block -mt-0.5">— Cafe —</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {mobileTab === 'menu' && (
                <>
                  <button
                    type="button"
                    onClick={() => {}}
                    className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-gray-600 hover:text-[#5844A8] cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileTab('cart')}
                    className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-gray-600 hover:text-[#5844A8] cursor-pointer relative"
                  >
                    <Utensils className="w-4 h-4" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E11D48] text-white text-[9px] font-black flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </button>
                </>
              )}
              {mobileTab !== 'menu' && (
                <button
                  type="button"
                  onClick={() => setMobileTab('tracker')}
                  className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-gray-600 hover:text-[#5844A8] cursor-pointer relative"
                >
                  <Bell className="w-4 h-4" />
                  {isOrderPlaced && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#E11D48] rounded-full animate-ping" />
                  )}
                </button>
              )}
            </div>
          </header>
        )}

        {/* =====================================================================
            SCREEN 5: MOBILE CUSTOMER HOME (Screens 5 & 18)
           ===================================================================== */}
        {mobileTab === 'home' && (
          <main className="px-4 py-4 space-y-4 max-w-md mx-auto w-full animate-in fade-in duration-200">
            {/* Greeting Header Banner */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <h2 className="text-lg font-black text-[#1E1548] flex items-center gap-1.5">
                  Hi Salena! <span className="animate-wave inline-block">👋</span>
                </h2>
                <p className="text-xs text-gray-500 font-medium leading-snug mt-0.5">
                  Discover offers, earn rewards, and enjoy <br className="hidden sm:inline" />
                  more at your favourite spots!
                </p>
              </div>
              <div className="w-16 h-14 bg-purple-50 rounded-2xl border border-purple-100 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                🏪
              </div>
            </div>

            {/* In-Dining Active Order Floating Card (Shown When Table Order is Live) */}
            <div className="bg-white rounded-3xl p-4 border border-purple-100/80 shadow-md shadow-purple-900/5 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-100 to-pink-50 flex items-center justify-center text-xl shadow-2xs">
                    🛎️
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-[#1E1548]">Your Order</h3>
                    <div
                      onClick={() => setMobileTab('tracker')}
                      className="text-[10px] text-gray-400 font-bold hover:text-[#5844A8] cursor-pointer flex items-center gap-0.5"
                    >
                      <span>Estimated Time: 15–20 mins</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>

                <span
                  onClick={() => setMobileIsLateOrder((prev) => !prev)}
                  className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full cursor-pointer border ${
                    mobileIsLateOrder
                      ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse'
                      : 'bg-purple-50 border-purple-100 text-[#5844A8]'
                  }`}
                  title="Click to toggle delay simulation"
                >
                  {mobileIsLateOrder ? '⏱ Running Late' : '◎ In Kitchen'}
                </span>
              </div>

              {/* Action Buttons inside Active Order Widget */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setMobileTab('call_waiter')}
                  className="py-2.5 px-3 rounded-2xl border border-gray-200 text-xs font-bold text-[#1E1548] bg-white hover:bg-gray-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition"
                >
                  <Bell className="w-3.5 h-3.5 text-gray-500" />
                  <span>Call Waiter</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMobileTab('request_items')}
                  className="py-2.5 px-3 rounded-2xl bg-[#2D1A47] hover:bg-[#1E1130] text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-white" />
                  <span>Request Item</span>
                </button>
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-1 pt-1">
                <span className="w-4 h-1 bg-[#2D1A47] rounded-full" />
                <span className="w-1.5 h-1 bg-gray-200 rounded-full" />
              </div>
            </div>

            {/* Section 1: "Your Offers" */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-[#1E1548]">Your Offers</h3>
                <button
                  type="button"
                  onClick={() => setMobileTab('offers')}
                  className="text-xs font-bold text-[#5844A8] hover:underline cursor-pointer flex items-center gap-0.5"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMobileOffersFilter('active')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    mobileOffersFilter === 'active'
                      ? 'bg-[#2D1A47] text-white shadow-xs'
                      : 'bg-white border border-gray-200 text-gray-500'
                  }`}
                >
                  Active Offers (3)
                </button>
                <button
                  type="button"
                  onClick={() => setMobileOffersFilter('expired')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    mobileOffersFilter === 'expired'
                      ? 'bg-[#2D1A47] text-white shadow-xs'
                      : 'bg-white border border-gray-200 text-gray-500'
                  }`}
                >
                  Expired Offers (2)
                </button>
              </div>

              {/* Horizontal Offer Cards Carousel */}
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                {/* Offer Card 1 */}
                <div className="min-w-[260px] bg-white rounded-3xl p-3 border border-purple-50 shadow-sm flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&auto=format&fit=crop&q=80"
                    alt="Beverage"
                    className="w-20 h-20 rounded-2xl object-cover shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="text-[8px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      Active
                    </span>
                    <h4 className="text-xs font-black text-[#1E1548] leading-tight">
                      Flat 20% OFF
                    </h4>
                    <p className="text-[10px] text-gray-400 font-medium">on all Beverages</p>
                    <button
                      type="button"
                      onClick={() => setMobileTab('offer_detail')}
                      className="py-1 px-2.5 bg-[#2D1A47] text-white text-[10px] font-bold rounded-lg cursor-pointer hover:bg-[#1E1130] transition inline-block"
                    >
                      Redeem Now &rarr;
                    </button>
                  </div>
                </div>

                {/* Offer Card 2 (Peeking) */}
                <div
                  onClick={() => setMobileTab('offer_detail')}
                  className="min-w-[200px] bg-white rounded-3xl p-3 border border-purple-50 shadow-sm flex items-center gap-3 cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&auto=format&fit=crop&q=80"
                    alt="Dessert"
                    className="w-16 h-16 rounded-2xl object-cover shrink-0"
                  />
                  <div>
                    <span className="text-[8px] font-black uppercase text-pink-700 bg-pink-50 px-2 py-0.5 rounded-full">
                      BOGO
                    </span>
                    <h4 className="text-xs font-black text-[#1E1548] leading-tight mt-0.5">
                      Buy 1 Get 1
                    </h4>
                    <p className="text-[9px] text-gray-400">On Desserts</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: "Nearby Offers" */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-[#1E1548]">Nearby Offers</h3>
                  <p className="text-[10px] text-gray-400 font-medium">
                    Offers from merchants around you
                  </p>
                </div>
                <span className="text-[10px] font-bold text-gray-500 bg-purple-50/70 border border-purple-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#5844A8]" />
                  Within 2 km
                </span>
              </div>

              {/* 3 Horizontal Merchant Cards */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    name: 'The Green Spoon',
                    badge: '15% OFF',
                    dist: '0.5 km',
                    img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&auto=format&fit=crop&q=80',
                    action: () => setMobileTab('partner_hub')
                  },
                  {
                    name: 'Pizza Hub',
                    badge: 'Flat 25% OFF',
                    dist: '1.2 km',
                    img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop&q=80',
                    action: () => alert('Opening Pizza Hub Specials!')
                  },
                  {
                    name: 'Brew House',
                    badge: '10% Cashback',
                    dist: '1.8 km',
                    img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&auto=format&fit=crop&q=80',
                    action: () => alert('Opening Brew House Specials!')
                  }
                ].map((merchant, idx) => (
                  <div
                    key={idx}
                    onClick={merchant.action}
                    className="bg-white rounded-2xl p-2 border border-purple-50 shadow-2xs cursor-pointer group hover:border-purple-200 transition"
                  >
                    <div className="relative rounded-xl overflow-hidden mb-1.5 h-16">
                      <img src={merchant.img} alt={merchant.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <span className="absolute bottom-1 left-1 bg-white/95 text-[8px] font-black text-[#E11D48] px-1.5 py-0.5 rounded shadow-xs">
                        {merchant.badge}
                      </span>
                    </div>
                    <h4 className="text-[11px] font-black text-[#1E1548] truncate leading-tight">
                      {merchant.name}
                    </h4>
                    <div className="text-[9px] text-gray-400 flex items-center gap-0.5 mt-0.5">
                      <MapPin className="w-2.5 h-2.5" />
                      <span>{merchant.dist}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: "My Wallet" Gradient Banner */}
            <div
              onClick={() => setMobileTab('wallet_history')}
              className="bg-gradient-to-r from-[#2D1A47] via-[#3A225D] to-[#1E1130] rounded-3xl p-4 text-white shadow-md flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-xl shadow-xs">
                  👛
                </div>
                <div>
                  <span className="text-[10px] font-bold text-purple-200 uppercase tracking-wider block">
                    My Wallet
                  </span>
                  <div className="text-xl font-black text-white leading-tight">₹250.00</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-purple-300 group-hover:translate-x-1 transition-transform" />
            </div>

            {/* Section 4: "Wallet History" */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-[#1E1548]">Wallet History</h3>
                  <p className="text-[10px] text-gray-400 font-medium">
                    All your transactions and cashback in one place
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileTab('wallet_history')}
                  className="text-xs font-bold text-[#5844A8] hover:underline cursor-pointer flex items-center gap-0.5"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Transactions List */}
              <div className="space-y-2">
                {[
                  {
                    title: 'Cashback Received',
                    sub: 'Today, 09:10 AM',
                    amount: '+ ₹50.00',
                    isPositive: true,
                    icon: '🎁',
                    iconBg: 'bg-pink-50'
                  },
                  {
                    title: 'Offer Redeemed – The Green Spoon',
                    sub: 'Yesterday, 06:45 PM',
                    amount: '- ₹200.00',
                    isPositive: false,
                    icon: '🛒',
                    iconBg: 'bg-purple-50'
                  },
                  {
                    title: 'Cashback Received',
                    sub: 'Yesterday, 05:46 PM',
                    amount: '+ ₹20.00',
                    isPositive: true,
                    icon: '🎁',
                    iconBg: 'bg-pink-50'
                  }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-3 border border-purple-50 shadow-2xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl ${item.iconBg} flex items-center justify-center text-sm shrink-0`}>
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#1E1548] leading-tight">
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-gray-400 font-medium">{item.sub}</span>
                      </div>
                    </div>
                    <span className={`text-xs font-black ${item.isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {item.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Loyalty Stamp Punch Card Teaser Banner */}
            <div
              onClick={() => setMobileTab('stamps')}
              className="bg-purple-50/80 rounded-2xl p-3.5 border border-purple-200/60 flex items-center justify-between cursor-pointer hover:bg-purple-100/60 transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">☕</span>
                <div>
                  <h4 className="text-xs font-black text-[#1E1548]">Coffee Stamp Card</h4>
                  <p className="text-[10px] text-gray-500 font-medium">
                    1 stamp away from a free artisan brew! (5 / 6)
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#5844A8] bg-white px-2.5 py-1 rounded-xl shadow-2xs border border-purple-100">
                View &rarr;
              </span>
            </div>
          </main>
        )}

        {/* =====================================================================
            SCREEN: MOBILE OFFERS & DEALS LIST (mobileTab === 'offers')
           ===================================================================== */}
        {mobileTab === 'offers' && (
          <main className="px-4 py-4 space-y-4 max-w-md mx-auto w-full animate-in fade-in duration-200">
            {/* Header Title */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#1E1548]">Offers &amp; Rewards</h3>
                <p className="text-[10px] text-gray-400 font-medium">
                  Exclusive member promotions and café rewards
                </p>
              </div>
              <span className="text-[10px] font-bold text-[#5844A8] bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
                5 Available
              </span>
            </div>

            {/* Loyalty Stamps Teaser Card */}
            <div
              onClick={() => setMobileTab('stamps')}
              className="bg-gradient-to-r from-[#2D1A47] to-[#1E1130] rounded-3xl p-4 text-white shadow-md flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-xl">
                  ☕
                </div>
                <div>
                  <span className="text-[9px] text-purple-200 font-bold uppercase tracking-wider block">
                    Stamp Program
                  </span>
                  <div className="text-xs font-black text-white">1 Stamp Away from Free Coffee!</div>
                  <span className="text-[10px] text-amber-300 font-bold">5 / 6 Stamps Collected</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-purple-300 group-hover:translate-x-1 transition-transform" />
            </div>

            {/* Active vs Expired Toggle Tabs */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileOffersFilter('active')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  mobileOffersFilter === 'active'
                    ? 'bg-[#2D1A47] text-white shadow-xs'
                    : 'bg-white border border-gray-200 text-gray-500'
                }`}
              >
                Active Offers (3)
              </button>
              <button
                type="button"
                onClick={() => setMobileOffersFilter('expired')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  mobileOffersFilter === 'expired'
                    ? 'bg-[#2D1A47] text-white shadow-xs'
                    : 'bg-white border border-gray-200 text-gray-500'
                }`}
              >
                Expired Offers (2)
              </button>
            </div>

            {/* Offers Cards List */}
            <div className="space-y-3">
              {[
                {
                  id: 'bogo-desserts',
                  title: 'Buy 1 Get 1 Free',
                  cat: 'On Desserts',
                  desc: 'Buy any dessert and get another dessert of the same or lower value free!',
                  badge: 'BOGO',
                  badgeColor: 'bg-pink-50 text-[#E11D48] border-pink-100',
                  validity: 'Till 28 Nov 2026',
                  img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop&q=80',
                  action: () => setMobileTab('offer_detail')
                },
                {
                  id: 'flat-20-bev',
                  title: 'Flat 20% OFF',
                  cat: 'On All Beverages',
                  desc: 'Applicable on artisanal roasted coffees, iced lattes, and specialty brews.',
                  badge: '20% OFF',
                  badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                  validity: 'Till 30 Nov 2026',
                  img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&auto=format&fit=crop&q=80',
                  action: () => setMobileTab('offer_detail')
                },
                {
                  id: 'cold-coffee-10',
                  title: 'Flat 10% OFF',
                  cat: 'Cold Coffee Special',
                  desc: 'Chilled espresso over creamy cold milk and ice cubes with vanilla aroma.',
                  badge: '10% OFF',
                  badgeColor: 'bg-purple-50 text-[#5844A8] border-purple-100',
                  validity: 'Till 28 Nov 2026',
                  img: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&auto=format&fit=crop&q=80',
                  action: () => setMobileTab('offer_detail')
                },
                {
                  id: 'free-cookie',
                  title: 'Complimentary Cookie',
                  cat: 'First Visit Perk',
                  desc: 'Enjoy a warm handcrafted chocolate chip cookie with any espresso beverage.',
                  badge: 'FREE ITEM',
                  badgeColor: 'bg-amber-50 text-amber-700 border-amber-100',
                  validity: 'Till 15 Dec 2026',
                  img: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&auto=format&fit=crop&q=80',
                  action: () => setMobileTab('offer_detail')
                },
                {
                  id: 'pizza-partner',
                  title: 'Flat 25% OFF at Pizza Hub',
                  cat: 'Partner Merchant',
                  desc: 'Exclusive partner benefit on any large gourmet artisanal pizza.',
                  badge: 'PARTNER DEAL',
                  badgeColor: 'bg-blue-50 text-blue-700 border-blue-100',
                  validity: 'Within 1.2 km',
                  img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=80',
                  action: () => setMobileTab('partner_hub')
                }
              ].map((offer) => (
                <div
                  key={offer.id}
                  onClick={offer.action}
                  className="bg-white rounded-3xl p-3.5 border border-purple-50 shadow-2xs space-y-3 cursor-pointer hover:border-purple-200 transition group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={offer.img}
                      alt={offer.title}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${offer.badgeColor}`}>
                          {offer.badge}
                        </span>
                        <span className="text-[9px] font-bold text-gray-400">{offer.cat}</span>
                      </div>
                      <h4 className="text-xs font-black text-[#1E1548] leading-tight">
                        {offer.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 line-clamp-1">{offer.desc}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[9px] text-gray-400">{offer.validity}</span>
                        <span className="text-[10px] font-black text-[#5844A8] group-hover:underline flex items-center gap-0.5">
                          <span>Redeem</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        )}

        {/* =====================================================================
            SCREEN 6: MOBILE OFFER DETAILS (Buy 1 Get 1 Free)
           ===================================================================== */}
        {mobileTab === 'offer_detail' && (
          <main className="px-4 py-4 space-y-4 max-w-md mx-auto w-full animate-in fade-in duration-200">
            {/* Featured Image & Heart Tag */}
            <div className="relative rounded-3xl overflow-hidden shadow-md h-52 bg-purple-50">
              <img
                src="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80"
                alt="Chocolate Cake"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => toggleFavorite('blueberry-muffin')}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-600 hover:text-rose-500 shadow-sm cursor-pointer"
              >
                <Heart className="w-4 h-4" />
              </button>
            </div>

            {/* Offer Header */}
            <div>
              <span className="text-[10px] font-bold text-[#5844A8] bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100 inline-block mb-1.5">
                On Desserts
              </span>
              <h2 className="text-xl font-black text-[#1E1548] leading-tight">
                Buy 1 Get 1 Free
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Buy any dessert and get another dessert of the same or lower value absolutely free!
              </p>
            </div>

            {/* 3-Column Metadata Card */}
            <div className="bg-white rounded-2xl p-3 border border-purple-50 shadow-2xs grid grid-cols-3 gap-2 text-center">
              <div className="border-r border-purple-50 pr-1">
                <Tag className="w-4 h-4 text-[#5844A8] mx-auto mb-1" />
                <span className="text-[9px] text-gray-400 font-bold block uppercase">Offer Type</span>
                <span className="text-xs font-black text-[#1E1548]">Free item</span>
              </div>
              <div className="border-r border-purple-50 pr-1">
                <Calendar className="w-4 h-4 text-[#5844A8] mx-auto mb-1" />
                <span className="text-[9px] text-gray-400 font-bold block uppercase">Validity</span>
                <span className="text-xs font-black text-[#1E1548]">Till 28 Nov 2026</span>
              </div>
              <div>
                <Gift className="w-4 h-4 text-[#5844A8] mx-auto mb-1" />
                <span className="text-[9px] text-gray-400 font-bold block uppercase">Applicable At</span>
                <span className="text-xs font-black text-[#1E1548]">All Branches</span>
              </div>
            </div>

            {/* Offer Details Card */}
            <div className="bg-white rounded-2xl p-4 border border-purple-50 shadow-2xs space-y-2">
              <h4 className="text-xs font-black text-[#1E1548] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#5844A8]" />
                Offer Details
              </h4>
              <ul className="text-xs text-gray-500 font-medium space-y-1.5 pl-4 list-disc">
                <li>Buy any dessert from our menu.</li>
                <li>Get another dessert of the same or lower value free.</li>
                <li>Valid for dine-in and takeaway.</li>
                <li>Not applicable with other ongoing offers.</li>
              </ul>
            </div>

            {/* Redemption Method Card */}
            <div className="bg-white rounded-2xl p-4 border border-purple-50 shadow-2xs space-y-3">
              <h4 className="text-xs font-black text-[#1E1548] flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5 text-[#5844A8]" />
                Redemption Method
              </h4>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-purple-50 text-[#5844A8] flex items-center justify-center mx-auto text-xs">
                    📱
                  </div>
                  <span className="font-bold text-gray-600 block leading-tight">
                    Go to Offers section
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-purple-50 text-[#5844A8] flex items-center justify-center mx-auto text-xs">
                    ⛶
                  </div>
                  <span className="font-bold text-gray-600 block leading-tight">
                    Show offer QR at counter
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-xs">
                    ✓
                  </div>
                  <span className="font-bold text-gray-600 block leading-tight">
                    Get applied instantly
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Redeem CTA */}
            <button
              type="button"
              onClick={() => {
                alert('Offer redeemed successfully! QR shown at counter.');
                setMobileTab('home');
              }}
              className="w-full py-3 bg-[#2D1A47] hover:bg-[#1E1130] text-white text-xs font-black rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Redeem Offer</span>
            </button>
          </main>
        )}

        {/* =====================================================================
            SCREEN 7: MOBILE GREEN SPOON PARTNER LOYALTY HUB
           ===================================================================== */}
        {mobileTab === 'partner_hub' && (
          <main className="px-4 py-4 space-y-4 max-w-md mx-auto w-full animate-in fade-in duration-200">
            {/* VIP Membership Banner */}
            <div className="bg-gradient-to-r from-[#2D1A47] via-[#3D1E6D] to-[#1E1130] rounded-3xl p-4 text-white shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center text-xl shadow-xs">
                    👑
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-200 font-bold uppercase tracking-wider">
                      Your Membership
                    </span>
                    <div className="text-base font-black text-white">VIP</div>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                      Current Tier
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-purple-200 font-bold block">Your Points</span>
                  <div className="text-lg font-black text-amber-300 flex items-center justify-end gap-1">
                    <span>★</span> 2,450
                  </div>
                  <button
                    type="button"
                    onClick={() => alert('VIP Benefits: 15% cashback, free dessert on birthday, priority seating!')}
                    className="text-[10px] text-white font-bold bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-lg transition cursor-pointer mt-1"
                  >
                    View Benefits &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Your Progress Stepper */}
            <div className="bg-white rounded-3xl p-4 border border-purple-50 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-[#1E1548]">Your Progress</h4>
                <span className="text-[10px] font-bold text-gray-400">Next Tier: Elite</span>
              </div>

              {/* Stepper Line */}
              <div className="flex items-center justify-between relative px-4">
                <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-0.5 bg-purple-200" />
                <div className="text-center relative z-10">
                  <div className="w-7 h-7 rounded-full bg-purple-100 text-[#5844A8] flex items-center justify-center text-xs mx-auto">
                    ⭐
                  </div>
                  <span className="text-[9px] font-bold text-gray-500">Member</span>
                </div>
                <div className="text-center relative z-10">
                  <div className="w-8 h-8 rounded-full bg-[#2D1A47] text-amber-300 flex items-center justify-center text-xs mx-auto shadow-xs border-2 border-white">
                    👑
                  </div>
                  <span className="text-[9px] font-black text-[#2D1A47]">VIP (Current)</span>
                </div>
                <div className="text-center relative z-10">
                  <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs mx-auto">
                    💎
                  </div>
                  <span className="text-[9px] font-bold text-gray-400">Elite</span>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-2.5 text-center text-xs font-bold text-[#5844A8]">
                Earn 550 more points to become an Elite member!
              </div>
            </div>

            {/* Available Offers */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-[#1E1548]">
                  Available Offers (Currently Running)
                </h4>
                <span className="text-[10px] text-[#5844A8] font-bold cursor-pointer">View All &rarr;</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { title: 'On All Beverages', badge: 'Flat 20% OFF', date: 'Valid till 30 Nov' },
                  { title: 'On Desserts', badge: 'Buy 1 Get 1', date: 'Valid till 28 Nov' },
                  { title: 'Cold Coffee', badge: 'Flat 10% OFF', date: 'Valid till 28 Nov' }
                ].map((offer, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-2.5 border border-purple-50 shadow-2xs text-center space-y-1">
                    <span className="text-[8px] font-black text-[#E11D48] bg-pink-50 px-1.5 py-0.5 rounded">
                      {offer.badge}
                    </span>
                    <h5 className="text-[10px] font-black text-[#1E1548] leading-tight truncate">{offer.title}</h5>
                    <span className="text-[8px] text-gray-400 block">{offer.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Applied Offers by Branch */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-[#1E1548]">Applied Offers by Branch</h4>
                <span className="text-[10px] text-[#5844A8] font-bold cursor-pointer">View All &rarr;</span>
              </div>
              <div className="space-y-2">
                <div className="bg-white rounded-2xl p-3 border border-purple-50 shadow-2xs flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-black text-[#1E1548]">Sly Granny Cafe - Downtown</h5>
                    <span className="text-[10px] text-gray-400">📍 0.5 km</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                    ✓ Applied: 10% Off
                  </span>
                </div>
                <div className="bg-white rounded-2xl p-3 border border-purple-50 shadow-2xs flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-black text-[#1E1548]">Sly Granny Cafe - City Mall</h5>
                    <span className="text-[10px] text-gray-400">📍 1.5 km</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                    ✓ Applied: Flat 20%
                  </span>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* =====================================================================
            SCREEN 8: MOBILE DIGITAL CAFÉ MENU
           ===================================================================== */}
        {mobileTab === 'menu' && (
          <main className="px-4 py-4 space-y-4 max-w-md mx-auto w-full animate-in fade-in duration-200">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-purple-100/70 via-pink-50/70 to-purple-50 rounded-3xl p-4 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black text-[#1E1548]">
                  Our <span className="text-pink-600">Cafe</span> Menu
                </h3>
                <p className="text-[10px] text-gray-500 font-medium">
                  Freshly brewed, deliciously made just for you!
                </p>
              </div>
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-xs">
                <img
                  src="https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200&auto=format&fit=crop&q=80"
                  alt="Coffee"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Horizontal Category Icon Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 'All', label: 'All', icon: '⊞' },
                { id: 'Coffee', label: 'Beverages', icon: '☕' },
                { id: 'Snacks', label: 'Snacks', icon: '🥤' },
                { id: 'Desserts', label: 'Desserts', icon: '🍰' },
                { id: 'Breakfast', label: 'Combos', icon: '🍱' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setMobileCategory(cat.id)}
                  className={`px-3 py-2 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                    mobileCategory === cat.id
                      ? 'bg-[#2D1A47] text-white shadow-xs'
                      : 'bg-white border border-gray-200 text-gray-600'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Popular Picks Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-[#1E1548] flex items-center gap-1">
                  Popular Picks 🔥
                </h4>
                <span className="text-[10px] text-[#5844A8] font-bold cursor-pointer">View All &gt;</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    id: 'cappuccino',
                    name: 'Cappuccino',
                    price: 149,
                    img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&auto=format&fit=crop&q=80'
                  },
                  {
                    id: 'chocolate-brownie',
                    name: 'Chocolate Brownie',
                    price: 199,
                    img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&auto=format&fit=crop&q=80'
                  },
                  {
                    id: 'veg-sandwich',
                    name: 'Veg Sandwich',
                    price: 179,
                    img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&auto=format&fit=crop&q=80'
                  }
                ].map((pick) => (
                  <div key={pick.id} className="bg-white rounded-2xl p-2 border border-purple-50 shadow-2xs flex flex-col justify-between">
                    <div className="relative rounded-xl overflow-hidden mb-1.5 h-18 bg-purple-50">
                      <img src={pick.img} alt={pick.name} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => toggleFavorite(pick.id)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/90 flex items-center justify-center text-gray-500 shadow-2xs"
                      >
                        <Heart className="w-3 h-3" />
                      </button>
                    </div>
                    <div>
                      <h5 className="text-[10px] font-black text-[#1E1548] truncate">{pick.name}</h5>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-black text-[#1E1548]">₹{pick.price}</span>
                        <button
                          type="button"
                          onClick={() => handleAddToCart(pick.id)}
                          className="py-1 px-2 rounded-lg bg-[#2D1A47] text-white text-[9px] font-bold cursor-pointer hover:bg-[#1E1130] transition"
                        >
                          Add +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Full Menu Section */}
            <div className="space-y-2 pt-1">
              <h4 className="text-xs font-black text-[#1E1548]">Full Menu</h4>
              <div className="space-y-2">
                {filteredMobileMenuItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-3 border border-purple-50 shadow-2xs flex items-center justify-between gap-3"
                  >
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-black text-[#1E1548] truncate">{item.name}</h5>
                      <p className="text-[10px] text-gray-400 line-clamp-1">{item.description}</p>
                      <div className="text-xs font-black text-[#1E1548] mt-1">₹{item.price}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(item.id)}
                      className="py-1.5 px-3 rounded-xl bg-[#2D1A47] text-white text-xs font-bold shrink-0 cursor-pointer hover:bg-[#1E1130] transition shadow-2xs"
                    >
                      Add +
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Cart Pill Bar */}
            {cartItemCount > 0 && (
              <div className="fixed bottom-20 inset-x-4 max-w-md mx-auto z-30 animate-in slide-in-from-bottom duration-300">
                <button
                  type="button"
                  onClick={() => setMobileTab('cart')}
                  className="w-full bg-[#2D1A47] text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between cursor-pointer hover:bg-[#1E1130] transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-white/20 text-white text-xs font-black flex items-center justify-center">
                      {cartItemCount}
                    </span>
                    <span className="text-xs font-bold">Items in Cart</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-black">
                    <span>₹{cartSubtotal}</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded-lg text-[10px]">View Cart &rarr;</span>
                  </div>
                </button>
              </div>
            )}
          </main>
        )}

        {/* =====================================================================
            SCREEN 9: MOBILE CART & BILL DETAILS
           ===================================================================== */}
        {mobileTab === 'cart' && (
          <main className="px-4 py-4 space-y-4 max-w-md mx-auto w-full animate-in fade-in duration-200">
            <h3 className="text-sm font-black text-[#1E1548] flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-[#5844A8]" />
              Your Cart ({cartItemCount})
            </h3>

            {/* Cart Items List Card */}
            <div className="bg-white rounded-3xl p-4 border border-purple-50 shadow-2xs space-y-3">
              {Object.entries(cart).map(([id, qty]) => {
                const item = MENU_ITEMS.find((m) => m.id === id) || {
                  id,
                  name: id === 'cappuccino' ? 'Cappuccino' : id === 'chocolate-brownie' ? 'Chocolate Brownie' : 'Classic Veg Burger',
                  price: id === 'cappuccino' ? 149 : id === 'chocolate-brownie' ? 199 : 229,
                  image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200&auto=format&fit=crop&q=80'
                };
                return (
                  <div key={id} className="flex items-center justify-between gap-3 pb-3 border-b border-purple-50 last:border-0 last:pb-0">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-black text-[#1E1548] truncate">{item.name}</h5>
                      <span className="text-xs font-bold text-[#5844A8]">₹{item.price}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-[#FAF8FF] border border-gray-200 rounded-xl px-2 py-1 gap-2 text-xs font-bold">
                        <button type="button" onClick={() => handleUpdateQty(id, -1)} className="cursor-pointer text-gray-500 hover:text-black">-</button>
                        <span>{qty}</span>
                        <button type="button" onClick={() => handleUpdateQty(id, 1)} className="cursor-pointer text-gray-500 hover:text-black">+</button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(id, -qty)}
                        className="text-gray-300 hover:text-rose-500 cursor-pointer p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Apply Coupon Row */}
            <div className="bg-white rounded-2xl p-3.5 border border-purple-100 flex items-center justify-between cursor-pointer hover:bg-purple-50/50 transition">
              <div className="flex items-center gap-2 text-xs font-bold text-[#5844A8]">
                <Tag className="w-4 h-4" />
                <span>Apply Coupon</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>

            {/* Bill Details Breakdown Card */}
            <div className="bg-white rounded-3xl p-4 border border-purple-50 shadow-2xs space-y-2 text-xs">
              <h4 className="font-black text-[#1E1548] pb-1 border-b border-purple-50">Bill Details</h4>
              <div className="flex items-center justify-between text-gray-500">
                <span>Item Total ({cartItemCount} Items)</span>
                <span className="font-bold text-[#1E1548]">₹{cartSubtotal}</span>
              </div>
              <div className="flex items-center justify-between text-gray-500">
                <span>Taxes (5%)</span>
                <span className="font-bold text-[#1E1548]">₹{Math.round(cartSubtotal * 0.05)}</span>
              </div>
              <div className="pt-2 border-t border-purple-50 flex items-center justify-between font-black text-sm text-[#1E1548]">
                <span>Total Payable</span>
                <span>₹{cartSubtotal + Math.round(cartSubtotal * 0.05)}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="button"
              onClick={() => {
                setIsOrderPlaced(true);
                setMobileTab('tracker');
              }}
              className="w-full py-3 bg-[#2D1A47] hover:bg-[#1E1130] text-white text-xs font-black rounded-2xl shadow-md transition cursor-pointer"
            >
              Place Order ₹{cartSubtotal + Math.round(cartSubtotal * 0.05)}
            </button>
          </main>
        )}

        {/* =====================================================================
            SCREENS 10 & 11: MOBILE LIVE ORDER TRACKER & DELAY STATE
           ===================================================================== */}
        {mobileTab === 'tracker' && (
          <main className="px-4 py-4 space-y-4 max-w-md mx-auto w-full animate-in fade-in duration-200">
            {/* Header Title with Dine In Badge */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#1E1548]">Track Your Order</h3>
                <p className="text-[10px] text-gray-400 font-medium">Sly Granny Café – Downtown</p>
              </div>
              <span className="text-[10px] font-bold text-pink-700 bg-pink-50 border border-pink-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                🍽 Dine In
              </span>
            </div>

            {/* KOT Number & Serving Time Card */}
            <div className="bg-white rounded-3xl p-4 border border-purple-50 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5844A8] flex items-center justify-center text-xs">
                    📋
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold uppercase block">KOT Number</span>
                    <span className="text-xs font-black text-[#1E1548]">#SG1045</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileIsLateOrder((prev) => !prev)}
                  className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full cursor-pointer transition ${
                    mobileIsLateOrder
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-purple-50 text-[#5844A8] border border-purple-100'
                  }`}
                  title="Click to toggle delay simulation"
                >
                  {mobileIsLateOrder ? '⏱ Running Late' : '◎ In Kitchen'}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-purple-50 text-center text-xs">
                <div>
                  <span className="text-[9px] text-gray-400 font-bold block uppercase">Table No.</span>
                  <span className="font-black text-[#1E1548]">12</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 font-bold block uppercase">Order Time</span>
                  <span className="font-black text-[#1E1548]">01:24 PM</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 font-bold block uppercase">Estimated</span>
                  {mobileIsLateOrder ? (
                    <span className="font-black text-rose-600 block text-[10px]">Now: 25–30 mins</span>
                  ) : (
                    <span className="font-black text-[#1E1548]">15–20 mins</span>
                  )}
                </div>
              </div>
            </div>

            {/* Delay Warning Apology Banner (When Order is Running Late) */}
            {mobileIsLateOrder && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 flex items-start gap-2.5 text-rose-900 animate-in fade-in duration-300">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-rose-800">Your Order is Running Late</h4>
                  <p className="text-[10px] text-rose-700 font-medium">
                    We're sorry for the delay. Your food will be ready in about 25–30 minutes.
                  </p>
                </div>
              </div>
            )}

            {/* Live Order Status Timeline (5 Stages) */}
            <div className="bg-white rounded-3xl p-4 border border-purple-50 shadow-2xs space-y-4">
              <h4 className="text-xs font-black text-[#1E1548]">Live Order Status</h4>
              <div className="space-y-4 pl-2 relative">
                {/* Stepper Vertical Connector Line */}
                <div className="absolute top-2 bottom-4 left-4 w-0.5 bg-purple-100" />

                {/* Step 1: Order Placed */}
                <div className="flex items-start gap-3 relative z-10">
                  <div className="w-5 h-5 rounded-full bg-[#5844A8] text-white flex items-center justify-center text-[10px] shrink-0">
                    ✓
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs font-bold text-[#1E1548]">
                      <span>Order Placed</span>
                      <span className="text-[10px] text-gray-400 font-normal">01:24 PM</span>
                    </div>
                    <p className="text-[10px] text-gray-400">Order successfully received.</p>
                  </div>
                </div>

                {/* Step 2: KOT Generated */}
                <div className="flex items-start gap-3 relative z-10">
                  <div className="w-5 h-5 rounded-full bg-[#5844A8] text-white flex items-center justify-center text-[10px] shrink-0">
                    ✓
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs font-bold text-[#1E1548]">
                      <span>KOT Generated</span>
                      <span className="text-[10px] text-gray-400 font-normal">01:25 PM</span>
                    </div>
                    <p className="text-[10px] text-gray-400">KOT #SG1045 sent to kitchen.</p>
                  </div>
                </div>

                {/* Step 3: Preparing Food (or Delay) */}
                <div className={`p-2 rounded-2xl border transition-all relative z-10 ${
                  mobileIsLateOrder ? 'bg-rose-50/80 border-rose-200' : 'bg-purple-50/80 border-purple-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 text-white ${
                      mobileIsLateOrder ? 'bg-rose-600' : 'bg-[#5844A8]'
                    }`}>
                      ⟳
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs font-black">
                        <span className={mobileIsLateOrder ? 'text-rose-800' : 'text-[#1E1548]'}>
                          {mobileIsLateOrder ? 'Your Order is Running Late' : 'Preparing Food'}
                        </span>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full text-white ${
                          mobileIsLateOrder ? 'bg-rose-600' : 'bg-[#5844A8]'
                        }`}>
                          Current
                        </span>
                      </div>
                      <p className={`text-[10px] ${mobileIsLateOrder ? 'text-rose-700' : 'text-gray-500'}`}>
                        {mobileIsLateOrder ? "We're sorry for the delay." : 'Your food is being prepared.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 4: Ready to Serve */}
                <div className="flex items-start gap-3 relative z-10 opacity-50">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center text-[10px] shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-gray-500 block">Ready to Serve</span>
                    <p className="text-[10px] text-gray-400">Waiting for kitchen confirmation.</p>
                  </div>
                </div>

                {/* Step 5: Served at Table */}
                <div
                  onClick={() => setMobileTab('order_completed')}
                  className="flex items-start gap-3 relative z-10 opacity-50 cursor-pointer hover:opacity-100 transition"
                  title="Click to simulate completing order"
                >
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center text-[10px] shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-gray-500 block">Served at Table</span>
                    <p className="text-[10px] text-gray-400">Food delivered to your table.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Snapshot */}
            <div className="bg-white rounded-3xl p-4 border border-purple-50 shadow-2xs space-y-2 text-xs">
              <div className="flex items-center justify-between font-black text-[#1E1548] pb-1 border-b border-purple-50">
                <span>Order Summary</span>
                <span className="text-[10px] text-gray-400 font-bold">3 Items</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>1 x Cheese Garlic Bread</span>
                <span className="font-bold">₹269</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>1 x Peri Peri Fries</span>
                <span className="font-bold">₹199</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>1 x Classic Veg Burger</span>
                <span className="font-bold">₹249</span>
              </div>
              <div className="pt-2 border-t border-purple-50 flex items-center justify-between font-black text-[#1E1548]">
                <span>Total (incl. tax)</span>
                <span>₹753</span>
              </div>
            </div>

            {/* Assistance Section ("Need Anything Else?") */}
            <div className="bg-white rounded-3xl p-4 border border-purple-50 shadow-2xs space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🛎️</span>
                <div>
                  <h4 className="text-xs font-black text-[#1E1548]">Need Anything Else?</h4>
                  <p className="text-[10px] text-gray-400 font-medium">
                    Request tissues, salt, water, or call a waiter to your table.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMobileTab('request_items')}
                  className="py-2.5 px-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-[#1E1548] flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-gray-500" />
                  <span>Request Items</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMobileTab('call_waiter')}
                  className="py-2.5 px-3 rounded-2xl bg-[#2D1A47] hover:bg-[#1E1130] text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Call Waiter</span>
                </button>
              </div>
            </div>
          </main>
        )}

        {/* =====================================================================
            SCREEN 12: MOBILE CALL WAITER
           ===================================================================== */}
        {mobileTab === 'call_waiter' && (
          <main className="px-4 py-4 space-y-4 max-w-md mx-auto w-full animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#1E1548]">Call Waiter</h3>
                <p className="text-[10px] text-gray-400 font-medium">
                  Choose an available waiter to assist you at your table.
                </p>
              </div>
              <span className="text-[10px] font-bold text-gray-500 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
                Table No. 12
              </span>
            </div>

            {/* Search Waiter Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search waiter"
                className="w-full bg-white border border-gray-200 rounded-2xl pl-9 pr-3 py-2 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8] shadow-2xs"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Available Waiters List (4 profiles) */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-black text-[#1E1548]">Available Waiters (4)</h4>
              {[
                {
                  name: 'Rohit Sharma',
                  rating: '4.8',
                  reviews: '112 reviews',
                  quote: 'Very polite and quick service!',
                  img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                },
                {
                  name: 'Neha Verma',
                  rating: '4.7',
                  reviews: '98 reviews',
                  quote: 'Courteous and always attentive.',
                  img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80'
                },
                {
                  name: 'Aman Singh',
                  rating: '4.6',
                  reviews: '76 reviews',
                  quote: 'Great service, very friendly.',
                  img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
                },
                {
                  name: 'Kavya Rao',
                  rating: '4.5',
                  reviews: '63 reviews',
                  quote: 'Prompt and helpful. Highly recommend!',
                  img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80'
                }
              ].map((waiter, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-3.5 border border-purple-50 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={waiter.img} alt={waiter.name} className="w-10 h-10 rounded-2xl object-cover shrink-0" />
                      <div>
                        <h5 className="text-xs font-black text-[#1E1548] leading-tight">{waiter.name}</h5>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-[10px] text-emerald-600 font-bold">Available</span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileAssignedWaiter(waiter.name);
                        alert(`Called ${waiter.name} for Table 12!`);
                      }}
                      className="py-1.5 px-3 rounded-xl bg-[#2D1A47] hover:bg-[#1E1130] text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer transition shadow-2xs"
                    >
                      <Bell className="w-3 h-3" />
                      <span>Call Waiter</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[10px] pt-1 border-t border-purple-50/60 text-gray-500">
                    <span className="text-amber-500 font-bold">★ {waiter.rating} ({waiter.reviews})</span>
                    <span className="italic text-gray-400 truncate max-w-[200px]">"{waiter.quote}"</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Active Waiter Request Status Tracker Card */}
            <div className="bg-white rounded-3xl p-4 border border-purple-50 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-[#1E1548]">Your Waiter Request</h4>
                <span className="text-[9px] font-black uppercase text-pink-700 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-100">
                  In Progress
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center font-bold text-xs text-[#5844A8]">
                    RS
                  </div>
                  <div>
                    <h5 className="font-bold text-[#1E1548] leading-tight">{mobileAssignedWaiter}</h5>
                    <span className="text-[10px] text-gray-400">Requested at 01:24 PM</span>
                  </div>
                </div>

                {/* 3-Stage Mini Stepper */}
                <div className="flex items-center gap-1 text-[9px] font-bold text-gray-400">
                  <span className="text-[#5844A8]">✓ Sent</span>
                  <span>&rarr;</span>
                  <span className="text-[#2D1A47] font-black underline">On the Way</span>
                  <span>&rarr;</span>
                  <span>Arrived</span>
                </div>
              </div>

              {/* Pin Waiter Nudge */}
              <div className="bg-purple-50/70 rounded-2xl p-3 flex items-center justify-between gap-2 border border-purple-100/70">
                <div>
                  <h6 className="text-[10px] font-black text-[#1E1548]">Waiter hasn't arrived yet?</h6>
                  <p className="text-[9px] text-gray-400">You can pin the waiter to get their attention.</p>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Pinned ${mobileAssignedWaiter}! A vibration alert was sent to the server tablet.`)}
                  className="py-1.5 px-3 bg-[#2D1A47] text-white rounded-xl text-[10px] font-bold shrink-0 cursor-pointer hover:bg-[#1E1130] transition flex items-center gap-1 shadow-2xs"
                >
                  <Pin className="w-3 h-3" />
                  <span>Pin Waiter</span>
                </button>
              </div>
            </div>
          </main>
        )}

        {/* =====================================================================
            SCREEN 13: MOBILE REQUEST TABLE AMENITIES
           ===================================================================== */}
        {mobileTab === 'request_items' && (
          <main className="px-4 py-4 space-y-4 max-w-md mx-auto w-full animate-in fade-in duration-200">
            <div>
              <h3 className="text-base font-black text-[#1E1548]">Request Items</h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Need something at your table? Select the items and we'll send a waiter to you.
              </p>
            </div>

            {/* 2x2 Interactive Amenity Tiles */}
            <div className="grid grid-cols-2 gap-3">
              {/* Tile 1: Tissue Paper */}
              <div
                onClick={() =>
                  setMobileTableAmenities((prev) => ({ ...prev, tissue: !prev.tissue }))
                }
                className={`p-4 rounded-3xl border text-center space-y-2 cursor-pointer transition relative ${
                  mobileTableAmenities.tissue
                    ? 'bg-purple-50/70 border-purple-300 shadow-xs'
                    : 'bg-white border-purple-50 shadow-2xs hover:border-purple-200'
                }`}
              >
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center text-[10px] absolute top-3 right-3 ${
                  mobileTableAmenities.tissue ? 'bg-[#2D1A47] text-white border-[#2D1A47]' : 'border-gray-300'
                }`}>
                  {mobileTableAmenities.tissue && '✓'}
                </div>
                <div className="text-3xl">🧻</div>
                <h5 className="text-xs font-black text-[#1E1548]">Tissue Paper</h5>
              </div>

              {/* Tile 2: Salt */}
              <div
                onClick={() =>
                  setMobileTableAmenities((prev) => ({ ...prev, salt: !prev.salt }))
                }
                className={`p-4 rounded-3xl border text-center space-y-2 cursor-pointer transition relative ${
                  mobileTableAmenities.salt
                    ? 'bg-purple-50/70 border-purple-300 shadow-xs'
                    : 'bg-white border-purple-50 shadow-2xs hover:border-purple-200'
                }`}
              >
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center text-[10px] absolute top-3 right-3 ${
                  mobileTableAmenities.salt ? 'bg-[#2D1A47] text-white border-[#2D1A47]' : 'border-gray-300'
                }`}>
                  {mobileTableAmenities.salt && '✓'}
                </div>
                <div className="text-3xl">🧂</div>
                <h5 className="text-xs font-black text-[#1E1548]">Salt</h5>
              </div>

              {/* Tile 3: Water with Stepper */}
              <div className="p-4 rounded-3xl bg-white border border-purple-50 shadow-2xs text-center space-y-2">
                <div className="text-3xl">🥛</div>
                <h5 className="text-xs font-black text-[#1E1548]">Water</h5>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setMobileTableAmenities((prev) => ({
                        ...prev,
                        waterQty: Math.max(0, prev.waterQty - 1)
                      }))
                    }
                    className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-xs"
                  >
                    -
                  </button>
                  <span className="text-xs font-black text-[#1E1548] w-4">
                    {mobileTableAmenities.waterQty}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setMobileTableAmenities((prev) => ({
                        ...prev,
                        waterQty: prev.waterQty + 1
                      }))
                    }
                    className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Tile 4: Extra Plates with Stepper */}
              <div className="p-4 rounded-3xl bg-white border border-purple-50 shadow-2xs text-center space-y-2">
                <div className="text-3xl">🍽️</div>
                <h5 className="text-xs font-black text-[#1E1548]">Extra Plates</h5>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setMobileTableAmenities((prev) => ({
                        ...prev,
                        platesQty: Math.max(0, prev.platesQty - 1)
                      }))
                    }
                    className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-xs"
                  >
                    -
                  </button>
                  <span className="text-xs font-black text-[#1E1548] w-4">
                    {mobileTableAmenities.platesQty}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setMobileTableAmenities((prev) => ({
                        ...prev,
                        platesQty: prev.platesQty + 1
                      }))
                    }
                    className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-xs"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Request Input Card */}
            <div className="bg-white rounded-3xl p-4 border border-purple-50 shadow-2xs space-y-2">
              <label className="block text-xs font-black text-[#1E1548]">
                Request Something Else
              </label>
              <input
                type="text"
                value={mobileCustomAmenityText}
                onChange={(e) => setMobileCustomAmenityText(e.target.value)}
                placeholder="E.g., Napkins, Ketchup, Spoon, etc."
                className="w-full bg-[#FAF8FF] border border-gray-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#1E1548] focus:bg-white focus:outline-none focus:border-[#5844A8]"
              />
            </div>

            {/* Send Request Action Button */}
            <button
              type="button"
              onClick={() => {
                alert('Table request sent to your server! Arriving shortly.');
                setMobileTab('tracker');
              }}
              className="w-full py-3 bg-[#2D1A47] hover:bg-[#1E1130] text-white text-xs font-black rounded-2xl shadow-md transition cursor-pointer"
            >
              Send Request
            </button>
          </main>
        )}

        {/* =====================================================================
            SCREEN 14: MOBILE ORDER COMPLETED & 3-AXIS REVIEW
           ===================================================================== */}
        {mobileTab === 'order_completed' && (
          <main className="px-4 py-4 space-y-4 max-w-md mx-auto w-full animate-in fade-in duration-200 text-center">
            {/* Cloche Illustration & Receipt Check */}
            <div className="w-20 h-20 rounded-full bg-purple-50 mx-auto flex items-center justify-center text-4xl shadow-sm border border-purple-100">
              🧾
            </div>
            <div>
              <h3 className="text-xl font-black text-[#1E1548]">Thank You!</h3>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Your order is completed and the bill has been given.
              </p>
            </div>

            {/* Bill Details Pill */}
            <div className="bg-white rounded-3xl p-3.5 border border-purple-50 shadow-2xs flex items-center justify-between text-left">
              <div>
                <span className="text-[10px] text-gray-400 font-bold block">Bill Details</span>
                <span className="text-xs font-black text-[#1E1548]">Order #SG1045</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-gray-400 uppercase font-bold block">Total Paid</span>
                <span className="text-sm font-black text-[#5844A8]">₹753</span>
              </div>
            </div>

            {/* 3-Axis Rating Dimensions */}
            <div className="bg-white rounded-3xl p-4 border border-purple-50 shadow-2xs text-left space-y-4">
              <div>
                <h4 className="text-xs font-black text-[#1E1548]">How was your experience?</h4>
                <p className="text-[10px] text-gray-400 font-medium">Your feedback helps us serve you better!</p>
              </div>

              {/* Dimension 1: Service */}
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-[#1E1548]">Service</h5>
                  <span className="text-[10px] text-gray-400">Rate the service quality</span>
                </div>
                <div className="flex gap-1 text-base cursor-pointer">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      onClick={() => setMobileReviewRatings((r) => ({ ...r, service: s }))}
                      className={s <= mobileReviewRatings.service ? 'text-amber-400' : 'text-gray-300'}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              {/* Dimension 2: Food Quality */}
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-[#1E1548]">Quality of Food</h5>
                  <span className="text-[10px] text-gray-400">Rate the taste and freshness</span>
                </div>
                <div className="flex gap-1 text-base cursor-pointer">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      onClick={() => setMobileReviewRatings((r) => ({ ...r, food: s }))}
                      className={s <= mobileReviewRatings.food ? 'text-amber-400' : 'text-gray-300'}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              {/* Dimension 3: Ambience */}
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-[#1E1548]">Ambience</h5>
                  <span className="text-[10px] text-gray-400">Rate the overall atmosphere</span>
                </div>
                <div className="flex gap-1 text-base cursor-pointer">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      onClick={() => setMobileReviewRatings((r) => ({ ...r, ambience: s }))}
                      className={s <= mobileReviewRatings.ambience ? 'text-amber-400' : 'text-gray-300'}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <textarea
                rows={2}
                value={mobileReviewText}
                onChange={(e) => setMobileReviewText(e.target.value)}
                placeholder="Share your thoughts (optional)..."
                className="w-full bg-[#FAF8FF] border border-gray-200 rounded-2xl p-2.5 text-xs text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  alert('Thank you for rating Sly Granny Café! 50 reward points added to your wallet.');
                  setMobileTab('home');
                }}
                className="w-full py-3 bg-[#2D1A47] hover:bg-[#1E1130] text-white text-xs font-black rounded-2xl shadow-md cursor-pointer transition"
              >
                Submit Review
              </button>
              <button
                type="button"
                onClick={() => setMobileTab('home')}
                className="w-full py-2.5 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-2xl hover:bg-gray-50 cursor-pointer transition"
              >
                Maybe Later
              </button>
            </div>
          </main>
        )}

        {/* =====================================================================
            SCREEN 16: MOBILE WALLET HISTORY & TRANSACTION LEDGER
           ===================================================================== */}
        {mobileTab === 'wallet_history' && (
          <main className="px-4 py-4 space-y-4 max-w-md mx-auto w-full animate-in fade-in duration-200">
            {/* Wallet Summary Banner */}
            <div className="bg-gradient-to-r from-[#2D1A47] via-[#3A225D] to-[#1E1130] rounded-3xl p-4 text-white shadow-md space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-xl">
                  👛
                </div>
                <div>
                  <span className="text-[10px] text-purple-200 uppercase font-bold block">My Wallet</span>
                  <div className="text-2xl font-black text-white">₹1,250.00</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
                <div>
                  <span className="text-[9px] text-purple-200 font-bold block">Total Cashback</span>
                  <span className="font-black text-white">₹200.00</span>
                </div>
                <div>
                  <span className="text-[9px] text-purple-200 font-bold block">Total Transactions</span>
                  <span className="font-black text-white">12</span>
                </div>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2">
              {(['all', 'orders', 'rewards', 'offers'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setMobileWalletTabFilter(tab)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition cursor-pointer ${
                    mobileWalletTabFilter === tab
                      ? 'bg-[#2D1A47] text-white shadow-xs'
                      : 'bg-white border border-gray-200 text-gray-500'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Detailed Ledger List */}
            <div className="space-y-2">
              {[
                { title: 'Coffee Stamp', sub: 'Sly Granny Café • 12 Apr 2025, 10:24 AM', delta: '+1 ★', status: '', icon: '☕' },
                { title: 'Burger Order', sub: 'Sly Granny Café • 10 Apr 2025, 02:15 PM', delta: '₹249', status: 'Completed', icon: '🍔' },
                { title: 'Offer Redeemed', sub: '20% Off First Visit • 08 Apr 2025, 12:10 PM', delta: '- ₹120', status: 'Applied', icon: '🎁' },
                { title: 'Coffee Order', sub: 'Sly Granny Café • 05 Apr 2025, 11:32 AM', delta: '₹180', status: 'Completed', icon: '☕' },
                { title: 'Stamp Earned', sub: 'Free Burger (3/5) • 02 Apr 2025, 06:20 PM', delta: '+1 🍷', status: '', icon: '🎟️' },
                { title: 'Offer Redeemed', sub: 'Buy 1 Get 1 Free • 30 Mar 2025, 01:45 PM', delta: '- ₹0', status: 'Applied', icon: '🏷️' }
              ].map((tx, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-3 border border-purple-50 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-sm shrink-0">
                      {tx.icon}
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-[#1E1548] leading-tight">{tx.title}</h5>
                      <span className="text-[9px] text-gray-400 block">{tx.sub}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-[#1E1548] block">{tx.delta}</span>
                    {tx.status && (
                      <span className="text-[8px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {tx.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </main>
        )}

        {/* =====================================================================
            SCREEN 17: MOBILE LOYALTY STAMPS HUB ("Good Food, Good Vibes")
           ===================================================================== */}
        {mobileTab === 'stamps' && (
          <main className="px-4 py-4 space-y-4 max-w-md mx-auto w-full animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#1E1548]">Good Food, Good Vibes</h3>
                <p className="text-[10px] text-gray-400 font-medium">Sly Granny Café Loyalty Rewards</p>
              </div>
              <div className="text-2xl">☕</div>
            </div>

            {/* Active Program Progress Card */}
            <div className="bg-gradient-to-r from-[#2D1A47] to-[#1E1130] rounded-3xl p-4 text-white shadow-md space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-purple-200 font-bold uppercase tracking-wider">Active Program</span>
                <span className="text-[9px] font-black uppercase text-pink-300 bg-white/10 px-2 py-0.5 rounded-full">
                  60% Done
                </span>
              </div>
              <h4 className="text-sm font-black text-white leading-tight">
                1 Stamp Away from Free Coffee!
              </h4>
              <p className="text-[10px] text-purple-200">
                Collect your 6th stamp today with any artisan roast brew.
              </p>
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] font-bold text-purple-200">
                  <span>Overall Progress</span>
                  <span>5 / 6</span>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full w-5/6" />
                </div>
              </div>
            </div>

            {/* Punch Card 1: Coffee Stamp Card (6 Stamps) */}
            <div className="bg-white rounded-3xl p-4 border border-purple-50 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-black text-[#1E1548]">Coffee Stamp Card</h5>
                  <p className="text-[10px] text-gray-400">Collect 6 stamps and get a free artisan brew!</p>
                </div>
                <span className="text-[9px] font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-full">
                  Next: Free Coffee
                </span>
              </div>

              {/* 6 Circular Slots */}
              <div className="grid grid-cols-6 gap-2 pt-1 text-center">
                {[1, 2, 3, 4, 5].map((slot) => (
                  <div key={slot} className="space-y-1">
                    <div className="w-10 h-10 rounded-full bg-[#2D1A47] text-white flex items-center justify-center text-sm shadow-xs mx-auto">
                      ☕
                    </div>
                    <span className="text-[9px] font-bold text-gray-400">#{slot}</span>
                  </div>
                ))}
                <div className="space-y-1">
                  <div className="w-10 h-10 rounded-full border-2 border-dashed border-rose-400 text-rose-500 flex items-center justify-center text-sm mx-auto">
                    🎁
                  </div>
                  <span className="text-[9px] font-bold text-rose-500">#6</span>
                </div>
              </div>
            </div>

            {/* Punch Card 2: Specials Stamp Card (8 Stamps) */}
            <div className="bg-white rounded-3xl p-4 border border-purple-50 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-black text-[#1E1548]">Specials Stamp Card</h5>
                  <p className="text-[10px] text-gray-400">Collect 8 stamps and get 15% off your total!</p>
                </div>
                <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  6 stamps remaining
                </span>
              </div>

              {/* 8 Circular Slots */}
              <div className="grid grid-cols-8 gap-1 pt-1 text-center">
                {[1, 2].map((slot) => (
                  <div key={slot} className="space-y-1">
                    <div className="w-7 h-7 rounded-full bg-[#2D1A47] text-white flex items-center justify-center text-[10px] shadow-xs mx-auto">
                      🍴
                    </div>
                    <span className="text-[8px] font-bold text-gray-400">#{slot}</span>
                  </div>
                ))}
                {[3, 4, 5, 6, 7].map((slot) => (
                  <div key={slot} className="space-y-1">
                    <div className="w-7 h-7 rounded-full bg-purple-50 text-purple-300 flex items-center justify-center text-[10px] mx-auto">
                      •
                    </div>
                    <span className="text-[8px] font-bold text-gray-300">#{slot}</span>
                  </div>
                ))}
                <div className="space-y-1">
                  <div className="w-7 h-7 rounded-full border-2 border-dashed border-rose-400 text-rose-500 flex items-center justify-center text-[10px] mx-auto">
                    🏷️
                  </div>
                  <span className="text-[8px] font-bold text-rose-500">#8</span>
                </div>
              </div>
            </div>

            {/* In-Store Table QR Scan Banner */}
            <div className="bg-[#2D1A47] rounded-2xl p-3.5 text-white flex items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">⛶</span>
                <div>
                  <h5 className="text-xs font-black text-white">Dining in right now?</h5>
                  <p className="text-[10px] text-purple-200">Scan QR code at your table to collect instant stamps.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileShowQrModal(true)}
                className="py-1.5 px-3 bg-white text-[#2D1A47] text-[10px] font-black rounded-xl cursor-pointer hover:bg-gray-100 transition shrink-0"
              >
                Scan Now
              </button>
            </div>

            {/* Recent Stamp Activity */}
            <div className="space-y-2">
              <h5 className="text-xs font-black text-[#1E1548]">Recent Activity</h5>
              <div className="space-y-2">
                {[
                  { title: 'Stamp collected - Coffee', date: '12 Apr, 2025 – 11:42 AM', icon: '☕' },
                  { title: 'Stamp collected - Main Course', date: '10 Apr, 2025 – 02:38 PM', icon: '🍽️' },
                  { title: 'Stamp collected - Coffee', date: '12 Apr, 2025 – 11:02 AM', icon: '☕' }
                ].map((act, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-2.5 border border-purple-50 shadow-2xs flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{act.icon}</span>
                      <div>
                        <span className="font-bold text-[#1E1548] block leading-tight">{act.title}</span>
                        <span className="text-[9px] text-gray-400">{act.date}</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-black text-[#5844A8] bg-purple-50 px-2 py-0.5 rounded-full">
                      +1 Stamp
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

        {/* =====================================================================
            SCREEN 15: MOBILE CUSTOMER PROFILE HUB
           ===================================================================== */}
        {mobileTab === 'profile' && (
          <main className="px-4 py-4 space-y-4 max-w-md mx-auto w-full animate-in fade-in duration-200">
            <h3 className="text-base font-black text-[#1E1548]">My Profile</h3>

            {/* User Identity Card */}
            <div className="bg-white rounded-3xl p-4 border border-purple-50 shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80"
                    alt="Salena Mishra"
                    className="w-14 h-14 rounded-full object-cover border-2 border-purple-100"
                  />
                  <div className="w-5 h-5 rounded-full bg-[#2D1A47] text-white flex items-center justify-center text-[10px] absolute -bottom-1 -right-1 shadow-xs">
                    📷
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#1E1548] leading-tight">Salena Mishra</h4>
                  <p className="text-[10px] text-gray-400 font-medium">📞 +91 98765 43210</p>
                  <p className="text-[10px] text-gray-400 font-medium">✉️ salena.mishra@gmail.com</p>
                </div>
              </div>
              <button type="button" className="p-2 text-gray-400 hover:text-[#5844A8] cursor-pointer">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            {/* My Wallet Banner */}
            <div
              onClick={() => setMobileTab('wallet_history')}
              className="bg-gradient-to-r from-[#2D1A47] via-[#3A225D] to-[#1E1130] rounded-3xl p-4 text-white shadow-md space-y-3 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-xl">
                  👛
                </div>
                <div>
                  <span className="text-[10px] text-purple-200 uppercase font-bold block">My Wallet</span>
                  <div className="text-xl font-black text-white">₹1,250.00</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
                <div>
                  <span className="text-[9px] text-purple-200 font-bold block">Total Cashback</span>
                  <span className="font-black text-white">₹200.00</span>
                </div>
                <div>
                  <span className="text-[9px] text-purple-200 font-bold block">Total Transactions</span>
                  <span className="font-black text-white">12</span>
                </div>
              </div>
            </div>

            {/* Navigation Menu Links */}
            <div className="bg-white rounded-3xl p-2 border border-purple-50 shadow-2xs divide-y divide-purple-50 text-xs">
              {[
                { label: 'My Orders', icon: ShoppingBag, action: () => setMobileTab('tracker') },
                { label: 'Offers & Rewards', icon: Tag, action: () => setMobileTab('offers') },
                { label: 'Wallet History', icon: CreditCard, action: () => setMobileTab('wallet_history') },
                { label: 'Loyalty Stamp Cards', icon: Ticket, action: () => setMobileTab('stamps') },
                { label: 'Saved Addresses', icon: MapPin, action: () => alert('Viewing Saved Addresses') },
                { label: 'Payment Methods', icon: CreditCard, action: () => alert('Viewing Payment Methods') },
                { label: 'Support & Help', icon: Phone, action: () => alert('Support helpline: +91 800-SLY-GRANNY') },
                { label: 'About Sly Granny Cafe', icon: Coffee, action: () => alert('Sly Granny Café - Artisanal Eatery & Roastery since 2018.') }
              ].map((link, idx) => {
                const IconC = link.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={link.action}
                    className="w-full p-3 flex items-center justify-between text-left hover:bg-purple-50/50 rounded-2xl transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <IconC className="w-4 h-4 text-[#5844A8]" />
                      <span className="font-bold text-[#1E1548]">{link.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </button>
                );
              })}
            </div>

            {/* Log Out Button */}
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('customer_token');
                localStorage.removeItem('customer');
                if (!localStorage.getItem('user')) {
                  localStorage.removeItem('token');
                }
                onNavigate('/');
              }}
              className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-2xl border border-rose-200 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </main>
        )}

        {/* =====================================================================
            MOBILE DOCKED 5-ICON BOTTOM NAVIGATION BAR
           ===================================================================== */}
        <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-purple-100 z-40 shadow-lg select-none">
          <div className="max-w-md mx-auto h-16 px-3 flex items-center justify-between relative">
            {/* 1. Home */}
            <button
              type="button"
              onClick={() => setMobileTab('home')}
              className={`flex flex-col items-center justify-center gap-0.5 cursor-pointer flex-1 transition-colors ${
                mobileTab === 'home' ? 'text-[#2D1A47] font-black' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${mobileTab === 'home' ? 'bg-purple-100/70 text-[#2D1A47]' : ''}`}>
                <Home className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold">Home</span>
            </button>

            {/* 2. Offers */}
            <button
              type="button"
              onClick={() => setMobileTab('offers')}
              className={`flex flex-col items-center justify-center gap-0.5 cursor-pointer flex-1 transition-colors ${
                ['offers', 'offer_detail', 'stamps'].includes(mobileTab) ? 'text-[#2D1A47] font-black' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${['offers', 'offer_detail', 'stamps'].includes(mobileTab) ? 'bg-purple-100/70 text-[#2D1A47]' : ''}`}>
                <Tag className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold">Offers</span>
            </button>

            {/* 3. Center Elevated Floating QR Button */}
            <div className="flex-1 flex justify-center relative">
              <button
                type="button"
                onClick={() => setMobileShowQrModal(true)}
                className="w-13 h-13 rounded-full bg-[#2D1A47] hover:bg-[#1E1130] text-white flex items-center justify-center shadow-xl border-4 border-white absolute -top-5 transition-transform active:scale-95 cursor-pointer"
                title="Scan Table QR Code"
              >
                <QrCode className="w-6 h-6 text-white" />
              </button>
              <div className="h-6" />
            </div>

            {/* 4. Menu */}
            <button
              type="button"
              onClick={() => setMobileTab('menu')}
              className={`flex flex-col items-center justify-center gap-0.5 cursor-pointer flex-1 transition-colors relative ${
                ['menu', 'cart'].includes(mobileTab) ? 'text-[#2D1A47] font-black' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${['menu', 'cart'].includes(mobileTab) ? 'bg-purple-100/70 text-[#2D1A47]' : ''}`}>
                <Utensils className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold">Menu</span>
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-3 w-4 h-4 rounded-full bg-[#E11D48] text-white text-[9px] font-black flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* 5. Profile */}
            <button
              type="button"
              onClick={() => setMobileTab('profile')}
              className={`flex flex-col items-center justify-center gap-0.5 cursor-pointer flex-1 transition-colors ${
                ['profile', 'wallet_history', 'partner_hub'].includes(mobileTab) ? 'text-[#2D1A47] font-black' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${['profile', 'wallet_history', 'partner_hub'].includes(mobileTab) ? 'bg-purple-100/70 text-[#2D1A47]' : ''}`}>
                <User className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold">Profile</span>
            </button>
          </div>
        </nav>

        {/* QR Scanner Modal */}
        {mobileShowQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl max-w-xs w-full p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#5844A8] flex items-center justify-center mx-auto text-2xl">
                ⛶
              </div>
              <div>
                <h4 className="text-sm font-black text-[#1E1548]">Scan Table QR</h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  Point camera at the table QR stand to check in and collect instant stamps.
                </p>
              </div>
              <div className="w-44 h-44 mx-auto rounded-2xl border-2 border-dashed border-[#5844A8] bg-[#FAF8FF] flex items-center justify-center relative overflow-hidden">
                <QrCode className="w-24 h-24 text-[#5844A8]/40" />
                <div className="absolute inset-x-0 h-0.5 bg-[#5844A8] animate-pulse top-1/2" />
              </div>
              <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-800 text-xs font-bold">
                Table 04 Detected • Ready to Order
              </div>
              <button
                type="button"
                onClick={() => setMobileShowQrModal(false)}
                className="w-full py-2.5 bg-[#2D1A47] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Scanner
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // 2. TABLET / IPAD VIEWPORT (640px to 1023px) - (Unchanged)
  // =========================================================================
  if (viewportMode === 'tablet') {
    return (
      <div className="min-h-screen bg-[#FAF8FF] text-[#1E1548] font-sans antialiased flex flex-col select-none relative pb-20">
        {/* iPad In-App Top Bar */}
        <header className="px-4 sm:px-6 py-3 bg-white/95 backdrop-blur-md border-b border-purple-100 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div
            onClick={() => setTabletTab('home')}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF4E8D] to-[#7C3AED] flex items-center justify-center shadow-xs">
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black text-[#1E1548] leading-tight">Sly Granny Café</h1>
                <span className="text-[9px] font-bold text-[#E11D48] bg-pink-50 border border-pink-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Table 04
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium">Good Food, Good Vibes</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTabletTab('wifi')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-[#5844A8] text-xs font-bold border border-purple-100 hover:bg-purple-100 cursor-pointer transition"
            >
              <Wifi className="w-3.5 h-3.5" />
              <span>Wi-Fi</span>
            </button>
            <button
              type="button"
              onClick={() => setTabletTab('tracker')}
              className="w-8 h-8 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-100 flex items-center justify-center text-[#5844A8] cursor-pointer relative transition"
              title="Active Order Notifications"
            >
              <Bell className="w-4 h-4" />
              {isOrderPlaced && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E11D48] rounded-full animate-ping" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setTabletTab('profile')}
              className="w-8 h-8 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-100 flex items-center justify-center text-[#5844A8] cursor-pointer transition"
              title="Settings & Profile"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* iPad Scrollable Content Area */}
        <div className="w-full max-w-2xl mx-auto flex-1 px-4 sm:px-6 py-4 space-y-4">
            {/* View 1: Tablet Home (Exact match to uploaded Screenshot 1) */}
            {tabletTab === 'home' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Hero Banner */}
                <div className="relative rounded-3xl overflow-hidden shadow-md h-40">
                  <img
                    src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80"
                    alt="Café Ambience"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent" />
                  {/* Floating Circular Avatar */}
                  <div className="absolute -bottom-1 left-5 flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF4E8D] to-[#7C3AED] p-0.5 shadow-lg flex items-center justify-center border-2 border-white">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-[#FF4E8D] to-[#7C3AED] flex items-center justify-center">
                        <Coffee className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="pt-2">
                      <h3 className="text-sm font-black text-[#1E1548]">Sly Granny Café</h3>
                      <p className="text-[10px] text-gray-500 font-medium">Good Food, Good Vibes</p>
                    </div>
                  </div>
                </div>

                {/* 2-Column Action Cards Grid (8 cards) */}
                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  {[
                    { title: 'Start Earning Rewards', desc: 'Collect stamps, get exclusive offers', icon: '🎁', tab: 'stamps' },
                    { title: 'Add a Review', desc: 'Share your experience', icon: '⭐', tab: 'feedback' },
                    { title: 'View Menu', desc: 'Explore our food & beverages', icon: '📖', tab: 'menu' },
                    { title: 'Connect to Wi-Fi', desc: 'Get connected while you relax', icon: '📶', tab: 'wifi' },
                    { title: 'Call Staff', desc: 'Need assistance? Call waiter or other staff', icon: '🔔', tab: 'call_staff' },
                    { title: 'Play Games', desc: 'Sudoku & more', icon: '🎮', action: () => setShowGameModal(true) },
                    { title: 'Suggestion Box', desc: "We'd love to hear from you", icon: '💬', tab: 'feedback' },
                    { title: 'Offers', desc: 'Latest offers for you', icon: '🏷️', tab: 'offers' }
                  ].map((card, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        if (card.action) card.action();
                        else if (card.tab) setTabletTab(card.tab as any);
                      }}
                      className="bg-white rounded-2xl p-3 border border-purple-50/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between h-24 group"
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-xl">{card.icon}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#5844A8] group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-[#1E1548] leading-tight line-clamp-1">{card.title}</h4>
                        <p className="text-[9px] text-gray-400 font-medium line-clamp-1 mt-0.5">{card.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Follow Our Channel Wide Card */}
                <div className="bg-white rounded-2xl p-3.5 border border-purple-50/80 shadow-2xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5844A8] flex items-center justify-center shrink-0">
                      <Megaphone className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#1E1548]">Follow Our Channel</h4>
                      <p className="text-[9px] text-gray-400">Get updates, events &amp; exclusive offers</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => alert('Opening Instagram @slygranny')} className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-pink-500 text-white flex items-center justify-center text-[10px] font-bold cursor-pointer shadow-2xs">IG</button>
                    <button onClick={() => alert('Opening Facebook')} className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold cursor-pointer shadow-2xs">FB</button>
                    <button onClick={() => alert('Opening YouTube')} className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center text-[10px] font-bold cursor-pointer shadow-2xs">YT</button>
                    <button onClick={() => alert('Opening WhatsApp Channel')} className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold cursor-pointer shadow-2xs">WA</button>
                  </div>
                </div>
              </div>
            )}

            {/* View 2: Tablet Menu */}
            {tabletTab === 'menu' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    value={tabletSearch}
                    onChange={(e) => setTabletSearch(e.target.value)}
                    placeholder="Search coffee, desserts, meals..."
                    className="w-full bg-white border border-gray-200 rounded-2xl pl-9 pr-3 py-2 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8] shadow-2xs"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                {/* Horizontal Category Scroll */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {['All', 'Coffee', 'Desserts', 'Breakfast', 'Main Course'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setTabletCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                        tabletCategory === cat
                          ? 'bg-[#5844A8] text-white shadow-2xs'
                          : 'bg-white border border-gray-200 text-gray-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* 2-Column Food Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  {filteredTabletMenuItems.map((item) => {
                    const qty = cart[item.id] || 0;
                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl p-2.5 border border-purple-50 shadow-2xs flex flex-col justify-between"
                      >
                        <div className="relative aspect-4/3 rounded-xl overflow-hidden mb-2">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          <div className="absolute top-1.5 left-1.5 w-3.5 h-3.5 rounded-md bg-white/90 flex items-center justify-center p-0.5 shadow-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-black text-[#1E1548] line-clamp-1">{item.name}</h4>
                          <p className="text-[9px] text-gray-400 line-clamp-1 mt-0.5">{item.description}</p>
                          <div className="text-xs font-black text-[#5844A8] mt-1">₹{item.price}</div>
                        </div>

                        <div className="mt-2 pt-2 border-t border-gray-50 flex items-center justify-between">
                          {qty > 0 ? (
                            <div className="flex items-center bg-[#FAF8FF] border border-purple-100 rounded-lg p-0.5 w-full justify-between">
                              <button
                                type="button"
                                onClick={() => handleUpdateQty(item.id, -1)}
                                className="w-5 h-5 rounded-md bg-white text-[#5844A8] font-black text-xs flex items-center justify-center shadow-xs cursor-pointer"
                              >
                                -
                              </button>
                              <span className="text-xs font-black text-[#1E1548] px-2">{qty}</span>
                              <button
                                type="button"
                                onClick={() => handleUpdateQty(item.id, 1)}
                                className="w-5 h-5 rounded-md bg-[#5844A8] text-white font-black text-xs flex items-center justify-center shadow-xs cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleAddToCart(item.id)}
                              className="w-full py-1.5 bg-purple-50 hover:bg-[#5844A8] hover:text-white text-[#5844A8] text-xs font-black rounded-lg transition-colors cursor-pointer"
                            >
                              + Add
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Floating Cart Tray Bar */}
                {cartItemCount > 0 && (
                  <div className="sticky bottom-2 z-20 bg-gradient-to-r from-[#5844A8] to-[#7C3AED] text-white p-3 rounded-2xl shadow-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-black">{cartItemCount} items • ₹{cartSubtotal}</div>
                      <div className="text-[10px] text-purple-200">Table 04 • Ready to order</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsOrderPlaced(true);
                        setTabletTab('tracker');
                      }}
                      className="px-3.5 py-1.5 bg-white text-[#5844A8] text-xs font-black rounded-xl shadow-xs hover:bg-gray-50 transition cursor-pointer"
                    >
                      Place Order &rarr;
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* View 3: Tablet Order Tracker (Exact match to Screenshot 2) */}
            {tabletTab === 'tracker' && (
              <div className="space-y-4 animate-in fade-in duration-200 text-center pt-3">
                {/* Centered Clipboard Illustration */}
                <div className="w-20 h-24 bg-white rounded-2xl shadow-md border border-purple-100 mx-auto p-3 flex flex-col justify-between relative">
                  <div className="w-6 h-1.5 bg-purple-300 rounded-full mx-auto" />
                  <div className="space-y-1.5 px-1">
                    <div className="w-full h-1 bg-gray-100 rounded-full" />
                    <div className="w-3/4 h-1 bg-gray-100 rounded-full" />
                    <div className="w-1/2 h-1 bg-gray-100 rounded-full" />
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#5844A8] text-white flex items-center justify-center absolute -bottom-2 -right-2 shadow-sm text-xs font-bold">
                    ✓
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-black text-[#1E1548]">
                    {orderStage === 1 && 'Order Received'}
                    {orderStage === 2 && 'Being Prepared'}
                    {orderStage === 3 && 'On the Way'}
                    {orderStage === 4 && 'Arriving Soon'}
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                    {orderStage === 1 && 'Your order has been received by the kitchen.'}
                    {orderStage === 2 && 'Chef is crafting your artisanal roast and dishes.'}
                    {orderStage === 3 && 'Server is bringing fresh trays to Table 04.'}
                    {orderStage === 4 && 'Bon appétit! Served hot at Table 04.'}
                  </p>
                </div>

                {/* 4-Stage Horizontal Stepper */}
                <div className="bg-white rounded-2xl p-4 border border-purple-50 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between relative">
                    <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-gray-100 z-0" />
                    {[1, 2, 3, 4].map((stg) => {
                      const isPassed = stg <= orderStage;
                      return (
                        <div
                          key={stg}
                          onClick={() => setOrderStage(stg as any)}
                          className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all cursor-pointer ${
                            isPassed
                              ? 'bg-[#5844A8] text-white shadow-xs'
                              : 'bg-white border-2 border-gray-200 text-gray-400'
                          }`}
                        >
                          {isPassed ? '✓' : stg}
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-4 text-[9px] font-bold text-gray-500 pt-1">
                    <span className={orderStage >= 1 ? 'text-[#5844A8]' : ''}>Order Received</span>
                    <span className={orderStage >= 2 ? 'text-[#5844A8]' : ''}>Being Prepared</span>
                    <span className={orderStage >= 3 ? 'text-[#5844A8]' : ''}>On the Way</span>
                    <span className={orderStage >= 4 ? 'text-[#5844A8]' : ''}>Arriving Soon</span>
                  </div>
                </div>

                {/* Order Summary Card */}
                <div className="bg-white rounded-2xl p-3.5 border border-purple-50 shadow-2xs flex items-center justify-between text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#5844A8] flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#1E1548]">Order #1024</h4>
                      <p className="text-[10px] text-gray-400 font-medium">3 items • 12 Oct 2024, 12:05 PM</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>

                {/* Notification Bell Box */}
                <div className="bg-white rounded-2xl p-3 border border-purple-50 shadow-2xs flex items-center gap-2.5 text-left">
                  <Bell className="w-4 h-4 text-[#5844A8] shrink-0" />
                  <p className="text-[10px] text-gray-500 font-medium">
                    We&apos;ll keep you updated on your order status.
                  </p>
                </div>
              </div>
            )}

            {/* View 4: Tablet Loyalty Stamps (Exact match to Screenshot 4) */}
            {tabletTab === 'stamps' && (
              <div className="space-y-3.5 animate-in fade-in duration-200">
                {/* Active Program Card */}
                <div className="bg-gradient-to-r from-[#241544] via-[#481E68] to-[#B31D64] rounded-3xl p-4 text-white shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <Coffee className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-pink-300 bg-white/10 px-2 py-0.5 rounded-full">
                          ACTIVE PROGRAM
                        </span>
                        <h4 className="text-xs font-black mt-0.5">1 Stamp Away from Free Coffee!</h4>
                      </div>
                    </div>
                    <span className="text-[10px] font-black bg-white/20 px-2 py-1 rounded-full">60% Done</span>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-semibold text-purple-200 mb-1">
                      <span>Overall Progress</span>
                      <span>5 / 6</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="w-[83%] h-full bg-gradient-to-r from-amber-300 to-pink-400" />
                    </div>
                  </div>
                </div>

                {/* Coffee Stamp Card */}
                <div className="bg-white rounded-3xl p-4 border border-purple-50 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-[#1E1548]">Coffee Stamp Card</h4>
                      <p className="text-[10px] text-gray-400 font-medium">Collect 6 stamps and get a free artisan brew!</p>
                    </div>
                    <span className="text-[10px] font-bold text-[#E11D48] bg-pink-50 px-2 py-0.5 rounded-full">Next: Free Coffee</span>
                  </div>

                  <div className="grid grid-cols-6 gap-2 pt-1">
                    {[1, 2, 3, 4, 5].map((idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1">
                        <div className="w-9 h-9 rounded-full bg-[#5844A8] text-white flex items-center justify-center shadow-xs">
                          <Coffee className="w-4 h-4" />
                        </div>
                        <span className="text-[9px] font-bold text-gray-400">#{idx}</span>
                      </div>
                    ))}
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-9 h-9 rounded-full border-2 border-dashed border-[#E11D48] bg-pink-50 text-[#E11D48] flex items-center justify-center shadow-xs">
                        <Gift className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-bold text-[#E11D48]">#6</span>
                    </div>
                  </div>
                </div>

                {/* Specials Stamp Card */}
                <div className="bg-white rounded-3xl p-4 border border-purple-50 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-[#1E1548]">Specials Stamp Card</h4>
                      <p className="text-[10px] text-gray-400 font-medium">Collect 8 stamps and get 15% off your total!</p>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">8 stamps remaining</span>
                  </div>

                  <div className="grid grid-cols-8 gap-1.5 pt-1">
                    {[1, 2].map((idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1">
                        <div className="w-7 h-7 rounded-full bg-[#5844A8] text-white flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </div>
                        <span className="text-[8px] font-bold text-gray-400">#{idx}</span>
                      </div>
                    ))}
                    {[3, 4, 5, 6, 7].map((idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1">
                        <div className="w-7 h-7 rounded-full bg-purple-50 text-gray-300 flex items-center justify-center text-[9px]">
                          •
                        </div>
                        <span className="text-[8px] font-bold text-gray-400">#{idx}</span>
                      </div>
                    ))}
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-7 h-7 rounded-full border border-dashed border-rose-300 bg-rose-50 text-[#E11D48] flex items-center justify-center text-[8px] font-black">
                        15%
                      </div>
                      <span className="text-[8px] font-bold text-[#E11D48]">15%</span>
                    </div>
                  </div>
                </div>

                {/* Scan QR Banner */}
                <div className="bg-[#2D164B] rounded-2xl p-3 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <QrCode className="w-5 h-5 text-pink-300" />
                    <div>
                      <h5 className="text-xs font-bold">Dining in right now?</h5>
                      <p className="text-[9px] text-purple-200">Scan QR code at your table to collect instant stamps.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert('Table QR Scanner simulated! +1 Stamp collected.')}
                    className="px-3 py-1 bg-white text-[#5844A8] text-[10px] font-black rounded-lg shadow-xs cursor-pointer"
                  >
                    Scan Now
                  </button>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-3xl p-4 border border-purple-50 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-black text-[#1E1548]">Recent Activity</h4>
                    <span className="text-[10px] font-bold text-[#5844A8] cursor-pointer">View All</span>
                  </div>

                  {[
                    { label: 'Stamp collected - Coffee', date: '12 Apr, 2025 • 11:42 AM' },
                    { label: 'Stamp collected - Main Course', date: '10 Apr, 2025 • 07:28 PM' },
                    { label: 'Stamp collected - Coffee', date: '06 Apr, 2025 • 01:22 PM' }
                  ].map((act, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-none">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-50 text-[#5844A8] flex items-center justify-center text-[10px]">
                          ☕
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-[#1E1548]">{act.label}</div>
                          <div className="text-[9px] text-gray-400">{act.date}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+1 Stamp</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* View 5: Tablet Offers (Exact match to Screenshot 5) */}
            {tabletTab === 'offers' && (
              <div className="space-y-3.5 animate-in fade-in duration-200">
                {/* Header Offer Card with Gold Member Pill */}
                <div className="bg-white rounded-3xl p-3.5 border border-purple-50 shadow-2xs flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-[#1E1548]">Your Offers</h3>
                    <p className="text-[9px] text-gray-400 font-medium">Exclusive offers, just for you! Enjoy great food.</p>
                  </div>
                  <div className="bg-gradient-to-br from-[#7C3AED] to-[#5844A8] text-white p-2 rounded-2xl text-center shrink-0">
                    <div className="text-[8px] font-bold flex items-center justify-center gap-1">👑 Gold</div>
                    <div className="text-xs font-black">320 pts</div>
                  </div>
                </div>

                {/* Horizontal Category Filters */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {['All Offers', 'Cashback', 'Free Items', 'Buy 1 Get 1', 'Combo Offers', 'Happy Hours'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setTabletOfferFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                        tabletOfferFilter === cat
                          ? 'bg-[#5844A8] text-white shadow-2xs'
                          : 'bg-white border border-gray-200 text-gray-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* 2-Column Offers Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { title: '20% OFF on Total Bill', tag: 'Popular', badge: 'Cashback', desc: 'Get 20% cashback on total bill', validity: 'Valid till 30 Apr 2025', img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300' },
                    { title: 'Buy 1 Get 1 Free', tag: 'New', badge: 'Buy 1 Get 1', desc: 'Buy any muffin and get another free', validity: 'Valid till 25 Apr 2025', img: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=300' },
                    { title: 'Free Iced Coffee', tag: 'Limited Time', badge: 'Free Item', desc: 'Get a free iced coffee above ₹300', validity: 'Valid till 20 Apr 2025', img: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=300' },
                    { title: 'Combo Offer', tag: 'Featured', badge: 'Combo', desc: 'Get Pizza + Drink at just ₹299', validity: 'Valid till 28 Apr 2025', img: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300' },
                    { title: 'Flat 15% OFF', tag: 'Happy Hours', badge: 'Happy Hours', desc: 'Enjoy 15% off from 4 PM - 7 PM', validity: 'Valid till 30 Apr 2025', img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300' },
                    { title: 'Free Birthday Dessert', tag: 'For You', badge: 'Birthday', desc: 'Celebrate with a complimentary cake', validity: 'Valid for 7 days', img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300' }
                  ].map((offer, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl p-2.5 border border-purple-50 shadow-2xs flex flex-col justify-between"
                    >
                      <div className="relative aspect-4/3 rounded-xl overflow-hidden mb-2">
                        <img src={offer.img} alt={offer.title} className="w-full h-full object-cover" />
                        <span className="absolute top-1.5 left-1.5 bg-[#E11D48] text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase">
                          {offer.tag}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-black text-[#1E1548] line-clamp-1">{offer.title}</h4>
                        <span className="text-[9px] font-bold text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded-md mt-1 inline-block">
                          {offer.badge}
                        </span>
                        <p className="text-[9px] text-gray-400 mt-1 line-clamp-1">{offer.desc}</p>
                      </div>

                      <div className="mt-2 pt-2 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-[8px] text-gray-400">{offer.validity}</span>
                        <button
                          type="button"
                          onClick={() => alert(`Offer Applied: ${offer.title}`)}
                          className="px-2 py-1 bg-purple-50 text-[#5844A8] text-[9px] font-black rounded-lg hover:bg-[#5844A8] hover:text-white transition cursor-pointer"
                        >
                          View Offer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* View 6: Tablet Transaction History (Exact match to Screenshot 3) */}
            {tabletTab === 'history' && (
              <div className="space-y-3.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-[#1E1548]">Transaction History</h3>
                    <p className="text-[9px] text-gray-400 font-medium">Track your orders, rewards and activity here.</p>
                  </div>

                  <div className="flex items-center gap-1 bg-white border border-gray-200 px-2 py-1 rounded-xl text-[10px] font-bold text-[#1E1548]">
                    <span>April 2025</span>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {['All', 'Earned', 'Redeemed', 'Offers'].map((flt) => (
                    <button
                      key={flt}
                      type="button"
                      onClick={() => setTabletHistoryFilter(flt)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        tabletHistoryFilter === flt
                          ? 'bg-[#5844A8] text-white shadow-2xs'
                          : 'bg-white border border-gray-200 text-gray-600'
                      }`}
                    >
                      {flt}
                    </button>
                  ))}
                </div>

                {/* Transactions List */}
                <div className="space-y-2">
                  {[
                    { title: 'Offer Locked', sub: '20% OFF on total bill', date: '12 Apr, 2025 • 11:42 AM', amount: '- ₹22', color: 'text-rose-500', icon: '🏷️' },
                    { title: 'Points Earned', sub: 'Visit bonus', date: '10 Apr, 2025 • 07:28 PM', amount: '+50', color: 'text-emerald-600', icon: '⭐' },
                    { title: 'Cashback Redeemed', sub: '₹50 cashback', date: '06 Apr, 2025 • 04:15 PM', amount: '- ₹50', color: 'text-rose-500', icon: '💳' },
                    { title: 'Stamp Collected', sub: 'Coffee', date: '06 Apr, 2025 • 01:22 PM', amount: '+1', color: 'text-emerald-600', icon: '☕' },
                    { title: 'Offer Locked', sub: 'Free Dessert', date: '04 Apr, 2025 • 08:45 PM', amount: '- ₹22', color: 'text-rose-500', icon: '🎁' },
                    { title: 'Points Earned', sub: 'Food order', date: '02 Apr, 2025 • 09:10 AM', amount: '+30', color: 'text-emerald-600', icon: '⭐' },
                    { title: 'Stamp Collected', sub: 'Main Course', date: '29 Mar, 2025 • 06:12 PM', amount: '+1', color: 'text-emerald-600', icon: '🍽️' }
                  ].map((tx, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl p-3 border border-purple-50 shadow-2xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-sm">
                          {tx.icon}
                        </div>
                        <div>
                          <h5 className="text-xs font-black text-[#1E1548]">{tx.title}</h5>
                          <p className="text-[9px] text-gray-500">{tx.sub} • <span className="text-gray-400">{tx.date}</span></p>
                        </div>
                      </div>
                      <span className={`text-xs font-black ${tx.color}`}>{tx.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* View 7: Tablet Profile */}
            {tabletTab === 'profile' && (
              <div className="space-y-3.5 animate-in fade-in duration-200">
                <div className="bg-white rounded-3xl p-4 border border-purple-50 shadow-2xs flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#FF4E8D] text-white font-black text-sm flex items-center justify-center">
                    AS
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#1E1548]">Aarav Sharma</h3>
                    <p className="text-[10px] text-gray-400 font-medium">+91 98765 43210 • Table 04</p>
                  </div>
                </div>

                {/* Tier Card */}
                <div className="bg-gradient-to-br from-[#FFF9E6] to-[#FFF3CC] rounded-3xl p-4 border border-amber-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                      <span>👑</span> Gold Member Tier
                    </span>
                    <span className="text-xs font-black text-[#5844A8]">320 pts</span>
                  </div>
                  <div className="w-full h-1.5 bg-amber-200 rounded-full overflow-hidden">
                    <div className="w-[64%] h-full bg-[#5844A8]" />
                  </div>
                  <p className="text-[9px] text-amber-800">180 points to Platinum (500 pts)</p>
                </div>

                {/* Shortcut Links */}
                <div className="bg-white rounded-2xl p-2 border border-purple-50 divide-y divide-gray-50">
                  <button onClick={() => setTabletTab('call_staff')} className="w-full p-2.5 flex items-center justify-between text-xs font-bold text-[#1E1548] hover:text-[#5844A8] cursor-pointer">
                    <span>Call Staff &amp; Amenities</span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </button>
                  <button onClick={() => setTabletTab('wifi')} className="w-full p-2.5 flex items-center justify-between text-xs font-bold text-[#1E1548] hover:text-[#5844A8] cursor-pointer">
                    <span>Free In-Store Wi-Fi</span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </button>
                  <button onClick={() => setTabletTab('feedback')} className="w-full p-2.5 flex items-center justify-between text-xs font-bold text-[#1E1548] hover:text-[#5844A8] cursor-pointer">
                    <span>Review Experience</span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem('customer_token');
                      localStorage.removeItem('customer');
                      if (!localStorage.getItem('user')) {
                        localStorage.removeItem('token');
                      }
                      onNavigate('/');
                    }}
                    className="w-full p-2.5 flex items-center justify-between text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-rose-400" />
                  </button>
                </div>
              </div>
            )}

            {/* View 8: Tablet Wi-Fi */}
            {tabletTab === 'wifi' && (
              <div className="bg-white rounded-3xl p-5 border border-purple-50 shadow-2xs space-y-4 animate-in fade-in duration-200 text-center">
                <div className="w-12 h-12 rounded-full bg-purple-50 text-[#5844A8] flex items-center justify-center mx-auto">
                  <Wifi className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#1E1548]">Connect to Free Wi-Fi</h4>
                  <p className="text-[10px] text-gray-400">High speed complimentary Wi-Fi for café guests.</p>
                </div>
                <div className="space-y-2 text-left">
                  <div className="p-3 bg-[#FAF8FF] rounded-xl border border-purple-50 flex items-center justify-between">
                    <div>
                      <div className="text-[9px] text-gray-400 font-bold uppercase">Network</div>
                      <div className="text-xs font-black text-[#1E1548]">SlyGranny_Cafe</div>
                    </div>
                    <button onClick={() => copyToClipboard('SlyGranny_Cafe', 'net')} className="text-xs text-[#5844A8] font-bold cursor-pointer">
                      {copiedKey === 'net' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="p-3 bg-[#FAF8FF] rounded-xl border border-purple-50 flex items-center justify-between">
                    <div>
                      <div className="text-[9px] text-gray-400 font-bold uppercase">Password</div>
                      <div className="text-xs font-black text-[#1E1548]">goodvibes123</div>
                    </div>
                    <button onClick={() => copyToClipboard('goodvibes123', 'pass')} className="text-xs text-[#5844A8] font-bold cursor-pointer">
                      {copiedKey === 'pass' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Connected to SlyGranny_Cafe!')}
                  className="w-full py-2.5 bg-[#5844A8] text-white text-xs font-black rounded-xl cursor-pointer"
                >
                  Connect Now
                </button>
              </div>
            )}

            {/* View 9: Tablet Call Staff */}
            {tabletTab === 'call_staff' && (
              <div className="bg-white rounded-3xl p-4 border border-purple-50 shadow-2xs space-y-3 animate-in fade-in duration-200">
                <div>
                  <h4 className="text-xs font-black text-[#1E1548]">Call Staff &amp; Assistance</h4>
                  <p className="text-[10px] text-gray-400">Select what you need for Table 04</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['Water', 'Cutlery', 'Napkins', 'Salt/Pepper', 'Extra Sauce', 'Bill/Check'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setSelectedAmenity(item);
                        setIsWaiterNotified(true);
                      }}
                      className="p-2.5 bg-[#FAF8FF] hover:bg-purple-50 border border-purple-100 rounded-xl text-center text-xs font-bold text-[#1E1548] cursor-pointer transition"
                    >
                      {item}
                    </button>
                  ))}
                </div>
                {isWaiterNotified && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold rounded-xl text-center">
                    Waiter notified for {selectedAmenity || 'assistance'}! Arriving shortly.
                  </div>
                )}
              </div>
            )}

            {/* View 10: Tablet Feedback */}
            {tabletTab === 'feedback' && (
              <div className="bg-white rounded-3xl p-4 border border-purple-50 shadow-2xs space-y-3 animate-in fade-in duration-200 text-center">
                <h4 className="text-xs font-black text-[#1E1548]">Rate Your Experience</h4>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setOverallRating(star)}
                      className="text-xl cursor-pointer"
                    >
                      {star <= overallRating ? '★' : '☆'}
                    </button>
                  ))}
                </div>
                <textarea
                  rows={3}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Tell us what you loved..."
                  className="w-full bg-[#FAF8FF] border border-gray-200 rounded-xl p-2.5 text-xs text-[#1E1548]"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFeedbackSubmitted(true);
                    setTimeout(() => setFeedbackSubmitted(false), 2000);
                  }}
                  className="w-full py-2 bg-[#5844A8] text-white text-xs font-black rounded-xl cursor-pointer"
                >
                  {feedbackSubmitted ? 'Thank You!' : 'Submit Review'}
                </button>
              </div>
            )}
        </div>

        {/* iPad / Tablet Fixed Bottom Navigation Bar (6 Tabs: Home, Menu, Offers, Stamps, History, Profile) */}
        <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-purple-100 z-40 shadow-lg select-none">
          <div className="max-w-2xl mx-auto h-16 px-4 flex items-center justify-between">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'menu', label: 'Menu', icon: Utensils, badge: cartItemCount > 0 ? cartItemCount : undefined },
              { id: 'offers', label: 'Offers', icon: Star },
              { id: 'stamps', label: 'Stamps', icon: Ticket },
              { id: 'history', label: 'History', icon: Clock },
              { id: 'profile', label: 'Profile', icon: User }
            ].map((tab) => {
              const isActive = tabletTab === tab.id;
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTabletTab(tab.id as any)}
                  className={`flex flex-col items-center justify-center gap-0.5 cursor-pointer flex-1 transition-colors relative ${
                    isActive ? 'text-[#E11D48] font-black' : 'text-gray-400 hover:text-gray-600 font-medium'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isActive ? 'text-[#E11D48]' : 'text-gray-400'}`} />
                  <span className="text-[10px]">{tab.label}</span>
                  {tab.badge && (
                    <span className="absolute top-0 right-3.5 w-3.5 h-3.5 rounded-full bg-[#E11D48] text-white text-[8px] font-black flex items-center justify-center">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Quick Games Modal */}
        {showGameModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl max-w-xs w-full p-5 text-center space-y-3 shadow-2xl">
              <div className="text-3xl">🎮</div>
              <h4 className="text-sm font-black text-[#1E1548]">In-Store Sudoku &amp; Trivia</h4>
              <p className="text-xs text-gray-500">Play while your order is prepared by the chef!</p>
              <div className="grid grid-cols-3 gap-1.5 p-3 bg-purple-50 rounded-2xl font-mono text-xs font-bold text-[#5844A8]">
                <span>5</span><span>3</span><span>_</span>
                <span>6</span><span>_</span><span>_</span>
                <span>_</span><span>9</span><span>8</span>
              </div>
              <button
                type="button"
                onClick={() => setShowGameModal(false)}
                className="w-full py-2 bg-[#5844A8] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Game
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

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
                onClick={() => {
                  localStorage.removeItem('customer_token');
                  localStorage.removeItem('customer');
                  if (!localStorage.getItem('user')) {
                    localStorage.removeItem('token');
                  }
                  onNavigate('/');
                }}
                className="py-3.5 px-3 flex items-center justify-between hover:bg-rose-50 rounded-2xl cursor-pointer text-rose-600"
              >
                <div>
                  <div className="text-xs font-bold">Log Out / Exit Session</div>
                  <div className="text-[11px] text-rose-400">Return to Revia main page</div>
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
