import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Coffee,
  CreditCard,
  Crown,
  Gift,
  QrCode,
  Sparkles,
  Star,
  Tag,
  Trophy,
  Utensils,
  X,
  XCircle,
  Zap
} from 'lucide-react';

export type OfferCardVariant =
  | 'stamp_teal'
  | 'coupon_purple'
  | 'coupon_detailed'
  | 'combo_orange'
  | 'gift_wrap';

export interface CustomerOfferItem {
  id: string;
  merchantName: string;
  title: string;
  subtitle: string;
  badgeText: string;
  validTill: string;
  status: 'active' | 'expired' | 'ready';
  dayScope: 'Weekdays' | 'Weekends' | 'All Days';
  timeScope: 'All Day' | 'Morning' | 'Afternoon' | 'Evening';
  cardTint: string;
  image: string;
  variant: OfferCardVariant;
  code: string;
  stampsProgress?: { current: number; total: number };
  discountHighlight?: string;
}

export const CUSTOMER_OFFERS_DATA: CustomerOfferItem[] = [
  {
    id: 'offer-bogo-pizza',
    merchantName: 'Sly Granny Cafe',
    title: 'Buy 1 Get 1 Free',
    subtitle: 'Buy any pizza and get another one free.',
    badgeText: 'Active',
    validTill: '30 Apr 2026',
    status: 'active',
    dayScope: 'Weekdays',
    timeScope: 'All Day',
    cardTint: 'bg-[#FFFCE8] border-[#FEF08A]',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&auto=format&fit=crop&q=80',
    variant: 'coupon_detailed',
    code: 'SGC-7845-3210-9876',
    discountHighlight: '15% OFF'
  },
  {
    id: 'offer-free-coffee',
    merchantName: 'Sly Granny Cafe',
    title: 'Free Coffee',
    subtitle: 'Collect 5 stamps & get a Free Coffee.',
    badgeText: 'Ready to Redeem',
    validTill: '30 Jun 2026',
    status: 'ready',
    dayScope: 'All Days',
    timeScope: 'All Day',
    cardTint: 'bg-[#ECFDF5] border-[#BBF7D0]',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&auto=format&fit=crop&q=80',
    variant: 'stamp_teal',
    code: 'WSC-5510-8842-1920',
    stampsProgress: { current: 5, total: 5 },
    discountHighlight: 'Free Cold Coffee'
  },
  {
    id: 'offer-coffee-stamp',
    merchantName: 'Sly Granny Cafe',
    title: 'Sly Granny Coffee Stamp',
    subtitle: 'Have 4 coffees? Get the 5th one free!',
    badgeText: 'Active',
    validTill: '30 Apr 2026',
    status: 'active',
    dayScope: 'Weekdays',
    timeScope: 'Morning',
    cardTint: 'bg-[#F0F7FF] border-[#DBEAFE]',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&auto=format&fit=crop&q=80',
    variant: 'coupon_purple',
    code: 'SGC-7845-3210-9876',
    stampsProgress: { current: 4, total: 5 },
    discountHighlight: '15% OFF'
  },
  {
    id: 'offer-combo-burger',
    merchantName: 'Sly Granny Cafe',
    title: 'Combo Offer – 15% OFF',
    subtitle: 'Flat 15% OFF on Burger + Coke Combo.',
    badgeText: 'Active',
    validTill: '30 Jun 2026',
    status: 'active',
    dayScope: 'Weekdays',
    timeScope: 'Afternoon',
    cardTint: 'bg-[#FFF7ED] border-[#FED7AA]',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80',
    variant: 'combo_orange',
    code: 'SGC-7845-3210-9876',
    discountHighlight: '15% OFF'
  },
  {
    id: 'offer-wrap-gift',
    merchantName: 'Wrap City',
    title: 'Wrap City Gift Card',
    subtitle: 'A gift for you! Exclusive partner dining pass.',
    badgeText: 'Ready to Redeem',
    validTill: '30 Jun 2026',
    status: 'ready',
    dayScope: 'All Days',
    timeScope: 'All Day',
    cardTint: 'bg-[#F5F0FF] border-[#E9D5FF]',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&auto=format&fit=crop&q=80',
    variant: 'gift_wrap',
    code: 'WPC-7845-3210-9876',
    discountHighlight: 'Gift Card'
  },
  {
    id: 'offer-expired-latte',
    merchantName: 'Sly Granny Cafe',
    title: 'Flat 25% OFF Breakfast',
    subtitle: 'Valid on artisan sourdough & morning lattes.',
    badgeText: 'Expired',
    validTill: '15 Feb 2026',
    status: 'expired',
    dayScope: 'Weekends',
    timeScope: 'Morning',
    cardTint: 'bg-[#F8F7FA] border-[#E5E7EB]',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&auto=format&fit=crop&q=80',
    variant: 'coupon_purple',
    code: 'SGC-1022-4410-9910',
    discountHighlight: '25% OFF'
  }
];

