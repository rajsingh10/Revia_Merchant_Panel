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
  Store,
  Menu as MenuIcon
} from 'lucide-react';
import {
  CafeHomeView,
  RequestItemsView,
  HistoryActivityView,
  AllMerchantsView,
  CUSTOMER_MERCHANTS,
  CustomerMerchantProfile
} from './components/shared/CustomerJourneyViews';
import {
  StampsProgramView,
  LoyaltyTiersView,
  SingleMerchantDetailView,
  MerchantWalletHistoryView
} from './components/shared/CustomerLoyaltyViews';
import {
  CUSTOMER_MENU_ITEMS,
  CustomerMenuItem,
  CartEntry,
  CustomerMenuBrowserView,
  CustomerMenuItemDetailView,
  CustomerCartView,
  OrderPlacedSuccessOverlay,
  CustomerOrderTrackerView,
  CustomerOrderCompletedView,
  CustomerCallWaiterView,
  CustomerProfileHubView
} from './components/shared/CustomerMenuFlowViews';
import { CustomerOffersHubView } from './components/shared/CustomerOffersViews';

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

  // Shared Customer Journey State (across Mobile, Tablet & Desktop)
  const [selectedMerchant, setSelectedMerchant] = useState<CustomerMerchantProfile>(CUSTOMER_MERCHANTS[0]);
  const [detailMerchant, setDetailMerchant] = useState<CustomerMerchantProfile>(CUSTOMER_MERCHANTS[1]);
  const [expandedMerchantId, setExpandedMerchantId] = useState<string | null>(null);
  const [journeyToast, setJourneyToast] = useState<string | null>(null);
  const showJourneyToast = (msg: string) => {
    setJourneyToast(msg);
    setTimeout(() => {
      setJourneyToast((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Unified Menu, Cart & Order Flow State (Mobile, Tablet & Desktop)
  const [selectedMenuItem, setSelectedMenuItem] = useState<CustomerMenuItem | null>(null);
  const [menuCartEntries, setMenuCartEntries] = useState<CartEntry[]>([
    {
      item: CUSTOMER_MENU_ITEMS[6], // Cappuccino
      qty: 1,
      sizeLabel: 'Regular',
      unitPrice: 149,
      servingTime: 'At 03:00 PM'
    },
    {
      item: CUSTOMER_MENU_ITEMS[11], // Chocolate Brownie
      qty: 1,
      unitPrice: 199,
      servingTime: 'At 03:00 PM'
    },
    {
      item: CUSTOMER_MENU_ITEMS[9], // Classic Veg Burger
      qty: 1,
      unitPrice: 229,
      servingTime: 'At 01:45 PM'
    }
  ]);
  const [showOrderPlacedOverlay, setShowOrderPlacedOverlay] = useState(false);
  const [lastPlacedOrderItems, setLastPlacedOrderItems] = useState<CartEntry[]>([]);
  const [lastPlacedOrderTotal, setLastPlacedOrderTotal] = useState<number>(753);

  const menuCartCount = menuCartEntries.reduce((s, e) => s + e.qty, 0);
  const menuCartSubtotal = menuCartEntries.reduce((s, e) => s + e.unitPrice * e.qty, 0);

  const handleMenuQuickAdd = (item: CustomerMenuItem) => {
    setMenuCartEntries((prev) => {
      const idx = prev.findIndex((e) => e.item.id === item.id);
      if (idx >= 0) {
        return prev.map((e, i) => (i === idx ? { ...e, qty: e.qty + 1 } : e));
      }
      return [...prev, { item, qty: 1, unitPrice: item.price, servingTime: 'At 01:45 PM' }];
    });
    showJourneyToast(`Added ${item.name} to cart`);
  };

  const handleMenuUpdateQty = (itemId: string, delta: number) => {
    setMenuCartEntries((prev) =>
      prev
        .map((e) => (e.item.id === itemId ? { ...e, qty: e.qty + delta } : e))
        .filter((e) => e.qty > 0)
    );
  };

  const handleMenuRemoveItem = (itemId: string) => {
    setMenuCartEntries((prev) => prev.filter((e) => e.item.id !== itemId));
  };

  const handleMenuUpdateServingTime = (itemId: string, time: string) => {
    setMenuCartEntries((prev) =>
      prev.map((e) => (e.item.id === itemId ? { ...e, servingTime: time } : e))
    );
  };

  const handleMenuCustomAdd = (
    item: CustomerMenuItem,
    sizeLabel: string,
    unitPrice: number,
    qty: number
  ) => {
    setMenuCartEntries((prev) => {
      const idx = prev.findIndex((e) => e.item.id === item.id);
      if (idx >= 0) {
        return prev.map((e, i) =>
          i === idx ? { ...e, sizeLabel, unitPrice, qty: e.qty + qty } : e
        );
      }
      return [...prev, { item, sizeLabel, unitPrice, qty, servingTime: 'At 01:45 PM' }];
    });
    showJourneyToast(`Added ${qty} × ${item.name} (${sizeLabel})`);
  };

  const handlePlaceMenuOrder = (totalPayable: number) => {
    setLastPlacedOrderItems(menuCartEntries);
    setLastPlacedOrderTotal(totalPayable);
    setIsOrderPlaced(true);
    setMenuCartEntries([]);
    setShowOrderPlacedOverlay(true);
  };

  const handleCustomerLogout = () => {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer');
    if (!localStorage.getItem('user')) {
      localStorage.removeItem('token');
    }
    onNavigate('/');
  };

  // Desktop Primary Active Module Tab
  const [activeTab, setActiveTab] = useState<
    | 'home'
    | 'menu'
    | 'item_detail'
    | 'cart'
    | 'offers'
    | 'stamps'
    | 'tracker'
    | 'order_completed'
    | 'call_waiter'
    | 'wallet'
    | 'all_merchants'
    | 'loyalty_tiers'
    | 'merchant_detail'
    | 'merchant_wallet'
    | 'call_staff'
    | 'profile'
    | 'feedback'
    | 'wifi'
  >('home');

  // Tablet / iPad Active Module Tab
  const [tabletTab, setTabletTab] = useState<
    | 'home'
    | 'menu'
    | 'item_detail'
    | 'cart'
    | 'offers'
    | 'stamps'
    | 'history'
    | 'all_merchants'
    | 'loyalty_tiers'
    | 'merchant_detail'
    | 'merchant_wallet'
    | 'profile'
    | 'tracker'
    | 'order_completed'
    | 'call_waiter'
    | 'call_staff'
    | 'wifi'
    | 'feedback'
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
      <div className="min-h-[100dvh] w-full bg-[#FAF8FF] text-[#1E1548] font-sans antialiased flex flex-col select-none relative pb-24 overflow-x-hidden">
        {journeyToast && (
          <div className="fixed bottom-22 left-4 right-4 z-50 bg-[#240B4C] text-white px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-2 duration-200 max-w-lg mx-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{journeyToast}</span>
          </div>
        )}
        {/* Mobile Header: Home Screen vs Sub-Screens */}
        {mobileTab === 'home' ? (
          <header className="px-4 py-3 bg-white/95 backdrop-blur-md border-b border-purple-100/70 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
            <button
              type="button"
              onClick={() => {
                setExpandedMerchantId(null);
                setMobileTab('partner_hub');
              }}
              className="w-9 h-9 rounded-full bg-purple-50 hover:bg-purple-100 flex items-center justify-center text-[#5844A8] cursor-pointer shadow-2xs transition"
              title="All Merchants"
            >
              <MenuIcon className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setMobileTab('home')}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF4E8D] to-[#7C3AED] p-0.5 flex items-center justify-center shadow-xs">
                <Coffee className="w-4 h-4 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-xs font-black text-[#1E1548] tracking-tight leading-none">
                  {selectedMerchant.name}
                </h1>
                <span className="text-[9px] font-bold text-pink-600 block -mt-0.5">— {selectedMerchant.category} —</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setMobileTab('wallet_history')}
                className="w-9 h-9 rounded-full bg-purple-50 hover:bg-purple-100 flex items-center justify-center text-[#5844A8] cursor-pointer shadow-2xs transition"
                title="History & Activity"
              >
                <Clock className="w-4 h-4" />
              </button>
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
            </div>
          </header>
        ) : (
          <header className="px-4 py-3 bg-white/95 backdrop-blur-md border-b border-purple-100/70 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
            <button
              type="button"
              onClick={() => {
                if (mobileTab === 'partner_hub' || mobileTab === 'loyalty_tiers' || mobileTab === 'merchant_wallet') {
                  setMobileTab('wallet_history');
                } else if (mobileTab === 'merchant_detail') {
                  setMobileTab('loyalty_tiers');
                } else if (['call_waiter', 'request_items'].includes(mobileTab)) {
                  setMobileTab('home');
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
                  {['wallet_history', 'partner_hub', 'loyalty_tiers', 'merchant_wallet'].includes(mobileTab)
                    ? 'Loyaltics'
                    : mobileTab === 'merchant_detail'
                    ? detailMerchant.name
                    : selectedMerchant.name}
                </h1>
                <span className="text-[9px] font-bold text-pink-600 block -mt-0.5">
                  {['wallet_history', 'partner_hub', 'loyalty_tiers', 'merchant_wallet'].includes(mobileTab)
                    ? 'by Analytix Data'
                    : '— Cafe —'}
                </span>
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
                    {menuCartCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E11D48] text-white text-[9px] font-black flex items-center justify-center">
                        {menuCartCount}
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
          <main className="px-4 sm:px-5 pt-4 pb-6 space-y-4 max-w-lg mx-auto w-full animate-in fade-in duration-200">
            <CafeHomeView
              merchant={selectedMerchant}
              onOpenMenu={() => setMobileTab('menu')}
              onOpenOffers={() => setMobileTab('offers')}
              onOpenStamps={() => setMobileTab('stamps')}
              onOpenRequestItems={() => setMobileTab('request_items')}
              onOpenWifi={() => setMobileTab('wifi')}
              onOpenReview={() => setMobileTab('feedback')}
              onOpenAllMerchants={() => {
                setExpandedMerchantId(null);
                setMobileTab('partner_hub');
              }}
              onOpenHistory={() => setMobileTab('wallet_history')}
              onNotify={showJourneyToast}
            />

            {/* Compact Active Dining Order Strip */}
            <div className="bg-white rounded-3xl p-4 border border-[#EFEAF7] shadow-sm space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div
                  onClick={() => setMobileTab('tracker')}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-2xl bg-[#F3EEFA] flex items-center justify-center text-lg shrink-0">
                    🛎️
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-[#1E1548]">Active Table Order</h3>
                    <div className="text-[11px] text-[#7B748C] font-semibold flex items-center gap-0.5">
                      <span>Est. 15–20 mins</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
                <span
                  onClick={() => setMobileIsLateOrder((prev) => !prev)}
                  className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full cursor-pointer border ${
                    mobileIsLateOrder
                      ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse'
                      : 'bg-[#F3EEFA] border-[#E5DEF5] text-[#5844A8]'
                  }`}
                >
                  {mobileIsLateOrder ? '⏱ Delayed' : '◎ Preparing'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMobileTab('call_waiter')}
                  className="py-2.5 px-3 rounded-2xl border border-[#EFEAF7] text-xs font-bold text-[#1E1548] bg-white hover:bg-[#FAF8FF] flex items-center justify-center gap-1.5 cursor-pointer transition"
                >
                  <Bell className="w-3.5 h-3.5 text-[#5844A8]" />
                  <span>Call Waiter</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMobileTab('request_items')}
                  className="py-2.5 px-3 rounded-2xl bg-[#240B4C] hover:bg-[#35166B] text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer transition"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-white" />
                  <span>Request Item</span>
                </button>
              </div>
            </div>
          </main>
        )}

        {/* =====================================================================
            SCREEN: MOBILE OFFERS & DEALS LIST (mobileTab === 'offers')
           ===================================================================== */}
        {(mobileTab === 'offers' || mobileTab === 'offer_detail') && (
          <main className="px-4 sm:px-5 pt-4 pb-6 max-w-lg mx-auto w-full">
            <CustomerOffersHubView
              merchantName={selectedMerchant.name}
              onOpenStamps={() => setMobileTab('stamps')}
              onNotify={showJourneyToast}
            />
          </main>
        )}

        {/* =====================================================================
            SCREEN 7: MOBILE ALL MERCHANTS + EXPANDED SINGLE MERCHANT (all marchants.png)
           ===================================================================== */}
        {mobileTab === 'partner_hub' && (
          <main className="px-4 sm:px-5 pt-4 pb-6 max-w-lg mx-auto w-full">
            <AllMerchantsView
              initialExpandedId={expandedMerchantId}
              onBack={() => setMobileTab('wallet_history')}
              onSelectMerchant={(m) => {
                setSelectedMerchant(m);
                setDetailMerchant(m);
                setMobileTab('merchant_detail');
                showJourneyToast(`Viewing ${m.name} loyalty profile`);
              }}
              onRedeemOffer={(title, mName) => {
                showJourneyToast(`${title} (${mName}) ready to redeem`);
                setMobileTab('offers');
              }}
            />
          </main>
        )}

        {/* =====================================================================
            SCREEN 8: MOBILE DIGITAL CAFÉ MENU
           ===================================================================== */}
        {mobileTab === 'menu' && (
          <main className="px-4 sm:px-5 pt-4 pb-6 max-w-lg mx-auto w-full">
            <CustomerMenuBrowserView
              merchantName={selectedMerchant.name}
              cartEntries={menuCartEntries}
              onQuickAdd={handleMenuQuickAdd}
              onUpdateQty={handleMenuUpdateQty}
              onSelectItem={(item) => {
                setSelectedMenuItem(item);
                setMobileTab('item_detail');
              }}
              onViewCart={() => setMobileTab('cart')}
            />
          </main>
        )}

        {/* =====================================================================
            SCREEN 8B: MOBILE MENU ITEM DETAIL & SIZE CUSTOMIZER (menu-2.png)
           ===================================================================== */}
        {mobileTab === 'item_detail' && selectedMenuItem && (
          <main className="px-4 sm:px-5 pt-4 pb-6 max-w-lg mx-auto w-full">
            <CustomerMenuItemDetailView
              merchantName={selectedMerchant.name}
              item={selectedMenuItem}
              onBack={() => setMobileTab('menu')}
              onAddToOrder={(item, sizeLabel, unitPrice, qty) => {
                handleMenuCustomAdd(item, sizeLabel, unitPrice, qty);
                setMobileTab('cart');
              }}
            />
          </main>
        )}

        {/* =====================================================================
            SCREEN 9: MOBILE CART & ORDER SEQUENCE (list to order.png)
           ===================================================================== */}
        {mobileTab === 'cart' && (
          <main className="px-4 sm:px-5 pt-4 pb-6 max-w-lg mx-auto w-full">
            <CustomerCartView
              cartEntries={menuCartEntries}
              onUpdateQty={handleMenuUpdateQty}
              onRemoveItem={handleMenuRemoveItem}
              onUpdateServingTime={handleMenuUpdateServingTime}
              onPlaceOrder={(total) => handlePlaceMenuOrder(total)}
              onContinueBrowsing={() => setMobileTab('menu')}
            />
          </main>
        )}

        {/* =====================================================================
            SCREENS 10 & 11: MOBILE LIVE ORDER TRACKER (tracking.png & tracking simmary.png)
           ===================================================================== */}
        {mobileTab === 'tracker' && (
          <main className="px-4 sm:px-5 pt-4 pb-6 max-w-lg mx-auto w-full">
            <CustomerOrderTrackerView
              merchantName={selectedMerchant.name}
              items={lastPlacedOrderItems}
              totalPaid={lastPlacedOrderTotal}
              onRequestItems={() => setMobileTab('request_items')}
              onCallWaiter={() => setMobileTab('call_waiter')}
              onMarkCompleted={() => setMobileTab('order_completed')}
              onCancelOrder={() => {
                showJourneyToast('Cancellation request sent to kitchen');
                setMobileTab('menu');
              }}
            />
          </main>
        )}

        {/* =====================================================================
            SCREEN 12: MOBILE CALL WAITER (waiter list.png)
           ===================================================================== */}
        {mobileTab === 'call_waiter' && (
          <main className="px-4 sm:px-5 pt-4 pb-6 max-w-lg mx-auto w-full">
            <CustomerCallWaiterView onNotify={showJourneyToast} />
          </main>
        )}

        {/* =====================================================================
            SCREEN 13: MOBILE REQUEST ITEMS (request item.png)
           ===================================================================== */}
        {mobileTab === 'request_items' && (
          <main className="px-4 sm:px-5 pt-4 pb-6 max-w-lg mx-auto w-full">
            <RequestItemsView
              merchantName={selectedMerchant.name}
              onSubmitted={(summary) => {
                showJourneyToast(summary);
                setMobileTab('tracker');
              }}
            />
          </main>
        )}

        {/* =====================================================================
            SCREEN 14: MOBILE ORDER COMPLETED & 3-AXIS REVIEW
           ===================================================================== */}
        {mobileTab === 'order_completed' && (
          <main className="px-4 sm:px-5 pt-4 pb-6 max-w-lg mx-auto w-full">
            <CustomerOrderCompletedView
              totalPaid={lastPlacedOrderTotal}
              onSubmitReview={() => {
                showJourneyToast('Thank you for your review! +50 loyalty points added.');
                setMobileTab('home');
              }}
              onSkip={() => setMobileTab('home')}
            />
          </main>
        )}

        {/* =====================================================================
            SCREEN 16: MOBILE HISTORY & ACTIVITY (history.png)
           ===================================================================== */}
        {mobileTab === 'wallet_history' && (
          <main className="px-4 sm:px-5 pt-4 pb-6 max-w-lg mx-auto w-full">
            <HistoryActivityView
              onOpenAllMerchants={(expId) => {
                setExpandedMerchantId(expId || null);
                setMobileTab('partner_hub');
              }}
              onOpenStamps={() => setMobileTab('stamps')}
              onOpenLoyaltyTiers={() => setMobileTab('loyalty_tiers')}
              onOpenMerchantWallet={(m) => {
                if (m) setDetailMerchant(m);
                setMobileTab('merchant_wallet');
              }}
              onOpenSingleMerchant={(m) => {
                setDetailMerchant(m);
                setMobileTab('merchant_detail');
              }}
              onNotify={showJourneyToast}
            />
          </main>
        )}

        {/* =====================================================================
            SCREEN 17: MOBILE LOYALTY STAMPS HUB (Matches stamps.png)
           ===================================================================== */}
        {mobileTab === 'stamps' && (
          <main className="px-4 sm:px-5 pt-4 pb-6 max-w-lg mx-auto w-full">
            <StampsProgramView
              merchant={selectedMerchant}
              onViewAllActivity={() => setMobileTab('wallet_history')}
            />
          </main>
        )}

        {/* =====================================================================
            SCREEN 18: MOBILE LOYALTY TIERS ACROSS MERCHANTS (Matches Loyalty tier.png)
           ===================================================================== */}
        {mobileTab === 'loyalty_tiers' && (
          <main className="px-4 sm:px-5 pt-4 pb-6 max-w-lg mx-auto w-full">
            <LoyaltyTiersView
              onBack={() => setMobileTab('wallet_history')}
              onOpenMerchantDetail={(m) => {
                setDetailMerchant(m);
                setMobileTab('merchant_detail');
              }}
            />
          </main>
        )}

        {/* =====================================================================
            SCREEN 19: MOBILE SINGLE MERCHANT DETAIL (Matches Single merchant wise.png)
           ===================================================================== */}
        {mobileTab === 'merchant_detail' && (
          <main className="px-4 sm:px-5 pt-4 pb-6 max-w-lg mx-auto w-full">
            <SingleMerchantDetailView
              merchant={detailMerchant}
              onSelectMerchant={(m) => setDetailMerchant(m)}
              onOpenTiers={() => setMobileTab('loyalty_tiers')}
              onOpenStamps={() => setMobileTab('stamps')}
              onOpenWalletHistory={(m) => {
                setDetailMerchant(m);
                setMobileTab('merchant_wallet');
              }}
              onOpenOffers={() => setMobileTab('offers')}
              onOpenCafeHome={(m) => {
                setSelectedMerchant(m);
                setMobileTab('home');
                showJourneyToast(`Switched to ${m.name}`);
              }}
              onBack={() => setMobileTab('loyalty_tiers')}
            />
          </main>
        )}

        {/* =====================================================================
            SCREEN 20: MOBILE MERCHANT-WISE WALLET (Matches wallet History.png)
           ===================================================================== */}
        {mobileTab === 'merchant_wallet' && (
          <main className="px-4 sm:px-5 pt-4 pb-6 max-w-lg mx-auto w-full">
            <MerchantWalletHistoryView
              initialMerchant={detailMerchant}
              onBack={() => setMobileTab('wallet_history')}
              onOpenStamps={() => setMobileTab('stamps')}
            />
          </main>
        )}

        {/* =====================================================================
            SCREEN 15: MOBILE CUSTOMER PROFILE HUB
           ===================================================================== */}
        {mobileTab === 'profile' && (
          <main className="px-4 sm:px-5 pt-4 pb-6 max-w-lg mx-auto w-full">
            <CustomerProfileHubView
              merchantName={selectedMerchant.name}
              onOpenOrders={() => setMobileTab('tracker')}
              onOpenOffers={() => setMobileTab('offers')}
              onOpenWalletHistory={() => setMobileTab('merchant_wallet')}
              onCallWaiter={() => setMobileTab('call_waiter')}
              onRequestItems={() => setMobileTab('request_items')}
              onLogout={handleCustomerLogout}
              onNotify={showJourneyToast}
            />
          </main>
        )}

        {/* Order Placed Celebration Overlay (menu-3.png) */}
        {showOrderPlacedOverlay && (
          <OrderPlacedSuccessOverlay
            onContinue={() => {
              setShowOrderPlacedOverlay(false);
              setMobileTab('tracker');
            }}
          />
        )}

        {/* =====================================================================
            MOBILE DOCKED 5-ICON BOTTOM NAVIGATION BAR
           ===================================================================== */}
        <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-purple-100 z-40 shadow-lg select-none">
          <div className="max-w-lg mx-auto h-16 px-4 flex items-center justify-between relative">
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
                ['menu', 'item_detail', 'cart'].includes(mobileTab) ? 'text-[#2D1A47] font-black' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${['menu', 'item_detail', 'cart'].includes(mobileTab) ? 'bg-purple-100/70 text-[#2D1A47]' : ''}`}>
                <Utensils className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold">Menu</span>
              {menuCartCount > 0 && (
                <span className="absolute top-1 right-3 w-4 h-4 rounded-full bg-[#E11D48] text-white text-[9px] font-black flex items-center justify-center">
                  {menuCartCount}
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
      <div className="min-h-screen bg-[#FAF8FF] text-[#1E1548] font-sans antialiased flex flex-col select-none relative pb-24">
        {/* Floating Journey Toast */}
        {journeyToast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-[#240B4C] text-white text-xs font-bold shadow-xl border border-white/15 animate-in fade-in slide-in-from-top-2 duration-200">
            {journeyToast}
          </div>
        )}

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
                <h1 className="text-sm font-black text-[#1E1548] leading-tight">{selectedMerchant.name}</h1>
                <span className="text-[9px] font-bold text-[#E11D48] bg-pink-50 border border-pink-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Table T12
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium">{selectedMerchant.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTabletTab('loyalty_tiers')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition ${
                tabletTab === 'loyalty_tiers' || tabletTab === 'merchant_detail'
                  ? 'bg-[#240B4C] text-white border-[#240B4C]'
                  : 'bg-[#FFFDF0] text-amber-800 border-amber-200 hover:bg-amber-50'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Tiers</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setExpandedMerchantId(null);
                setTabletTab('all_merchants');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition ${
                tabletTab === 'all_merchants'
                  ? 'bg-[#240B4C] text-white border-[#240B4C]'
                  : 'bg-[#F3EEFA] text-[#5844A8] border-[#E5DEF5] hover:bg-purple-100'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Merchants</span>
            </button>
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
        <div className="w-full max-w-3xl mx-auto flex-1 px-4 sm:px-6 py-4 space-y-4">
            {/* View 1: Tablet Home (Matches Home.png & request item-1.png) */}
            {tabletTab === 'home' && (
              <CafeHomeView
                merchant={selectedMerchant}
                onOpenMenu={() => setTabletTab('menu')}
                onOpenOffers={() => setTabletTab('offers')}
                onOpenStamps={() => setTabletTab('stamps')}
                onOpenRequestItems={() => setTabletTab('call_staff')}
                onOpenWifi={() => setTabletTab('wifi')}
                onOpenReview={() => setTabletTab('feedback')}
                onOpenAllMerchants={() => {
                  setExpandedMerchantId(null);
                  setTabletTab('all_merchants');
                }}
                onOpenHistory={() => setTabletTab('history')}
                onNotify={showJourneyToast}
              />
            )}

            {/* View 2: Tablet Menu (Matches menu.png & menu-1.png) */}
            {tabletTab === 'menu' && (
              <CustomerMenuBrowserView
                merchantName={selectedMerchant.name}
                cartEntries={menuCartEntries}
                onQuickAdd={handleMenuQuickAdd}
                onUpdateQty={handleMenuUpdateQty}
                onSelectItem={(item) => {
                  setSelectedMenuItem(item);
                  setTabletTab('item_detail');
                }}
                onViewCart={() => setTabletTab('cart')}
              />
            )}

            {/* View 2B: Tablet Item Customizer (Matches menu-2.png) */}
            {tabletTab === 'item_detail' && selectedMenuItem && (
              <CustomerMenuItemDetailView
                merchantName={selectedMerchant.name}
                item={selectedMenuItem}
                onBack={() => setTabletTab('menu')}
                onAddToOrder={(item, sizeLabel, unitPrice, qty) => {
                  handleMenuCustomAdd(item, sizeLabel, unitPrice, qty);
                  setTabletTab('cart');
                }}
              />
            )}

            {/* View 2C: Tablet Cart & Order Sequence (Matches list to order.png) */}
            {tabletTab === 'cart' && (
              <CustomerCartView
                cartEntries={menuCartEntries}
                onUpdateQty={handleMenuUpdateQty}
                onRemoveItem={handleMenuRemoveItem}
                onUpdateServingTime={handleMenuUpdateServingTime}
                onPlaceOrder={(total) => handlePlaceMenuOrder(total)}
                onContinueBrowsing={() => setTabletTab('menu')}
              />
            )}

            {/* View 3: Tablet Order Tracker (Matches tracking.png & tracking simmary.png) */}
            {tabletTab === 'tracker' && (
              <CustomerOrderTrackerView
                merchantName={selectedMerchant.name}
                items={lastPlacedOrderItems}
                totalPaid={lastPlacedOrderTotal}
                onRequestItems={() => setTabletTab('call_staff')}
                onCallWaiter={() => setTabletTab('call_waiter')}
                onMarkCompleted={() => setTabletTab('order_completed')}
                onCancelOrder={() => {
                  showJourneyToast('Cancellation request sent to kitchen');
                  setTabletTab('menu');
                }}
              />
            )}

            {/* View 3B: Tablet Call Waiter (Matches waiter list.png) */}
            {tabletTab === 'call_waiter' && (
              <CustomerCallWaiterView onNotify={showJourneyToast} />
            )}

            {/* View 3C: Tablet Order Completed (Matches Order finished.png) */}
            {tabletTab === 'order_completed' && (
              <CustomerOrderCompletedView
                totalPaid={lastPlacedOrderTotal}
                onSubmitReview={() => {
                  showJourneyToast('Thank you for your review! +50 loyalty points added.');
                  setTabletTab('home');
                }}
                onSkip={() => setTabletTab('home')}
              />
            )}

            {/* View 4: Tablet Loyalty Stamps (Matches stamps.png) */}
            {tabletTab === 'stamps' && (
              <StampsProgramView
                merchant={selectedMerchant}
                onViewAllActivity={() => setTabletTab('history')}
              />
            )}

            {/* View 5: Tablet Offers (Matches Offers.png & TapCard Passes) */}
            {tabletTab === 'offers' && (
              <CustomerOffersHubView
                merchantName={selectedMerchant.name}
                onOpenStamps={() => setTabletTab('stamps')}
                onNotify={showJourneyToast}
              />
            )}

            {/* View 6: Tablet History & Activity (Matches history.png) */}
            {tabletTab === 'history' && (
              <HistoryActivityView
                onOpenAllMerchants={(expandedId) => {
                  setExpandedMerchantId(expandedId || null);
                  setTabletTab('all_merchants');
                }}
                onOpenStamps={() => setTabletTab('stamps')}
                onOpenLoyaltyTiers={() => setTabletTab('loyalty_tiers')}
                onOpenMerchantWallet={(m) => {
                  if (m) setDetailMerchant(m);
                  setTabletTab('merchant_wallet');
                }}
                onOpenSingleMerchant={(m) => {
                  setDetailMerchant(m);
                  setTabletTab('merchant_detail');
                }}
                onNotify={showJourneyToast}
              />
            )}

            {/* View 6B: Tablet All Merchants (Matches all marchants.png & single merchant.png) */}
            {tabletTab === 'all_merchants' && (
              <AllMerchantsView
                initialExpandedId={expandedMerchantId}
                onBack={() => setTabletTab('history')}
                onSelectMerchant={(merchant) => {
                  setSelectedMerchant(merchant);
                  setDetailMerchant(merchant);
                  setTabletTab('merchant_detail');
                  showJourneyToast(`Viewing ${merchant.name} loyalty profile`);
                }}
                onRedeemOffer={(offerTitle, merchantName) => {
                  setTabletTab('offers');
                  showJourneyToast(`Selected "${offerTitle}" at ${merchantName}`);
                }}
              />
            )}

            {/* View 6C: Tablet Loyalty Tiers (Matches Loyalty tier.png) */}
            {tabletTab === 'loyalty_tiers' && (
              <LoyaltyTiersView
                onBack={() => setTabletTab('history')}
                onOpenMerchantDetail={(m) => {
                  setDetailMerchant(m);
                  setTabletTab('merchant_detail');
                }}
              />
            )}

            {/* View 6D: Tablet Single Merchant Detail (Matches Single merchant wise.png) */}
            {tabletTab === 'merchant_detail' && (
              <SingleMerchantDetailView
                merchant={detailMerchant}
                onSelectMerchant={(m) => setDetailMerchant(m)}
                onOpenTiers={() => setTabletTab('loyalty_tiers')}
                onOpenStamps={() => setTabletTab('stamps')}
                onOpenWalletHistory={(m) => {
                  setDetailMerchant(m);
                  setTabletTab('merchant_wallet');
                }}
                onOpenOffers={() => setTabletTab('offers')}
                onOpenCafeHome={(m) => {
                  setSelectedMerchant(m);
                  setTabletTab('home');
                  showJourneyToast(`Switched to ${m.name}`);
                }}
                onBack={() => setTabletTab('loyalty_tiers')}
              />
            )}

            {/* View 6E: Tablet Merchant-Wise Wallet (Matches wallet History.png) */}
            {tabletTab === 'merchant_wallet' && (
              <MerchantWalletHistoryView
                initialMerchant={detailMerchant}
                onBack={() => setTabletTab('history')}
                onOpenStamps={() => setTabletTab('stamps')}
              />
            )}

            {/* View 7: Tablet Profile (Matches profile.png & profile-1.png) */}
            {tabletTab === 'profile' && (
              <CustomerProfileHubView
                merchantName={selectedMerchant.name}
                onOpenOrders={() => setTabletTab('tracker')}
                onOpenOffers={() => setTabletTab('offers')}
                onOpenWalletHistory={() => setTabletTab('merchant_wallet')}
                onCallWaiter={() => setTabletTab('call_waiter')}
                onRequestItems={() => setTabletTab('call_staff')}
                onLogout={handleCustomerLogout}
                onNotify={showJourneyToast}
              />
            )}

            {/* Order Placed Celebration Overlay (menu-3.png) */}
            {showOrderPlacedOverlay && (
              <OrderPlacedSuccessOverlay
                onContinue={() => {
                  setShowOrderPlacedOverlay(false);
                  setTabletTab('tracker');
                }}
              />
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

            {/* View 9: Tablet Request Items (Matches request item.png) */}
            {tabletTab === 'call_staff' && (
              <RequestItemsView
                merchantName={selectedMerchant.name}
                onBack={() => setTabletTab('home')}
                onSubmitted={(summary) => {
                  showJourneyToast(summary);
                }}
              />
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
        <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#EFEAF7] z-40 shadow-[0_-4px_20px_rgba(36,11,76,0.06)] select-none">
          <div className="max-w-3xl mx-auto h-[72px] px-4 flex items-center justify-between gap-1">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'menu', label: 'Menu', icon: Utensils, badge: menuCartCount > 0 ? menuCartCount : undefined },
              { id: 'offers', label: 'Offers', icon: Star },
              { id: 'stamps', label: 'Stamps', icon: Ticket },
              { id: 'history', label: 'History', icon: Clock },
              { id: 'profile', label: 'Profile', icon: User }
            ].map((tab) => {
              const isActive =
                tabletTab === tab.id || (tab.id === 'history' && tabletTab === 'all_merchants');
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTabletTab(tab.id as any)}
                  className={`flex flex-col items-center justify-center gap-1 cursor-pointer flex-1 transition-all relative py-1.5 ${
                    isActive ? 'text-[#E11D48] font-black' : 'text-[#8E879E] hover:text-[#240B4C] font-semibold'
                  }`}
                >
                  <div
                    className={`w-11 h-7 rounded-full flex items-center justify-center transition-colors ${
                      isActive ? 'bg-[#FDE8F0]' : 'bg-transparent'
                    }`}
                  >
                    <IconComp className={`w-4 h-4 ${isActive ? 'text-[#E11D48]' : 'text-[#8E879E]'}`} />
                  </div>
                  <span className="text-[10px] leading-none">{tab.label}</span>
                  {tab.badge && (
                    <span className="absolute top-0.5 right-4 w-4 h-4 rounded-full bg-[#E11D48] text-white text-[9px] font-black flex items-center justify-center shadow-xs">
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
    <div className="min-h-screen bg-[#FAF8FF] text-[#1E1548] font-sans antialiased flex flex-row select-none relative">
      {/* Floating Journey Toast */}
      {journeyToast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-[#240B4C] text-white text-xs font-bold shadow-2xl border border-white/15 animate-in fade-in slide-in-from-top-2 duration-200">
          {journeyToast}
        </div>
      )}

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
                {selectedMerchant.name}
              </div>
              <div className="text-[11px] font-semibold text-gray-400">
                {selectedMerchant.tagline}
              </div>
            </div>
          </div>
        </div>

        {/* Live Table Dining Badge */}
        <div className="px-5 py-3 bg-[#FAF8FF] border-b border-purple-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-[#1E1548]">Table T12 • Indoor</span>
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
              { id: 'menu', label: 'Digital Menu', icon: Utensils, badge: menuCartCount > 0 ? `${menuCartCount}` : undefined },
              { id: 'tracker', label: 'Order Status', icon: Clock, badge: isOrderPlaced ? 'Live' : undefined },
              { id: 'offers', label: 'Offers & Deals', icon: Zap },
              { id: 'stamps', label: 'Loyalty Stamps', icon: Ticket },
              { id: 'loyalty_tiers', label: 'Loyalty Tiers', icon: Crown },
              { id: 'wallet', label: 'History & Activity', icon: CreditCard },
              { id: 'merchant_wallet', label: 'Merchant Wallet', icon: Receipt },
              { id: 'all_merchants', label: 'All Merchants', icon: Store },
            ].map((t) => {
              const isActive = activeTab === t.id;
              const IconComp = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    if (t.id === 'all_merchants') setExpandedMerchantId(null);
                    setActiveTab(t.id as any);
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#240B4C] text-white shadow-sm'
                      : 'text-gray-600 hover:text-[#1E1548] hover:bg-purple-50/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    <span>{t.label}</span>
                  </div>
                  {t.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-white text-[#240B4C]' : 'bg-[#E11D48] text-white'
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
              { id: 'call_staff', label: 'Request Items', icon: ShoppingBag },
              { id: 'call_waiter', label: 'Call Waiter', icon: Bell },
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
                      ? 'bg-[#240B4C] text-white shadow-sm'
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
                <span>👑</span> Gold (2,164 pts)
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
            <h2 className="text-sm font-black text-[#1E1548]">
              {activeTab === 'home' && `${selectedMerchant.name} • Overview`}
              {activeTab === 'menu' && 'Digital Menu & Live Ordering'}
              {activeTab === 'item_detail' && `${selectedMenuItem?.name || 'Item Customizer'}`}
              {activeTab === 'cart' && `Your Cart (${menuCartCount})`}
              {activeTab === 'tracker' && 'Track Your Order'}
              {activeTab === 'order_completed' && 'Order Completed & Review'}
              {activeTab === 'call_waiter' && 'Call Waiter & Table Assistance'}
              {activeTab === 'offers' && 'Exclusive Offers & Rewards'}
              {activeTab === 'stamps' && 'Loyalty Stamp Cards'}
              {activeTab === 'loyalty_tiers' && 'Your Tier Across Merchants'}
              {activeTab === 'merchant_detail' && `${detailMerchant.name} • Loyalty Profile`}
              {activeTab === 'merchant_wallet' && 'Wallet (Merchant Wise)'}
              {activeTab === 'wallet' && 'History & Activity'}
              {activeTab === 'all_merchants' && 'All Merchants & Loyalty'}
              {activeTab === 'call_staff' && 'Request Items & Table Service'}
              {activeTab === 'wifi' && 'High-Speed Free Wi-Fi'}
              {activeTab === 'feedback' && 'Customer Experience Review'}
              {activeTab === 'profile' && 'My Profile'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Cart Pill */}
            <button
              type="button"
              onClick={() => setActiveTab('cart')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#5844A8] text-xs font-bold border border-purple-100 transition-colors cursor-pointer"
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Cart ({menuCartCount})</span>
              <span className="font-extrabold text-[#1E1548] ml-1">₹{menuCartSubtotal}</span>
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
          <CafeHomeView
            merchant={selectedMerchant}
            onOpenMenu={() => setActiveTab('menu')}
            onOpenOffers={() => setActiveTab('offers')}
            onOpenStamps={() => setActiveTab('stamps')}
            onOpenRequestItems={() => setActiveTab('call_staff')}
            onOpenWifi={() => setActiveTab('wifi')}
            onOpenReview={() => setActiveTab('feedback')}
            onOpenAllMerchants={() => {
              setExpandedMerchantId(null);
              setActiveTab('all_merchants');
            }}
            onOpenHistory={() => setActiveTab('wallet')}
            onNotify={showJourneyToast}
          />
        )}

        {/* =======================================================================
            MODULE 2: DIGITAL MENU & TABLE ORDERING (Matches menu.png & menu-1.png)
           ======================================================================= */}
        {activeTab === 'menu' && (
          <div className="max-w-5xl mx-auto">
            <CustomerMenuBrowserView
              merchantName={selectedMerchant.name}
              cartEntries={menuCartEntries}
              onQuickAdd={handleMenuQuickAdd}
              onUpdateQty={handleMenuUpdateQty}
              onSelectItem={(item) => {
                setSelectedMenuItem(item);
                setActiveTab('item_detail');
              }}
              onViewCart={() => setActiveTab('cart')}
            />
          </div>
        )}

        {/* =======================================================================
            MODULE 2B: ITEM CUSTOMIZER (Matches menu-2.png)
           ======================================================================= */}
        {activeTab === 'item_detail' && selectedMenuItem && (
          <CustomerMenuItemDetailView
            merchantName={selectedMerchant.name}
            item={selectedMenuItem}
            onBack={() => setActiveTab('menu')}
            onAddToOrder={(item, sizeLabel, unitPrice, qty) => {
              handleMenuCustomAdd(item, sizeLabel, unitPrice, qty);
              setActiveTab('cart');
            }}
          />
        )}

        {/* =======================================================================
            MODULE 2C: CART & ORDER SEQUENCE (Matches list to order.png)
           ======================================================================= */}
        {activeTab === 'cart' && (
          <div className="max-w-5xl mx-auto">
            <CustomerCartView
              cartEntries={menuCartEntries}
              onUpdateQty={handleMenuUpdateQty}
              onRemoveItem={handleMenuRemoveItem}
              onUpdateServingTime={handleMenuUpdateServingTime}
              onPlaceOrder={(total) => handlePlaceMenuOrder(total)}
              onContinueBrowsing={() => setActiveTab('menu')}
            />
          </div>
        )}

        {/* =======================================================================
            MODULE 3: REAL-TIME KITCHEN ORDER TRACKER (Matches tracking.png & tracking simmary.png)
           ======================================================================= */}
        {activeTab === 'tracker' && (
          <CustomerOrderTrackerView
            merchantName={selectedMerchant.name}
            items={lastPlacedOrderItems}
            totalPaid={lastPlacedOrderTotal}
            onRequestItems={() => setActiveTab('call_staff')}
            onCallWaiter={() => setActiveTab('call_waiter')}
            onMarkCompleted={() => setActiveTab('order_completed')}
            onCancelOrder={() => {
              showJourneyToast('Cancellation request sent to kitchen');
              setActiveTab('menu');
            }}
          />
        )}

        {/* =======================================================================
            MODULE 3B: ORDER COMPLETED & REVIEW (Matches Order finished.png)
           ======================================================================= */}
        {activeTab === 'order_completed' && (
          <CustomerOrderCompletedView
            totalPaid={lastPlacedOrderTotal}
            onSubmitReview={() => {
              showJourneyToast('Thank you for your review! +50 loyalty points added.');
              setActiveTab('home');
            }}
            onSkip={() => setActiveTab('home')}
          />
        )}

        {/* =======================================================================
            MODULE 3C: CALL WAITER DIRECTORY (Matches waiter list.png)
           ======================================================================= */}
        {activeTab === 'call_waiter' && (
          <CustomerCallWaiterView onNotify={showJourneyToast} />
        )}

        {/* =======================================================================
            MODULE 4: LOYALTY STAMP CARDS (iPad Image 10)
           ======================================================================= */}
        {activeTab === 'stamps' && (
          <div className="max-w-5xl mx-auto">
            <StampsProgramView
              merchant={selectedMerchant}
              onViewAllActivity={() => setActiveTab('wallet')}
            />
          </div>
        )}

        {/* =======================================================================
            MODULE 5: OFFERS & REWARDS CATALOG (iPad Image 11 & 13)
           ======================================================================= */}
        {activeTab === 'offers' && (
          <div className="max-w-5xl mx-auto">
            <CustomerOffersHubView
              merchantName={selectedMerchant.name}
              onOpenStamps={() => setActiveTab('stamps')}
              onNotify={showJourneyToast}
            />
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
          <RequestItemsView
            merchantName={selectedMerchant.name}
            onSubmitted={(summary) => {
              showJourneyToast(summary);
            }}
          />
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
          <div className="max-w-5xl mx-auto">
            <HistoryActivityView
              onOpenAllMerchants={(expandedId) => {
                setExpandedMerchantId(expandedId || null);
                setActiveTab('all_merchants');
              }}
              onOpenStamps={() => setActiveTab('stamps')}
              onOpenLoyaltyTiers={() => setActiveTab('loyalty_tiers')}
              onOpenMerchantWallet={(m) => {
                if (m) setDetailMerchant(m);
                setActiveTab('merchant_wallet');
              }}
              onOpenSingleMerchant={(m) => {
                setDetailMerchant(m);
                setActiveTab('merchant_detail');
              }}
              onNotify={showJourneyToast}
            />
          </div>
        )}

        {/* =======================================================================
            MODULE 9B: ALL MERCHANTS & SINGLE MERCHANT EXPANDED VIEW
           ======================================================================= */}
        {activeTab === 'all_merchants' && (
          <div className="max-w-5xl mx-auto">
            <AllMerchantsView
              initialExpandedId={expandedMerchantId}
              onBack={() => setActiveTab('wallet')}
              onSelectMerchant={(merchant) => {
                setSelectedMerchant(merchant);
                setDetailMerchant(merchant);
                setActiveTab('merchant_detail');
                showJourneyToast(`Viewing ${merchant.name} loyalty profile`);
              }}
              onRedeemOffer={(offerTitle, merchantName) => {
                setActiveTab('offers');
                showJourneyToast(`Selected "${offerTitle}" at ${merchantName}`);
              }}
            />
          </div>
        )}

        {/* =======================================================================
            MODULE 9C: LOYALTY TIERS ACROSS MERCHANTS (Loyalty tier.png)
           ======================================================================= */}
        {activeTab === 'loyalty_tiers' && (
          <div className="max-w-5xl mx-auto">
            <LoyaltyTiersView
              onBack={() => setActiveTab('wallet')}
              onOpenMerchantDetail={(m) => {
                setDetailMerchant(m);
                setActiveTab('merchant_detail');
              }}
            />
          </div>
        )}

        {/* =======================================================================
            MODULE 9D: SINGLE MERCHANT LOYALTY PROFILE (Single merchant wise.png)
           ======================================================================= */}
        {activeTab === 'merchant_detail' && (
          <div className="max-w-5xl mx-auto">
            <SingleMerchantDetailView
              merchant={detailMerchant}
              onSelectMerchant={(m) => setDetailMerchant(m)}
              onOpenTiers={() => setActiveTab('loyalty_tiers')}
              onOpenStamps={() => setActiveTab('stamps')}
              onOpenWalletHistory={(m) => {
                setDetailMerchant(m);
                setActiveTab('merchant_wallet');
              }}
              onOpenOffers={() => setActiveTab('offers')}
              onOpenCafeHome={(m) => {
                setSelectedMerchant(m);
                setActiveTab('home');
                showJourneyToast(`Switched to ${m.name}`);
              }}
              onBack={() => setActiveTab('loyalty_tiers')}
            />
          </div>
        )}

        {/* =======================================================================
            MODULE 9E: MERCHANT-WISE WALLET HISTORY (wallet History.png)
           ======================================================================= */}
        {activeTab === 'merchant_wallet' && (
          <div className="max-w-5xl mx-auto">
            <MerchantWalletHistoryView
              initialMerchant={detailMerchant}
              onBack={() => setActiveTab('wallet')}
              onOpenStamps={() => setActiveTab('stamps')}
            />
          </div>
        )}

        {/* =======================================================================
            MODULE 10: CUSTOMER PROFILE & LOYALTY TIER HUB (iPad Image 5)
           ======================================================================= */}
        {activeTab === 'profile' && (
          <CustomerProfileHubView
            merchantName={selectedMerchant.name}
            onOpenOrders={() => setActiveTab('tracker')}
            onOpenOffers={() => setActiveTab('offers')}
            onOpenWalletHistory={() => setActiveTab('merchant_wallet')}
            onCallWaiter={() => setActiveTab('call_waiter')}
            onRequestItems={() => setActiveTab('call_staff')}
            onLogout={handleCustomerLogout}
            onNotify={showJourneyToast}
          />
        )}

        {/* Order Placed Celebration Overlay (menu-3.png) */}
        {showOrderPlacedOverlay && (
          <OrderPlacedSuccessOverlay
            onContinue={() => {
              setShowOrderPlacedOverlay(false);
              setActiveTab('tracker');
            }}
          />
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
