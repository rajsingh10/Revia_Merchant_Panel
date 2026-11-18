import React, { useState } from 'react';
import {
  ArrowLeft,
  Award,
  Bell,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Coffee,
  Crown,
  Gift,
  Heart,
  Layers,
  Sparkles,
  Star,
  Tag,
  Trophy,
  Utensils,
  Wallet
} from 'lucide-react';
import {
  CUSTOMER_MERCHANTS,
  CustomerMerchantProfile
} from './CustomerJourneyViews';

/* ============================================================================
   1. STAMPS PROGRAM VIEW (Matches stamps.png)
   Responsive across Mobile, Tablet, and Desktop
   ============================================================================ */
export interface StampsProgramViewProps {
  merchant: CustomerMerchantProfile;
  onViewAllActivity: () => void;
  onBack?: () => void;
}

export const StampsProgramView: React.FC<StampsProgramViewProps> = ({
  merchant,
  onViewAllActivity,
  onBack
}) => {
  const [coffeeStamps, setCoffeeStamps] = useState(5);
  const specialsStamps = 2;

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
      {/* Top Greeting Banner */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-white border border-[#EFEAF7] flex items-center justify-center text-[#1E1548] shadow-2xs cursor-pointer hover:border-[#5844A8]/50 shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#240B4C] leading-tight tracking-tight">
              {merchant.tagline}
            </h1>
            <div className="h-0.5 w-32 bg-gradient-to-r from-[#5844A8] to-transparent rounded-full mt-1.5" />
          </div>
        </div>

        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-[#F3EEFA] to-[#FDE8F0] border border-[#E5DEF5] flex items-center justify-center shrink-0 relative shadow-xs">
          <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-tr from-[#5844A8] to-[#9333EA] text-white flex items-center justify-center shadow-md">
            <Coffee className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <Sparkles className="w-4 h-4 text-[#E11D48] absolute -top-1 -right-1" />
        </div>
      </div>

      {/* Hero Active Program Gradient Card + Stamp Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        {/* Left / Top: Active Program Hero Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#340E59] via-[#6B1272] to-[#93127C] rounded-3xl p-5 sm:p-6 text-white shadow-xl shadow-purple-950/20 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              <Coffee className="w-6 h-6 text-white" />
            </div>
            <span className="px-3 py-1 rounded-full bg-[#EC2A7A] text-white text-[11px] font-black shadow-sm">
              {Math.round((coffeeStamps / 6) * 100)}% Done
            </span>
          </div>

          <div className="mt-4 relative z-10">
            <div className="text-[10px] font-bold uppercase tracking-widest text-purple-200/90">
              Active Program
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-1 leading-snug">
              {6 - coffeeStamps > 0
                ? `${6 - coffeeStamps} Stamp${6 - coffeeStamps === 1 ? '' : 's'} Away from Free Coffee!`
                : 'Free Artisan Coffee Unlocked! 🎉'}
            </h2>
            <p className="text-xs text-purple-100/85 mt-2 leading-relaxed">
              Collect your 6th stamp today with any artisan roast brew at {merchant.name}.
            </p>
          </div>

          <div className="mt-5 space-y-2 relative z-10">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-purple-100">Overall Progress</span>
              <span className="font-black text-white">{coffeeStamps} / 6</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-black/25 overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FACC15] via-[#FB923C] to-[#F43F5E] transition-all duration-300"
                style={{ width: `${(coffeeStamps / 6) * 100}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCoffeeStamps((prev) => (prev < 6 ? prev + 1 : 5))}
            className="mt-4 w-full py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/25 text-xs font-black text-white transition-colors cursor-pointer relative z-10"
          >
            {coffeeStamps < 6 ? '+ Simulate Scan & Collect Stamp' : 'Reset Demo Stamp (5/6)'}
          </button>
        </div>

        {/* Right / Middle: Coffee & Specials Stamp Cards */}
        <div className="lg:col-span-7 space-y-4">
          {/* Coffee Stamp Card */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#F3EEFA] text-[#240B4C] flex items-center justify-center shrink-0">
                  <Coffee className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-black text-[#1E1548]">Coffee Stamp Card</h3>
                  <p className="text-[11px] sm:text-xs text-[#7B748C] mt-0.5">
                    Collect 6 stamps and get a free artisan brew!
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#FFF1F5] border border-[#FBCFE8] text-[#E11D48] text-[10px] sm:text-[11px] font-black shrink-0">
                Next: Free Coffee
              </span>
            </div>

            <div className="grid grid-cols-6 gap-2 sm:gap-3 pt-1">
              {[1, 2, 3, 4, 5, 6].map((slot) => {
                const filled = slot <= coffeeStamps;
                const isReward = slot === 6;
                return (
                  <div key={slot} className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
                        filled
                          ? 'bg-[#351256] text-white shadow-sm'
                          : isReward
                          ? 'bg-[#FFF5F8] border-2 border-dashed border-[#E11D48] text-[#E11D48]'
                          : 'bg-[#F3EEFA] text-[#C4B5FD]'
                      }`}
                    >
                      {isReward ? (
                        <Gift className="w-5 h-5" />
                      ) : (
                        <Coffee className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-black ${
                        isReward ? 'text-[#E11D48]' : 'text-[#6B657E]'
                      }`}
                    >
                      #{slot}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Specials Stamp Card */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF1F5] text-[#E11D48] flex items-center justify-center shrink-0">
                  <Utensils className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-black text-[#1E1548]">Specials Stamp Card</h3>
                  <p className="text-[11px] sm:text-xs text-[#7B748C] mt-0.5">
                    Collect 8 stamps and get 15% off your total!
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#F3EEFA] text-[#5844A8] text-[10px] sm:text-[11px] font-black shrink-0">
                {8 - specialsStamps} stamps remaining
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 pt-1">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((slot) => {
                const filled = slot <= specialsStamps;
                const isReward = slot === 8;
                return (
                  <div key={slot} className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all ${
                        filled
                          ? 'bg-[#351256] text-white shadow-sm'
                          : isReward
                          ? 'bg-[#FFF5F8] border-2 border-dashed border-[#E11D48] text-[#E11D48]'
                          : 'bg-[#F5F1FC] border border-[#EAE2FB]'
                      }`}
                    >
                      {filled ? (
                        <Utensils className="w-4 h-4" />
                      ) : isReward ? (
                        <Tag className="w-4 h-4" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-[#C4B5FD]" />
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-black ${
                        isReward ? 'text-[#E11D48]' : 'text-[#8C84A0]'
                      }`}
                    >
                      #{slot}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-black text-[#1E1548]">Recent Activity</h3>
          <button
            type="button"
            onClick={onViewAllActivity}
            className="text-xs font-black text-[#5844A8] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <span>&rarr;</span>
          </button>
        </div>

        <div className="divide-y divide-[#F4F0FA]">
          {[
            { title: 'Stamp collected – Coffee', date: '12 Apr, 2025 – 11:42 AM', type: 'coffee' },
            { title: 'Stamp collected – Main Course', date: '10 Apr, 2025 – 02:38 PM', type: 'food' },
            { title: 'Stamp collected – Coffee', date: '12 Apr, 2025 – 11:02 AM', type: 'coffee' },
            { title: 'Stamp collected – Main Course', date: '12 Apr, 2025 – 10:28 PM', type: 'food' }
          ].map((row, idx) => (
            <div key={idx} className="py-3 first:pt-1 last:pb-0 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    row.type === 'coffee'
                      ? 'bg-[#F3EEFA] text-[#351256]'
                      : 'bg-[#FFF1F5] text-[#E11D48]'
                  }`}
                >
                  {row.type === 'coffee' ? (
                    <Coffee className="w-4 h-4" />
                  ) : (
                    <Bell className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-black text-[#1E1548] truncate">
                    {row.title}
                  </div>
                  <div className="text-[11px] text-[#8C84A0]">{row.date}</div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#F3EEFA] text-[#5844A8] text-[11px] font-black shrink-0">
                +1 Stamp
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   2. LOYALTY TIERS ACROSS MERCHANTS (Matches Loyalty tier.png)
   Responsive across Mobile, Tablet, and Desktop
   ============================================================================ */
export interface LoyaltyTiersViewProps {
  onBack?: () => void;
  onOpenMerchantDetail: (merchant: CustomerMerchantProfile) => void;
}

export const LoyaltyTiersView: React.FC<LoyaltyTiersViewProps> = ({
  onBack,
  onOpenMerchantDetail
}) => {
  const tierCards = [
    {
      merchant: CUSTOMER_MERCHANTS[1], // Brew House
      displayName: 'Brew House',
      subtitle: 'Café & Restaurant',
      tier: 'VIP',
      tierStyle: 'bg-[#FEF9C3] border-[#FDE047] text-[#A16207]',
      points: '1,250',
      spend: '₹8,950',
      redeemed: 6
    },
    {
      merchant: CUSTOMER_MERCHANTS[3], // Laiback Cafe
      displayName: 'Laidback Cafe',
      subtitle: 'Café & Lounge',
      tier: 'VIP',
      tierStyle: 'bg-[#FEF9C3] border-[#FDE047] text-[#A16207]',
      points: '1,250',
      spend: '₹8,950',
      redeemed: 6
    },
    {
      merchant: CUSTOMER_MERCHANTS[0], // Sly Granny / Green House
      displayName: 'Sly Granny Café',
      subtitle: 'Café & Dining',
      tier: 'Silver',
      tierStyle: 'bg-slate-100 border-slate-200 text-slate-600',
      points: '1,250',
      spend: '₹8,950',
      redeemed: 6
    },
    {
      merchant: CUSTOMER_MERCHANTS[2], // Chill Cafe
      displayName: 'Chill Cafe',
      subtitle: 'Café & Bistro',
      tier: 'Bronze',
      tierStyle: 'bg-orange-50 border-orange-200 text-orange-700',
      points: '1,250',
      spend: '₹8,950',
      redeemed: 6
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-white border border-[#EFEAF7] flex items-center justify-center text-[#1E1548] shadow-2xs cursor-pointer hover:border-[#5844A8]/50 shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#240B4C] tracking-tight leading-tight">
              Your Tier in Different Merchants
            </h1>
            <p className="text-xs sm:text-sm text-[#7B748C] mt-0.5">
              Check your loyalty tier at each restaurant
            </p>
          </div>
        </div>
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#FFF9DB] border border-[#FDE68A] flex items-center justify-center text-amber-500 shrink-0 shadow-xs">
          <Crown className="w-6 h-6 fill-amber-400 text-amber-500" />
        </div>
      </div>

      {/* Gold Overall Tier Status Banner + Tier Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Overall Status Gold Card */}
        <div className="lg:col-span-6 bg-gradient-to-r from-[#FFF7C2] via-[#FFF1A8] to-[#FDE68A] rounded-3xl p-4 sm:p-5 border border-[#FCD34D]/60 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-black text-[#240B4C] leading-snug">
                Your Loyalty Across Merchants
              </h2>
              <p className="text-xs text-[#6B5A2E] font-medium mt-0.5">
                You are a member in 4 restaurants
              </p>
            </div>
          </div>

          <div className="border-l border-amber-700/15 pl-4 text-center shrink-0">
            <div className="text-[10px] font-bold text-[#6B5A2E] uppercase tracking-wider">
              Overall Tier Status
            </div>
            <div className="mt-1.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#EAB308] to-[#F59E0B] text-[#240B4C] font-black text-xs shadow-sm">
              <Crown className="w-3.5 h-3.5 fill-[#240B4C]" />
              <span>VIP</span>
            </div>
          </div>
        </div>

        {/* Tier Summary 2-Col Split Card */}
        <div className="lg:col-span-6 bg-white/95 rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-black text-[#240B4C]">Tier Summary</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 divide-x divide-[#F2ECF9]">
            <div className="space-y-2 pr-2">
              <div className="flex items-center justify-center gap-2">
                <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#F59E0B] to-[#FDE047] text-white flex items-center justify-center shadow-xs">
                  <Crown className="w-3.5 h-3.5 fill-white" />
                </span>
                <span className="text-sm font-black text-[#1E1548]">VIP</span>
              </div>
              <div className="space-y-1.5">
                {['Sly Granny Café', 'Chill Cafe'].map((name) => (
                  <div
                    key={name}
                    className="px-2.5 py-1.5 rounded-full bg-[#FAF8FF] border border-[#EFEAF7] text-[11px] font-bold text-[#240B4C] text-center truncate"
                  >
                    ☕ {name}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pl-3">
              <div className="flex items-center justify-center gap-2">
                <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-slate-400 to-slate-200 text-white flex items-center justify-center shadow-xs">
                  <Star className="w-3.5 h-3.5 fill-white" />
                </span>
                <span className="text-sm font-black text-[#1E1548]">Silver</span>
              </div>
              <div className="space-y-1.5">
                {['Brew House', 'Laiback Cafe'].map((name) => (
                  <div
                    key={name}
                    className="px-2.5 py-1.5 rounded-full bg-[#FAF8FF] border border-[#EFEAF7] text-[11px] font-bold text-[#240B4C] text-center truncate"
                  >
                    🍽 {name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Merchant Tier List Cards (1-col Mobile, 2-col Tablet/Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {tierCards.map((item) => (
          <button
            key={item.displayName}
            type="button"
            onClick={() => onOpenMerchantDetail(item.merchant)}
            className="bg-white hover:bg-[#FDFBFF] rounded-3xl p-3.5 sm:p-4 border border-[#EFEAF7] hover:border-[#C4B5FD] shadow-2xs hover:shadow-md transition-all flex items-center justify-between gap-3 text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-20 h-16 sm:w-24 sm:h-18 rounded-2xl overflow-hidden relative shrink-0 border border-[#EFEAF7]">
                <img
                  src={item.merchant.thumbImage}
                  alt={item.displayName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/35 flex items-center justify-center px-1">
                  <span className="text-[10px] font-black text-white text-center leading-tight drop-shadow">
                    {item.displayName}
                  </span>
                </div>
              </div>

              <div className="min-w-0">
                <h4 className="text-sm font-black text-[#240B4C] truncate group-hover:text-[#5844A8]">
                  {item.displayName}
                </h4>
                <p className="text-[11px] text-[#7B748C] truncate">{item.subtitle}</p>
                <span
                  className={`mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-black ${item.tierStyle}`}
                >
                  <Award className="w-3 h-3" />
                  {item.tier}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="text-right space-y-1">
                <div className="text-[11px] text-[#7B748C] flex items-center justify-end gap-1.5">
                  <span>⭐ Tier Points</span>
                  <strong className="text-[#1E1548] font-black">{item.points}</strong>
                </div>
                <div className="text-[11px] text-[#7B748C] flex items-center justify-end gap-1.5">
                  <span>💼 Total Spend</span>
                  <strong className="text-[#1E1548] font-black">{item.spend}</strong>
                </div>
                <div className="text-[11px] text-[#7B748C] flex items-center justify-end gap-1.5">
                  <span>🎁 Offers Redeemed</span>
                  <strong className="text-[#1E1548] font-black">{item.redeemed}</strong>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#9890A8] group-hover:text-[#5844A8] group-hover:translate-x-0.5 transition-all" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

/* ============================================================================
   3. SINGLE MERCHANT DETAIL VIEW (Matches Single merchant wise.png)
   Responsive across Mobile, Tablet, and Desktop
   ============================================================================ */
export interface SingleMerchantDetailViewProps {
  merchant: CustomerMerchantProfile;
  onSelectMerchant: (merchant: CustomerMerchantProfile) => void;
  onOpenTiers: () => void;
  onOpenStamps: () => void;
  onOpenWalletHistory: (merchant: CustomerMerchantProfile) => void;
  onOpenOffers: () => void;
  onOpenCafeHome: (merchant: CustomerMerchantProfile) => void;
  onBack?: () => void;
}

export const SingleMerchantDetailView: React.FC<SingleMerchantDetailViewProps> = ({
  merchant,
  onSelectMerchant,
  onOpenTiers,
  onOpenStamps,
  onOpenWalletHistory,
  onOpenOffers,
  onOpenCafeHome,
  onBack
}) => {
  const [favorited, setFavorited] = useState(false);

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
      {/* Top Switcher Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white border border-[#EFEAF7] flex items-center justify-center text-[#1E1548] shadow-2xs cursor-pointer hover:border-[#5844A8]/50 shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        {CUSTOMER_MERCHANTS.map((m) => {
          const active = m.id === merchant.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelectMerchant(m)}
              className={`px-3.5 py-2 rounded-full text-xs font-black whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border ${
                active
                  ? 'bg-[#DB006A] text-white border-[#DB006A] shadow-sm'
                  : 'bg-white text-[#240B4C] border-[#EFEAF7] hover:border-[#C4B5FD]'
              }`}
            >
              <Coffee className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-[#5844A8]'}`} />
              <span>{m.name}</span>
            </button>
          );
        })}
      </div>

      {/* Hero Photo Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg h-48 sm:h-60 lg:h-68 border border-white">
        <img
          src={merchant.heroImage}
          alt={merchant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />

        {/* Top-Right Pill + Heart */}
        <div className="absolute top-3.5 right-3.5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenCafeHome(merchant)}
            className="px-3 py-1.5 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-md text-white text-[11px] font-black flex items-center gap-1.5 border border-white/20 cursor-pointer transition"
          >
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Open {merchant.name}</span>
          </button>
          <button
            type="button"
            onClick={() => setFavorited((p) => !p)}
            className="w-9 h-9 rounded-full bg-black/45 backdrop-blur-md border border-white/25 flex items-center justify-center text-white cursor-pointer hover:bg-black/65 transition"
          >
            <Heart
              className={`w-4 h-4 ${favorited ? 'text-rose-400 fill-rose-400' : 'text-white'}`}
            />
          </button>
        </div>

        {/* Bottom-Left Store Badge + Name */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3.5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#1A120B]/90 border-2 border-amber-400/70 p-2 flex flex-col items-center justify-center text-center shadow-lg shrink-0">
            <Coffee className="w-5 h-5 text-amber-400 mb-0.5" />
            <span className="text-[8px] font-black text-amber-100 uppercase leading-tight line-clamp-2">
              {merchant.name}
            </span>
          </div>
          <div className="pb-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight truncate">
              {merchant.name}
            </h1>
            <p className="text-xs sm:text-sm text-white/80 font-medium">{merchant.category}</p>
          </div>
        </div>
      </div>

      {/* Your Tier Bar */}
      <button
        type="button"
        onClick={onOpenTiers}
        className="w-full bg-white hover:bg-[#FDFBFF] rounded-3xl p-4 border border-[#EFEAF7] shadow-2xs flex items-center justify-between gap-3 cursor-pointer transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#2B1B0E] via-[#4A2E14] to-[#1A0E06] border-2 border-amber-400 flex flex-col items-center justify-center text-amber-300 shadow-sm shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-[8px] font-black leading-none mt-0.5">{merchant.tier}</span>
          </div>
          <div className="text-left">
            <div className="text-[11px] font-semibold text-[#7B748C]">Your Tier</div>
            <div className="text-sm sm:text-base font-black text-[#DB006A]">
              {merchant.tier} Member
            </div>
          </div>
        </div>

        <div className="px-3.5 py-2 rounded-full bg-[#FFFDF0] border border-[#FDE68A] text-xs font-black text-[#1E1548] flex items-center gap-1.5 group-hover:border-amber-400 transition">
          <span className="w-5 h-5 rounded-full bg-amber-400 text-white flex items-center justify-center text-[10px]">
            ★
          </span>
          <span>1,250 Tier Points</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#7B748C]" />
        </div>
      </button>

      {/* 5 Metric Tiles Row */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 sm:gap-3">
        {[
          {
            label: 'Wallet Balance',
            val: `₹${merchant.walletBalance.toLocaleString('en-IN')}`,
            color: 'text-[#DB006A]',
            icon: <Wallet className="w-4 h-4 text-[#DB006A]" />,
            onClick: () => onOpenWalletHistory(merchant)
          },
          {
            label: 'Total Spend',
            val: `₹${merchant.totalSpend.toLocaleString('en-IN')}`,
            color: 'text-[#DB006A]',
            icon: <Sparkles className="w-4 h-4 text-[#DB006A]" />,
            onClick: () => onOpenWalletHistory(merchant)
          },
          {
            label: 'Offers Redeemed',
            val: `${merchant.offersRedeemed}`,
            color: 'text-[#DB006A]',
            icon: <Gift className="w-4 h-4 text-[#DB006A]" />,
            onClick: onOpenOffers
          },
          {
            label: 'Active Offers',
            val: `${merchant.activeOffersCount}`,
            color: 'text-[#059669]',
            icon: <Tag className="w-4 h-4 text-[#059669]" />,
            onClick: onOpenOffers
          },
          {
            label: 'Expired Offers',
            val: `${merchant.expiredOffersCount}`,
            color: 'text-[#DB006A]',
            icon: <Clock className="w-4 h-4 text-[#DB006A]" />,
            onClick: onOpenOffers
          }
        ].map((metric) => (
          <button
            key={metric.label}
            type="button"
            onClick={metric.onClick}
            className="bg-white hover:bg-[#FDFBFF] rounded-2xl p-3 border border-[#EFEAF7] hover:border-[#C4B5FD] shadow-2xs flex flex-col items-center justify-center text-center gap-1 cursor-pointer transition-all"
          >
            <div>{metric.icon}</div>
            <div className="text-[10px] font-semibold text-[#7B748C] leading-tight">
              {metric.label}
            </div>
            <div className={`text-sm font-black ${metric.color}`}>{metric.val}</div>
          </button>
        ))}
      </div>

      {/* Bottom 2-Column Responsive Grid: Next Redemption + Wallet History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Next Redemption Stamp Progress Card */}
        <div
          onClick={onOpenStamps}
          className="lg:col-span-5 bg-white hover:bg-[#FDFBFF] rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] hover:border-[#F9A8D4] shadow-2xs space-y-4 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-full bg-[#FFF1F5] text-[#DB006A] flex items-center justify-center shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black text-[#1E1548]">Next Redemption</div>
                <div className="text-[11px] text-[#7B748C]">
                  {Math.max(1, merchant.stampsTotal - merchant.stampsCollected)} stamps away to redeem
                </div>
                <div className="text-sm font-black text-[#DB006A] mt-0.5 truncate">
                  Free Café Coffee
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&auto=format&fit=crop&q=80"
                alt="Free Coffee"
                className="w-14 h-12 rounded-xl object-cover shadow-xs"
              />
              <ChevronRight className="w-4 h-4 text-[#9890A8]" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#F4F0FA]">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: merchant.stampsTotal }).map((_, i) => {
                const filled = i < merchant.stampsCollected;
                return (
                  <span
                    key={i}
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      filled
                        ? 'bg-[#DB006A] text-white shadow-2xs'
                        : 'bg-white border-2 border-[#FBCFE8]'
                    }`}
                  >
                    {filled && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </span>
                );
              })}
            </div>
            <span className="px-3 py-1 rounded-full bg-[#FFF1F5] text-[#DB006A] text-[11px] font-black shrink-0">
              {merchant.stampsCollected} / {merchant.stampsTotal} Stamps
            </span>
          </div>
        </div>

        {/* Wallet History Preview Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-[#DB006A]" />
              <h3 className="text-sm sm:text-base font-black text-[#1E1548]">Wallet History</h3>
            </div>
            <button
              type="button"
              onClick={() => onOpenWalletHistory(merchant)}
              className="text-xs font-black text-[#5844A8] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#F4F0FA]">
            {[
              {
                title: 'Offer Redemption',
                sub: 'Free Coffee (6 Visits)',
                amount: '+ ₹100',
                date: '12 Oct 2026, 03:10 PM',
                isGift: true
              },
              {
                title: 'Cashback Earned',
                sub: 'On Order #BH78452',
                amount: '+ ₹120',
                date: '12 Oct 2026, 03:05 PM',
                isGift: false
              },
              {
                title: 'Cashback Earned',
                sub: 'On Order #BH78419',
                amount: '+ ₹80',
                date: '09 Oct 2026, 10:45 AM',
                isGift: false
              }
            ].map((tx, idx) => (
              <div key={idx} className="py-2.5 first:pt-1 last:pb-0 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      tx.isGift
                        ? 'bg-[#F3EEFA] text-[#7C3AED]'
                        : 'bg-[#ECFDF5] text-[#059669]'
                    }`}
                  >
                    {tx.isGift ? <Gift className="w-4 h-4" /> : <span className="font-black text-base">+</span>}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-black text-[#1E1548] truncate">
                      {tx.title}
                    </div>
                    <div className="text-[11px] text-[#8C84A0] truncate">{tx.sub}</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs sm:text-sm font-black text-[#059669]">{tx.amount}</div>
                  <div className="text-[10px] text-[#9890A8]">{tx.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   4. MERCHANT-WISE WALLET HISTORY (Matches wallet History.png)
   Responsive across Mobile, Tablet, and Desktop
   ============================================================================ */
export interface MerchantWalletHistoryViewProps {
  initialMerchant: CustomerMerchantProfile;
  onBack?: () => void;
  onOpenStamps: () => void;
}

export const MerchantWalletHistoryView: React.FC<MerchantWalletHistoryViewProps> = ({
  initialMerchant,
  onBack,
  onOpenStamps
}) => {
  const [activeMerchant, setActiveMerchant] = useState<CustomerMerchantProfile>(initialMerchant);
  const [txFilter, setTxFilter] = useState<'All' | 'Cashback' | 'Stamps' | 'Redeemed'>('All');
  const [period, setPeriod] = useState<'This Month' | 'Last 3 Months' | 'All Time'>('This Month');

  const transactions = [
    {
      id: 'tx1',
      type: 'Cashback' as const,
      title: 'Cashback Earned',
      sub: 'Order #BH1246 • 09 Oct 2026, 10:45 AM',
      badge: '+ ₹80',
      badgeStyle: 'bg-[#ECFDF5] text-[#059669]',
      iconBg: 'bg-[#ECFDF5] text-[#059669]',
      icon: <Wallet className="w-4 h-4" />
    },
    {
      id: 'tx2',
      type: 'Stamps' as const,
      title: 'Stamp Earned',
      sub: 'Order #BH1246 • 09 Oct 2026, 10:45 AM',
      badge: '+ 1 Stamp',
      badgeStyle: 'bg-[#F3EEFA] text-[#7C3AED]',
      iconBg: 'bg-[#F3EEFA] text-[#7C3AED]',
      icon: <Award className="w-4 h-4" />
    },
    {
      id: 'tx3',
      type: 'Redeemed' as const,
      title: 'Free Coffee Redeemed',
      sub: 'Reward: Free Coffee (1 Cup) • 07 Oct 2026, 07:20 PM',
      badge: '- 8 Stamps',
      badgeStyle: 'bg-[#FFF1F2] text-[#E11D48]',
      iconBg: 'bg-[#FFF1F2] text-[#E11D48]',
      icon: <Coffee className="w-4 h-4" />
    },
    {
      id: 'tx4',
      type: 'Cashback' as const,
      title: 'Cashback Earned',
      sub: 'Order #BH1198 • 04 Oct 2026, 09:30 AM',
      badge: '+ ₹120',
      badgeStyle: 'bg-[#ECFDF5] text-[#059669]',
      iconBg: 'bg-[#ECFDF5] text-[#059669]',
      icon: <Wallet className="w-4 h-4" />
    },
    {
      id: 'tx5',
      type: 'Stamps' as const,
      title: 'Stamp Earned',
      sub: 'Order #BH1198 • 04 Oct 2026, 09:30 AM',
      badge: '+ 2 stamps',
      badgeStyle: 'bg-[#F3EEFA] text-[#7C3AED]',
      iconBg: 'bg-[#F3EEFA] text-[#7C3AED]',
      icon: <Award className="w-4 h-4" />
    }
  ];

  const visibleTx = transactions.filter((t) => txFilter === 'All' || t.type === txFilter);

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white border border-[#EFEAF7] flex items-center justify-center text-[#1E1548] shadow-2xs cursor-pointer hover:border-[#5844A8]/50 shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <div className="w-9 h-9 rounded-full bg-[#DCFCE7] text-[#059669] flex items-center justify-center shrink-0">
          <Wallet className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl font-black text-[#1E1548] tracking-tight truncate">
            Wallet <span className="font-semibold text-[#5B546E]">(Merchant Wise)</span>
          </h1>
          <p className="text-xs text-[#7B748C]">
            Your rewards, cashback, stamps and redemptions by merchant
          </p>
        </div>
      </div>

      {/* Horizontal Merchant Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {CUSTOMER_MERCHANTS.map((m) => {
          const active = m.id === activeMerchant.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setActiveMerchant(m)}
              className={`pl-1.5 pr-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer shrink-0 border ${
                active
                  ? 'bg-[#0D8A5A] text-white border-[#0D8A5A] shadow-sm'
                  : 'bg-white text-[#1E1548] border-[#EFEAF7] hover:border-[#0D8A5A]/40'
              }`}
            >
              <img
                src={m.thumbImage}
                alt={m.name}
                className="w-6 h-6 rounded-full object-cover border border-white/60"
              />
              <span>{m.name}</span>
            </button>
          );
        })}
      </div>

      {/* Emerald Green Merchant Hero Card */}
      <div className="bg-gradient-to-r from-[#047857] via-[#0D8A5A] to-[#10B981] rounded-3xl p-4 sm:p-5 text-white shadow-lg shadow-emerald-950/15 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <img
            src={activeMerchant.thumbImage}
            alt={activeMerchant.name}
            className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 border-white/30 shadow-sm shrink-0"
          />
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-black truncate">{activeMerchant.name}</h2>
            <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full bg-white text-[#047857] text-[10px] font-black">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              Active
            </span>
            <div className="text-[11px] text-emerald-50/90 font-medium mt-1 truncate">
              {activeMerchant.category}
            </div>
          </div>
        </div>

        <div className="border-l border-white/25 pl-4 sm:pl-6 text-center shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-amber-300/50 flex flex-col items-center justify-center">
            <Crown className="w-5 h-5 text-amber-300 fill-amber-300" />
            <span className="text-[10px] font-black text-amber-200 leading-none mt-0.5">
              {activeMerchant.tier}
            </span>
            <span className="text-[8px] font-bold text-emerald-100 uppercase">Tier</span>
          </div>
        </div>
      </div>

      {/* Wallet Summary Header + 4 KPI Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#0D8A5A] text-white flex items-center justify-center shrink-0">
              <Wallet className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm sm:text-base font-black text-[#1E1548] truncate">
              Wallet Summary – {activeMerchant.name}
            </h3>
          </div>

          <button
            type="button"
            onClick={() =>
              setPeriod((p) =>
                p === 'This Month' ? 'Last 3 Months' : p === 'Last 3 Months' ? 'All Time' : 'This Month'
              )
            }
            className="px-3 py-1.5 rounded-full bg-white border border-[#E5DEF5] text-[11px] font-bold text-[#1E1548] flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
          >
            <Calendar className="w-3.5 h-3.5 text-[#5844A8]" />
            <span>{period}</span>
            <ChevronDown className="w-3 h-3 text-[#8C84A0]" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              val: `₹${activeMerchant.walletBalance.toLocaleString('en-IN')}`,
              label: 'Wallet Balance',
              iconBg: 'bg-[#FFF1F5] text-[#E11D48]',
              icon: <Wallet className="w-4 h-4" />
            },
            {
              val: '₹320',
              label: 'Cashback Earned',
              iconBg: 'bg-[#F3EEFA] text-[#7C3AED]',
              icon: <Sparkles className="w-4 h-4" />
            },
            {
              val: '8',
              label: 'Stamps Earned',
              iconBg: 'bg-[#F3EEFA] text-[#5844A8]',
              icon: <Award className="w-4 h-4" />
            },
            {
              val: '2',
              label: 'Free Coffee Redeemed',
              iconBg: 'bg-[#FFF1F5] text-[#E11D48]',
              icon: <Gift className="w-4 h-4" />
            }
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="bg-white rounded-2xl p-3.5 sm:p-4 border border-[#EFEAF7] shadow-2xs flex flex-col items-center text-center gap-1.5"
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${kpi.iconBg}`}>
                {kpi.icon}
              </div>
              <div className="text-lg font-black text-[#1E1548] leading-tight">{kpi.val}</div>
              <div className="text-[11px] text-[#7B748C] font-medium leading-tight">{kpi.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {(
          [
            { id: 'All', label: 'All Transactions' },
            { id: 'Cashback', label: 'Cashback' },
            { id: 'Stamps', label: 'Stamps' },
            { id: 'Redeemed', label: 'Redeemed' }
          ] as const
        ).map((tab) => {
          const active = txFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTxFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                active
                  ? 'bg-[#0D8A5A] text-white border-[#0D8A5A] shadow-sm'
                  : 'bg-white text-[#1E1548] border-[#EFEAF7] hover:border-[#0D8A5A]/40'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Transaction History List */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3">
        <h3 className="text-sm sm:text-base font-black text-[#1E1548]">
          Transaction History – {activeMerchant.name}
        </h3>

        <div className="divide-y divide-[#F4F0FA]">
          {visibleTx.map((tx) => (
            <div key={tx.id} className="py-3 first:pt-1 last:pb-0 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tx.iconBg}`}>
                  {tx.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-black text-[#1E1548] truncate">
                    {tx.title}
                  </div>
                  <div className="text-[11px] text-[#8C84A0] truncate">{tx.sub}</div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black shrink-0 ${tx.badgeStyle}`}>
                {tx.badge}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Stamp Progress Card */}
      <div
        onClick={onOpenStamps}
        className="bg-white hover:bg-[#FDFBFF] rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] hover:border-[#0D8A5A]/40 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-all"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] border border-amber-200 flex items-center justify-center text-2xl shrink-0">
            ☕
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-black text-[#1E1548] truncate">
              Stamp Progress – {activeMerchant.name}
            </h4>
            <div className="text-xs font-black text-[#7C3AED] mt-0.5">8 / 10 Stamps</div>
            <div className="flex items-center gap-1 mt-2">
              {Array.from({ length: 10 }).map((_, idx) => (
                <span
                  key={idx}
                  className={`w-3.5 h-5 rounded-full flex items-center justify-center text-[8px] ${
                    idx < 8
                      ? 'bg-[#0D8A5A] text-white'
                      : 'bg-[#F3F4F6] border border-[#E5E7EB]'
                  }`}
                >
                  {idx < 8 ? '✓' : ''}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="px-3.5 py-2.5 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center gap-2.5 shrink-0">
          <Gift className="w-5 h-5 text-[#0D8A5A] shrink-0" />
          <span className="text-xs font-black text-[#047857] leading-snug max-w-[140px]">
            2 Stamps Away to Redeem Free Coffee
          </span>
        </div>
      </div>
    </div>
  );
};
