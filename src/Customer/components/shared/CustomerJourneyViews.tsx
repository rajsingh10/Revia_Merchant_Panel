import React, { useState } from 'react';
import {
  Gift,
  BookOpen,
  Wifi,
  Bell,
  Star,
  MessageSquare,
  Megaphone,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  Search,
  Check,
  CheckCircle2,
  Calendar,
  Tag,
  CreditCard,
  Shield,
  Clock,
  Store,
  Crown,
  ShoppingCart,
  Sparkles,
  Coffee,
  Trophy,
  Plus,
  Minus,
  Utensils
} from 'lucide-react';

export interface CustomerMerchantProfile {
  id: string;
  name: string;
  tagline: string;
  category: string;
  tier: 'VIP' | 'Gold' | 'Silver' | 'Bronze';
  headerGrad: string;
  accentBtn: string;
  borderAccent: string;
  initials: string;
  initialsBg: string;
  heroImage: string;
  thumbImage: string;
  activeOffersCount: number;
  expiredOffersCount: number;
  offersRedeemed: number;
  allAvailableOffers: number;
  walletBalance: number;
  totalSpend: number;
  stampsCollected: number;
  stampsTotal: number;
  latestVisit: string;
  visitTime: string;
  visitTimeRange: string;
  promoBannerText: string;
  activeOffers: {
    id: string;
    title: string;
    subtitle: string;
    image: string;
  }[];
}