/* Crisp Reusable CSS Barcode Strip */
const BarcodeVisual: React.FC<{ code?: string }> = ({ code }) => {
  const widths = [3, 1, 2, 1, 4, 1, 2, 2, 1, 3, 1, 1, 3, 2, 1, 4, 1, 2, 1, 3, 1, 2, 1, 3, 2, 1, 2, 4, 1, 2, 1, 3];
  return (
    <div className="bg-white rounded-2xl px-4 py-3.5 shadow-sm flex flex-col items-center justify-center">
      <div className="flex items-stretch justify-center gap-[2.5px] h-14 w-full overflow-hidden">
        {widths.map((w, idx) => (
          <span
            key={idx}
            className="bg-[#111827] rounded-[0.5px] inline-block"
            style={{ width: `${w * 2.2}px` }}
          />
        ))}
      </div>
      {code && (
        <div className="text-[11px] sm:text-xs font-black tracking-[0.22em] text-[#1E1548] mt-2 font-mono">
          {code}
        </div>
      )}
    </div>
  );
};

/* ============================================================================
   OFFER PASS DETAIL VIEW (Matches offer card.png through offer card-4.png)
   Responsive across Mobile, Tablet, and Desktop
   ============================================================================ */
export interface CustomerOfferPassViewProps {
  offer: CustomerOfferItem;
  onBack: () => void;
  onNotify: (msg: string) => void;
}