export const CUSTOMER_MERCHANTS: CustomerMerchantProfile[] = [
  {
    id: 'sly-granny',
    name: 'Sly Granny Café',
    tagline: 'Good Food, Good Vibes',
    category: 'Café & Dine-in',
    tier: 'Gold',
    headerGrad: 'from-[#047857] via-[#059669] to-[#0D9488]',
    accentBtn: 'bg-[#047857] hover:bg-[#065F46]',
    borderAccent: 'border-[#10B981]',
    initials: 'SG',
    initialsBg: 'bg-[#9D174D]',
    heroImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1000&auto=format&fit=crop&q=80',
    thumbImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300&auto=format&fit=crop&q=80',
    activeOffersCount: 8,
    expiredOffersCount: 2,
    offersRedeemed: 6,
    allAvailableOffers: 14,
    walletBalance: 1750,
    totalSpend: 5420,
    stampsCollected: 5,
    stampsTotal: 6,
    latestVisit: '28 Oct 2026',
    visitTime: 'Evening',
    visitTimeRange: '(6:00 – 9:30)',
    promoBannerText: 'Earn rewards & unlock special treats',
    activeOffers: [
      { id: 'sg-1', title: 'Flat 20% OFF', subtitle: 'on All Artisan Beverages', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200&auto=format&fit=crop&q=80' },
      { id: 'sg-2', title: 'Free Dessert', subtitle: 'on Orders Above ₹999', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=200&auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'brew-house',
    name: 'Brew House',
    tagline: 'Specialty Coffee & Roastery',
    category: 'Café & Coffee House',
    tier: 'VIP',
    headerGrad: 'from-[#DB2777] via-[#EC4899] to-[#C026D3]',
    accentBtn: 'bg-[#DB2777] hover:bg-[#BE185D]',
    borderAccent: 'border-[#EC4899]',
    initials: 'BH',
    initialsBg: 'bg-[#3B1478]',
    heroImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1000&auto=format&fit=crop&q=80',
    thumbImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&auto=format&fit=crop&q=80',
    activeOffersCount: 10,
    expiredOffersCount: 3,
    offersRedeemed: 8,
    allAvailableOffers: 16,
    walletBalance: 2500,
    totalSpend: 6780,
    stampsCollected: 4,
    stampsTotal: 6,
    latestVisit: '08 Nov 2026',
    visitTime: 'Afternoon',
    visitTimeRange: '(12:00 – 4:00)',
    promoBannerText: 'Only 2 stamps away from your free coffee!',
    activeOffers: [
      { id: 'bh-1', title: 'Buy 1 Get 1 Free', subtitle: 'on Selected Beverages', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&auto=format&fit=crop&q=80' },
      { id: 'bh-2', title: 'Flat 20% OFF', subtitle: 'on Cakes & Desserts', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'chill-cafe',
    name: 'Chill Cafe',
    tagline: 'Craft Bites & Cozy Lounge',
    category: 'Café & Bistro',
    tier: 'Silver',
    headerGrad: 'from-[#5B21B6] via-[#6D28D9] to-[#7E22CE]',
    accentBtn: 'bg-[#6D28D9] hover:bg-[#5B21B6]',
    borderAccent: 'border-[#7C3AED]',
    initials: 'CC',
    initialsBg: 'bg-[#92400E]',
    heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&auto=format&fit=crop&q=80',
    thumbImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&auto=format&fit=crop&q=80',
    activeOffersCount: 7,
    expiredOffersCount: 4,
    offersRedeemed: 5,
    allAvailableOffers: 11,
    walletBalance: 800,
    totalSpend: 3240,
    stampsCollected: 3,
    stampsTotal: 5,
    latestVisit: '06 Nov 2026',
    visitTime: 'Morning',
    visitTimeRange: '(8:30 – 11:30)',
    promoBannerText: 'Get a Free Coffee • Now 2 stamps away to redeem',
    activeOffers: [
      { id: 'cc-1', title: '15% Off Breakfast', subtitle: 'on Sourdough & Bowls', image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=200&auto=format&fit=crop&q=80' },
      { id: 'cc-2', title: 'Free Iced Latte', subtitle: 'with Any Main Course', image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=200&auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'laiback-cafe',
    name: 'Laiback Cafe',
    tagline: 'Artisanal Desserts & Lounge',
    category: 'Café & Desserts',
    tier: 'Bronze',
    headerGrad: 'from-[#BE185D] via-[#DB2777] to-[#E11D48]',
    accentBtn: 'bg-[#BE185D] hover:bg-[#9D174D]',
    borderAccent: 'border-[#DB2777]',
    initials: 'LC',
    initialsBg: 'bg-[#B45309]',
    heroImage: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1000&auto=format&fit=crop&q=80',
    thumbImage: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=300&auto=format&fit=crop&q=80',
    activeOffersCount: 5,
    expiredOffersCount: 1,
    offersRedeemed: 4,
    allAvailableOffers: 9,
    walletBalance: 1200,
    totalSpend: 2890,
    stampsCollected: 2,
    stampsTotal: 5,
    latestVisit: '02 Nov 2026',
    visitTime: 'Evening',
    visitTimeRange: '(5:00 – 8:00)',
    promoBannerText: 'Enjoy member-only offers & rewards',
    activeOffers: [
      { id: 'lc-1', title: 'Flat 25% OFF', subtitle: 'on Artisanal Pastries', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=200&auto=format&fit=crop&q=80' }
    ]
  }
];

/* ============================================================================
   1. CAFÉ HOME HUB (Matches Home.png & request item-1.png)
   Responsive across Mobile, Tablet, and Desktop
   ============================================================================ */
export interface CafeHomeViewProps {
  merchant: CustomerMerchantProfile;
  onOpenMenu: () => void;
  onOpenOffers: () => void;
  onOpenStamps: () => void;
  onOpenRequestItems: () => void;
  onOpenWifi: () => void;
  onOpenReview: () => void;
  onOpenAllMerchants: () => void;
  onOpenHistory: () => void;
  onNotify: (msg: string) => void;
}

export const CafeHomeView: React.FC<CafeHomeViewProps> = ({
  merchant,
  onOpenMenu,
  onOpenOffers,
  onOpenStamps,
  onOpenRequestItems,
  onOpenWifi,
  onOpenReview,
  onOpenAllMerchants,
  onOpenHistory,
  onNotify
}) => {
  return (
    <div className="animate-in fade-in duration-200 -mx-4 -mt-4 sm:mx-0 sm:mt-0">
      {/* Full-bleed Café Hero Cover + Overlapping Rounded Lavender Sheet */}
      <div className="relative">
        <div className="w-full h-44 sm:h-56 lg:h-64 sm:rounded-t-3xl overflow-hidden relative">
          <img
            src={merchant.heroImage}
            alt={merchant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
          {/* Top-right Switch Merchant Pill */}
          <button
            type="button"
            onClick={onOpenAllMerchants}
            className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white backdrop-blur-md text-[11px] font-black text-[#240B4C] flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
          >
            <Store className="w-3.5 h-3.5 text-[#5844A8]" />
            <span>Switch Merchant</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Rounded Sheet overlapping bottom of cover photo */}
        <div className="-mt-6 relative z-10 rounded-t-[28px] bg-gradient-to-b from-[#FAF5FF] via-[#F7F1FD] to-[#FAF8FF] px-4 sm:px-6 pt-5 pb-4 space-y-4">
          {/* Circular Pink Cup Logo + Café Title Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white p-1.5 shadow-lg border border-[#EFEAF7] flex items-center justify-center shrink-0">
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#DB006A] via-[#EC1B73] to-[#F43F5E] text-white flex items-center justify-center shadow-inner">
                  <Coffee className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#1E1548] tracking-tight truncate leading-tight">
                  {merchant.name}
                </h1>
                <p className="text-xs sm:text-sm font-medium text-[#7B748C] truncate mt-0.5">
                  {merchant.tagline}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenHistory}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-[#E5DEF5] hover:border-[#5844A8] text-xs font-bold text-[#240B4C] shadow-2xs cursor-pointer shrink-0 transition-colors"
            >
              <Clock className="w-3.5 h-3.5 text-[#5844A8]" />
              <span>History &amp; Wallet</span>
            </button>
          </div>

          {/* 2-Column Compact Action Cards Grid on Mobile & Tablet, 3-Column on Desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5 pt-1">
            {[
              {
                title: 'Offers',
                desc: 'Latest offers for you',
                icon: <Star className="w-4 h-4 sm:w-5 sm:h-5 text-[#F43F5E] fill-[#F43F5E]" />,
                iconBg: 'bg-[#FFF0F3]',
                onClick: onOpenOffers
              },
              {
                title: 'Add a Review',
                desc: 'Share your experience',
                icon: <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-[#0EA5E9] fill-[#0EA5E9]/20" />,
                iconBg: 'bg-[#E0F2FE]',
                onClick: onOpenReview
              },
              {
                title: 'View Menu',
                desc: 'Explore our food & drinks',
                icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#7C3AED]" />,
                iconBg: 'bg-[#F3E8FF]',
                onClick: onOpenMenu
              },
              {
                title: 'Connect to Wi-Fi',
                desc: 'Get connected while you relax',
                icon: <Wifi className="w-4 h-4 sm:w-5 sm:h-5 text-[#10B981]" />,
                iconBg: 'bg-[#DCFCE7]',
                onClick: onOpenWifi
              },
              {
                title: 'Add Request',
                desc: 'Call waiter or request items',
                icon: <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-[#4F46E5] fill-[#4F46E5]/20" />,
                iconBg: 'bg-[#E0E7FF]',
                onClick: onOpenRequestItems
              },
              {
                title: 'Earn Rewards',
                desc: 'Collect stamps & perks',
                icon: <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-[#E11D48]" />,
                iconBg: 'bg-[#FFE4E6]',
                onClick: onOpenStamps
              }
            ].map((card) => (
              <button
                key={card.title}
                type="button"
                onClick={card.onClick}
                className="bg-white hover:bg-[#FDFBFF] rounded-2xl p-3 sm:p-4 border border-[#EFEAF7]/90 hover:border-[#C4B5FD] shadow-xs hover:shadow-md flex items-center justify-between gap-2 text-left transition-all cursor-pointer active:scale-[0.98]"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 ${card.iconBg}`}>
                    {card.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-black text-[#1E1548] truncate leading-tight">
                      {card.title}
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-medium text-[#8C84A0] mt-0.5 line-clamp-2 leading-tight">
                      {card.desc}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#B4ADC6] shrink-0" />
              </button>
            ))}
          </div>

          {/* Full-Width Single-Row Follow Our Channel Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl px-3.5 py-3.5 sm:px-5 sm:py-4 border border-[#EFEAF7] shadow-xs flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#F5F0FF] text-[#9333EA] flex items-center justify-center shrink-0">
                <Megaphone className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-black text-[#1E1548] truncate">
                  Follow Our Channel
                </div>
                <div className="text-[10px] sm:text-[11px] font-medium text-[#8C84A0] leading-tight line-clamp-2">
                  Get updates, events &amp; exclusive offers
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {[
                { name: 'Instagram', bg: 'bg-gradient-to-tr from-[#F59E0B] via-[#EC4899] to-[#8B5CF6]', txt: 'IG' },
                { name: 'Facebook', bg: 'bg-[#1877F2]', txt: 'f' },
                { name: 'YouTube', bg: 'bg-[#FF0000]', txt: '▶' },
                { name: 'WhatsApp', bg: 'bg-[#25D366]', txt: 'WA' }
              ].map((soc) => (
                <button
                  key={soc.name}
                  type="button"
                  onClick={() => onNotify(`Opening ${merchant.name} on ${soc.name}`)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${soc.bg} text-white font-black text-[10px] flex items-center justify-center shadow-xs hover:opacity-90 cursor-pointer transition-opacity`}
                  title={`Follow on ${soc.name}`}
                >
                  {soc.txt}
                </button>
              ))}
              <ChevronRight className="w-3.5 h-3.5 text-[#B4ADC6] ml-0.5 shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   2. REQUEST ITEMS (Matches request item.png)
   Responsive across Mobile, Tablet, and Desktop
   ============================================================================ */
export interface RequestItemsViewProps {
  merchantName: string;
  onBack?: () => void;
  onSubmitted: (summary: string) => void;
}

export const RequestItemsView: React.FC<RequestItemsViewProps> = ({
  merchantName,
  onBack,
  onSubmitted
}) => {
  const [tissueSelected, setTissueSelected] = useState(true);
  const [saltSelected, setSaltSelected] = useState(false);
  const [waterSelected, setWaterSelected] = useState(true);
  const [waterQty, setWaterQty] = useState(1);
  const [platesSelected, setPlatesSelected] = useState(true);
  const [platesQty, setPlatesQty] = useState(1);
  const [changeTable, setChangeTable] = useState(true);
  const [tablePref, setTablePref] = useState('Window Seat');
  const [customRequest, setCustomRequest] = useState('');

  const totalSelectedItems =
    (tissueSelected ? 1 : 0) +
    (saltSelected ? 1 : 0) +
    (waterSelected && waterQty > 0 ? waterQty : 0) +
    (platesSelected && platesQty > 0 ? platesQty : 0) +
    (changeTable ? 1 : 0) +
    (customRequest.trim() ? 1 : 0);

  const handleSend = () => {
    const items: string[] = [];
    if (tissueSelected) items.push('Tissue Paper');
    if (saltSelected) items.push('Salt');
    if (waterSelected && waterQty > 0) items.push(`Water ×${waterQty}`);
    if (platesSelected && platesQty > 0) items.push(`Extra Plates ×${platesQty}`);
    if (changeTable) items.push(`Table Change (${tablePref})`);
    if (customRequest.trim()) items.push(customRequest.trim());
    onSubmitted(
      items.length > 0
        ? `Request sent to waiter (${items.join(', ')})!`
        : 'Waiter notified for Table T12!'
    );
  };

  return (
    <div className="space-y-4 sm:space-y-5 max-w-3xl lg:max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Top Bar when inside Mobile/Tablet */}
      {onBack && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white border border-[#EFEAF7] flex items-center justify-center text-[#1E1548] shadow-2xs cursor-pointer hover:border-[#5844A8]/50"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="text-center">
            <div className="text-sm font-black text-[#1E1548]">{merchantName}</div>
            <div className="text-[10px] font-bold text-[#E11D48] tracking-wider uppercase">— Table T12 —</div>
          </div>
          <div className="w-9" />
        </div>
      )}

      {/* Title + Cloche Bell Hero */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#240B4C] tracking-tight">Request Items</h1>
          <p className="text-xs sm:text-sm text-[#6B657E] font-medium mt-1 max-w-md leading-relaxed">
            Need something at your table? Select the items and we&apos;ll send a waiter to you.
          </p>
        </div>
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-[#5844A8] to-[#9333EA] text-white flex items-center justify-center shadow-lg shadow-purple-900/20 shrink-0 relative">
          <Bell className="w-8 h-8 sm:w-9 sm:h-9" />
          <Sparkles className="w-4 h-4 text-pink-300 absolute -top-1.5 -left-1.5" />
        </div>
      </div>

      {/* 2x2 (4-col on desktop) Interactive Amenity Tiles (request item.png) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Tissue Paper */}
        <div
          onClick={() => setTissueSelected((p) => !p)}
          className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between min-h-[155px] relative ${
            tissueSelected
              ? 'bg-white border-[#7C3AED] shadow-md shadow-purple-900/5'
              : 'bg-white/95 border-[#EFEAF7] hover:border-[#D9CEF2]'
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center absolute top-3.5 right-3.5 transition-colors ${
              tissueSelected ? 'bg-[#240B4C] text-white' : 'border-2 border-[#D4CCE6] bg-white'
            }`}
          >
            {tissueSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
          <div className="flex-1 flex items-center justify-center text-5xl py-2 select-none">🧻</div>
          <div className="text-xs sm:text-sm font-black text-[#1E1548]">Tissue Paper</div>
        </div>

        {/* Salt */}
        <div
          onClick={() => setSaltSelected((p) => !p)}
          className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between min-h-[155px] relative ${
            saltSelected
              ? 'bg-white border-[#7C3AED] shadow-md shadow-purple-900/5'
              : 'bg-white/95 border-[#EFEAF7] hover:border-[#D9CEF2]'
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center absolute top-3.5 right-3.5 transition-colors ${
              saltSelected ? 'bg-[#240B4C] text-white' : 'border-2 border-[#D4CCE6] bg-white'
            }`}
          >
            {saltSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
          <div className="flex-1 flex items-center justify-center text-5xl py-2 select-none">🧂</div>
          <div className="text-xs sm:text-sm font-black text-[#1E1548]">Salt</div>
        </div>

        {/* Water with Stepper */}
        <div
          onClick={() => setWaterSelected((p) => !p)}
          className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between min-h-[155px] relative ${
            waterSelected
              ? 'bg-white border-[#7C3AED] shadow-md shadow-purple-900/5'
              : 'bg-white/95 border-[#EFEAF7] hover:border-[#D9CEF2]'
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center absolute top-3.5 right-3.5 transition-colors ${
              waterSelected ? 'bg-[#240B4C] text-white' : 'border-2 border-[#D4CCE6] bg-white'
            }`}
          >
            {waterSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
          <div className="flex-1 flex items-center justify-center text-5xl py-2 select-none">🥛</div>
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs sm:text-sm font-black text-[#1E1548]">Water</span>
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 bg-[#F3EEFA] rounded-full px-2 py-0.5 border border-[#E5DAF9]"
            >
              <button
                type="button"
                onClick={() => {
                  const next = Math.max(0, waterQty - 1);
                  setWaterQty(next);
                  if (next === 0) setWaterSelected(false);
                }}
                className="text-[#5844A8] font-black text-xs px-0.5 cursor-pointer"
              >
                −
              </button>
              <span className="text-xs font-black text-[#1E1548] min-w-[14px] text-center">{waterQty}</span>
              <button
                type="button"
                onClick={() => {
                  setWaterQty((q) => q + 1);
                  setWaterSelected(true);
                }}
                className="text-[#5844A8] font-black text-xs px-0.5 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Extra Plates with Stepper */}
        <div
          onClick={() => setPlatesSelected((p) => !p)}
          className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between min-h-[155px] relative ${
            platesSelected
              ? 'bg-white border-[#7C3AED] shadow-md shadow-purple-900/5'
              : 'bg-white/95 border-[#EFEAF7] hover:border-[#D9CEF2]'
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center absolute top-3.5 right-3.5 transition-colors ${
              platesSelected ? 'bg-[#240B4C] text-white' : 'border-2 border-[#D4CCE6] bg-white'
            }`}
          >
            {platesSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
          <div className="flex-1 flex items-center justify-center text-5xl py-2 select-none">🍽️</div>
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs sm:text-sm font-black text-[#1E1548] truncate">Extra Plates</span>
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 bg-[#F3EEFA] rounded-full px-2 py-0.5 border border-[#E5DAF9] shrink-0"
            >
              <button
                type="button"
                onClick={() => {
                  const next = Math.max(0, platesQty - 1);
                  setPlatesQty(next);
                  if (next === 0) setPlatesSelected(false);
                }}
                className="text-[#5844A8] font-black text-xs px-0.5 cursor-pointer"
              >
                −
              </button>
              <span className="text-xs font-black text-[#1E1548] min-w-[14px] text-center">{platesQty}</span>
              <button
                type="button"
                onClick={() => {
                  setPlatesQty((q) => q + 1);
                  setPlatesSelected(true);
                }}
                className="text-[#5844A8] font-black text-xs px-0.5 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Table Request Card (request item.png) */}
      <div
        className={`bg-white rounded-3xl p-4 sm:p-5 border-2 transition-all space-y-4 ${
          changeTable ? 'border-[#C4B5FD] shadow-sm' : 'border-[#EFEAF7]'
        }`}
      >
        <div
          onClick={() => setChangeTable((p) => !p)}
          className="flex items-center justify-between gap-3 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#F3EEFA] text-[#5844A8] flex items-center justify-center shrink-0">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black text-[#1E1548]">Change Table Request</div>
              <div className="text-xs text-[#7B748C]">Want to move to a different table?</div>
            </div>
          </div>
          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
              changeTable ? 'bg-[#240B4C] text-white' : 'border-2 border-[#D4CCE6] bg-white'
            }`}
          >
            {changeTable && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
        </div>

        {changeTable && (
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
            <div className="sm:col-span-8">
              <label className="text-xs font-black text-[#1E1548] block mb-1.5">New Table Preference</label>
              <div className="relative">
                <select
                  value={tablePref}
                  onChange={(e) => setTablePref(e.target.value)}
                  className="w-full appearance-none bg-[#FAF8FF] border border-[#E5DEF5] rounded-2xl px-4 py-2.5 pr-9 text-xs font-bold text-[#1E1548] outline-none cursor-pointer"
                >
                  <option value="Window Seat">Window Seat</option>
                  <option value="Patio / Outdoor">Patio / Outdoor</option>
                  <option value="Quiet Corner">Quiet Corner</option>
                  <option value="Booth for 4">Booth for 4</option>
                  <option value="Near Power Outlet">Near Power Outlet</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#8C84A0] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div className="sm:col-span-4">
              <label className="text-xs font-black text-[#1E1548] block mb-1.5">Table No.</label>
              <div className="h-[40px] rounded-2xl bg-[#F3EEFA] border border-[#E5DAF9] px-4 flex items-center justify-center gap-1.5 text-xs font-black text-[#240B4C]">
                <Utensils className="w-3.5 h-3.5 text-[#5844A8]" />
                <span>T12</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Request Something Else Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-[#F3EEFA] text-[#5844A8] flex items-center justify-center shrink-0">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <label className="text-xs font-black text-[#1E1548] block">Request Something Else</label>
          <input
            type="text"
            value={customRequest}
            onChange={(e) => setCustomRequest(e.target.value)}
            placeholder="E.g., Napkins, Ketchup, Spoon, etc."
            className="w-full bg-[#FAF8FF] border border-[#E5DEF5] focus:border-[#5844A8] rounded-xl px-3.5 py-2 text-xs font-semibold text-[#1E1548] placeholder:text-[#9890A8] outline-none"
          />
        </div>
      </div>

      {/* Primary CTA Button */}
      <button
        type="button"
        onClick={handleSend}
        className="w-full py-3.5 rounded-full bg-[#240B4C] hover:bg-[#321266] text-white text-sm font-black shadow-lg shadow-purple-950/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
      >
        <Bell className="w-4 h-4" />
        <span>Send Request ({totalSelectedItems} {totalSelectedItems === 1 ? 'Item' : 'Items'})</span>
      </button>
    </div>
  );
};

/* ============================================================================
   3. HISTORY & ACTIVITY (Matches history.png)
   Responsive across Mobile, Tablet, and Desktop
   ============================================================================ */
export interface HistoryActivityViewProps {
  onOpenAllMerchants: (expandedId?: string) => void;
  onOpenStamps: () => void;
  onOpenLoyaltyTiers?: () => void;
  onOpenMerchantWallet?: (merchant?: CustomerMerchantProfile) => void;
  onOpenSingleMerchant?: (merchant: CustomerMerchantProfile) => void;
  onNotify: (msg: string) => void;
}

export const HistoryActivityView: React.FC<HistoryActivityViewProps> = ({
  onOpenAllMerchants,
  onOpenStamps,
  onOpenLoyaltyTiers,
  onOpenMerchantWallet,
  onOpenSingleMerchant,
  onNotify
}) => {
  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E1548] tracking-tight">History &amp; Activity</h1>
          <p className="text-xs sm:text-sm text-[#7B748C] mt-0.5">
            Your visits, loyalty and rewards in one place.
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#F3EEFA] border border-[#E5DAF9] text-[#5844A8] flex items-center justify-center shrink-0">
          <Store className="w-6 h-6" />
        </div>
      </div>

      {/* Hero Next Reward Card (history.png) */}
      <div className="rounded-3xl p-4 sm:p-6 bg-gradient-to-br from-[#DB2777] via-[#9D174D] to-[#3B0764] text-white shadow-xl space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs border border-white/20 text-[11px] font-bold">
            <Star className="w-3 h-3 text-amber-300" /> Your next reward
          </span>
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> ALMOST UNLOCKED
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 sm:gap-5">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <img
              src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=240&auto=format&fit=crop&q=80"
              alt="Brew House"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/30 shrink-0 shadow-md"
            />
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-widest text-pink-200">
                Brew House · Loyalty Reward
              </div>
              <h2 className="text-base sm:text-xl font-black leading-snug mt-0.5">
                Only <span className="text-amber-300">2 stamps</span> until your free coffee!
              </h2>
            </div>
          </div>

          <img
            src="https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200&auto=format&fit=crop&q=80"
            alt="Latte"
            className="hidden sm:block w-20 h-20 rounded-full object-cover border-2 border-white/40 shadow-lg shrink-0"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <span
                  key={n}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${
                    n <= 4
                      ? 'bg-white text-[#9D174D]'
                      : 'border-2 border-white/40 bg-white/10 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </span>
              ))}
            </div>
            <div className="text-[11px] font-semibold text-pink-100">4 of 6 stamps collected</div>
          </div>

          <button
            type="button"
            onClick={onOpenStamps}
            className="self-start sm:self-auto px-5 py-2.5 bg-white hover:bg-purple-50 text-[#240B4C] rounded-full text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>View reward</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* View All Merchants Banner Card (history.png) */}
      <button
        type="button"
        onClick={() => onOpenAllMerchants()}
        className="w-full bg-white hover:bg-[#FAF8FF] rounded-3xl p-4 border border-[#EFEAF7] hover:border-[#C4B5FD] shadow-2xs flex items-center justify-between gap-3 text-left transition-all cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-[#F3EEFA] text-[#5844A8] flex items-center justify-center shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-black text-[#1E1548]">View all merchants</div>
            <div className="text-[11px] text-[#7B748C] truncate">
              Explore offers, tiers and rewards across all merchants you have visited
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex -space-x-2">
            <span className="w-7 h-7 rounded-full bg-[#3B1478] text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white">BH</span>
            <span className="w-7 h-7 rounded-full bg-[#B45309] text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white">LC</span>
            <span className="w-7 h-7 rounded-full bg-[#047857] text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white">SG</span>
            <span className="w-7 h-7 rounded-full bg-[#F3EEFA] text-[#5844A8] text-[9px] font-black flex items-center justify-center ring-2 ring-white">+1</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8C84A0]" />
        </div>
      </button>

      {/* 2-Column Split on Tablet/Desktop: Cumulative Wallet | Your Membership Tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Cumulative Wallet */}
        <div className="bg-white rounded-3xl overflow-hidden border border-[#EFEAF7] shadow-2xs flex flex-col justify-between">
          <div className="p-4 sm:p-5 bg-gradient-to-b from-[#ECFDF5]/80 to-white space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#059669] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-[#1E1548]">Cumulative Wallet</h3>
                  <p className="text-[11px] text-[#6B657E]">Balances and earned rewards in one place</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  onOpenMerchantWallet
                    ? onOpenMerchantWallet(CUSTOMER_MERCHANTS[1])
                    : onNotify('Showing complete wallet transaction ledger')
                }
                className="text-xs font-bold text-[#E11D48] hover:underline cursor-pointer shrink-0"
              >
                Wallet history →
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5]">
                <CreditCard className="w-4 h-4 text-[#5844A8] mx-auto" />
                <div className="text-base sm:text-lg font-black text-[#1E1548] mt-1">₹500</div>
                <div className="text-[10px] font-semibold text-[#6B657E]">Cashback</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#FEFCE8] border border-[#FEF08A]">
                <Star className="w-4 h-4 text-amber-500 mx-auto" />
                <div className="text-base sm:text-lg font-black text-[#1E1548] mt-1">2,164</div>
                <div className="text-[10px] font-semibold text-[#6B657E]">Reward points</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#F5F3FF] border border-[#EDE9FE]">
                <Gift className="w-4 h-4 text-[#D97706] mx-auto" />
                <div className="text-base sm:text-lg font-black text-[#1E1548] mt-1">3</div>
                <div className="text-[10px] font-semibold text-[#6B657E]">Active stamp cards</div>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-5 pb-4 pt-2 space-y-2.5 border-t border-[#F4F0FA]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-black text-[#1E1548]">Latest wallet transactions</span>
              <button
                type="button"
                onClick={() => onNotify('All wallet transactions loaded')}
                className="font-bold text-[#E11D48] hover:underline cursor-pointer"
              >
                View all →
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2 py-1">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-8 h-8 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0">
                    <CreditCard className="w-3.5 h-3.5" />
                  </span>
                  <div className="min-w-0">
                    <div className="font-black text-[#1E1548] truncate">Cashback earned · Brew House</div>
                    <div className="text-[10px] text-[#8C84A0]">8 Nov 2026 · Reward credited</div>
                  </div>
                </div>
                <span className="font-black text-[#059669] shrink-0">+₹120</span>
              </div>
              <div className="flex items-center justify-between gap-2 py-1">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-8 h-8 rounded-full bg-[#FEFCE8] text-amber-500 flex items-center justify-center shrink-0">
                    <Star className="w-3.5 h-3.5" />
                  </span>
                  <div className="min-w-0">
                    <div className="font-black text-[#1E1548] truncate">Reward points · Chill Cafe</div>
                    <div className="text-[10px] text-[#8C84A0]">6 Nov 2026 · Visit reward</div>
                  </div>
                </div>
                <span className="font-black text-[#D97706] shrink-0">+80 pts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Your Membership Tiers */}
        <div className="bg-gradient-to-b from-[#FEFCE8]/90 via-[#FFFBF0] to-white rounded-3xl p-4 sm:p-5 border border-[#FEF08A]/70 shadow-2xs space-y-3.5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">👑</span>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-[#1E1548]">Your Membership Tiers</h3>
                  <p className="text-[11px] text-[#7B748C]">Your tier at restaurants you&apos;ve visited.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  onOpenLoyaltyTiers
                    ? onOpenLoyaltyTiers()
                    : onOpenAllMerchants('brew-house')
                }
                className="text-xs font-bold text-[#E11D48] hover:underline cursor-pointer shrink-0"
              >
                See details →
              </button>
            </div>

            <div className="divide-y divide-amber-100/80">
              {CUSTOMER_MERCHANTS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() =>
                    onOpenSingleMerchant
                      ? onOpenSingleMerchant(m)
                      : onOpenAllMerchants(m.id)
                  }
                  className="w-full py-2.5 flex items-center justify-between gap-3 hover:bg-white/60 -mx-2 px-2 rounded-xl transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-9 h-9 rounded-full ${m.initialsBg} text-white font-black text-xs flex items-center justify-center shrink-0`}>
                      {m.initials}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-black text-[#1E1548] truncate">{m.name}</div>
                      <div className="text-[10px] text-[#8C84A0] font-semibold">
                        {m.id === 'brew-house' ? '1,250 tier points' : 'Membership active'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                        m.tier === 'VIP'
                          ? 'bg-[#FEF08A] text-[#854D0E]'
                          : m.tier === 'Gold'
                          ? 'bg-amber-100 text-amber-800'
                          : m.tier === 'Silver'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {m.tier === 'VIP' ? '★ VIP' : m.tier}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#9890A8]" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-amber-100 text-[11px] font-semibold text-[#854D0E]">
            <span className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" /> Tap any merchant to view full perks &amp; offers
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity Card (history.png) */}
      <div className="bg-white rounded-3xl overflow-hidden border border-[#EFEAF7] shadow-2xs">
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#F3EEFA] to-[#FAF8FF] flex items-center justify-between border-b border-[#EFEAF7]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#7C3AED] text-white flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-black text-[#1E1548]">Recent Activity</h3>
          </div>
          <button
            type="button"
            onClick={() => onOpenAllMerchants()}
            className="text-xs font-bold text-[#E11D48] hover:underline cursor-pointer"
          >
            Full history →
          </button>
        </div>

        <div className="divide-y divide-[#F4F0FA] px-4 sm:px-5">
          {[
            { title: 'Visited Brew House', sub: 'Completed visit · Earned 1 stamp', date: '8 Nov', icon: Store },
            { title: 'Stamp added at Chill Cafe', sub: 'One step closer to your next reward', date: '6 Nov', icon: Star },
            { title: 'Redeemed an offer at Laiback Cafe', sub: 'Flat 20% off cakes & desserts', date: '4 Nov', icon: Gift }
          ].map((ev, idx) => (
            <div key={idx} className="py-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#F8F5FF] border border-[#EAE2FB] text-[#5844A8] flex items-center justify-center shrink-0">
                  <ev.icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-black text-[#1E1548] truncate">{ev.title}</div>
                  <div className="text-[11px] text-[#8C84A0] truncate">{ev.sub}</div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#8C84A0] whitespace-nowrap shrink-0">{ev.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   4. ALL MERCHANTS + EXPANDED SINGLE MERCHANT (all marchants.png & when click on single merchant.png)
   Responsive across Mobile, Tablet, and Desktop
   ============================================================================ */
export interface AllMerchantsViewProps {
  initialExpandedId?: string | null;
  onBack: () => void;
  onSelectMerchant: (merchant: CustomerMerchantProfile) => void;
  onRedeemOffer: (offerTitle: string, merchantName: string) => void;
}

export const AllMerchantsView: React.FC<AllMerchantsViewProps> = ({
  initialExpandedId = null,
  onBack,
  onSelectMerchant,
  onRedeemOffer
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Visited' | 'Nearby' | 'Rewards due'>('All');
  const [expandedId, setExpandedId] = useState<string | null>(initialExpandedId);

  const filtered = CUSTOMER_MERCHANTS.filter((m) => {
    const q = search.trim().toLowerCase();
    const matchesQ = !q || m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
    if (!matchesQ) return false;
    if (filter === 'Rewards due') return m.stampsCollected >= m.stampsTotal - 2;
    return true;
  });

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
      {/* Breadcrumb + Header */}
      <div className="space-y-1.5">
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-bold text-[#5844A8] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>History &amp; Activity</span>
          <span className="text-[#9890A8]">&gt;</span>
          <span className="text-[#1E1548]">All Merchants</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1E1548] tracking-tight">All Merchants</h1>
        <p className="text-xs sm:text-sm text-[#7B748C]">
          Explore your restaurants, offers, loyalty rewards and wallet balances in one place.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-[#EFEAF7] focus-within:border-[#5844A8]/50 rounded-2xl px-4 py-2.5 sm:py-3 flex items-center gap-2.5 shadow-2xs">
        <Search className="w-4 h-4 text-[#8C84A0] shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search restaurants, cafes and more..."
          className="bg-transparent outline-none w-full text-xs sm:text-sm font-medium text-[#1E1548] placeholder:text-[#9890A8]"
        />
      </div>

      {/* Filter Pills + Helper */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
          {(['All', 'Visited', 'Nearby', 'Rewards due'] as const).map((pill) => (
            <button
              key={pill}
              type="button"
              onClick={() => setFilter(pill)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                filter === pill
                  ? 'bg-[#240B4C] text-white shadow-xs'
                  : 'bg-white border border-[#E5DEF5] text-[#5E5870] hover:border-[#5844A8]/40'
              }`}
            >
              {pill}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[11px] font-semibold text-[#7B748C]">
          <span>
            <strong className="text-[#1E1548]">{filtered.length} merchants</strong> in your loyalty history
          </span>
          <span className="text-[#EC4899]">● Tap to expand</span>
        </div>
      </div>

      {/* Merchant Cards Grid (1 col mobile, 2 cols tablet/desktop; expanded spans full width on tablet/desktop!) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((m) => {
          const isExpanded = expandedId === m.id;
          return (
            <div
              key={m.id}
              className={`bg-white rounded-3xl overflow-hidden border-2 shadow-sm transition-all ${
                isExpanded ? `${m.borderAccent} md:col-span-2 shadow-lg` : 'border-[#EFEAF7] hover:border-[#D9CEF2]'
              }`}
            >
              {/* Colored Gradient Header Banner */}
              <div
                onClick={() => setExpandedId((prev) => (prev === m.id ? null : m.id))}
                className={`bg-gradient-to-r ${m.headerGrad} p-4 text-white flex items-center justify-between gap-3 cursor-pointer`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={m.thumbImage}
                    alt={m.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white/80 shrink-0 shadow-sm"
                  />
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-black leading-tight truncate">{m.name}</h3>
                    <p className="text-xs text-white/85 font-medium truncate mt-0.5">{m.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1 rounded-full bg-white/95 text-[#1E1548] text-xs font-black flex items-center gap-1 shadow-xs">
                    {m.tier === 'VIP' || m.tier === 'Gold' ? <Crown className="w-3 h-3 text-amber-500" /> : <Star className="w-3 h-3 text-[#5844A8]" />}
                    <span>{m.tier}</span>
                  </span>
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
              </div>

              {/* Collapsed Card Body (all marchants.png) */}
              {!isExpanded && (
                <div className="p-4 space-y-3.5">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[#FFF1F5] text-[#E11D48] flex items-center justify-center shrink-0">
                        <Tag className="w-3.5 h-3.5" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-[9.5px] text-[#8C84A0] font-semibold truncate">Active Offers</div>
                        <div className="font-black text-[#1E1548]">{m.activeOffersCount} Offers</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 border-l border-[#F4F0FA] pl-2">
                      <span className="w-7 h-7 rounded-full bg-[#FFF1F5] text-[#E11D48] flex items-center justify-center shrink-0">
                        <CreditCard className="w-3.5 h-3.5" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-[9.5px] text-[#8C84A0] font-semibold truncate">Wallet Balance</div>
                        <div className="font-black text-[#1E1548]">₹{m.walletBalance.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 border-l border-[#F4F0FA] pl-2">
                      <span className="w-7 h-7 rounded-full bg-[#FFF1F5] text-[#E11D48] flex items-center justify-center shrink-0">
                        <Shield className="w-3.5 h-3.5" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-[9.5px] text-[#8C84A0] font-semibold truncate">Stamps</div>
                        <div className="font-black text-[#1E1548]">
                          {m.stampsCollected} / {m.stampsTotal}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#F4F0FA] flex items-center justify-between gap-2">
                    <span className="text-[11px] text-[#7B748C] font-semibold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#9890A8]" />
                      Latest Visit: <strong className="text-[#1E1548]">{m.latestVisit}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setExpandedId(m.id)}
                      className={`px-4 py-1.5 rounded-full text-white text-xs font-black flex items-center gap-1 shadow-xs cursor-pointer transition-colors ${m.accentBtn}`}
                    >
                      <span>View Merchant</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Expanded Single Merchant Body (when click on single merchant.png) */}
              {isExpanded && (
                <div className="p-4 sm:p-5 space-y-4 animate-in fade-in duration-150">
                  {/* 8 Metric Tiles (2x4 on mobile, 4x2 on tablet/desktop) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <div className="p-3 rounded-2xl bg-[#FAF8FF] border border-[#EFEAF7] space-y-1">
                      <CreditCard className="w-4 h-4 text-[#E11D48]" />
                      <div className="text-[10px] text-[#7B748C] font-semibold">Offers Redeemed</div>
                      <div className="text-base font-black text-[#1E1548]">{String(m.offersRedeemed).padStart(2, '0')}</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#FFF5F7] border border-[#FCE1E9] space-y-1">
                      <Gift className="w-4 h-4 text-[#E11D48]" />
                      <div className="text-[10px] text-[#7B748C] font-semibold">Current Active Offers</div>
                      <div className="text-base font-black text-[#E11D48]">{m.activeOffersCount}</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#F5F3FF] border border-[#EDE9FE] space-y-1">
                      <Tag className="w-4 h-4 text-[#5844A8]" />
                      <div className="text-[10px] text-[#7B748C] font-semibold">All Available Offers</div>
                      <div className="text-base font-black text-[#1E1548]">{m.allAvailableOffers}</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#FAF8FF] border border-[#EFEAF7] space-y-1">
                      <Calendar className="w-4 h-4 text-[#5844A8]" />
                      <div className="text-[10px] text-[#7B748C] font-semibold">Visit Time</div>
                      <div className="text-xs font-black text-[#1E1548]">{m.visitTime}</div>
                      <div className="text-[9.5px] text-[#8C84A0]">{m.visitTimeRange}</div>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#F5F3FF] border border-[#EDE9FE] space-y-1">
                      <CreditCard className="w-4 h-4 text-[#5844A8]" />
                      <div className="text-[10px] text-[#7B748C] font-semibold">Wallet Balance</div>
                      <div className="text-base font-black text-[#1E1548]">₹{m.walletBalance.toLocaleString()}</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#FFF5F7] border border-[#FCE1E9] space-y-1">
                      <ShoppingCart className="w-4 h-4 text-[#E11D48]" />
                      <div className="text-[10px] text-[#7B748C] font-semibold">Total Spend</div>
                      <div className="text-base font-black text-[#1E1548]">₹{m.totalSpend.toLocaleString()}</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#FFFBEB] border border-[#FEF08A] space-y-1">
                      <Crown className="w-4 h-4 text-amber-500" />
                      <div className="text-[10px] text-[#7B748C] font-semibold">Your Tier</div>
                      <div className="text-base font-black text-[#D97706]">{m.tier}</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#FAF8FF] border border-[#EFEAF7] space-y-1">
                      <Calendar className="w-4 h-4 text-[#5844A8]" />
                      <div className="text-[10px] text-[#7B748C] font-semibold">Last Visit</div>
                      <div className="text-xs font-black text-[#1E1548]">{m.latestVisit}</div>
                    </div>
                  </div>

                  {/* Your Current Active Offers */}
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-black text-[#1E1548]">Your Current Active Offers</h4>
                      <button
                        type="button"
                        onClick={() => onSelectMerchant(m)}
                        className={`px-3.5 py-1.5 rounded-full text-white text-[11px] font-black flex items-center gap-1 cursor-pointer ${m.accentBtn}`}
                      >
                        <span>Open {m.name}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {m.activeOffers.map((off) => (
                        <button
                          key={off.id}
                          type="button"
                          onClick={() => onRedeemOffer(off.title, m.name)}
                          className="p-3 rounded-2xl bg-[#FAF8FF] hover:bg-[#F3EEFA] border border-[#EFEAF7] flex items-center justify-between gap-3 text-left transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img src={off.image} alt={off.title} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                            <div className="min-w-0">
                              <div className="text-xs font-black text-[#1E1548] truncate">{off.title}</div>
                              <div className="text-[10px] text-[#7B748C] truncate">{off.subtitle}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                              Active
                            </span>
                            <ChevronRight className="w-4 h-4 text-[#8C84A0]" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-[#8C84A0] pt-1">
        Merchant-specific balances and tiers remain <strong className="text-[#1E1548]">separate</strong>.
      </p>
    </div>
  );
};