export const CustomerOfferPassView: React.FC<CustomerOfferPassViewProps> = ({
  offer,
  onBack,
  onNotify
}) => {
  const [variant, setVariant] = useState<OfferCardVariant>(offer.variant);
  const [showQrSheet, setShowQrSheet] = useState(false);

  const variantTabs: Array<{ id: OfferCardVariant; label: string }> = [
    { id: 'stamp_teal', label: 'Stamp Card' },
    { id: 'coupon_purple', label: 'Discount Pass' },
    { id: 'coupon_detailed', label: 'Full Details' },
    { id: 'combo_orange', label: 'Combo Offer' },
    { id: 'gift_wrap', label: 'Gift Card' }
  ];

  const ctaColor =
    variant === 'stamp_teal'
      ? 'bg-[#008C99] hover:bg-[#00737E]'
      : variant === 'combo_orange'
      ? 'bg-[#EC5800] hover:bg-[#D44D00]'
      : 'bg-[#5B218D] hover:bg-[#471770]';

  return (
    <div className="max-w-lg mx-auto space-y-4 sm:space-y-5 animate-in fade-in duration-200">
      {/* Top Bar + Greeting */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white border border-[#EFEAF7] flex items-center justify-center text-[#1E1548] shadow-2xs cursor-pointer hover:border-[#58258B] transition shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1E1548] leading-tight flex items-center gap-1.5">
              <span>Hi Salena!</span>
              <span>👋</span>
            </h1>
            <p className="text-xs text-[#7B748C] font-medium">Your Loyalty Rewards</p>
          </div>
        </div>
      </div>

      {/* Card Style Switcher Pills (allows previewing all 5 TapCard passes smoothly) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {variantTabs.map((t) => {
          const active = variant === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setVariant(t.id)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap border transition-all cursor-pointer shrink-0 ${
                active
                  ? 'bg-[#2F0E45] text-white border-[#2F0E45] shadow-xs'
                  : 'bg-white text-[#5B546E] border-[#EFEAF7] hover:border-[#C4B5FD]'
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ─── PASS 1: TEAL LOYALTY PROGRAM STAMP CARD (offer card.png) ─── */}
      {variant === 'stamp_teal' && (
        <div className="rounded-[32px] p-5 sm:p-6 bg-gradient-to-b from-[#008E9B] via-[#008291] to-[#007786] text-white shadow-2xl shadow-teal-950/25 space-y-5">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=120&auto=format&fit=crop&q=80"
              alt="Coffee"
              className="w-10 h-10 rounded-full object-cover border-2 border-white/40"
            />
            <span className="text-base font-black tracking-tight">Wave Specialty Coffee</span>
          </div>

          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Loyalty Program</h2>
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/20 items-center">
            <div>
              <div className="text-[11px] text-teal-100">Stamps until reward</div>
              <div className="text-base font-black mt-0.5">1 stamp</div>
            </div>
            <div className="border-l border-white/20 pl-3 flex items-center justify-between gap-2">
              <div>
                <div className="text-[11px] text-teal-100">Available rewards</div>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md bg-[#FACC15] text-[#1E1548] text-[11px] font-black">
                  Free Cold Coffee
                </span>
              </div>
              <span className="text-2xl">🧋</span>
            </div>
          </div>

          <BarcodeVisual />

          {/* 3x2 Coffee Stamp Cups */}
          <div className="grid grid-cols-3 gap-4 py-2 text-center">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-3xl shadow-sm">
                  ☕
                </div>
              </div>
            ))}
            <div className="flex flex-col items-center opacity-45">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-dashed border-white/40 flex items-center justify-center text-3xl">
                ☕
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border-2 border-amber-300 flex flex-col items-center justify-center shadow-md relative">
                <span className="text-2xl leading-none">🧋</span>
                <span className="text-[8px] font-black bg-[#FACC15] text-[#1E1548] px-1.5 rounded -mt-1">
                  FREE
                </span>
              </div>
            </div>
          </div>

          <div className="text-center text-xs font-bold text-teal-100/90 pt-1">
            Powered by TapCard
          </div>
        </div>
      )}

      {/* ─── PASS 2: PURPLE DISCOUNT COUPON (offer card-1.png) ─── */}
      {variant === 'coupon_purple' && (
        <div className="rounded-[32px] bg-gradient-to-b from-[#4C0D78] via-[#571186] to-[#3B0861] text-white shadow-2xl shadow-purple-950/30 overflow-hidden relative">
          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-sm font-black">
              <Coffee className="w-5 h-5" />
              <span className="opacity-50">|</span>
              <span>Sly Granny <span className="italic font-serif font-normal">Café</span></span>
            </div>

            <div className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-7 space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-[#E9D5FF] text-[#3B0861] text-[10px] font-black tracking-wider uppercase">
                  Discount Coupon
                </span>
                <div className="flex items-baseline gap-1.5 pt-1">
                  <span className="text-4xl sm:text-5xl font-black text-[#FACC15] leading-none">
                    15%
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-white leading-none">
                    OFF
                  </span>
                </div>
                <p className="text-xs font-bold text-purple-100">On All Drinks &amp; Food Items</p>
              </div>
              <div className="col-span-5 flex justify-end">
                <img
                  src="https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&auto=format&fit=crop&q=80"
                  alt="Latte"
                  className="w-28 h-28 rounded-full object-cover border-4 border-white/20 shadow-xl"
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <span className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-100" />
              </span>
              <div>
                <div className="text-[10px] text-purple-200">Valid till</div>
                <div className="text-xs font-black">30 June 2026</div>
              </div>
            </div>
          </div>

          {/* Ticket Notch Divider */}
          <div className="relative flex items-center px-4">
            <span className="w-6 h-6 rounded-full bg-[#FAF8FF] -ml-7 shrink-0" />
            <div className="flex-1 border-t-2 border-dashed border-white/25 mx-2" />
            <span className="w-6 h-6 rounded-full bg-[#FAF8FF] -mr-7 shrink-0" />
          </div>

          <div className="p-5 sm:p-6 space-y-4">
            <BarcodeVisual code={offer.code} />
            <div className="text-center text-xs font-semibold text-purple-200 flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5 text-purple-200" />
              <span>Powered by TapCard</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── PASS 3: DETAILED PURPLE COUPON + OFFER DETAILS (offer card-2.png) ─── */}
      {variant === 'coupon_detailed' && (
        <div className="rounded-[32px] bg-gradient-to-b from-[#55118A] via-[#4B0E7B] to-[#36075B] text-white shadow-2xl shadow-purple-950/30 overflow-hidden relative border-2 border-[#7C3AED]/40">
          {/* Top-right Gold Star Bookmark */}
          <div className="absolute top-0 right-5 w-10 h-13 bg-gradient-to-b from-[#FACC15] to-[#EAB308] rounded-b-lg flex items-center justify-center shadow-md z-10">
            <Star className="w-5 h-5 text-white fill-white/30" />
          </div>

          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-sm font-black">
              <Coffee className="w-5 h-5" />
              <span className="opacity-50">|</span>
              <span>Sly Granny <span className="italic font-serif font-normal">Café</span></span>
            </div>

            <div className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-7 space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-white/15 border border-white/25 text-white text-[10px] font-black tracking-wider uppercase">
                  Discount Coupon
                </span>
                <div className="flex items-baseline gap-1.5 pt-1">
                  <span className="text-4xl font-black text-[#FACC15] leading-none">15%</span>
                  <span className="text-2xl font-black text-white leading-none">OFF</span>
                </div>
                <p className="text-xs font-bold text-purple-100">On All Drinks &amp; Food Items</p>
              </div>
              <div className="col-span-5 flex justify-end">
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=80"
                  alt="Burger & Drink"
                  className="w-28 h-24 rounded-2xl object-cover border-2 border-white/20 shadow-xl"
                />
              </div>
            </div>

            {/* Meta Box */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-white/10 border border-white/15 text-xs">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#FACC15] shrink-0" />
                <div>
                  <div className="text-[10px] text-purple-200">Offer Type</div>
                  <div className="font-black">Discount</div>
                </div>
              </div>
              <div className="flex items-center gap-2 border-l border-white/15 pl-3">
                <Calendar className="w-4 h-4 text-[#FACC15] shrink-0" />
                <div>
                  <div className="text-[10px] text-purple-200">Valid Till</div>
                  <div className="font-black">30 June 2026</div>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Notch Divider */}
          <div className="relative flex items-center px-4">
            <span className="w-6 h-6 rounded-full bg-[#FAF8FF] -ml-7 shrink-0" />
            <div className="flex-1 border-t-2 border-dashed border-white/25 mx-2" />
            <span className="w-6 h-6 rounded-full bg-[#FAF8FF] -mr-7 shrink-0" />
          </div>

          <div className="p-5 sm:p-6 space-y-4">
            <BarcodeVisual code={offer.code} />

            {/* Offer Details Checklist */}
            <div className="space-y-2 pt-1">
              <div className="text-xs font-black flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FACC15]" />
                <span>Offer Details</span>
              </div>
              <ul className="space-y-1.5 text-xs text-purple-100/90">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#FACC15] shrink-0 mt-0.5" />
                  <span>Get 15% off on all drinks &amp; food items.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#FACC15] shrink-0 mt-0.5" />
                  <span>Valid for dine-in and takeaway.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#FACC15] shrink-0 mt-0.5" />
                  <span>Not applicable with other ongoing offers.</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => onNotify('Offer pass added to your Loyaltics Wallet!')}
              className="w-full h-12 rounded-full bg-white hover:bg-purple-50 text-[#240B4C] text-sm font-black flex items-center justify-center gap-2 shadow-lg cursor-pointer transition active:scale-[0.99]"
            >
              <CreditCard className="w-4 h-4" />
              <span>Add to Wallet</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── PASS 4: WARM CREAM & ORANGE COMBO OFFER (offer card-3.png) ─── */}
      {variant === 'combo_orange' && (
        <div className="rounded-[32px] bg-gradient-to-b from-[#FFFDF9] via-[#FFF9F0] to-[#FFF2E0] text-[#3B1806] shadow-2xl shadow-orange-950/15 border border-[#FDE2C4] overflow-hidden relative p-5 sm:p-6 space-y-5">
          {/* Top-right Orange Corner Blob */}
          <div className="w-28 h-24 bg-[#F0651A] rounded-bl-full absolute top-0 right-0 pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2 text-sm font-black text-[#6B2106]">
              <span>🍔</span>
              <span>Sly Granny <span className="italic font-serif font-normal">Café</span></span>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5E6D3] text-[#6B2106] text-[10px] font-black uppercase tracking-wider">
              Exclusive Rewards 👑
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-[#451A03] tracking-tight">
              Combo Offer
            </h2>

            <div className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-6 space-y-2.5">
                <div className="inline-block px-4 py-2 rounded-xl bg-[#D91604] text-white text-lg font-black italic shadow-md">
                  15% OFF
                </div>
                <p className="text-xs sm:text-sm font-black text-[#451A03] leading-snug">
                  on Burger + Coke Combo
                </p>
              </div>
              <div className="col-span-6 flex justify-end">
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=360&auto=format&fit=crop&q=80"
                  alt="Burger & Coke"
                  className="w-32 h-28 rounded-2xl object-cover shadow-lg border-2 border-white"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-dashed border-[#E8CFAF] pt-4 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[#FDE8D3] text-[#9A3412] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </span>
            <div>
              <div className="text-[11px] font-semibold text-[#78350F]">Valid till</div>
              <div className="text-sm font-black text-[#1E1548]">30 June 2026</div>
            </div>
          </div>

          <BarcodeVisual code={offer.code} />

          <div className="text-center text-xs font-bold text-[#C2410C] flex items-center justify-center gap-1">
            <Zap className="w-3.5 h-3.5" />
            <span>Powered by TapCard</span>
          </div>
        </div>
      )}

      {/* ─── PASS 5: PURPLE & GOLD GIFT CARD (offer card-4.png) ─── */}
      {variant === 'gift_wrap' && (
        <div className="rounded-[32px] bg-gradient-to-b from-[#450A70] via-[#531185] to-[#3B0764] text-white shadow-2xl shadow-purple-950/30 overflow-hidden relative">
          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-full bg-[#FACC15] text-[#240B4C] flex items-center justify-center font-black text-sm">
                  🌯
                </span>
                <span className="opacity-40">|</span>
                <span className="text-base font-black">Wrap City</span>
              </div>
              <Gift className="w-8 h-8 text-purple-200" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
                <span>Gift Card</span>
                <Sparkles className="w-5 h-5 text-[#FACC15]" />
              </h2>
              <p className="text-sm font-bold text-[#FACC15] mt-0.5">A gift for you!</p>
            </div>

            <BarcodeVisual code="WPC-7845-3210-9876" />
          </div>

          {/* Ticket Notch Divider */}
          <div className="relative flex items-center px-4">
            <span className="w-6 h-6 rounded-full bg-[#FAF8FF] -ml-7 shrink-0" />
            <div className="flex-1" />
            <span className="w-6 h-6 rounded-full bg-[#FAF8FF] -mr-7 shrink-0" />
          </div>

          {/* Bottom Gold Wave + Wrap Showcase */}
          <div className="relative pt-4">
            <div className="px-6 relative z-10 flex justify-center -mb-6">
              <img
                src="https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&auto=format&fit=crop&q=80"
                alt="Wrap City"
                className="w-64 h-36 rounded-2xl object-cover shadow-2xl border-4 border-white/25"
              />
            </div>
            <div className="bg-gradient-to-r from-[#FACC15] via-[#FDE047] to-[#EAB308] text-[#240B4C] pt-10 pb-4 px-5 text-center rounded-t-[40px]">
              <div className="text-xs font-black flex items-center justify-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-[#240B4C]" />
                <span>Powered by TapCard</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Primary Show My Card CTA (Matches offer card.png / 1 / 3 / 4) */}
      {variant !== 'coupon_detailed' && (
        <button
          type="button"
          onClick={() => setShowQrSheet(true)}
          className={`w-full h-13 rounded-2xl ${ctaColor} text-white text-sm font-black shadow-xl flex items-center justify-center gap-2 cursor-pointer transition active:scale-[0.99]`}
        >
          <QrCode className="w-5 h-5" />
          <span>Show My Card</span>
        </button>
      )}

      {/* Redemption QR / Barcode Sheet Modal */}
      {showQrSheet && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-[#EFEAF7] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#58258B] uppercase tracking-wider">
                TapCard Pass
              </span>
              <button
                type="button"
                onClick={() => setShowQrSheet(false)}
                className="w-8 h-8 rounded-full bg-[#FAF8FF] text-[#6B657E] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h3 className="text-lg font-black text-[#1E1548]">{offer.title}</h3>
              <p className="text-xs text-[#7B748C] mt-0.5">
                Show this code to your waiter or cashier to redeem instantly.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-[#EFEAF7] space-y-3">
              <QrCode className="w-28 h-28 mx-auto text-[#240B4C]" />
              <div className="text-xs font-black tracking-widest text-[#58258B] font-mono">
                {offer.code}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowQrSheet(false);
                onNotify(`${offer.title} redeemed at ${offer.merchantName}!`);
              }}
              className="w-full h-12 rounded-2xl bg-[#240B4C] hover:bg-[#3A1475] text-white text-xs font-black cursor-pointer transition"
            >
              Confirm Redemption
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
   MAIN CUSTOMER OFFERS HUB VIEW (Matches Offers.png)
   Responsive across Mobile, Tablet, and Desktop
   ============================================================================ */
export interface CustomerOffersHubViewProps {
  merchantName: string;
  onOpenStamps: () => void;
  onNotify: (msg: string) => void;
}

export const CustomerOffersHubView: React.FC<CustomerOffersHubViewProps> = ({
  merchantName,
  onOpenStamps,
  onNotify
}) => {
  const [selectedOffer, setSelectedOffer] = useState<CustomerOfferItem | null>(null);
  const [dayFilter, setDayFilter] = useState<'Weekdays' | 'Weekends' | 'All Days'>('Weekdays');
  const [timeFilter, setTimeFilter] = useState<'All Day' | 'Morning' | 'Afternoon' | 'Evening'>('All Day');
  const [statusTab, setStatusTab] = useState<'active' | 'expired' | 'ready'>('active');
  const [sortBy, setSortBy] = useState<'Newest' | 'Expiring Soon'>('Newest');

  if (selectedOffer) {
    return (
      <CustomerOfferPassView
        offer={selectedOffer}
        onBack={() => setSelectedOffer(null)}
        onNotify={onNotify}
      />
    );
  }

  const visibleOffers = CUSTOMER_OFFERS_DATA.filter((o) => {
    if (statusTab === 'active') return o.status === 'active' || o.status === 'ready';
    return o.status === statusTab;
  });

  const top3Offers = [
    {
      badge: 'Bestseller',
      title: 'Flat 29% OFF',
      sub: 'on all Pizzas',
      img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&auto=format&fit=crop&q=80',
      btnBg: 'bg-[#EC0C6E]',
      offer: CUSTOMER_OFFERS_DATA[0]
    },
    {
      badge: null,
      title: 'Buy 1 Get 1',
      sub: 'Get 1 Free',
      img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&auto=format&fit=crop&q=80',
      btnBg: 'bg-[#7C146E]',
      offer: CUSTOMER_OFFERS_DATA[2]
    },
    {
      badge: 'Combo',
      title: '15% OFF Combo',
      sub: 'Burger + Coke',
      img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80',
      btnBg: 'bg-[#EC5800]',
      offer: CUSTOMER_OFFERS_DATA[3]
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
      {/* Hero Banner Row (Offers.png) */}
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#1E1548] tracking-tight">
              Offers
            </h1>
            <span className="w-8 h-8 rounded-xl bg-[#DB006A] text-white flex items-center justify-center rotate-12 shadow-sm shrink-0">
              <Tag className="w-4 h-4 fill-white" />
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#7B748C] font-medium mt-1 max-w-xs leading-relaxed">
            Explore all offers, rewards and exclusive delights at {merchantName}
          </p>
        </div>

        <div className="w-28 h-22 sm:w-36 sm:h-24 rounded-3xl overflow-hidden border-2 border-white shadow-md shrink-0">
          <img
            src="https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=360&auto=format&fit=crop&q=80"
            alt="Café Delights"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Day & Time Filter Pill Card */}
      <div className="bg-white rounded-2xl px-3.5 py-2.5 border border-[#EFEAF7] shadow-2xs grid grid-cols-2 divide-x divide-[#EFEAF7] gap-2">
        <div className="flex items-center justify-between gap-1.5 pr-2">
          <span className="text-xs font-bold text-[#5B546E] flex items-center gap-1.5 shrink-0">
            <Calendar className="w-3.5 h-3.5 text-[#58258B]" />
            <span>Day:</span>
          </span>
          <select
            value={dayFilter}
            onChange={(e) => setDayFilter(e.target.value as any)}
            className="bg-[#FAF6FF] border border-[#EFEAF7] rounded-xl px-2 py-1 text-xs font-bold text-[#1E1548] outline-none cursor-pointer"
          >
            <option value="Weekdays">Weekdays</option>
            <option value="Weekends">Weekends</option>
            <option value="All Days">All Days</option>
          </select>
        </div>

        <div className="flex items-center justify-between gap-1.5 pl-2">
          <span className="text-xs font-bold text-[#5B546E] flex items-center gap-1.5 shrink-0">
            <Clock className="w-3.5 h-3.5 text-[#58258B]" />
            <span>Time:</span>
          </span>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as any)}
            className="bg-[#FAF6FF] border border-[#EFEAF7] rounded-xl px-2 py-1 text-xs font-bold text-[#1E1548] outline-none cursor-pointer"
          >
            <option value="All Day">All Day</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
          </select>
        </div>
      </div>

      {/* Status Filter Tabs (Active Offers | Expired Offers | Ready to Redeem) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {(
          [
            { id: 'active', label: 'Active Offers (8)', icon: Zap },
            { id: 'expired', label: 'Expired Offers (4)', icon: XCircle },
            { id: 'ready', label: 'Ready to Redeem (2)', icon: Gift }
          ] as const
        ).map((tab) => {
          const active = statusTab === tab.id;
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer border shrink-0 ${
                active
                  ? 'bg-[#2F0E45] text-white border-[#2F0E45] shadow-sm'
                  : 'bg-white text-[#240B4C] border-[#EFEAF7] hover:border-[#C4B5FD]'
              }`}
            >
              <IconComp className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Top 3 Offers Magenta Highlight Container (Offers.png) */}
      <div className="rounded-3xl bg-gradient-to-r from-[#EC0C6E] via-[#E11268] to-[#D60B64] p-3.5 sm:p-4 shadow-lg shadow-pink-900/15 space-y-3">
        <div className="flex items-center justify-between text-white px-1">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-black">
            <Crown className="w-4 h-4 fill-white" />
            <span>Top 3 Offers at {merchantName}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusTab('active')}
            className="text-xs font-bold text-white/95 hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-2xl p-3 grid grid-cols-2 lg:grid-cols-3 gap-3">
          {top3Offers.map((item, idx) => (
            <div
              key={item.title}
              onClick={() => setSelectedOffer(item.offer)}
              className={`rounded-2xl border border-[#F3EDF9] p-2.5 flex flex-col justify-between gap-2 cursor-pointer hover:border-[#EC0C6E]/40 hover:shadow-sm transition group ${
                idx === 2 ? 'hidden lg:flex' : 'flex'
              }`}
            >
              <div className="relative h-24 sm:h-28 rounded-xl overflow-hidden">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {item.badge && (
                  <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-[#EC0C6E] text-white text-[10px] font-black shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 pt-0.5">
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-black text-[#1E1548] truncate">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-[#7B748C] truncate">{item.sub}</div>
                </div>
                <span
                  className={`w-7 h-7 rounded-full ${item.btnBg} text-white flex items-center justify-center shrink-0 shadow-xs`}
                >
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Active Offers Header + Sort */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <h2 className="text-base sm:text-lg font-black text-[#1E1548]">
          {statusTab === 'active'
            ? 'All Active Offers'
            : statusTab === 'ready'
            ? 'Ready to Redeem'
            : 'Expired Offers'}
        </h2>
        <button
          type="button"
          onClick={() => setSortBy((s) => (s === 'Newest' ? 'Expiring Soon' : 'Newest'))}
          className="px-3 py-1.5 rounded-full bg-white border border-[#EFEAF7] text-xs font-bold text-[#1E1548] flex items-center gap-1 cursor-pointer shadow-2xs"
        >
          <span className="text-[#7B748C]">Sort by:</span>
          <span>{sortBy}</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#8C84A0]" />
        </button>
      </div>

      {/* Color-Tinted Offer Cards Grid (1-col Mobile, 2-col Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {visibleOffers.map((offer) => (
          <button
            key={offer.id}
            type="button"
            onClick={() => setSelectedOffer(offer)}
            className={`w-full rounded-3xl p-3.5 sm:p-4 border shadow-2xs hover:shadow-md transition-all flex items-center justify-between gap-3.5 text-left cursor-pointer group ${offer.cardTint}`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <img
                src={offer.image}
                alt={offer.title}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 shadow-xs group-hover:scale-[1.03] transition-transform"
              />
              <div className="min-w-0 space-y-1">
                <div className="text-[11px] font-bold text-[#6B657E]">{offer.merchantName}</div>
                <h3 className="text-sm sm:text-base font-black text-[#1E1548] truncate">
                  {offer.title}
                </h3>
                <p className="text-xs text-[#6B657E] line-clamp-1">{offer.subtitle}</p>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black inline-flex items-center gap-1 ${
                      offer.status === 'ready'
                        ? 'bg-[#DCFCE7] text-[#15803D]'
                        : offer.status === 'expired'
                        ? 'bg-gray-200 text-gray-600'
                        : 'bg-[#CCFBF1] text-[#0F766E]'
                    }`}
                  >
                    {offer.status === 'ready' ? '🎁' : offer.status === 'active' ? '⚡' : '⏱'}{' '}
                    {offer.badgeText}
                  </span>

                  {offer.stampsProgress ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-white/80 text-[#240B4C] text-[10px] font-black border border-black/5">
                      {offer.stampsProgress.current} / {offer.stampsProgress.total} Stamps
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFF1F5] text-[#DB006A] text-[10px] font-bold inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Valid till {offer.validTill}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <span className="w-8 h-8 rounded-full bg-white/90 text-[#1E1548] group-hover:text-[#DB006A] flex items-center justify-center shadow-2xs shrink-0 transition">
              <ChevronRight className="w-4 h-4" />
            </span>
          </button>
        ))}
      </div>

      {/* Bottom More Rewards Await Banner (Offers.png) */}
      <div className="rounded-3xl p-4 sm:p-5 bg-gradient-to-r from-[#2D0A48] via-[#4C126E] to-[#74167B] text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-[#FACC15] text-[#240B4C] flex items-center justify-center shrink-0 shadow-md">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black">More Rewards Await!</h3>
            <p className="text-xs text-purple-100/85 mt-0.5">
              Collect stamps, enjoy special offers &amp; unlock exclusive treats.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenStamps}
          className="px-5 py-2.5 rounded-full bg-white hover:bg-purple-50 text-[#240B4C] text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 shadow-md cursor-pointer shrink-0 transition"
        >
          <span>View Stamps</span>
          <span>&rarr;</span>
        </button>
      </div>
    </div>
  );
};
