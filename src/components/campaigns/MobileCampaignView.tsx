import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Plus,
  Search,
  Filter,
  Check,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Calendar,
  Clock,
  ArrowUpRight,
  Users,
  UserPlus,
  Star,
  Crown,
  Gem,
  Shield,
  Award,
  Store,
  ShoppingBag,
  Receipt,
  Percent,
  Gift,
  Tag,
  Coins,
  Package,
  Repeat,
  Coffee,
  Pizza,
  Utensils,
  Share2,
  Trash2,
  Pause,
  Play,
  CheckCircle2,
  SlidersHorizontal,
  Layers,
  Smartphone,
  MessageSquare,
  Send,
  QrCode,
  Edit3,
  BarChart2,
  Home,
  Megaphone,
  Car,
  Cake,
  Building2,
  PartyPopper,
  Info,
  Sliders,
  DollarSign,
  FileText,
  Heart,
  Flame,
  CheckCheck,
  Volume2,
  Bookmark,
  RotateCcw,
  MapPin,
  Eye,
  Image as ImageIcon,
  Trophy,
  ShoppingCart
} from 'lucide-react';
import { NavRoute } from '../../types';

export interface MobileCampaignViewProps {
  initialViewMode?: 'dashboard' | 'builder';
  onNavigate?: (route: string) => void;
  onToggleMobileMenu?: () => void;
}

export interface MobileCampaignItem {
  id: string;
  number: number;
  name: string;
  subtitle: string;
  status: 'ACTIVE' | 'DRAFT' | 'PAUSED';
  isTopPerformer?: boolean;
  image: string;
  scannedCount: number;
  redeemedCount: number;
  totalSales: number;
  type: string;
  targetAudience: string;
  validity: string;
  condition: string;
  offer: string;
  expiryDate: string;
  approvalsCount?: number;
  branches: {
    name: string;
    location: string;
    scan: number;
    redeem: number;
    sales: number;
  }[];
}

const INITIAL_CAMPAIGNS: MobileCampaignItem[] = [
  {
    id: 'camp-1',
    number: 1,
    name: 'Summer Cashback',
    subtitle: '10% cashback on all beverages for regular visitors',
    status: 'ACTIVE',
    isTopPerformer: true,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&auto=format&fit=crop&q=80',
    scannedCount: 1420,
    redeemedCount: 890,
    totalSales: 45000,
    type: 'Cashback',
    targetAudience: 'All Customers',
    validity: '15 Sep - 30 Sep',
    condition: 'Min bill ₹250',
    offer: '10% Cashback',
    expiryDate: '30 Sep 2026',
    approvalsCount: 5,
    branches: [
      { name: 'Connaught Place', location: 'Delhi', scan: 620, redeem: 410, sales: 21000 },
      { name: 'Cyber Hub', location: 'Gurgaon', scan: 480, redeem: 310, sales: 15500 },
      { name: 'Indiranagar', location: 'Bangalore', scan: 320, redeem: 170, sales: 8500 }
    ]
  },
  {
    id: 'camp-2',
    number: 2,
    name: 'Lunch Discount',
    subtitle: '20% off on main course items during lunch hours',
    status: 'ACTIVE',
    isTopPerformer: false,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&auto=format&fit=crop&q=80',
    scannedCount: 980,
    redeemedCount: 640,
    totalSales: 32500,
    type: 'Discount',
    targetAudience: 'VIP & Gold Tiers',
    validity: '01 Oct - 15 Oct',
    condition: 'Main Course item',
    offer: '20% Off',
    expiryDate: '15 Oct 2026',
    branches: [
      { name: 'Connaught Place', location: 'Delhi', scan: 450, redeem: 300, sales: 16000 },
      { name: 'Cyber Hub', location: 'Gurgaon', scan: 530, redeem: 340, sales: 16500 }
    ]
  },
  {
    id: 'camp-3',
    number: 3,
    name: 'Monsoon Chai & Bites',
    subtitle: 'Seasonal afternoon rush multiplier',
    status: 'PAUSED',
    isTopPerformer: false,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&auto=format&fit=crop&q=80',
    scannedCount: 450,
    redeemedCount: 220,
    totalSales: 11200,
    type: 'Cashback',
    targetAudience: 'All Registered',
    validity: '10 Aug - 10 Sep',
    condition: 'Visits >= 3',
    offer: '₹100 Cashback',
    expiryDate: '10 Sep 2026',
    branches: [
      { name: 'Indiranagar', location: 'Bangalore', scan: 450, redeem: 220, sales: 11200 }
    ]
  }
];

export const MobileCampaignView: React.FC<MobileCampaignViewProps> = ({
  initialViewMode = 'dashboard',
  onNavigate,
  onToggleMobileMenu
}) => {
  const [viewMode, setViewMode] = useState<'dashboard' | 'builder'>(initialViewMode);

  // ---------------------------------------------------------------------------
  // DASHBOARD STATE
  // ---------------------------------------------------------------------------
  const [campaignsList, setCampaignsList] = useState<MobileCampaignItem[]>(INITIAL_CAMPAIGNS);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<string[]>([]);
  const [bottomNavTab, setBottomNavTab] = useState<'home' | 'create' | 'menu' | 'report' | 'approve'>('create');

  // ---------------------------------------------------------------------------
  // WIZARD STATE (Matching Mobile Figma Screens 1-5)
  // ---------------------------------------------------------------------------
  // Step 0: Campaign Count Selector ("How many campaigns do you want to create?")
  const [campaignCreationMode, setCampaignCreationMode] = useState<'single' | 'multiple'>('single');
  const [creationSetupStep, setCreationSetupStep] = useState<'choose_type' | 'configure_multiple' | 'wizard'>('choose_type');
  const [multipleCampaignsList, setMultipleCampaignsList] = useState<
    { id: string; name: string; status: 'Active' | 'Scheduled' | 'Draft'; type: string; desc: string; dates: string }[]
  >([
    {
      id: 'mc-1',
      name: 'Summer Cashback',
      status: 'Active',
      type: 'Cashback',
      desc: '10% cashback on all beverages',
      dates: '15 Sep 2025\n30 Sep 2025'
    },
    {
      id: 'mc-2',
      name: 'Lunch Discount',
      status: 'Scheduled',
      type: 'Discount',
      desc: '20% off on main course',
      dates: '01 Oct 2025\n15 Oct 2025'
    }
  ]);

  // Main 6-Step Wizard:
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [audienceSubStep, setAudienceSubStep] = useState<'audience_type' | 'order_types' | 'tiers' | 'sliders'>('audience_type');

  // Step 1: Basic Details
  const [campaignName, setCampaignName] = useState('Summer Special');
  const [audienceDesc, setAudienceDesc] = useState(
    'Get 20% off on all main course items. Valid for dine-in and takeaway.'
  );
  const [startDate, setStartDate] = useState('15 Sep 2025');
  const [endDate, setEndDate] = useState('30 Sep 2025');
  const [isActiveAllDay, setIsActiveAllDay] = useState(true);
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('10:00 PM');
  const [campaignStatus, setCampaignStatus] = useState<'active' | 'draft'>('active');

  // Step 2: Audience
  const [audienceCategory, setAudienceCategory] = useState<'all' | 'new' | 'existing'>('all');
  const [selectedOrderTypes, setSelectedOrderTypes] = useState<string[]>(['Dine In']);
  const [selectedTier, setSelectedTier] = useState<string>('VVIP');
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 60]);
  const [genderFilter, setGenderFilter] = useState<'All' | 'Male' | 'Female'>('All');
  const [totalSpendLimit, setTotalSpendLimit] = useState(50000);
  const [totalVisitsLimit, setTotalVisitsLimit] = useState(50);

  // Step 3: Condition
  const [conditionType, setConditionType] = useState<
    'visit' | 'billing' | 'stamps' | 'item' | 'happy_hours' | 'birthday' | 'anniversary' | 'combo'
  >('visit');
  const [isConfiguringCondition, setIsConfiguringCondition] = useState<boolean>(false);

  // Condition 1: Visit
  const [visitQualifyingCount, setVisitQualifyingCount] = useState(1);
  const [visitMinBill, setVisitMinBill] = useState('0');
  const [visitApplyTo, setVisitApplyTo] = useState<'per_bill' | 'total_spent'>('per_bill');
  const [visitAvailability, setVisitAvailability] = useState<'same_day' | 'month_end'>('same_day');

  // Condition 2: Billing
  const [billingTargetAmount, setBillingTargetAmount] = useState(500);
  const [billingFrequency, setBillingFrequency] = useState<'Weekly' | 'Monthly' | 'Quarterly' | 'Per Campaign'>('Monthly');
  const [allowEarlyRedemption, setAllowEarlyRedemption] = useState<'yes' | 'no'>('yes');
  const [whenToGiveOffer, setWhenToGiveOffer] = useState<'same_order' | 'next_visit'>('same_order');

  // Condition 3: Stamps
  const [stampsCount, setStampsCount] = useState(5);
  const [stampItemScope, setStampItemScope] = useState('Any Item');
  const [stampValidityPeriod, setStampValidityPeriod] = useState('Monthly');

  // Condition 4: Item Based Offers
  const [itemTimeStart, setItemTimeStart] = useState('10:00 AM');
  const [itemTimeEnd, setItemTimeEnd] = useState('04:00 PM');
  const [itemOfferScope, setItemOfferScope] = useState<'specific' | 'category'>('specific');
  const [itemCategoryTab, setItemCategoryTab] = useState('Pizzas');
  const [selectedItemsForCondition, setSelectedItemsForCondition] = useState<string[]>([
    'Margherita Pizza',
    'Pasta Alfredo'
  ]);

  // Condition 5: Happy Hours
  const [happyHourStart, setHappyHourStart] = useState('10:00 AM');
  const [happyHourEnd, setHappyHourEnd] = useState('04:00 PM');
  const [happyHourDays, setHappyHourDays] = useState<string[]>(['M', 'T', 'W', 'T', 'F']);
  const [happyHourScope, setHappyHourScope] = useState('All items');

  // Condition 6 & 7: Birthday / Anniversary
  const [birthdayMonth, setBirthdayMonth] = useState('Aug');
  const [specialDayMode, setSpecialDayMode] = useState<'birthday' | 'anniversary'>('birthday');
  const [birthdayDaysSpan, setBirthdayDaysSpan] = useState(3);
  const [birthdayValidFor, setBirthdayValidFor] = useState('All registered members');

  // Condition 8: Combo Offers
  const [comboMode, setComboMode] = useState<'fixed' | 'custom'>('custom');
  const [comboTimeStart, setComboTimeStart] = useState('10:00 AM');
  const [comboTimeEnd, setComboTimeEnd] = useState('04:00 PM');
  const [selectedFixedCombos, setSelectedFixedCombos] = useState<string[]>([
    'Margherita Pizza + Cold Coffee',
    'Pasta + Garlic Bread'
  ]);
  const [customComboName, setCustomComboName] = useState('Weekend Duo Special');
  const [customComboPrice, setCustomComboPrice] = useState('399');
  const [customComboSelectedTag, setCustomComboSelectedTag] = useState('Weekend Duo Special');

  // Step 4: Rewards
  const [rewardType, setRewardType] = useState<
    'cashback' | 'points' | 'free_item' | 'discount' | 'nominal_item' | 'combo' | 'bogo'
  >('cashback');
  const [isConfiguringReward, setIsConfiguringReward] = useState<boolean>(false);

  // Cashback Reward
  const [cashbackType, setCashbackType] = useState<'percentage' | 'fixed'>('percentage');
  const [cashbackPercent, setCashbackPercent] = useState('10');
  const [cashbackFixed, setCashbackFixed] = useState('50');
  const [cashbackCapping, setCashbackCapping] = useState(true);
  const [cashbackMaxCap, setCashbackMaxCap] = useState('100');
  const [cashbackApplicable, setCashbackApplicable] = useState('All items');

  // Discount Reward
  const [discountRewardType, setDiscountRewardType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountRewardPercent, setDiscountRewardPercent] = useState('10');
  const [discountRewardFixed, setDiscountRewardFixed] = useState('50');
  const [discountRewardCapping, setDiscountRewardCapping] = useState(true);
  const [discountRewardMaxCap, setDiscountRewardMaxCap] = useState('100');
  const [discountRewardApplicable, setDiscountRewardApplicable] = useState('All items');

  // Points Reward
  const [pointsRewardType, setPointsRewardType] = useState<'percentage' | 'fixed'>('percentage');
  const [pointsRewardPercent, setPointsRewardPercent] = useState('10');
  const [pointsRewardFixed, setPointsRewardFixed] = useState('50');
  const [pointsRewardValueRupee, setPointsRewardValueRupee] = useState('1');
  const [pointsRewardCapping, setPointsRewardCapping] = useState(true);
  const [pointsRewardMaxCap, setPointsRewardMaxCap] = useState('100');
  const [pointsRewardApplicable, setPointsRewardApplicable] = useState('All items');

  // Free Item Reward
  const [freeItemSearch, setFreeItemSearch] = useState('');
  const [freeItemSelected, setFreeItemSelected] = useState('Margherita Pizza');
  const [freeItemQty, setFreeItemQty] = useState(1);

  // Nominal Priced Item Reward
  const [nominalSearch, setNominalSearch] = useState('');
  const [nominalSelectedItems, setNominalSelectedItems] = useState<{
    [id: string]: { selected: boolean; revisedPrice: string; discountText: string };
  }>({
    margherita: { selected: true, revisedPrice: '49', discountText: '₹250 discount · 84% OFF' },
    pasta: { selected: false, revisedPrice: '99', discountText: '₹250 discount · 71% OFF' },
    salad: { selected: false, revisedPrice: '79', discountText: '₹170 discount · 68% OFF' },
    coffee: { selected: true, revisedPrice: '19', discountText: '₹130 discount · 87% OFF' }
  });

  // BOGO Reward
  const [bogoBuyQty, setBogoBuyQty] = useState(1);
  const [bogoGetFreeQty, setBogoGetFreeQty] = useState(1);
  const [bogoSearch, setBogoSearch] = useState('');
  const [bogoCategory, setBogoCategory] = useState('All');
  const [bogoSelectAll, setBogoSelectAll] = useState(true);
  const [bogoSelectedItems, setBogoSelectedItems] = useState<string[]>([
    'Margherita Pizza',
    'Farmhouse Pizza'
  ]);
  const [bogoFreeRule, setBogoFreeRule] = useState<'same_item' | 'any_item_same_price'>('same_item');
  const [bogoShowMore, setBogoShowMore] = useState(false);

  // Step 5: Customize Banner (Templates)
  const [bannerTab, setBannerTab] = useState<'content' | 'design' | 'layout'>('content');
  const [bannerOfferTitle, setBannerOfferTitle] = useState('Buy 1 Get 1 Free');
  const [bannerSubtext, setBannerSubtext] = useState('On all pizzas');
  const [bannerSpecialTag, setBannerSpecialTag] = useState('Special Offer');
  const [bannerShowValidity, setBannerShowValidity] = useState(true);
  const [bannerValidityDate, setBannerValidityDate] = useState('31 Dec 2025');
  const [bannerShowLocation, setBannerShowLocation] = useState(true);

  // Stamp-specific banner states
  const [bannerShowStampProgress, setBannerShowStampProgress] = useState(true);
  const [bannerProgressText, setBannerProgressText] = useState('Your Progress');

  // Design Tab states
  const [bannerColorTheme, setBannerColorTheme] = useState('#2D0F55');
  const [bannerBgStyle, setBannerBgStyle] = useState<'gradient' | 'solid' | 'image'>('gradient');
  const [bannerFontStyle, setBannerFontStyle] = useState<'modern' | 'classic' | 'playful'>('modern');
  const [bannerButtonStyle, setBannerButtonStyle] = useState<'filled' | 'outline' | 'text'>('filled');
  const [bannerIconStyle, setBannerIconStyle] = useState<
    'star' | 'heart' | 'gift' | 'bag' | 'hexagon' | 'crown'
  >('star');

  // Layout Tab states
  const [bannerLayout, setBannerLayout] = useState<'layout1' | 'layout2' | 'layout3' | 'layout4'>('layout1');
  const [bannerShowBadge, setBannerShowBadge] = useState(true);
  const [bannerShowFoodImage, setBannerShowFoodImage] = useState(true);
  const [bannerShowIcons, setBannerShowIcons] = useState(true);

  // Stamp-specific show/hide elements
  const [stampShowIcons, setStampShowIcons] = useState(true);
  const [stampShowGift, setStampShowGift] = useState(true);
  const [stampShowProgressBar, setStampShowProgressBar] = useState(true);
  const [stampShowProgressText, setStampShowProgressText] = useState(true);

  // Filtered campaigns for mobile dashboard
  const filteredCampaigns = useMemo(() => {
    return campaignsList.filter((camp) => {
      if (typeFilter !== 'All Types' && !camp.type.toLowerCase().includes(typeFilter.toLowerCase())) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          camp.name.toLowerCase().includes(q) ||
          camp.subtitle.toLowerCase().includes(q) ||
          camp.type.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [campaignsList, typeFilter, searchQuery]);

  const handleToggleSelectCampaign = (id: string) => {
    setSelectedCampaignIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedCampaignIds.length === filteredCampaigns.length) {
      setSelectedCampaignIds([]);
    } else {
      setSelectedCampaignIds(filteredCampaigns.map((c) => c.id));
    }
  };

  const stepLabels = [
    { num: 1, label: 'Basic Details' },
    { num: 2, label: 'Audience Type' },
    { num: 3, label: 'Conditions' },
    { num: 4, label: 'Rewards' },
    { num: 5, label: 'Templates' },
    { num: 6, label: 'Review & Launch' }
  ];

  // ===========================================================================
  // RENDER: MOBILE DASHBOARD VIEW
  // ===========================================================================
  if (viewMode === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FDF9FE] via-[#FFFDFE] to-[#FBF8FD] pb-24 font-sans text-[#1A102F]">
        {/* Mobile Header Bar */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F0EBF5] px-4 py-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#EC4899] flex items-center justify-center text-white font-black text-sm shadow-xs">
                ★
              </div>
              <div>
                <div className="text-sm font-black text-[#1A102F] leading-tight">Loyalitics</div>
                <div className="text-[10px] text-gray-400 font-medium">Rewards • Engage • Grow</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCreationSetupStep('choose_type');
                  setViewMode('builder');
                }}
                className="px-3 py-1.5 rounded-xl bg-[#2D0F55] text-white text-xs font-bold hover:bg-[#3D1472] transition-all shadow-xs cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New</span>
              </button>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-purple-200"
              />
            </div>
          </div>
        </div>

        {/* Dashboard Main Content */}
        <div className="p-4 space-y-4">
          {/* Top Title */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-black text-[#1A102F] tracking-tight">Campaigns</h1>
              <p className="text-xs text-gray-500">Monitor active promotions and customer response</p>
            </div>
          </div>

          {/* 4 Summary KPI Cards in 2x2 grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white rounded-3xl p-4 border border-[#F0EBF5] shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-[#FAF5FF] text-[#7C3AED] flex items-center justify-center">
                  <Megaphone className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12%</span>
              </div>
              <div className="text-2xl font-black text-[#1A102F] mt-2">24</div>
              <div className="text-[11px] text-gray-400 font-medium">Total Campaigns</div>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-[#F0EBF5] shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-[#F0FDF4] text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <div className="text-2xl font-black text-[#1A102F] mt-2">18</div>
              <div className="text-[11px] text-gray-400 font-medium">Active Sales</div>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-[#F0EBF5] shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-[#FFF7ED] text-amber-600 flex items-center justify-center">
                  <Gift className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+24%</span>
              </div>
              <div className="text-2xl font-black text-[#1A102F] mt-2">12,480</div>
              <div className="text-[11px] text-gray-400 font-medium">Redemptions</div>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-[#F0EBF5] shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-blue-600 flex items-center justify-center">
                  <QrCode className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Scans</span>
              </div>
              <div className="text-2xl font-black text-[#1A102F] mt-2">5,320</div>
              <div className="text-[11px] text-gray-400 font-medium">Total Scan QR</div>
            </div>
          </div>

          {/* Weekly Campaign Performance Chart */}
          <div className="bg-white rounded-3xl p-4 border border-[#F0EBF5] shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold text-[#1A102F]">Campaign Performance</h3>
                <p className="text-[10px] text-gray-400">Weekly scanned vs redeemed ratio</p>
              </div>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                This Week
              </span>
            </div>
            <div className="h-28 flex items-end justify-between gap-1.5 pt-2 px-1">
              {[
                { day: 'Mon', h1: '40%', h2: '65%' },
                { day: 'Tue', h1: '55%', h2: '80%' },
                { day: 'Wed', h1: '35%', h2: '50%' },
                { day: 'Thu', h1: '70%', h2: '90%' },
                { day: 'Fri', h1: '85%', h2: '100%' },
                { day: 'Sat', h1: '95%', h2: '100%' },
                { day: 'Sun', h1: '60%', h2: '85%' }
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1 h-20">
                    <div style={{ height: bar.h1 }} className="w-2.5 bg-purple-200 rounded-t-sm" />
                    <div style={{ height: bar.h2 }} className="w-2.5 bg-[#2D0F55] rounded-t-sm" />
                  </div>
                  <span className="text-[9px] font-semibold text-gray-400">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Search & Add New CTA */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search campaigns..."
                className="w-full pl-8 pr-3 py-2.5 bg-white border border-[#EAE6E1] rounded-2xl text-xs outline-none focus:border-[#7C3AED] shadow-2xs font-medium"
              />
            </div>
            <button
              onClick={() => {
                setCreationSetupStep('choose_type');
                setViewMode('builder');
              }}
              className="px-4 py-2.5 bg-[#2D0F55] text-white rounded-2xl text-xs font-bold hover:bg-[#3D1472] transition-all cursor-pointer whitespace-nowrap shadow-xs"
            >
              + Add New +
            </button>
          </div>

          {/* Batch Actions & Filters Bar */}
          <div className="flex items-center justify-between text-xs py-1">
            <label className="flex items-center gap-1.5 font-bold text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCampaignIds.length === filteredCampaigns.length && filteredCampaigns.length > 0}
                onChange={handleSelectAll}
                className="w-3.5 h-3.5 rounded accent-[#2D0F55]"
              />
              <span className="text-[11px]">Select All</span>
            </label>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                5 Pending
              </span>
              <button className="p-1.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:text-purple-700 shadow-2xs">
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Campaign Cards List */}
          <div className="space-y-3.5">
            {filteredCampaigns.map((camp) => (
              <div
                key={camp.id}
                className="bg-white rounded-3xl border border-[#F0EBF5] overflow-hidden shadow-2xs"
              >
                {/* Status Bar */}
                <div className="bg-[#2D0F55] text-white px-4 py-2.5 flex items-center justify-between text-[11px] font-bold">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCampaignIds.includes(camp.id)}
                      onChange={() => handleToggleSelectCampaign(camp.id)}
                      className="w-3.5 h-3.5 rounded accent-white"
                    />
                    <span>Campaign #{camp.number}</span>
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full">
                      ● {camp.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-purple-200">
                    <span>Scanned {camp.scannedCount}</span>
                    <span>•</span>
                    <span>Redeem {camp.redeemedCount}</span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {/* Title & Food Image */}
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={camp.image}
                        alt={camp.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-gray-100 shadow-xs"
                      />
                      {camp.isTopPerformer && (
                        <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full shadow-xs">
                          ★ Top
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-[#1A102F] truncate">{camp.name}</h4>
                      <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5 leading-relaxed">{camp.subtitle}</p>
                      <div className="text-[11px] font-black text-emerald-700 mt-1">
                        Total Sales: ₹{camp.totalSales.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* 4 Info Chips */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50 text-[10px]">
                    <div className="bg-[#FAF8FD] p-2 rounded-xl border border-[#F1EBF5]">
                      <span className="text-gray-400 font-semibold block">Type:</span>
                      <span className="font-bold text-[#1A102F]">{camp.type}</span>
                    </div>
                    <div className="bg-[#FAF8FD] p-2 rounded-xl border border-[#F1EBF5]">
                      <span className="text-gray-400 font-semibold block">Target:</span>
                      <span className="font-bold text-[#1A102F]">{camp.targetAudience}</span>
                    </div>
                    <div className="bg-[#FAF8FD] p-2 rounded-xl border border-[#F1EBF5]">
                      <span className="text-gray-400 font-semibold block">Validity:</span>
                      <span className="font-bold text-[#1A102F]">{camp.validity}</span>
                    </div>
                    <div className="bg-[#FAF8FD] p-2 rounded-xl border border-[#F1EBF5]">
                      <span className="text-gray-400 font-semibold block">Condition:</span>
                      <span className="font-bold text-[#1A102F]">{camp.condition}</span>
                    </div>
                  </div>

                  {/* Branch Breakdown Strip */}
                  <div className="bg-pink-50/70 border border-pink-100 rounded-2xl p-2.5 flex items-center justify-between text-[10px]">
                    <span className="font-bold text-pink-900">Branch Performance</span>
                    <span className="text-pink-700 font-bold">3 Outlets Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Fixed Bottom Navigation Bar */}
        <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#F0EBF5] px-4 py-2 z-50 flex items-center justify-between shadow-lg">
          <button
            onClick={() => setBottomNavTab('home')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              bottomNavTab === 'home' ? 'text-[#2D0F55]' : 'text-gray-400'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => {
              setBottomNavTab('create');
              setCreationSetupStep('choose_type');
              setViewMode('builder');
            }}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              bottomNavTab === 'create' ? 'text-[#2D0F55]' : 'text-gray-400'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Campaign</span>
          </button>

          {/* Elevated Center Menu Button */}
          <div className="-mt-6">
            <button
              onClick={() => {
                setCreationSetupStep('choose_type');
                setViewMode('builder');
              }}
              className="w-12 h-12 rounded-full bg-[#2D0F55] text-white flex items-center justify-center shadow-lg shadow-purple-950/30 hover:bg-[#3D1472] transition-all cursor-pointer"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          <button
            onClick={() => setBottomNavTab('report')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              bottomNavTab === 'report' ? 'text-[#2D0F55]' : 'text-gray-400'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Report</span>
          </button>

          <button
            onClick={() => setBottomNavTab('approve')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              bottomNavTab === 'approve' ? 'text-[#2D0F55]' : 'text-gray-400'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Approve</span>
          </button>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // RENDER: MOBILE BUILDER WIZARD FLOW (Matching Figma Images 1-5)
  // (NO fake phone status bars like 9:41 or battery)
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // STEP 0A: "How many campaigns do you want to create?" (Image 2)
  // ---------------------------------------------------------------------------
  if (creationSetupStep === 'choose_type') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FDF8FD] via-[#FFF9FA] to-[#FAF8FD] flex flex-col justify-between p-6 font-sans text-[#1A102F]">
        {/* Top Spacer / Back */}
        <div className="flex items-center justify-between pb-2">
          <button
            onClick={() => setViewMode('dashboard')}
            className="p-1 rounded-full text-gray-400 hover:text-black cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="w-5" />
        </div>

        {/* Center Illustration & Options */}
        <div className="space-y-6 my-auto pt-2 pb-6 max-w-sm mx-auto w-full">
          <div className="text-center space-y-2">
            <h1 className="text-[26px] font-black text-[#1A102F] tracking-tight leading-tight">
              How many campaigns<br />
              do you want to <span className="text-[#6D28D9]">create?</span>
            </h1>
            <p className="text-xs text-[#64748B] max-w-xs mx-auto leading-relaxed">
              Choose whether you want to create a single campaign or multiple campaigns at once.
            </p>
          </div>

          {/* Cute SVG Character Illustration (Desk, Girl with Laptop, Checklist, Plant) */}
          <div className="flex justify-center py-2">
            <div className="relative w-64 h-44 flex items-center justify-center">
              {/* Hanging lamp */}
              <div className="absolute top-0 left-20 flex flex-col items-center">
                <div className="w-0.5 h-10 bg-gray-200" />
                <div className="w-4 h-2.5 bg-amber-100 rounded-b-md border border-amber-200 shadow-2xs" />
              </div>

              {/* Plant in pot */}
              <div className="absolute bottom-2 left-6 flex flex-col items-center">
                <div className="text-2xl -mb-1">🪴</div>
                <div className="w-7 h-7 rounded-lg bg-pink-50 border border-pink-200 flex items-center justify-center text-[10px] text-pink-500 shadow-2xs">
                  ♥
                </div>
              </div>

              {/* Coffee Cup */}
              <div className="absolute bottom-2 left-16">
                <div className="w-5 h-6 rounded-md bg-purple-50 border border-purple-200 flex items-center justify-center text-[8px] text-purple-400 shadow-2xs">
                  ♥
                </div>
              </div>

              {/* Girl with laptop */}
              <div className="flex flex-col items-center relative z-10">
                {/* Speech bubble with lightbulb */}
                <div className="absolute -top-7 right-2 bg-white rounded-full p-1.5 shadow-sm border border-amber-100 flex items-center justify-center text-xs">
                  💡
                </div>
                {/* Head */}
                <div className="w-12 h-12 rounded-full bg-[#FFE4D6] border border-[#F3C5B2] flex items-center justify-center relative overflow-hidden shadow-2xs">
                  <div className="absolute top-0 inset-x-0 h-6 bg-[#2B1B43] rounded-t-full" />
                  <div className="text-xs mt-2 font-bold">👩🏻</div>
                </div>
                {/* Torso */}
                <div className="w-14 h-9 bg-purple-100 rounded-t-xl -mt-1 border border-purple-200" />
                {/* Purple Laptop with Star */}
                <div className="w-20 h-12 rounded-t-lg bg-[#5B21B6] border border-purple-400 shadow-sm flex items-center justify-center text-white text-xs font-black -mt-4">
                  ★
                </div>
                <div className="w-24 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* Clipboard Checklist */}
              <div className="absolute bottom-2 right-8 bg-white border border-purple-300 rounded-xl p-2 w-14 h-18 shadow-xs flex flex-col justify-between">
                <div className="w-6 h-1.5 bg-purple-200 rounded-full mx-auto" />
                <div className="text-[7px] font-black text-purple-900 text-center">Campaign</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[8px] text-emerald-600 font-bold">✓ <div className="w-5 h-0.5 bg-gray-200 rounded" /></div>
                  <div className="flex items-center gap-1 text-[8px] text-emerald-600 font-bold">✓ <div className="w-5 h-0.5 bg-gray-200 rounded" /></div>
                  <div className="flex items-center gap-1 text-[8px] text-gray-400">▢ <div className="w-5 h-0.5 bg-gray-200 rounded" /></div>
                </div>
              </div>

              {/* Desk Line */}
              <div className="absolute bottom-0 inset-x-2 h-0.5 bg-[#DDD6FE]" />
            </div>
          </div>

          {/* Radio Cards */}
          <div className="space-y-3">
            <div
              onClick={() => setCampaignCreationMode('single')}
              className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                campaignCreationMode === 'single'
                  ? 'border-[#6D28D9] bg-white shadow-md shadow-purple-500/5 ring-2 ring-purple-100'
                  : 'border-[#F1EBF5] bg-white shadow-2xs hover:border-[#DDD6FE]'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#F5F0FF] text-[#6D28D9] flex items-center justify-center shrink-0">
                  <Volume2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-black text-[#1A102F]">Single Campaign</div>
                  <div className="text-[11px] text-[#64748B] leading-tight mt-0.5">
                    Create one campaign with a single offer and condition.
                  </div>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  campaignCreationMode === 'single' ? 'border-[#6D28D9]' : 'border-gray-300'
                }`}
              >
                {campaignCreationMode === 'single' && <div className="w-3 h-3 rounded-full bg-[#6D28D9]" />}
              </div>
            </div>

            <div
              onClick={() => setCampaignCreationMode('multiple')}
              className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                campaignCreationMode === 'multiple'
                  ? 'border-[#6D28D9] bg-white shadow-md shadow-purple-500/5 ring-2 ring-purple-100'
                  : 'border-[#F1EBF5] bg-white shadow-2xs hover:border-[#DDD6FE]'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF1F2] text-pink-600 flex items-center justify-center shrink-0 relative">
                  <div className="absolute inset-0 rounded-2xl bg-purple-100/60 translate-x-1 translate-y-1 -z-10" />
                  <Volume2 className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <div className="text-sm font-black text-[#1A102F]">Multiple Campaigns</div>
                  <div className="text-[11px] text-[#64748B] leading-tight mt-0.5">
                    Create multiple campaigns with different offers, conditions or time periods.
                  </div>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  campaignCreationMode === 'multiple' ? 'border-[#6D28D9]' : 'border-gray-300'
                }`}
              >
                {campaignCreationMode === 'multiple' && <div className="w-3 h-3 rounded-full bg-[#6D28D9]" />}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[#F0EBF5] max-w-sm mx-auto w-full">
          <button
            onClick={() => setViewMode('dashboard')}
            className="text-xs font-black text-[#1A102F] hover:text-[#6D28D9] flex items-center gap-1.5 cursor-pointer"
          >
            <span>←</span>
            <span>Back</span>
          </button>
          <button
            onClick={() => {
              if (campaignCreationMode === 'multiple') {
                setCreationSetupStep('configure_multiple');
              } else {
                setCreationSetupStep('wizard');
              }
            }}
            className="px-8 py-3 bg-[#2D0F55] hover:bg-[#3D1472] text-white rounded-2xl text-xs font-black shadow-md shadow-purple-950/20 cursor-pointer transition-all"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // STEP 0B: "Create Multiple Campaigns" (Image 1)
  // ---------------------------------------------------------------------------
  if (creationSetupStep === 'configure_multiple') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FDF8FD] via-[#FFF9FA] to-[#FAF8FD] flex flex-col justify-between p-6 font-sans text-[#1A102F]">
        <div className="space-y-4 max-w-sm mx-auto w-full">
          {/* Top Title with 3D Megaphone Graphic */}
          <div className="flex items-start justify-between pt-1">
            <div className="space-y-1">
              <h1 className="text-[22px] font-black text-[#1A102F] leading-tight">Create Multiple<br />Campaigns</h1>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Add and configure multiple campaigns with different offers, conditions or time periods.
              </p>
            </div>
            {/* 3D Clipboard & Megaphone icon container */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-200 to-indigo-100 flex items-center justify-center shrink-0 shadow-sm relative">
              <span className="text-2xl">📋</span>
              <span className="absolute -top-1 -right-1 text-sm">✨</span>
            </div>
          </div>

          {/* Info Banner with Target/Pin Icon */}
          <div className="bg-[#F5F0FF] border border-[#DDD6FE]/60 rounded-2xl p-3.5 flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-white shadow-2xs flex items-center justify-center shrink-0 text-[#6D28D9] font-black text-xs">
              🎯
            </div>
            <p className="text-xs text-[#4C1D95] font-medium leading-relaxed">
              You can add multiple campaigns. Each campaign can have a different offer type, validity and conditions.
            </p>
          </div>

          {/* Campaigns Count and + Add Campaign Pill */}
          <div className="flex items-center justify-between pt-1">
            <h2 className="text-sm font-black text-[#1A102F]">
              Campaigns ({multipleCampaignsList.length})
            </h2>
            <button
              onClick={() => {
                const newId = `mc-${Date.now()}`;
                setMultipleCampaignsList((prev) => [
                  ...prev,
                  {
                    id: newId,
                    name: `Campaign #${prev.length + 1}`,
                    status: 'Scheduled',
                    type: 'Discount',
                    desc: 'Flat 15% off main course',
                    dates: '15 Oct 2025\n30 Oct 2025'
                  }
                ]);
              }}
              className="px-4 py-1.5 rounded-full border border-[#6D28D9] text-[#6D28D9] text-xs font-bold hover:bg-[#F5F0FF] transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>+</span>
              <span>Add Campaign</span>
            </button>
          </div>

          {/* Campaign Cards List (Matching Image 1) */}
          <div className="space-y-3">
            {multipleCampaignsList.map((mc, idx) => {
              const isFirst = idx === 0;
              return (
                <div
                  key={mc.id}
                  className="bg-white rounded-3xl border border-[#F1EBF5] p-4 shadow-xs space-y-3"
                >
                  {/* Top Row: Number pill, Title, Status badge, Edit, Trash */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full text-white font-black text-xs flex items-center justify-center ${
                          isFirst ? 'bg-[#5B21B6]' : 'bg-[#3B82F6]'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <span className="text-sm font-black text-[#1A102F]">{mc.name}</span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          mc.status === 'Active'
                            ? 'bg-[#DCFCE7] text-[#15803D]'
                            : 'bg-[#F3E8FF] text-[#7E22CE]'
                        }`}
                      >
                        {mc.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-gray-400 hover:text-black cursor-pointer" />
                      <Trash2
                        onClick={() => setMultipleCampaignsList((p) => p.filter((x) => x.id !== mc.id))}
                        className="w-4 h-4 text-[#F43F5E] hover:text-red-700 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Bottom Row: Category Icon, Description, Date Pill */}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-3 min-w-0">
                      {isFirst ? (
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3B82F6] to-[#60A5FA] text-white flex items-center justify-center shadow-xs shrink-0 text-xl">
                          💳
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#EC4899] to-[#F43F5E] text-white flex items-center justify-center shadow-xs shrink-0 text-xl">
                          🏷️
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-black text-[#1A102F]">{mc.type}</div>
                        <div className="text-[11px] text-[#64748B] truncate">{mc.desc}</div>
                      </div>
                    </div>

                    {/* Right-aligned Calendar Date Pill */}
                    <div className="bg-[#FAF8FD] border border-[#EAE6F0] px-3 py-1.5 rounded-2xl flex items-center gap-2 text-[10px] font-bold text-[#475569] shrink-0">
                      <Calendar className="w-4 h-4 text-[#6D28D9] shrink-0" />
                      <div className="whitespace-pre-line text-[10px] leading-tight">
                        {mc.dates}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[#F0EBF5] max-w-sm mx-auto w-full">
          <button
            onClick={() => setCreationSetupStep('choose_type')}
            className="text-xs font-black text-[#1A102F] hover:text-[#6D28D9] flex items-center gap-1.5 cursor-pointer"
          >
            <span>←</span>
            <span>Back</span>
          </button>
          <button
            onClick={() => setCreationSetupStep('wizard')}
            className="px-8 py-3 bg-[#2D0F55] hover:bg-[#3D1472] text-white rounded-2xl text-xs font-black shadow-md shadow-purple-950/20 cursor-pointer transition-all"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 6-STEP WIZARD CONTAINER WITH PROGRESS BAR (NO fake phone status bar!)
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF8FD] via-[#FFF9FA] to-[#FAF8FD] flex flex-col justify-between pb-6 font-sans text-[#1A102F]">
      {/* Top Header with 6-Step Connected Progress Stepper (Matching Image 3 & 4) */}
      <div className="px-5 pt-3 pb-3 border-b border-[#F0EBF5] bg-white/90 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center justify-end mb-1">
          <button
            onClick={() => setViewMode('dashboard')}
            className="p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Connected Step Indicator */}
        <div className="flex items-center justify-between relative px-2">
          {/* Horizontal connecting background line */}
          <div className="absolute left-6 right-6 top-3 h-0.5 bg-gray-200 -z-0" />
          <div
            className="absolute left-6 h-0.5 bg-[#5B21B6] -z-0 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / 5) * 88}%` }}
          />

          {stepLabels.map((st) => {
            const isCompletedOrCurrent = currentStep >= st.num;
            return (
              <div key={st.num} className="flex flex-col items-center gap-1 z-10">
                <div
                  className={`w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center transition-all ${
                    isCompletedOrCurrent
                      ? 'bg-[#5B21B6] text-white shadow-xs'
                      : 'bg-white border-2 border-gray-300 text-gray-400'
                  }`}
                >
                  {st.num}
                </div>
                <span
                  className={`text-[8.5px] font-bold text-center leading-tight max-w-[45px] ${
                    isCompletedOrCurrent ? 'text-[#5B21B6]' : 'text-gray-400'
                  }`}
                >
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP CONTENT BODY */}
      <div className="flex-1 p-5 max-w-sm mx-auto w-full">
        {/* ===================================================================== */}
        {/* STEP 1: BASIC DETAILS (Image 3) */}
        {/* ===================================================================== */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h1 className="text-[22px] font-black text-[#1A102F]">Basic Details</h1>
              <p className="text-xs text-[#64748B] mt-0.5">Give your campaign a name and add a short description.</p>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-black text-[#1A102F] mb-1.5">Campaign name *</label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g. Summer Special"
                  className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-2xl text-xs font-bold text-[#1A102F] outline-none focus:border-[#6D28D9] shadow-2xs"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-black text-[#1A102F]">Audience description</label>
                  <span className="text-[10px] text-gray-400 font-bold">{audienceDesc.length}/200</span>
                </div>
                <textarea
                  value={audienceDesc}
                  onChange={(e) => setAudienceDesc(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-2xl text-xs font-medium text-[#1A102F] outline-none focus:border-[#6D28D9] shadow-2xs resize-none leading-relaxed"
                />
              </div>

              {/* Campaign Validity */}
              <div className="pt-1">
                <h3 className="text-xs font-black text-[#1A102F]">Campaign Validity</h3>
                <p className="text-[10px] text-[#64748B] mb-2">Set the start and end date for your campaign.</p>
                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] text-[#64748B] font-bold block mb-1">Start date</span>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#E2E8F0] rounded-2xl text-xs font-bold text-[#1A102F] outline-none shadow-2xs"
                      />
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748B] font-bold block mb-1">End date</span>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#E2E8F0] rounded-2xl text-xs font-bold text-[#1A102F] outline-none shadow-2xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* When will this campaign be active? */}
              <div className="pt-1">
                <h3 className="text-xs font-black text-[#1A102F] mb-2">When will this campaign be active?</h3>
                <div className="space-y-2">
                  <label
                    onClick={() => setIsActiveAllDay(true)}
                    className="flex items-center gap-2.5 text-xs text-[#1A102F] font-bold cursor-pointer"
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isActiveAllDay ? 'border-[#5B21B6]' : 'border-gray-300'
                      }`}
                    >
                      {isActiveAllDay && <div className="w-2 h-2 rounded-full bg-[#5B21B6]" />}
                    </div>
                    <span>Entire day</span>
                  </label>

                  <label
                    onClick={() => setIsActiveAllDay(false)}
                    className="flex items-center gap-2.5 text-xs text-[#1A102F] font-bold cursor-pointer"
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        !isActiveAllDay ? 'border-[#5B21B6]' : 'border-gray-300'
                      }`}
                    >
                      {!isActiveAllDay && <div className="w-2 h-2 rounded-full bg-[#5B21B6]" />}
                    </div>
                    <span>Specific time</span>
                  </label>

                  {!isActiveAllDay && (
                    <div className="grid grid-cols-2 gap-2 pt-1 pl-6">
                      <input
                        type="text"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Campaign Status (Matching Image 3) */}
              <div className="pt-1">
                <h3 className="text-xs font-black text-[#1A102F]">Campaign Status</h3>
                <p className="text-[10px] text-[#64748B] mb-2">Choose whether to start the campaign immediately or keep it as a draft</p>
                <div className="space-y-2.5">
                  <div
                    onClick={() => setCampaignStatus('active')}
                    className={`p-3.5 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      campaignStatus === 'active'
                        ? 'border-[#5B21B6] bg-white shadow-xs ring-2 ring-purple-100'
                        : 'border-[#E2E8F0] bg-white shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#F5F0FF] text-[#6D28D9] flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-[#1A102F]">Active</div>
                        <div className="text-[10px] text-[#64748B]">Campaign will be live as soon as you save it.</div>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        campaignStatus === 'active' ? 'border-[#5B21B6]' : 'border-gray-300'
                      }`}
                    >
                      {campaignStatus === 'active' && <div className="w-2.5 h-2.5 rounded-full bg-[#5B21B6]" />}
                    </div>
                  </div>

                  <div
                    onClick={() => setCampaignStatus('draft')}
                    className={`p-3.5 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      campaignStatus === 'draft'
                        ? 'border-[#5B21B6] bg-white shadow-xs ring-2 ring-purple-100'
                        : 'border-[#E2E8F0] bg-white shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#F8FAFC] text-gray-500 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-[#1A102F]">Draft</div>
                        <div className="text-[10px] text-[#64748B]">Save and activate it later.</div>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        campaignStatus === 'draft' ? 'border-[#5B21B6]' : 'border-gray-300'
                      }`}
                    >
                      {campaignStatus === 'draft' && <div className="w-2.5 h-2.5 rounded-full bg-[#5B21B6]" />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* STEP 2: AUDIENCE (Image 4 + Sub-screens) */}
        {/* ===================================================================== */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* SUB-STEP 2A: Choose your audience (Image 4) */}
            {audienceSubStep === 'audience_type' && (
              <div className="space-y-4">
                <div>
                  <h1 className="text-[22px] font-black text-[#1A102F]">Choose your audience</h1>
                  <p className="text-xs text-[#64748B] mt-0.5">Select who will be eligible to see and use this campaign.</p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: 'all',
                      title: 'All customers',
                      desc: 'Show to everyone',
                      icon: <Users className="w-5 h-5 text-[#6D28D9]" />
                    },
                    {
                      id: 'new',
                      title: 'New customers only',
                      desc: 'Only show to first time visitors.',
                      icon: <UserPlus className="w-5 h-5 text-gray-500" />
                    },
                    {
                      id: 'existing',
                      title: 'Existing customers only',
                      desc: 'Show to your regular customers.',
                      icon: <Star className="w-5 h-5 text-gray-500" />
                    }
                  ].map((aud) => {
                    const isSelected = audienceCategory === aud.id;
                    return (
                      <div
                        key={aud.id}
                        onClick={() => setAudienceCategory(aud.id as any)}
                        className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-[#7C3AED] bg-white shadow-md shadow-purple-500/5 ring-2 ring-purple-100'
                            : 'border-[#F1EBF5] bg-white shadow-2xs hover:border-[#DDD6FE]'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-[#F5F0FF]' : 'bg-[#F8FAFC]'
                            }`}
                          >
                            {aud.icon}
                          </div>
                          <div>
                            <div className="text-sm font-black text-[#1A102F]">{aud.title}</div>
                            <div className="text-xs text-[#64748B] mt-0.5">{aud.desc}</div>
                          </div>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-[#5B21B6]' : 'border-gray-300'
                          }`}
                        >
                          {isSelected && <div className="w-3 h-3 rounded-full bg-[#5B21B6]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SUB-STEP 2B: Where will this campaign be available? (Matching Image 1) */}
            {audienceSubStep === 'order_types' && (
              <div className="space-y-4">
                <div>
                  <h1 className="text-[22px] font-black text-[#1A102F]">Where will this campaign be available?</h1>
                  <p className="text-xs text-[#64748B] mt-0.5">Choose the order types where customers can use this offer.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      id: 'Dine In',
                      title: 'Dine In',
                      desc: 'For customers dining at your outlet',
                      illustration: (
                        <svg viewBox="0 0 100 70" className="w-20 h-16 mx-auto">
                          {/* Left Chair */}
                          <rect x="18" y="24" width="5" height="18" rx="2.5" fill="#BE185D" />
                          <path d="M14 36 C14 26, 24 26, 24 36 L24 48 L14 48 Z" fill="#DB2777" />
                          <rect x="15" y="48" width="3" height="16" rx="1.5" fill="#9D174D" />
                          <rect x="21" y="48" width="3" height="16" rx="1.5" fill="#9D174D" />
                          {/* Right Chair */}
                          <rect x="77" y="24" width="5" height="18" rx="2.5" fill="#BE185D" />
                          <path d="M76 36 C76 26, 86 26, 86 36 L86 48 L76 48 Z" fill="#DB2777" />
                          <rect x="76" y="48" width="3" height="16" rx="1.5" fill="#9D174D" />
                          <rect x="82" y="48" width="3" height="16" rx="1.5" fill="#9D174D" />
                          {/* Dining Table */}
                          <rect x="28" y="38" width="44" height="6" rx="3" fill="#2D124D" />
                          <rect x="47" y="44" width="6" height="20" rx="2" fill="#2D124D" />
                          <ellipse cx="50" cy="64" rx="13" ry="3.5" fill="#2D124D" />
                          {/* Glass & drink */}
                          <path d="M47 32 L48 38 L52 38 L53 32 Z" fill="#0D9488" opacity="0.85" />
                          <circle cx="50" cy="29" r="2.5" fill="#10B981" />
                          <path d="M49 28 C49 26, 53 24, 54 23" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                        </svg>
                      )
                    },
                    {
                      id: 'Takeaway',
                      title: 'Takeaway',
                      desc: 'For takeout orders at your outlet',
                      illustration: (
                        <div className="w-16 h-16 rounded-full bg-[#FFEDD5] flex items-center justify-center mx-auto">
                          <svg viewBox="0 0 48 48" className="w-10 h-10">
                            <path d="M19 14 C19 9, 29 9, 29 14" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                            <path d="M14 16 L34 16 L32 38 L16 38 Z" fill="#D97706" />
                            <path d="M13 16 L35 16 L34 20 L14 20 Z" fill="#B45309" opacity="0.35" />
                            <circle cx="24" cy="28" r="4.5" fill="white" />
                            <circle cx="24" cy="28" r="3" fill="#D97706" />
                            <path d="M22 27 Q24 25 26 27 Q24 29 22 27" fill="white" />
                          </svg>
                        </div>
                      )
                    },
                    {
                      id: 'Delivery',
                      title: 'Delivery',
                      desc: 'For online delivery orders',
                      illustration: (
                        <div className="w-16 h-16 rounded-full bg-[#E0F2FE] flex items-center justify-center mx-auto">
                          <svg viewBox="0 0 64 64" className="w-12 h-12">
                            <circle cx="19" cy="46" r="6" fill="#1E1B4B" />
                            <circle cx="19" cy="46" r="2.5" fill="white" />
                            <circle cx="47" cy="46" r="6" fill="#1E1B4B" />
                            <circle cx="47" cy="46" r="2.5" fill="white" />
                            <path d="M19 46 L30 46 L37 33 L47 46" stroke="#4C1D95" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            <path d="M37 33 L39 23 L45 23" stroke="#4C1D95" strokeWidth="3" strokeLinecap="round" fill="none" />
                            <rect x="14" y="23" width="15" height="15" rx="3" fill="#EC4899" />
                            <circle cx="21.5" cy="30.5" r="2.5" fill="white" />
                            <circle cx="34" cy="18" r="5" fill="#4C1D95" />
                            <path d="M35 17 L39 18" stroke="#F472B6" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </div>
                      )
                    },
                    {
                      id: 'All Types',
                      title: 'All Types',
                      desc: 'Dine in, Takeaway & Delivery',
                      illustration: (
                        <div className="flex items-center justify-center gap-2 h-16">
                          <div className="flex flex-col items-center">
                            <div className="flex items-end gap-1">
                              <div className="w-1.5 h-4 bg-[#DB2777] rounded-xs" />
                              <div className="w-5 h-1.5 bg-[#2D124D] rounded-xs" />
                              <div className="w-1.5 h-4 bg-[#DB2777] rounded-xs" />
                            </div>
                            <div className="w-1 h-3 bg-[#2D124D]" />
                          </div>
                          <div className="w-6 h-8 bg-[#D97706] rounded-xs flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-white" />
                          </div>
                          <div className="flex items-center gap-0.5">
                            <div className="w-3.5 h-3.5 rounded-full bg-[#1E1B4B]" />
                            <div className="w-3 h-3 bg-[#EC4899] rounded-xs" />
                            <div className="w-3.5 h-3.5 rounded-full bg-[#1E1B4B]" />
                          </div>
                        </div>
                      )
                    }
                  ].map((ord) => {
                    const isSelected = selectedOrderTypes.includes(ord.id);
                    return (
                      <div
                        key={ord.id}
                        onClick={() => {
                          if (ord.id === 'All Types') {
                            setSelectedOrderTypes(['All Types']);
                          } else {
                            setSelectedOrderTypes([ord.id]);
                          }
                        }}
                        className={`p-4 rounded-3xl border-2 flex flex-col justify-between h-44 transition-all cursor-pointer relative bg-white ${
                          isSelected
                            ? 'border-[#7C3AED] ring-2 ring-purple-100 shadow-md shadow-purple-500/5'
                            : 'border-[#E2E8F0] shadow-2xs hover:border-[#DDD6FE]'
                        }`}
                      >
                        {/* Radio circle at top right */}
                        <div className="flex justify-end">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                              isSelected ? 'border-[#7C3AED]' : 'border-[#CBD5E1]'
                            }`}
                          >
                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" />}
                          </div>
                        </div>

                        {/* Illustration */}
                        <div className="my-auto">{ord.illustration}</div>

                        {/* Text */}
                        <div className="mt-1">
                          <div className="text-xs font-black text-[#1A102F]">{ord.title}</div>
                          <div className="text-[10px] text-[#64748B] line-clamp-2 mt-0.5 leading-tight">{ord.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SUB-STEP 2C: Customer Tiers (Matching Image 2) */}
            {audienceSubStep === 'tiers' && (
              <div className="space-y-4">
                <div>
                  <h1 className="text-[22px] font-black text-[#1A102F]">VVIP / VIP / Gold / Silver / Bronze</h1>
                  <p className="text-xs text-[#64748B] mt-0.5">Filter by customer tier(s).</p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: 'VVIP',
                      label: 'VVIP',
                      desc: 'Our most loyal customers',
                      iconBg: 'bg-[#2D0F55]',
                      iconColor: 'text-white',
                      iconComponent: <Crown className="w-5 h-5 text-white" />
                    },
                    {
                      id: 'VIP',
                      label: 'VIP',
                      desc: 'High spending, frequent visitors',
                      iconBg: 'bg-[#EDE9FE]',
                      iconColor: 'text-[#7C3AED]',
                      iconComponent: <Gem className="w-5 h-5 text-[#7C3AED]" />
                    },
                    {
                      id: 'Gold',
                      label: 'Gold',
                      desc: 'Regular customers',
                      iconBg: 'bg-[#D97706]',
                      iconColor: 'text-white',
                      iconComponent: <Crown className="w-5 h-5 text-white" />
                    },
                    {
                      id: 'Silver',
                      label: 'Silver',
                      desc: 'Occasional customers',
                      iconBg: 'bg-[#64748B]',
                      iconColor: 'text-white',
                      iconComponent: <Shield className="w-5 h-5 text-white" />
                    },
                    {
                      id: 'Bronze',
                      label: 'Bronze',
                      desc: 'New and exploring customers',
                      iconBg: 'bg-[#B45309]',
                      iconColor: 'text-white',
                      iconComponent: <Award className="w-5 h-5 text-white" />
                    }
                  ].map((tier) => {
                    const isSelected = selectedTier === tier.id;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => setSelectedTier(tier.id)}
                        className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between bg-white ${
                          isSelected
                            ? 'border-[#7C3AED] ring-2 ring-purple-100 shadow-md shadow-purple-500/5'
                            : 'border-[#E2E8F0] shadow-2xs hover:border-[#DDD6FE]'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-11 h-11 rounded-full ${tier.iconBg} ${tier.iconColor} flex items-center justify-center shrink-0 shadow-xs`}
                          >
                            {tier.iconComponent}
                          </div>
                          <div>
                            <div className="text-sm font-black text-[#1A102F]">{tier.label}</div>
                            <div className="text-xs text-[#64748B] mt-0.5">{tier.desc}</div>
                          </div>
                        </div>

                        {/* Radio Circle */}
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                            isSelected ? 'border-[#7C3AED]' : 'border-[#CBD5E1]'
                          }`}
                        >
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SUB-STEP 2D: Demographic Sliders (Matching Image 3) */}
            {audienceSubStep === 'sliders' && (
              <div className="space-y-4">
                <div>
                  <h1 className="text-[20px] font-black text-[#1A102F] leading-tight">
                    Narrow down your audeince with more conditions (optional).
                  </h1>
                </div>

                <div className="space-y-3.5">
                  {/* Card 1: Age Range */}
                  <div className="bg-white rounded-3xl p-5 border border-[#F1EBF5] shadow-2xs space-y-3.5">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#5B21B6]" />
                      <span className="text-sm font-black text-[#1A102F]">Age Range</span>
                    </div>

                    <div className="relative pt-2 pb-1 px-1">
                      <div className="h-2 bg-[#E9D5FF]/40 rounded-full relative">
                        <div
                          className="absolute h-full bg-[#5B21B6] rounded-full"
                          style={{
                            left: `${((ageRange[0] - 18) / (65 - 18)) * 100}%`,
                            right: `${100 - ((ageRange[1] - 18) / (65 - 18)) * 100}%`
                          }}
                        />
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#5B21B6] border-2 border-white shadow-md -ml-3"
                          style={{ left: `${((ageRange[0] - 18) / (65 - 18)) * 100}%` }}
                        />
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#5B21B6] border-2 border-white shadow-md -ml-3"
                          style={{ left: `${((ageRange[1] - 18) / (65 - 18)) * 100}%` }}
                        />
                      </div>
                      <input
                        type="range"
                        min={18}
                        max={65}
                        value={ageRange[1]}
                        onChange={(e) =>
                          setAgeRange([ageRange[0], Math.max(ageRange[0] + 5, parseInt(e.target.value, 10))])
                        }
                        className="w-full opacity-0 absolute inset-0 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="w-24 py-2 rounded-2xl border border-gray-200 bg-[#FAF8FD] text-xs font-bold text-center text-[#1A102F]">
                        {ageRange[0]}
                      </div>
                      <span className="text-xs font-bold text-gray-400">TO</span>
                      <div className="w-24 py-2 rounded-2xl border border-gray-200 bg-[#FAF8FD] text-xs font-bold text-center text-[#1A102F]">
                        {ageRange[1] >= 60 ? '60+' : ageRange[1]}
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Gender */}
                  <div className="bg-white rounded-3xl p-5 border border-[#F1EBF5] shadow-2xs space-y-3.5">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#5B21B6]" />
                      <span className="text-sm font-black text-[#1A102F]">Gender</span>
                    </div>
                    <div className="bg-[#F3EFF9] p-1.5 rounded-2xl grid grid-cols-3 gap-1">
                      {(['All', 'Male', 'Female'] as const).map((g) => {
                        const isActive = genderFilter === g;
                        return (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setGenderFilter(g)}
                            className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isActive
                                ? 'bg-[#2D0F55] text-white shadow-xs'
                                : 'text-[#64748B] hover:text-[#1A102F]'
                            }`}
                          >
                            {g}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Card 3: Total Spend (₹) */}
                  <div className="bg-white rounded-3xl p-5 border border-[#F1EBF5] shadow-2xs space-y-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-[#5B21B6]">₹</span>
                      <span className="text-sm font-black text-[#1A102F]">Total Spend (₹)</span>
                    </div>
                    <div className="relative pt-2 pb-1">
                      <input
                        type="range"
                        min={0}
                        max={50000}
                        step={1000}
                        value={totalSpendLimit}
                        onChange={(e) => setTotalSpendLimit(parseInt(e.target.value, 10))}
                        className="w-full accent-[#5B21B6] cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <div className="w-20 py-2 rounded-2xl border border-gray-200 bg-[#FAF8FD] text-xs font-bold text-center text-[#1A102F]">
                        0
                      </div>
                      <div className="px-5 py-2 rounded-2xl border-2 border-[#7C3AED] bg-[#FAF5FF] text-xs font-black text-[#5B21B6] text-center">
                        {totalSpendLimit >= 50000 ? '50,000+' : `₹${totalSpendLimit.toLocaleString()}`}
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Total Visits */}
                  <div className="bg-white rounded-3xl p-5 border border-[#F1EBF5] shadow-2xs space-y-3.5">
                    <div className="flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-[#5B21B6]" />
                      <span className="text-sm font-black text-[#1A102F]">Total Visits</span>
                    </div>
                    <div className="relative pt-2 pb-1">
                      <input
                        type="range"
                        min={0}
                        max={50}
                        value={totalVisitsLimit}
                        onChange={(e) => setTotalVisitsLimit(parseInt(e.target.value, 10))}
                        className="w-full accent-[#5B21B6] cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <div className="w-20 py-2 rounded-2xl border border-gray-200 bg-[#FAF8FD] text-xs font-bold text-center text-[#1A102F]">
                        0
                      </div>
                      <div className="px-6 py-2 rounded-2xl border-2 border-[#7C3AED] bg-[#FAF5FF] text-xs font-black text-[#5B21B6] text-center">
                        {totalVisitsLimit >= 50 ? '50+' : totalVisitsLimit}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================== */}
        {/* STEP 3: CONDITIONS (Matching Image 4 & 5) */}
        {/* ===================================================================== */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {!isConfiguringCondition ? (
              /* Step 3A: Select Condition Type (Matching Image 4) */
              <div className="space-y-3.5">
                <div>
                  <h1 className="text-[22px] font-black text-[#1A102F]">Select Condition Type</h1>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Choose how you want to define the eligibility for its campaign
                  </p>
                </div>

                <div className="space-y-2.5">
                  {[
                    {
                      id: 'visit',
                      title: 'Visit',
                      desc: 'Qualifying no of visits',
                      iconBg: 'bg-[#FFE4E6]',
                      iconColor: 'text-[#E11D48]',
                      icon: <Car className="w-5 h-5" />
                    },
                    {
                      id: 'billing',
                      title: 'Billing',
                      desc: 'Target amount / frequency',
                      iconBg: 'bg-[#EDE9FE]',
                      iconColor: 'text-[#7C3AED]',
                      icon: <FileText className="w-5 h-5" />
                    },
                    {
                      id: 'stamps',
                      title: 'Stamps',
                      desc: 'Qualifying item / no of stamps',
                      iconBg: 'bg-[#FEF3C7]',
                      iconColor: 'text-[#D97706]',
                      icon: <Star className="w-5 h-5" />
                    },
                    {
                      id: 'item',
                      title: 'Item based offers',
                      desc: 'Specific items or categories',
                      iconBg: 'bg-[#E0F2FE]',
                      iconColor: 'text-[#0284C7]',
                      icon: <ShoppingBag className="w-5 h-5" />
                    },
                    {
                      id: 'happy_hours',
                      title: 'Happy Hours',
                      desc: 'Time + day based',
                      iconBg: 'bg-[#FFEDD5]',
                      iconColor: 'text-[#EA580C]',
                      icon: <Clock className="w-5 h-5" />
                    },
                    {
                      id: 'birthday',
                      title: 'Birthday / Anniversary',
                      desc: 'Special day based',
                      iconBg: 'bg-[#FCE7F3]',
                      iconColor: 'text-[#DB2777]',
                      icon: <Cake className="w-5 h-5" />
                    },
                    {
                      id: 'combo',
                      title: 'Combo offers',
                      desc: 'Qualifying item / combo',
                      iconBg: 'bg-[#F3E8FF]',
                      iconColor: 'text-[#9333EA]',
                      icon: <Package className="w-5 h-5" />
                    }
                  ].map((cond) => (
                    <div
                      key={cond.id}
                      onClick={() => {
                        setConditionType(cond.id as any);
                        setIsConfiguringCondition(true);
                      }}
                      className="p-4 rounded-3xl border border-[#F1EBF5] bg-white hover:border-[#7C3AED] transition-all cursor-pointer flex items-center justify-between shadow-2xs hover:shadow-xs group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-11 h-11 rounded-2xl ${cond.iconBg} ${cond.iconColor} flex items-center justify-center shrink-0 shadow-2xs`}
                        >
                          {cond.icon}
                        </div>
                        <div>
                          <div className="text-sm font-black text-[#1A102F]">{cond.title}</div>
                          <div className="text-xs text-[#64748B] mt-0.5">{cond.desc}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#7C3AED] transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Step 3B: Condition Detail Configuration (Matching Image 5) */
              <div className="space-y-4">
                {/* Header */}
                <div>
                  <h1 className="text-[22px] font-black text-[#1A102F]">Select Condition Type</h1>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Choose how you want to define the eligibility for its campaign
                  </p>
                </div>

                {/* Dropdown Card */}
                <div
                  onClick={() => setIsConfiguringCondition(false)}
                  className="p-4 rounded-3xl border border-[#F1EBF5] bg-white flex items-center justify-between shadow-2xs cursor-pointer hover:border-[#DDD6FE] transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
                        conditionType === 'visit'
                          ? 'bg-[#FFE4E6] text-[#E11D48]'
                          : conditionType === 'billing'
                          ? 'bg-[#EDE9FE] text-[#7C3AED]'
                          : 'bg-[#FEF3C7] text-[#D97706]'
                      }`}
                    >
                      {conditionType === 'visit' ? (
                        <Car className="w-5 h-5" />
                      ) : conditionType === 'billing' ? (
                        <FileText className="w-5 h-5" />
                      ) : (
                        <Star className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-black text-[#1A102F]">
                        {conditionType === 'visit'
                          ? 'Visit'
                          : conditionType === 'billing'
                          ? 'Billing'
                          : conditionType === 'stamps'
                          ? 'Stamps'
                          : conditionType}
                      </div>
                      <div className="text-xs text-[#64748B]">
                        {conditionType === 'visit'
                          ? 'Qualifying no of visits'
                          : conditionType === 'billing'
                          ? 'Target amount / frequency'
                          : conditionType === 'stamps'
                          ? 'Qualifying item / no of stamps'
                          : 'Configured rule'}
                      </div>
                    </div>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>

                {/* VISIT CONDITION CONFIGURATION (Matching Image 5) */}
                {conditionType === 'visit' && (
                  <div className="space-y-3.5">
                    <div>
                      <h2 className="text-base font-black text-[#1A102F]">Visit Rule</h2>
                      <p className="text-xs text-[#64748B]">Set the number of visits required to avail this campaign.</p>
                    </div>

                    {/* Card 1: Qualifying no of visits */}
                    <div className="bg-white rounded-3xl p-5 border border-[#F1EBF5] shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#1A102F]">Qualifying no of visits</span>
                        <span className="bg-[#FFE4E6] text-[#E11D48] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          Mandatory
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <button
                          type="button"
                          onClick={() => setVisitQualifyingCount((c) => Math.max(1, c - 1))}
                          className="w-12 h-12 rounded-2xl bg-[#F8FAFC] border border-gray-200 text-gray-700 text-xl font-bold flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
                        >
                          -
                        </button>
                        <div className="text-center">
                          <div className="text-3xl font-black text-[#1A102F]">{visitQualifyingCount}</div>
                          <div className="text-xs text-[#64748B] font-semibold">visit</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setVisitQualifyingCount((c) => c + 1)}
                          className="w-12 h-12 rounded-2xl bg-[#2D0F55] text-white text-xl font-bold flex items-center justify-center active:scale-95 transition-transform shadow-xs cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-[11px] text-[#64748B] leading-relaxed">
                        Total recorded check-ins needed within the campaign window.
                      </p>
                    </div>

                    {/* Card 2: Minimum bill amount */}
                    <div className="bg-white rounded-3xl p-5 border border-[#F1EBF5] shadow-2xs space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#1A102F]">Minimum bill amount</span>
                        <span className="bg-[#FFE4E6] text-[#E11D48] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          Mandatory
                        </span>
                      </div>

                      <div className="relative flex items-center bg-[#FAF8FD] border border-gray-200 rounded-2xl px-4 py-2.5 focus-within:border-[#7C3AED]">
                        <span className="text-sm font-bold text-gray-500 mr-2">₹</span>
                        <input
                          type="number"
                          value={visitMinBill}
                          onChange={(e) => setVisitMinBill(e.target.value)}
                          className="w-full bg-transparent text-sm font-black text-[#1A102F] outline-none"
                          placeholder="0"
                        />
                        <span className="text-xs font-bold text-gray-400">INR</span>
                      </div>

                      <div className="space-y-2 pt-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A102F]">
                          <span>Apply to</span>
                          <Info className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          <div
                            onClick={() => setVisitApplyTo('per_bill')}
                            className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                              visitApplyTo === 'per_bill'
                                ? 'border-[#7C3AED] bg-[#FAF5FF]'
                                : 'border-gray-200 bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                  visitApplyTo === 'per_bill' ? 'border-[#5B21B6]' : 'border-gray-300'
                                }`}
                              >
                                {visitApplyTo === 'per_bill' && <div className="w-2 h-2 rounded-full bg-[#5B21B6]" />}
                              </div>
                              <span className="text-xs font-black text-[#1A102F]">Per bill</span>
                            </div>
                            <p className="text-[10px] text-[#64748B] pl-6 leading-tight">
                              Minimum amount per visit/bill
                            </p>
                          </div>

                          <div
                            onClick={() => setVisitApplyTo('total_spent')}
                            className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                              visitApplyTo === 'total_spent'
                                ? 'border-[#7C3AED] bg-[#FAF5FF]'
                                : 'border-gray-200 bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                  visitApplyTo === 'total_spent' ? 'border-[#5B21B6]' : 'border-gray-300'
                                }`}
                              >
                                {visitApplyTo === 'total_spent' && <div className="w-2 h-2 rounded-full bg-[#5B21B6]" />}
                              </div>
                              <span className="text-xs font-black text-[#1A102F]">Total money spent till now</span>
                            </div>
                            <p className="text-[10px] text-[#64748B] pl-6 leading-tight">
                              Minimum cumulative spend till now
                            </p>
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] text-[#64748B] leading-relaxed">
                        Set a minimum bill amount for eligibility. Keep ₹0 for any purchase.
                      </p>
                    </div>

                    {/* Card 3: Offer Availability */}
                    <div className="bg-white rounded-3xl p-5 border border-[#F1EBF5] shadow-2xs space-y-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#5B21B6]" />
                          <span className="text-xs font-black text-[#1A102F]">Offer Availability</span>
                        </div>
                        <p className="text-[11px] text-[#64748B]">When do you want customers to avail this offer?</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 pt-1">
                        <div
                          onClick={() => setVisitAvailability('same_day')}
                          className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                            visitAvailability === 'same_day'
                              ? 'border-[#7C3AED] bg-white ring-2 ring-purple-100 shadow-xs'
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-xl">☀️</span>
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                visitAvailability === 'same_day' ? 'border-[#5B21B6]' : 'border-gray-300'
                              }`}
                            >
                              {visitAvailability === 'same_day' && <div className="w-2 h-2 rounded-full bg-[#5B21B6]" />}
                            </div>
                          </div>
                          <div className="text-xs font-black text-[#1A102F]">Same day</div>
                          <div className="text-[10px] text-[#64748B] mt-0.5 leading-tight">
                            Offer can be used on the same day as the visit.
                          </div>
                        </div>

                        <div
                          onClick={() => setVisitAvailability('month_end')}
                          className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                            visitAvailability === 'month_end'
                              ? 'border-[#7C3AED] bg-white ring-2 ring-purple-100 shadow-xs'
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <Calendar className="w-5 h-5 text-gray-500" />
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                visitAvailability === 'month_end' ? 'border-[#5B21B6]' : 'border-gray-300'
                              }`}
                            >
                              {visitAvailability === 'month_end' && <div className="w-2 h-2 rounded-full bg-[#5B21B6]" />}
                            </div>
                          </div>
                          <div className="text-xs font-black text-[#1A102F]">Month end</div>
                          <div className="text-[10px] text-[#64748B] mt-0.5 leading-tight">
                            Offer can be used at the end of the month.
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card 4: Rule Preview */}
                    <div className="bg-[#F6EEFD] border border-[#E9D5FF] rounded-2xl p-4 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#5B21B6] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        i
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs font-black text-[#2D0F55]">Rule Preview</div>
                        <div className="text-xs text-[#4C1D95] leading-relaxed">
                          Customer needs to visit your restaurant{' '}
                          <span className="font-bold">at least {visitQualifyingCount} time</span> to be eligible for
                          this campaign
                        </div>
                      </div>
                    </div>

                    {/* Bottom Nav inside Condition Config */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setIsConfiguringCondition(false)}
                        className="text-xs font-black text-[#2D0F55] hover:text-[#6D28D9] cursor-pointer"
                      >
                        Change condition
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(4)}
                        className="px-8 py-3 bg-[#2D0F55] hover:bg-[#3D1472] text-white rounded-2xl text-xs font-black shadow-md shadow-purple-950/20 cursor-pointer transition-all"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. BILLING (Matching Image 1) */}
                {conditionType === 'billing' && (
                  <div className="space-y-3.5">
                    <div>
                      <h2 className="text-base font-black text-[#1A102F]">Billing Rule</h2>
                      <p className="text-xs text-[#64748B]">Set the number of visits required to avail this campaign.</p>
                    </div>

                    {/* Top Card: Target Amount & Frequency */}
                    <div className="bg-white rounded-3xl p-5 border border-[#F1EBF5] shadow-2xs space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#1A102F]">Target Amount</span>
                        <span className="bg-[#FFE4E6] text-[#E11D48] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          Required
                        </span>
                      </div>

                      {/* Currency Input Display */}
                      <div className="relative flex items-center justify-between bg-[#FAF8FD] border border-gray-200 rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-gray-700">₹</span>
                          <span className="text-2xl font-black text-[#1A102F]">{billingTargetAmount}</span>
                        </div>
                        <span className="text-xs font-bold text-gray-500">INR ₹</span>
                      </div>

                      {/* Quick Amount Pills */}
                      <div className="grid grid-cols-4 gap-2">
                        {[250, 500, 1000, 2500].map((amt) => {
                          const isSelected = billingTargetAmount === amt;
                          return (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => setBillingTargetAmount(amt)}
                              className={`py-2 rounded-xl text-xs font-black cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-[#2D0F55] text-white shadow-xs'
                                  : 'bg-[#FAF8FD] text-gray-700 hover:bg-gray-100 border border-gray-200'
                              }`}
                            >
                              ₹{amt.toLocaleString()}
                            </button>
                          );
                        })}
                      </div>

                      {/* Frequency Dropdown & Pills */}
                      <div className="pt-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-[#1A102F]">Frequency (Optional)</span>
                          <span className="text-[11px] font-semibold text-gray-400">Rolling Period</span>
                        </div>

                        <div className="bg-[#FAF8FD] border border-gray-200 rounded-2xl p-3 flex items-center justify-between cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-600" />
                            <span className="text-xs font-black text-[#1A102F]">{billingFrequency}</span>
                          </div>
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>

                        <div className="grid grid-cols-4 gap-1.5 pt-1">
                          {(['Weekly', 'Monthly', 'Quarterly', 'Per Campaign'] as const).map((frq) => {
                            const isSelected = billingFrequency === frq;
                            return (
                              <button
                                key={frq}
                                type="button"
                                onClick={() => setBillingFrequency(frq)}
                                className={`py-2 rounded-xl text-[10px] font-bold cursor-pointer transition-all ${
                                  isSelected
                                    ? 'bg-[#F3E8FF] text-[#5B21B6] border border-[#DDD6FE]'
                                    : 'bg-[#FAF8FD] text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                              >
                                {frq}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Rule Preview */}
                      <div className="bg-[#F6EEFD] border border-[#E9D5FF] rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-[#4C1D95]">
                        <div className="w-5 h-5 rounded-full bg-[#5B21B6] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          i
                        </div>
                        <div>
                          <div className="font-bold text-[#2D0F55] mb-0.5">Rule Preview</div>
                          <div>
                            Customer will be eligible after spending{' '}
                            <span className="font-black">₹{billingTargetAmount}</span> in a{' '}
                            <span className="font-black">{billingFrequency.toLowerCase()}</span>.
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Card: Early Redemption & Timing */}
                    <div className="bg-white rounded-3xl p-5 border border-[#F1EBF5] shadow-2xs space-y-4">
                      {/* Allow Early Redemption */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs font-black text-[#1A102F]">
                            <span>Allow Early Redemption</span>
                            <Info className="w-3.5 h-3.5 text-gray-400" />
                          </div>
                          <span className="bg-[#FFE4E6] text-[#E11D48] text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Required
                          </span>
                        </div>
                        <p className="text-[11px] text-[#64748B] leading-relaxed">
                          Can the customer redeem the offer before the selected period ends if the required bill amount is generated?
                        </p>

                        <div className="grid grid-cols-2 gap-2.5 pt-1">
                          <div
                            onClick={() => setAllowEarlyRedemption('yes')}
                            className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                              allowEarlyRedemption === 'yes'
                                ? 'border-[#7C3AED] bg-white ring-2 ring-purple-100 shadow-xs'
                                : 'border-gray-200 bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                  allowEarlyRedemption === 'yes' ? 'border-[#5B21B6]' : 'border-gray-300'
                                }`}
                              >
                                {allowEarlyRedemption === 'yes' && <div className="w-2 h-2 rounded-full bg-[#5B21B6]" />}
                              </div>
                              <span className="text-xs font-black text-[#1A102F]">Yes</span>
                            </div>
                            <p className="text-[10px] text-[#64748B] pl-6 leading-tight">
                              Allow redemption once the required amount is reached, even before the period ends.
                            </p>
                          </div>

                          <div
                            onClick={() => setAllowEarlyRedemption('no')}
                            className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                              allowEarlyRedemption === 'no'
                                ? 'border-[#7C3AED] bg-white ring-2 ring-purple-100 shadow-xs'
                                : 'border-gray-200 bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                  allowEarlyRedemption === 'no' ? 'border-[#5B21B6]' : 'border-gray-300'
                                }`}
                              >
                                {allowEarlyRedemption === 'no' && <div className="w-2 h-2 rounded-full bg-[#5B21B6]" />}
                              </div>
                              <span className="text-xs font-black text-[#1A102F]">No</span>
                            </div>
                            <p className="text-[10px] text-[#64748B] pl-6 leading-tight">
                              Redemption is allowed only after the selected period is completed.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* When to give the offer? */}
                      <div className="space-y-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-[#1A102F]">When to give the offer?</span>
                          <span className="bg-[#FFE4E6] text-[#E11D48] text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Required
                          </span>
                        </div>
                        <p className="text-[11px] text-[#64748B] leading-relaxed">
                          If redeemed early, when should the offer be given to the customer?
                        </p>

                        <div className="grid grid-cols-2 gap-2.5 pt-1">
                          <div
                            onClick={() => setWhenToGiveOffer('same_order')}
                            className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                              whenToGiveOffer === 'same_order'
                                ? 'border-[#7C3AED] bg-white ring-2 ring-purple-100 shadow-xs'
                                : 'border-gray-200 bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                  whenToGiveOffer === 'same_order' ? 'border-[#5B21B6]' : 'border-gray-300'
                                }`}
                              >
                                {whenToGiveOffer === 'same_order' && <div className="w-2 h-2 rounded-full bg-[#5B21B6]" />}
                              </div>
                              <span className="text-xs font-black text-[#1A102F]">In the same order</span>
                            </div>
                            <p className="text-[10px] text-[#64748B] pl-6 leading-tight">
                              Offer will be applied immediately in the current order.
                            </p>
                          </div>

                          <div
                            onClick={() => setWhenToGiveOffer('next_visit')}
                            className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                              whenToGiveOffer === 'next_visit'
                                ? 'border-[#7C3AED] bg-white ring-2 ring-purple-100 shadow-xs'
                                : 'border-gray-200 bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                  whenToGiveOffer === 'next_visit' ? 'border-[#5B21B6]' : 'border-gray-300'
                                }`}
                              >
                                {whenToGiveOffer === 'next_visit' && <div className="w-2 h-2 rounded-full bg-[#5B21B6]" />}
                              </div>
                              <span className="text-xs font-black text-[#1A102F]">On next visit / next order</span>
                            </div>
                            <p className="text-[10px] text-[#64748B] pl-6 leading-tight">
                              Offer will be available for the customer's next visit or next order.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Nav */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setIsConfiguringCondition(false)}
                        className="text-xs font-black text-[#2D0F55] hover:text-[#6D28D9] cursor-pointer"
                      >
                        Change condition
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(4)}
                        className="px-8 py-3 bg-[#2D0F55] hover:bg-[#3D1472] text-white rounded-2xl text-xs font-black shadow-md shadow-purple-950/20 cursor-pointer transition-all"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. STAMPS (Matching Image 2) */}
                {conditionType === 'stamps' && (
                  <div className="space-y-3.5">
                    <div>
                      <h2 className="text-base font-black text-[#1A102F]">Stamps Rule</h2>
                      <p className="text-xs text-[#64748B]">Set the qualifying item and number of stamps required to unlock this promotion</p>
                    </div>

                    <div className="bg-white rounded-3xl p-5 border border-[#F1EBF5] shadow-2xs space-y-4">
                      {/* Qualifying item(s) */}
                      <div className="space-y-1.5">
                        <span className="text-xs font-black text-[#1A102F]">Qualifying item(s)</span>
                        <div className="bg-[#FAF8FD] border border-gray-200 rounded-2xl p-3 flex items-center justify-between cursor-pointer">
                          <div className="flex items-center gap-2.5">
                            <Utensils className="w-4 h-4 text-[#5B21B6]" />
                            <span className="text-xs font-black text-[#1A102F]">{stampItemScope}</span>
                          </div>
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-[10px] text-[#64748B] leading-tight">
                          Applies to all catalog menu items or customized categories.
                        </p>
                      </div>

                      {/* No of stamps */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-[#1A102F]">No of stamps</span>
                          <span className="text-xs font-bold text-[#5B21B6]">Target: {stampsCount} stamps</span>
                        </div>

                        <div className="flex items-center justify-between bg-[#FAF8FD] p-2.5 rounded-2xl border border-gray-200">
                          <button
                            type="button"
                            onClick={() => setStampsCount((c) => Math.max(1, c - 1))}
                            className="w-11 h-11 rounded-xl bg-white border border-gray-200 font-bold text-gray-700 text-lg flex items-center justify-center cursor-pointer active:scale-95"
                          >
                            -
                          </button>
                          <div className="text-center">
                            <div className="text-2xl font-black text-[#1A102F]">{stampsCount}</div>
                            <div className="text-[10px] text-[#64748B] font-semibold">visits / purchases</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setStampsCount((c) => c + 1)}
                            className="w-11 h-11 rounded-xl bg-white border border-gray-200 font-bold text-gray-700 text-lg flex items-center justify-center cursor-pointer active:scale-95"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Customer Pass Preview */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-[#1A102F]">Customer Pass Preview</span>
                          <span className="text-xs font-bold text-[#E11D48]">Merchant Pulse Card</span>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-1">
                          {[1, 2, 3, 4].map((s) => (
                            <div
                              key={s}
                              className="w-12 h-12 rounded-2xl bg-[#2D0F55] text-white flex items-center justify-center font-bold text-sm shadow-xs"
                            >
                              ✓
                            </div>
                          ))}
                          <div className="w-12 h-12 rounded-2xl bg-[#EC4899] text-white flex items-center justify-center font-bold text-lg shadow-xs">
                            🎁
                          </div>
                        </div>
                      </div>

                      {/* Rule preview info */}
                      <div className="bg-[#F6EEFD] border border-[#E9D5FF] rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-[#4C1D95]">
                        <div className="w-5 h-5 rounded-full bg-[#5B21B6] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          i
                        </div>
                        <div>
                          Customer needs to collect <span className="font-black">{stampsCount} stamps</span> (on any item) to be eligible for this campaign.
                        </div>
                      </div>
                    </div>

                    {/* Stamp Validity Card */}
                    <div className="bg-white rounded-3xl p-5 border border-[#F1EBF5] shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#1A102F]">Stamp Validity (To Collect stamps)</span>
                        <span className="text-[11px] font-semibold text-gray-400">Rolling Period</span>
                      </div>

                      <div className="bg-[#FAF8FD] border border-gray-200 rounded-2xl p-3 flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-600" />
                          <span className="text-xs font-black text-[#1A102F]">{stampValidityPeriod}</span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-1">
                        {['Weekly', 'Monthly', 'Quarterly'].map((val) => {
                          const isSelected = stampValidityPeriod === val;
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setStampValidityPeriod(val)}
                              className={`py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-[#F3E8FF] text-[#5B21B6] border border-[#DDD6FE]'
                                  : 'bg-[#FAF8FD] text-gray-600 hover:bg-gray-100 border border-gray-200'
                              }`}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bottom Nav */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setIsConfiguringCondition(false)}
                        className="text-xs font-black text-[#2D0F55] hover:text-[#6D28D9] cursor-pointer"
                      >
                        Change condition
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(4)}
                        className="px-8 py-3 bg-[#2D0F55] hover:bg-[#3D1472] text-white rounded-2xl text-xs font-black shadow-md shadow-purple-950/20 cursor-pointer transition-all"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. ITEM BASED OFFERS (Matching Image 3) */}
                {conditionType === 'item' && (
                  <div className="space-y-3.5">
                    <div>
                      <h2 className="text-base font-black text-[#1A102F]">Item Based Offer Rules</h2>
                      <p className="text-xs text-[#64748B]">
                        Choose specific items or parent categories to trigger this promotional reward.
                      </p>
                    </div>

                    {/* Time Range Card */}
                    <div className="bg-white rounded-3xl p-5 border border-[#F1EBF5] shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#5B21B6]" />
                          <span className="text-xs font-black text-[#1A102F]">Time range</span>
                        </div>
                        <span className="bg-[#FFE4E6] text-[#E11D48] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          Optional
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <div className="flex-1 bg-[#FAF8FD] border border-gray-200 rounded-2xl p-2.5">
                          <div className="text-[10px] text-gray-400 font-semibold mb-0.5">Starts from</div>
                          <div className="flex items-center gap-1.5 text-xs font-black text-[#1A102F]">
                            <Clock className="w-3.5 h-3.5 text-[#5B21B6]" />
                            <span>{itemTimeStart}</span>
                          </div>
                        </div>

                        <div className="w-7 h-7 rounded-full bg-[#F3E8FF] text-[#5B21B6] flex items-center justify-center shrink-0">
                          →
                        </div>

                        <div className="flex-1 bg-[#FAF8FD] border border-gray-200 rounded-2xl p-2.5">
                          <div className="text-[10px] text-gray-400 font-semibold mb-0.5">Valid until</div>
                          <div className="flex items-center gap-1.5 text-xs font-black text-[#1A102F]">
                            <Clock className="w-3.5 h-3.5 text-[#E11D48]" />
                            <span>{itemTimeEnd}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-xs">
                        <div className="flex items-center gap-1.5 text-gray-500 font-semibold">
                          <span>⏳</span>
                          <span>Active window:</span>
                        </div>
                        <span className="font-black text-[#5B21B6]">6 hours / day</span>
                      </div>
                    </div>

                    {/* Specific items vs Category Picker */}
                    <div className="bg-white rounded-3xl p-5 border border-[#F1EBF5] shadow-2xs space-y-3.5">
                      {/* Segmented Switcher */}
                      <div className="bg-[#F3EFF9] p-1.5 rounded-2xl grid grid-cols-2 gap-1">
                        <button
                          type="button"
                          onClick={() => setItemOfferScope('specific')}
                          className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                            itemOfferScope === 'specific'
                              ? 'bg-white text-[#1A102F] shadow-xs'
                              : 'text-gray-500'
                          }`}
                        >
                          <Utensils className="w-3.5 h-3.5" />
                          <span>Specific items</span>
                          <span className="w-4 h-4 rounded-full bg-[#5B21B6] text-white text-[9px] flex items-center justify-center">
                            {selectedItemsForCondition.length}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setItemOfferScope('category')}
                          className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                            itemOfferScope === 'category'
                              ? 'bg-white text-[#1A102F] shadow-xs'
                              : 'text-gray-500'
                          }`}
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>Category</span>
                        </button>
                      </div>

                      {/* Search Bar */}
                      <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search item, cuisine, or SKU..."
                          className="w-full pl-9 pr-8 py-2.5 bg-[#FAF8FD] border border-gray-200 rounded-2xl text-xs font-medium outline-none focus:border-[#7C3AED]"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🎤</span>
                      </div>

                      {/* Category Horizontal Filter Pills */}
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {[
                          { label: 'Pizzas', icon: '🍕' },
                          { label: 'Pastas', icon: '🍝' },
                          { label: 'Beverages', icon: '☕' },
                          { label: 'Dessert', icon: '🍨' }
                        ].map((cat) => {
                          const isSelected = itemCategoryTab === cat.label;
                          return (
                            <button
                              key={cat.label}
                              type="button"
                              onClick={() => setItemCategoryTab(cat.label)}
                              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-1.5 cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-[#2D0F55] text-white shadow-xs'
                                  : 'bg-[#FAF8FD] text-gray-700 border border-gray-200'
                              }`}
                            >
                              <span>{cat.icon}</span>
                              <span>{cat.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Count & Select All */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5 text-xs font-black text-[#1A102F]">
                          <Sparkles className="w-3.5 h-3.5 text-[#5B21B6]" />
                          <span>{selectedItemsForCondition.length} items selected for promotion</span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedItemsForCondition([
                              'Margherita Pizza',
                              'Pasta Alfredo',
                              'Caesar Salad',
                              'Cold Coffee'
                            ])
                          }
                          className="text-xs font-black text-[#5B21B6] hover:underline cursor-pointer"
                        >
                          Select all
                        </button>
                      </div>

                      {/* Item List */}
                      <div className="space-y-2 pt-1">
                        {[
                          {
                            name: 'Margherita Pizza',
                            badge: 'Bestseller',
                            badgeBg: 'bg-[#FFE4E6] text-[#E11D48]',
                            price: '₹ 299',
                            desc: 'Wood-fired 11-inch',
                            img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=100&auto=format&fit=crop&q=80'
                          },
                          {
                            name: 'Pasta Alfredo',
                            badge: 'Chef Choice',
                            badgeBg: 'bg-[#EDE9FE] text-[#7C3AED]',
                            price: '₹ 349',
                            desc: 'Rich Garlic Parmesan',
                            img: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281292?w=100&auto=format&fit=crop&q=80'
                          },
                          {
                            name: 'Caesar Salad',
                            badge: null,
                            badgeBg: '',
                            price: '₹ 249',
                            desc: 'Crisp Romaine & Shaved Parmesan',
                            img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100&auto=format&fit=crop&q=80'
                          },
                          {
                            name: 'Cold Coffee',
                            badge: null,
                            badgeBg: '',
                            price: '₹ 149',
                            desc: 'Brewed Cold Roast 350ml',
                            img: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=100&auto=format&fit=crop&q=80'
                          }
                        ].map((food) => {
                          const isChecked = selectedItemsForCondition.includes(food.name);
                          return (
                            <div
                              key={food.name}
                              onClick={() => {
                                setSelectedItemsForCondition((prev) =>
                                  prev.includes(food.name)
                                    ? prev.filter((x) => x !== food.name)
                                    : [...prev, food.name]
                                );
                              }}
                              className="p-2.5 rounded-2xl border border-gray-100 bg-[#FAF8FD] hover:bg-white flex items-center justify-between cursor-pointer transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={food.img}
                                  alt={food.name}
                                  className="w-11 h-11 rounded-xl object-cover shrink-0"
                                />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-black text-[#1A102F]">{food.name}</span>
                                    {food.badge && (
                                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${food.badgeBg}`}>
                                        {food.badge}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-gray-500 mt-0.5 font-medium">
                                    <span className="font-bold text-gray-700">{food.price}</span> • {food.desc}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-5 h-5 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                                    isChecked
                                      ? 'bg-[#2D0F55] text-white shadow-xs'
                                      : 'bg-white border border-gray-300 text-transparent'
                                  }`}
                                >
                                  ✓
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bottom Nav */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setIsConfiguringCondition(false)}
                        className="text-xs font-black text-[#2D0F55] hover:text-[#6D28D9] cursor-pointer"
                      >
                        Change condition
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(4)}
                        className="px-8 py-3 bg-[#2D0F55] hover:bg-[#3D1472] text-white rounded-2xl text-xs font-black shadow-md shadow-purple-950/20 cursor-pointer transition-all"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* 5. HAPPY HOURS (Matching Image 4) */}
                {conditionType === 'happy_hours' && (
                  <div className="space-y-3.5">
                    <div>
                      <h2 className="text-base font-black text-[#1A102F]">Happy Hours Rule</h2>
                      <p className="text-xs text-[#64748B]">
                        Set the time, day and duration window to trigger exclusive tier pricing.
                      </p>
                    </div>

                    {/* Strategic Promotional Banner */}
                    <div className="relative rounded-3xl overflow-hidden shadow-md bg-gradient-to-r from-[#2D0F55] via-[#4C1D95] to-[#7C3AED] p-5 text-white">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-200 mb-1">
                        <span>🍸</span>
                        <span>Peak Traffic Strategy</span>
                      </div>
                      <h3 className="text-xl font-black tracking-tight">Afternoon Boost</h3>
                      <p className="text-xs text-purple-200 mt-1 font-medium">Drive 3.4x weekday footfall</p>
                    </div>

                    {/* Time Range Card */}
                    <div className="bg-white rounded-3xl p-5 border border-[#F1EBF5] shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#5B21B6]" />
                          <span className="text-xs font-black text-[#1A102F]">Time range</span>
                        </div>
                        <span className="bg-[#F3E8FF] text-[#5B21B6] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          Standard Slot
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <div className="flex-1 bg-[#FAF8FD] border border-gray-200 rounded-2xl p-2.5">
                          <div className="text-[10px] text-gray-400 font-semibold mb-0.5">Starts from</div>
                          <div className="flex items-center gap-1.5 text-xs font-black text-[#1A102F]">
                            <Clock className="w-3.5 h-3.5 text-[#5B21B6]" />
                            <span>{happyHourStart}</span>
                          </div>
                        </div>

                        <div className="w-7 h-7 rounded-full bg-[#F3E8FF] text-[#5B21B6] flex items-center justify-center shrink-0">
                          →
                        </div>

                        <div className="flex-1 bg-[#FAF8FD] border border-gray-200 rounded-2xl p-2.5">
                          <div className="text-[10px] text-gray-400 font-semibold mb-0.5">Valid until</div>
                          <div className="flex items-center gap-1.5 text-xs font-black text-[#1A102F]">
                            <Clock className="w-3.5 h-3.5 text-[#E11D48]" />
                            <span>{happyHourEnd}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-xs">
                        <div className="flex items-center gap-1.5 text-gray-500 font-semibold">
                          <span>⏳</span>
                          <span>Active window:</span>
                        </div>
                        <span className="font-black text-[#5B21B6]">6 hours / day</span>
                      </div>
                    </div>

                    {/* Days Selection Card */}
                    <div className="bg-white rounded-3xl p-5 border border-[#F1EBF5] shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#5B21B6]" />
                          <span className="text-xs font-black text-[#1A102F]">Days</span>
                        </div>
                        <span className="text-xs font-bold text-[#E11D48]">Weekdays (5)</span>
                      </div>

                      <div className="flex items-center justify-between gap-1.5 pt-1">
                        {[
                          { key: 'M', full: 'Mon', active: true },
                          { key: 'T', full: 'Tue', active: true },
                          { key: 'W', full: 'Wed', active: true },
                          { key: 'T', full: 'Thu', active: true },
                          { key: 'F', full: 'Fri', active: true },
                          { key: 'S', full: 'Sat', active: false },
                          { key: 'S', full: 'Sun', active: false }
                        ].map((d, idx) => (
                          <div
                            key={idx}
                            className={`w-10 h-10 rounded-full flex flex-col items-center justify-center font-bold text-xs shadow-xs cursor-pointer ${
                              d.active
                                ? 'bg-gradient-to-b from-[#4C1D95] to-[#2D0F55] text-white'
                                : 'bg-[#FAF8FD] border border-gray-200 text-gray-400'
                            }`}
                          >
                            <span>{d.key}</span>
                            <span className="text-[8px] opacity-75 font-normal leading-none">{d.full.slice(1)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-[#64748B] pt-1">
                        <Calendar className="w-3.5 h-3.5 text-[#5B21B6]" />
                        <span>Recurring on 5 days every week</span>
                      </div>
                    </div>

                    {/* Applicable on Card */}
                    <div className="bg-white rounded-3xl p-5 border border-[#F1EBF5] shadow-2xs space-y-2">
                      <span className="text-xs font-black text-[#1A102F]">Select applicable on</span>
                      <div className="bg-[#FAF8FD] border border-gray-200 rounded-2xl p-3 flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2.5">
                          <Utensils className="w-4 h-4 text-[#5B21B6]" />
                          <div>
                            <div className="text-xs font-black text-[#1A102F]">{happyHourScope}</div>
                            <div className="text-[10px] text-gray-400">Entire menu catalog included</div>
                          </div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Rule Preview */}
                    <div className="bg-[#F6EEFD] border border-[#E9D5FF] rounded-2xl p-4 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#5B21B6] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs font-black text-[#2D0F55]">Rule Preview</div>
                        <div className="text-xs text-[#4C1D95] leading-relaxed">
                          This offer will be valid from 10:00 AM to 04:00 PM,{' '}
                          <span className="font-bold text-[#2D0F55]">Mon to Fri</span>.
                        </div>
                      </div>
                    </div>

                    {/* Bottom Nav */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setIsConfiguringCondition(false)}
                        className="text-xs font-black text-[#2D0F55] hover:text-[#6D28D9] cursor-pointer"
                      >
                        Change condition
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(4)}
                        className="px-8 py-3 bg-[#2D0F55] hover:bg-[#3D1472] text-white rounded-2xl text-xs font-black shadow-md shadow-purple-950/20 cursor-pointer transition-all"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* 6. BIRTHDAY / ANNIVERSARY (Matching Image 5) */}
                {(conditionType === 'birthday' || conditionType === 'anniversary') && (
                  <div className="space-y-3.5">
                    <div>
                      <h2 className="text-base font-black text-[#1A102F]">Birthday/Anniversary Offer Rule</h2>
                      <p className="text-xs text-[#64748B]">
                        Set the special day eligibility window and customer group for automated surprise perks
                      </p>
                    </div>

                    {/* Select Month Card */}
                    <div className="bg-white rounded-3xl p-5 border border-[#F1EBF5] shadow-2xs space-y-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#5B21B6]" />
                          <span className="text-xs font-black text-[#1A102F]">Select Month</span>
                        </div>
                        <p className="text-[11px] text-[#64748B] mt-0.5">
                          Choose in which month this offer will be available.
                        </p>
                      </div>

                      <div className="grid grid-cols-6 gap-2 pt-1">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(
                          (m) => {
                            const isSelected = birthdayMonth === m;
                            return (
                              <button
                                key={m}
                                type="button"
                                onClick={() => setBirthdayMonth(m)}
                                className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#2D0F55] text-white shadow-xs'
                                    : 'bg-[#FAF8FD] text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                              >
                                {m}
                                {isSelected ? ' ✓' : ''}
                              </button>
                            );
                          }
                        )}
                      </div>
                    </div>

                    {/* Birthday vs Anniversary Switcher */}
                    <div className="bg-[#F3EFF9] p-1.5 rounded-2xl grid grid-cols-2 gap-1">
                      <button
                        type="button"
                        onClick={() => setSpecialDayMode('birthday')}
                        className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                          specialDayMode === 'birthday'
                            ? 'bg-white text-[#1A102F] shadow-xs'
                            : 'text-gray-500'
                        }`}
                      >
                        <span>🎉</span>
                        <span>Birthday</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSpecialDayMode('anniversary')}
                        className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                          specialDayMode === 'anniversary'
                            ? 'bg-white text-[#1A102F] shadow-xs'
                            : 'text-gray-500'
                        }`}
                      >
                        <span>💍</span>
                        <span>Anniversary</span>
                      </button>
                    </div>

                    {/* Days Before Card */}
                    <div className="bg-white rounded-3xl p-5 border border-[#F1EBF5] shadow-2xs space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#5B21B6]" />
                          <span className="text-xs font-black text-[#1A102F]">Days before</span>
                        </div>
                        <span className="bg-[#FFE4E6] text-[#E11D48] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          Flexible Window
                        </span>
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center justify-between bg-[#FAF8FD] p-2.5 rounded-2xl border border-gray-200">
                        <button
                          type="button"
                          onClick={() => setBirthdayDaysSpan((d) => Math.max(0, d - 1))}
                          className="w-11 h-11 rounded-xl bg-white border border-gray-200 font-bold text-gray-700 text-lg flex items-center justify-center cursor-pointer active:scale-95"
                        >
                          -
                        </button>
                        <div className="text-center">
                          <div className="text-2xl font-black text-[#1A102F]">{birthdayDaysSpan}</div>
                          <div className="text-[10px] text-[#64748B] font-semibold">- {birthdayDaysSpan} days span</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setBirthdayDaysSpan((d) => d + 1)}
                          className="w-11 h-11 rounded-xl bg-[#2D0F55] text-white font-bold text-lg flex items-center justify-center cursor-pointer active:scale-95 shadow-xs"
                        >
                          +
                        </button>
                      </div>

                      {/* Quick Pills */}
                      <div className="grid grid-cols-4 gap-1.5 pt-1">
                        {[
                          { label: 'Exact Day', val: 0 },
                          { label: '- 3 Days', val: 3 },
                          { label: '- 7 Days', val: 7 },
                          { label: '- 14 Days', val: 14 }
                        ].map((sp) => {
                          const isSelected = birthdayDaysSpan === sp.val;
                          return (
                            <button
                              key={sp.label}
                              type="button"
                              onClick={() => setBirthdayDaysSpan(sp.val)}
                              className={`py-2 rounded-xl text-[10px] font-bold cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-[#F3E8FF] text-[#5B21B6] border border-[#DDD6FE]'
                                  : 'bg-[#FAF8FD] text-gray-600 hover:bg-gray-100 border border-gray-200'
                              }`}
                            >
                              {sp.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Info preview */}
                      <div className="bg-[#F6EEFD] border border-[#E9D5FF] rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-[#4C1D95]">
                        <div className="w-5 h-5 rounded-full bg-[#5B21B6] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          i
                        </div>
                        <div>
                          Offer will be automatically claimable{' '}
                          <span className="font-black">
                            {birthdayDaysSpan === 0
                              ? 'on the exact day'
                              : `${birthdayDaysSpan} days prior or on`}
                          </span>{' '}
                          the member's {specialDayMode}.
                        </div>
                      </div>
                    </div>

                    {/* Valid For Audience Segment Card */}
                    <div className="bg-white rounded-3xl p-5 border border-[#F1EBF5] shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#5B21B6]" />
                          <span className="text-xs font-black text-[#1A102F]">Valid for</span>
                        </div>
                        <span className="text-[11px] font-semibold text-gray-400">Audience Segment</span>
                      </div>

                      <div className="bg-[#FAF8FD] border border-gray-200 rounded-2xl p-3 flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2.5">
                          <Users className="w-4 h-4 text-[#5B21B6]" />
                          <span className="text-xs font-black text-[#1A102F]">{birthdayValidFor}</span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>

                      {/* Forecast Banner */}
                      <div className="bg-[#FFF5F8] border border-[#FFE4E6] rounded-2xl p-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#E11D48]" />
                          <span className="font-semibold text-gray-600">Eligible Monthly Forecast</span>
                        </div>
                        <span className="font-black text-[#E11D48]">~28 guests / month</span>
                      </div>
                    </div>

                    {/* Bottom Nav */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setIsConfiguringCondition(false)}
                        className="text-xs font-black text-[#2D0F55] hover:text-[#6D28D9] cursor-pointer"
                      >
                        Change condition
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(4)}
                        className="px-8 py-3 bg-[#2D0F55] hover:bg-[#3D1472] text-white rounded-2xl text-xs font-black shadow-md shadow-purple-950/20 cursor-pointer transition-all"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* 7. COMBO OFFERS (Matching Image) */}
                {conditionType === 'combo' && (
                  <div className="space-y-3.5">
                    <div>
                      <h2 className="text-base font-black text-[#1A102F]">Combo Offers Rule</h2>
                      <p className="text-xs text-[#64748B]">
                        Select the combo items eligible for this smart campaign trigger.
                      </p>
                    </div>

                    {/* Time Range Card */}
                    <div className="bg-white rounded-3xl p-5 border border-[#F1EBF5] shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#5B21B6]" />
                          <span className="text-xs font-black text-[#1A102F]">Time range</span>
                        </div>
                        <span className="bg-[#F3E8FF] text-[#5B21B6] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          Standard Slot
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <div className="flex-1 bg-[#FAF8FD] border border-gray-200 rounded-2xl p-2.5">
                          <div className="text-[10px] text-gray-400 font-semibold mb-0.5">Starts from</div>
                          <div className="flex items-center gap-1.5 text-xs font-black text-[#1A102F]">
                            <Clock className="w-3.5 h-3.5 text-[#5B21B6]" />
                            <span>{comboTimeStart}</span>
                          </div>
                        </div>

                        <div className="w-7 h-7 rounded-full bg-[#F3E8FF] text-[#5B21B6] flex items-center justify-center shrink-0">
                          →
                        </div>

                        <div className="flex-1 bg-[#FAF8FD] border border-gray-200 rounded-2xl p-2.5">
                          <div className="text-[10px] text-gray-400 font-semibold mb-0.5">Valid until</div>
                          <div className="flex items-center gap-1.5 text-xs font-black text-[#1A102F]">
                            <Clock className="w-3.5 h-3.5 text-[#E11D48]" />
                            <span>{comboTimeEnd}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-xs">
                        <div className="flex items-center gap-1.5 text-gray-500 font-semibold">
                          <span>⏳</span>
                          <span>Active window:</span>
                        </div>
                        <span className="font-black text-[#5B21B6]">6 hours / day</span>
                      </div>
                    </div>

                    {/* Fixed vs Custom Combo Switcher */}
                    <div className="bg-[#F3EFF9] p-1.5 rounded-2xl grid grid-cols-2 gap-1">
                      <button
                        type="button"
                        onClick={() => setComboMode('fixed')}
                        className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          comboMode === 'fixed'
                            ? 'bg-[#2D0F55] text-white shadow-xs'
                            : 'bg-transparent text-gray-700 hover:text-black'
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Fixed combo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setComboMode('custom')}
                        className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          comboMode === 'custom'
                            ? 'bg-[#2D0F55] text-white shadow-xs'
                            : 'bg-transparent text-gray-700 hover:text-black'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Custom combo</span>
                      </button>
                    </div>

                    {/* Preview Trio Canvas Card */}
                    <div className="bg-white rounded-3xl p-5 border border-[#F1EBF5] shadow-2xs space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-[#DB2777]" />
                          <span className="text-xs font-black text-[#1A102F]">Preview Trio Canvas</span>
                        </div>
                        <span className="bg-[#F3E8FF] text-[#5B21B6] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          Dynamic Tier
                        </span>
                      </div>

                      {/* 3 Canvas Slots */}
                      <div className="flex items-center justify-between gap-1.5 pt-1">
                        {/* Slot 1: Main Entree */}
                        <div className="flex-1 bg-[#FFF9F5] border border-[#FED7AA] rounded-2xl p-2.5 flex flex-col items-center justify-center relative">
                          <span className="w-4 h-4 rounded-full bg-[#2D0F55] text-white text-[9px] font-bold flex items-center justify-center absolute -top-1 -right-1 shadow-2xs">
                            1
                          </span>
                          <span className="text-2xl mb-1">🍔</span>
                          <span className="text-[10px] font-black text-[#1A102F] text-center">Main Entree</span>
                        </div>

                        <span className="text-gray-400 font-bold text-sm">+</span>

                        {/* Slot 2: Beverage */}
                        <div className="flex-1 bg-[#F8FAFC] border border-gray-200 rounded-2xl p-2.5 flex flex-col items-center justify-center relative">
                          <span className="w-4 h-4 rounded-full bg-[#2D0F55] text-white text-[9px] font-bold flex items-center justify-center absolute -top-1 -right-1 shadow-2xs">
                            2
                          </span>
                          <span className="text-2xl mb-1">🥤</span>
                          <span className="text-[10px] font-black text-[#1A102F] text-center">Beverage</span>
                        </div>

                        <span className="text-gray-400 font-bold text-sm">+</span>

                        {/* Slot 3: Side */}
                        <div className="flex-1 bg-[#FFF9F5] border border-[#FED7AA] rounded-2xl p-2.5 flex flex-col items-center justify-center relative">
                          <span className="w-4 h-4 rounded-full bg-[#2D0F55] text-white text-[9px] font-bold flex items-center justify-center absolute -top-1 -right-1 shadow-2xs">
                            3
                          </span>
                          <span className="text-2xl mb-1">🍟</span>
                          <span className="text-[10px] font-black text-[#1A102F] text-center">Side</span>
                        </div>
                      </div>

                      {/* Target Price */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                        <div className="flex items-center gap-1.5 text-gray-500 font-semibold">
                          <Tag className="w-3.5 h-3.5 text-[#5B21B6]" />
                          <span>Recommended target price:</span>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-black text-[#1A102F]">$14.99</span>
                          <span className="line-through text-xs text-gray-400 font-medium">$19.50</span>
                        </div>
                      </div>
                    </div>

                    {/* Create Your Own Combo Steps */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xs font-black text-[#1A102F]">Create your own combo</h3>
                          <p className="text-[10px] text-[#64748B]">Follow 3 quick steps to automate basket upsell</p>
                        </div>
                        <div className="w-7 h-7 rounded-xl bg-[#F3E8FF] text-[#5B21B6] flex items-center justify-center text-xs">
                          <QrCode className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="bg-white border border-[#F1EBF5] rounded-2xl p-3 flex items-start gap-3 shadow-2xs">
                          <div className="w-5 h-5 rounded-full bg-[#2D0F55] text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                            1
                          </div>
                          <div>
                            <div className="text-xs font-black text-[#1A102F]">Select items</div>
                            <div className="text-[10px] text-[#64748B] mt-0.5">Choose items from the menu to bundle together</div>
                          </div>
                        </div>

                        <div className="bg-white border border-[#F1EBF5] rounded-2xl p-3 flex items-start gap-3 shadow-2xs">
                          <div className="w-5 h-5 rounded-full bg-[#2D0F55] text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                            2
                          </div>
                          <div>
                            <div className="text-xs font-black text-[#1A102F]">Set combo price</div>
                            <div className="text-[10px] text-[#64748B] mt-0.5">Add special price for the combo with discount rules</div>
                          </div>
                        </div>

                        <div className="bg-white border border-[#F1EBF5] rounded-2xl p-3 flex items-start gap-3 shadow-2xs">
                          <div className="w-5 h-5 rounded-full bg-[#2D0F55] text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                            3
                          </div>
                          <div>
                            <div className="text-xs font-black text-[#1A102F]">Save offer</div>
                            <div className="text-[10px] text-[#64748B] mt-0.5">Your custom combo will be saved and shown in fixed combos next time.</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Your Combo Card */}
                    <div className="bg-white rounded-3xl p-5 border border-[#F1EBF5] shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-black text-[#1A102F]">
                          <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
                          <span>Your combo</span>
                        </div>
                        <Edit3 className="w-4 h-4 text-gray-400 cursor-pointer" />
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        <div className="bg-[#FAF8FD] rounded-2xl p-2.5 flex items-center justify-between border border-gray-100">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-[#FFE4E6] text-[#E11D48] flex items-center justify-center font-bold text-sm">
                              🍕
                            </div>
                            <div>
                              <div className="text-xs font-black text-[#1A102F]">Margherita Pizza</div>
                              <div className="text-[10px] text-gray-400">Hand-tossed 8" classic</div>
                            </div>
                          </div>
                          <span className="border border-gray-200 bg-white px-2 py-0.5 rounded-lg text-xs font-bold text-gray-600">
                            x 1
                          </span>
                        </div>

                        <div className="bg-[#FAF8FD] rounded-2xl p-2.5 flex items-center justify-between border border-gray-100">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center font-bold text-sm">
                              ☕
                            </div>
                            <div>
                              <div className="text-xs font-black text-[#1A102F]">Cold Coffee</div>
                              <div className="text-[10px] text-gray-400">Signature cold brew 250ml</div>
                            </div>
                          </div>
                          <span className="border border-gray-200 bg-white px-2 py-0.5 rounded-lg text-xs font-bold text-gray-600">
                            x 1
                          </span>
                        </div>
                      </div>

                      {/* Price Summary */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div>
                          <div className="text-[9px] font-bold text-gray-400 tracking-wider">TOTAL VALUE</div>
                          <div className="text-xs font-bold text-gray-600">₹448</div>
                        </div>

                        <span className="bg-[#E11D48] text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-2xs">
                          11% OFF
                        </span>

                        <div className="text-right">
                          <div className="text-[9px] font-bold text-gray-400 tracking-wider">COMBO PRICE</div>
                          <div className="text-2xl font-black text-[#1A102F]">₹{customComboPrice}</div>
                        </div>
                      </div>
                    </div>

                    {/* Two Visual Thumbnails */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="relative rounded-2xl overflow-hidden h-24 shadow-2xs">
                        <img
                          src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&auto=format&fit=crop&q=80"
                          alt="Fresh Crust"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-lg">
                          Fresh Crust
                        </span>
                      </div>
                      <div className="relative rounded-2xl overflow-hidden h-24 shadow-2xs">
                        <img
                          src="https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=300&auto=format&fit=crop&q=80"
                          alt="Cold Crafted"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-lg">
                          Cold Crafted
                        </span>
                      </div>
                    </div>

                    {/* Combo Name Input */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#1A102F]">Combo name *</span>
                        <span className="text-[10px] font-bold text-[#E11D48]">Required</span>
                      </div>
                      <div className="flex items-center bg-[#FAF8FD] border border-gray-200 rounded-2xl px-3.5 py-3 focus-within:border-[#7C3AED]">
                        <Bookmark className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
                        <input
                          type="text"
                          value={customComboName}
                          onChange={(e) => setCustomComboName(e.target.value)}
                          className="w-full bg-transparent text-xs font-black text-[#1A102F] outline-none"
                          placeholder="e.g. Weekend Duo Special"
                        />
                        {customComboName && (
                          <X
                            onClick={() => setCustomComboName('')}
                            className="w-4 h-4 text-gray-400 hover:text-black cursor-pointer shrink-0"
                          />
                        )}
                      </div>
                    </div>

                    {/* Suggested Smart Tags */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-semibold text-gray-500">Suggested smart tags</span>
                      <div className="flex flex-wrap gap-1.5">
                        {['Dinner Special', 'Weekend Duo Special', 'Lunch Deal', 'Snack Pair', 'Bestseller'].map(
                          (tag) => {
                            const isSelected = customComboSelectedTag === tag;
                            return (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => {
                                  setCustomComboSelectedTag(tag);
                                  setCustomComboName(tag);
                                }}
                                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer transition-all ${
                                  isSelected
                                    ? 'bg-[#2D0F55] text-white shadow-xs'
                                    : 'bg-[#FAF8FD] text-gray-700 hover:bg-gray-100 border border-gray-200'
                                }`}
                              >
                                {tag}
                              </button>
                            );
                          }
                        )}
                      </div>
                    </div>

                    {/* Automatic Promo Sync Banner */}
                    <div className="bg-[#F6EEFD] border border-[#E9D5FF] rounded-2xl p-4 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#5B21B6] text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Shield className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs font-black text-[#2D0F55]">Automatic Promo Sync</div>
                        <div className="text-[11px] text-[#4C1D95] leading-relaxed">
                          This combo will be saved under Fixed Combos for instant re-use across all POS and marketing campaigns.
                        </div>
                      </div>
                    </div>

                    {/* Bottom Nav */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setIsConfiguringCondition(false)}
                        className="text-xs font-black text-[#2D0F55] hover:text-[#6D28D9] cursor-pointer"
                      >
                        Change condition
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(4)}
                        className="px-8 py-3 bg-[#2D0F55] hover:bg-[#3D1472] text-white rounded-2xl text-xs font-black shadow-md shadow-purple-950/20 cursor-pointer transition-all"
                      >
                        Save and Launch
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ===================================================================== */}
        {/* STEP 4: REWARDS */}
        {/* ===================================================================== */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h1 className="text-[22px] font-black text-[#1A102F]">Choose Reward Type</h1>
              <p className="text-xs text-[#64748B] mt-0.5">
                Choose how you want to define the eligibility for its campaign
              </p>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* SUB-STATE 1: REWARD CATALOG (Image: Campaign- Reward Type-1) */}
            {/* ------------------------------------------------------------- */}
            {!isConfiguringReward && (
              <div className="space-y-3">
                {[
                  {
                    id: 'cashback',
                    title: 'Cashback',
                    badge: 'High Retention',
                    badgeColor: 'bg-[#ECFDF5] text-[#059669]',
                    desc: 'Get a % or fixed amount back on eligible orders',
                    icon: (
                      <div className="w-11 h-11 rounded-2xl bg-[#F3E8FF] flex items-center justify-center text-[#7C3AED]">
                        <Coins className="w-5 h-5" />
                      </div>
                    )
                  },
                  {
                    id: 'points',
                    title: 'Reward Points',
                    badge: 'Tiered',
                    badgeColor: 'bg-[#F3E8FF] text-[#7C3AED]',
                    desc: 'Earn points on every purchase. Redeem for future orders.',
                    icon: (
                      <div className="w-11 h-11 rounded-2xl bg-[#FEF3C7] flex items-center justify-center text-[#D97706]">
                        <Star className="w-5 h-5 fill-[#D97706]/20" />
                      </div>
                    )
                  },
                  {
                    id: 'free_item',
                    title: 'Free Item',
                    badge: 'Basket Booster',
                    badgeColor: 'bg-[#FFE4E6] text-[#E11D48]',
                    desc: 'Offer complimentary item from your menu.',
                    icon: (
                      <div className="w-11 h-11 rounded-2xl bg-[#FFE4E6] flex items-center justify-center text-[#E11D48]">
                        <Gift className="w-5 h-5" />
                      </div>
                    )
                  },
                  {
                    id: 'discount',
                    title: 'Discount',
                    badge: 'Most Popular',
                    badgeColor: 'bg-[#FCE7F3] text-[#DB2777]',
                    desc: 'Get a % or fixed amount discount on eligible orders.',
                    icon: (
                      <div className="w-11 h-11 rounded-2xl bg-[#2D0F55] flex items-center justify-center text-white">
                        <Tag className="w-5 h-5" />
                      </div>
                    )
                  },
                  {
                    id: 'nominal_item',
                    title: 'Nominal Priced Item',
                    badge: 'Add-on',
                    badgeColor: 'bg-[#CCFBF1] text-[#0F766E]',
                    desc: 'Offer select items at an irresistible low price like ₹19.',
                    icon: (
                      <div className="w-11 h-11 rounded-2xl bg-[#CCFBF1] flex items-center justify-center text-[#0F766E]">
                        <DollarSign className="w-5 h-5" />
                      </div>
                    )
                  },
                  {
                    id: 'combo',
                    title: 'Combo Offers',
                    badge: 'Bundle',
                    badgeColor: 'bg-[#FFE4E6] text-[#E11D48]',
                    desc: 'Curate or offer fixed & custom item bundles.',
                    icon: (
                      <div className="w-11 h-11 rounded-2xl bg-[#FFEDD5] flex items-center justify-center text-[#EA580C]">
                        <Package className="w-5 h-5" />
                      </div>
                    )
                  },
                  {
                    id: 'bogo',
                    title: 'Buy X Get Y Free',
                    badge: 'BOGO',
                    badgeColor: 'bg-[#F3E8FF] text-[#7C3AED]',
                    desc: 'Complimentary item on purchasing qualifying quantity.',
                    icon: (
                      <div className="w-11 h-11 rounded-2xl bg-[#F3E8FF] flex items-center justify-center text-[#7C3AED]">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                    )
                  }
                ].map((rew) => (
                  <div
                    key={rew.id}
                    onClick={() => {
                      setRewardType(rew.id as any);
                      setIsConfiguringReward(true);
                    }}
                    className="p-3.5 bg-white border border-[#F1EBF5] rounded-3xl flex items-center justify-between cursor-pointer hover:border-purple-300 hover:shadow-xs transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      {rew.icon}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-[#1A102F]">{rew.title}</span>
                          <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${rew.badgeColor}`}>
                            {rew.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{rew.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
                  </div>
                ))}
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* SUB-STATE 2: DETAILED REWARD CONFIGURATION VIEWS              */}
            {/* ------------------------------------------------------------- */}
            {isConfiguringReward && (
              <div className="space-y-4">
                {/* Active Reward Dropdown Header */}
                <div
                  onClick={() => setIsConfiguringReward(false)}
                  className="p-3.5 bg-white border border-[#F1EBF5] rounded-3xl flex items-center justify-between cursor-pointer shadow-2xs hover:border-purple-300 transition-all"
                >
                  <div className="flex items-center gap-3">
                    {rewardType === 'cashback' && (
                      <div className="w-11 h-11 rounded-2xl bg-[#F3E8FF] flex items-center justify-center text-[#7C3AED]">
                        <Coins className="w-5 h-5" />
                      </div>
                    )}
                    {rewardType === 'points' && (
                      <div className="w-11 h-11 rounded-2xl bg-[#FEF3C7] flex items-center justify-center text-[#D97706]">
                        <Star className="w-5 h-5 fill-[#D97706]/20" />
                      </div>
                    )}
                    {rewardType === 'free_item' && (
                      <div className="w-11 h-11 rounded-2xl bg-[#FFE4E6] flex items-center justify-center text-[#E11D48]">
                        <Gift className="w-5 h-5" />
                      </div>
                    )}
                    {rewardType === 'discount' && (
                      <div className="w-11 h-11 rounded-2xl bg-[#2D0F55] flex items-center justify-center text-white">
                        <Tag className="w-5 h-5" />
                      </div>
                    )}
                    {rewardType === 'nominal_item' && (
                      <div className="w-11 h-11 rounded-2xl bg-[#CCFBF1] flex items-center justify-center text-[#0F766E]">
                        <DollarSign className="w-5 h-5" />
                      </div>
                    )}
                    {rewardType === 'combo' && (
                      <div className="w-11 h-11 rounded-2xl bg-[#FFEDD5] flex items-center justify-center text-[#EA580C]">
                        <Package className="w-5 h-5" />
                      </div>
                    )}
                    {rewardType === 'bogo' && (
                      <div className="w-11 h-11 rounded-2xl bg-[#F3E8FF] flex items-center justify-center text-[#7C3AED]">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-[#1A102F]">
                          {rewardType === 'cashback' && 'Cashback'}
                          {rewardType === 'points' && 'Reward Points'}
                          {rewardType === 'free_item' && 'Free Item'}
                          {rewardType === 'discount' && 'Discount'}
                          {rewardType === 'nominal_item' && 'Nominal Priced Item'}
                          {rewardType === 'combo' && 'Combo Offers'}
                          {rewardType === 'bogo' && 'Buy X Get Y Free'}
                        </span>
                        <span
                          className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${
                            rewardType === 'cashback'
                              ? 'bg-[#ECFDF5] text-[#059669]'
                              : rewardType === 'points'
                              ? 'bg-[#F3E8FF] text-[#7C3AED]'
                              : rewardType === 'free_item'
                              ? 'bg-[#FFE4E6] text-[#E11D48]'
                              : rewardType === 'discount'
                              ? 'bg-[#FCE7F3] text-[#DB2777]'
                              : rewardType === 'nominal_item'
                              ? 'bg-[#CCFBF1] text-[#0F766E]'
                              : rewardType === 'combo'
                              ? 'bg-[#FFE4E6] text-[#E11D48]'
                              : 'bg-[#F3E8FF] text-[#7C3AED]'
                          }`}
                        >
                          {rewardType === 'cashback' && 'High Retention'}
                          {rewardType === 'points' && 'Tiered'}
                          {rewardType === 'free_item' && 'Basket Booster'}
                          {rewardType === 'discount' && 'Most Popular'}
                          {rewardType === 'nominal_item' && 'Add-on'}
                          {rewardType === 'combo' && 'Bundle'}
                          {rewardType === 'bogo' && 'BOGO'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                        {rewardType === 'cashback' && 'Get a % or fixed amount back on eligible orders'}
                        {rewardType === 'points' && 'Earn points on every purchase. Redeem for future orders.'}
                        {rewardType === 'free_item' && 'Offer complimentary item from your menu.'}
                        {rewardType === 'discount' && 'Get a % or fixed amount discount on eligible orders.'}
                        {rewardType === 'nominal_item' && 'Offer select items at an irresistible low price like ₹19.'}
                        {rewardType === 'combo' && 'Curate or offer fixed & custom item bundles.'}
                        {rewardType === 'bogo' && 'Complimentary item on purchasing qualifying quantity.'}
                      </p>
                    </div>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>

                {/* ========================================================= */}
                {/* 1. CASHBACK REWARD (Campaign- Reward Type- Cashback.png) */}
                {/* ========================================================= */}
                {rewardType === 'cashback' && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div>
                      <label className="text-xs font-black text-[#1A102F] block mb-2">Type of cashback</label>
                      <div className="grid grid-cols-2 gap-3">
                        <div
                          onClick={() => setCashbackType('percentage')}
                          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between min-h-[92px] ${
                            cashbackType === 'percentage'
                              ? 'border-[#7C3AED] bg-white shadow-xs'
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                cashbackType === 'percentage'
                                  ? 'border-2 border-[#7C3AED]'
                                  : 'border-2 border-gray-300'
                              }`}
                            >
                              {cashbackType === 'percentage' && (
                                <div className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" />
                              )}
                            </div>
                            <Percent className="w-4 h-4 text-[#1A102F]" />
                          </div>
                          <div>
                            <div className="text-sm font-black text-[#1A102F]">Percentage</div>
                            <div className="text-[10.5px] text-gray-400">e.g. 10% of bill</div>
                          </div>
                        </div>

                        <div
                          onClick={() => setCashbackType('fixed')}
                          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between min-h-[92px] ${
                            cashbackType === 'fixed'
                              ? 'border-[#7C3AED] bg-white shadow-xs'
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                cashbackType === 'fixed'
                                  ? 'border-2 border-[#7C3AED]'
                                  : 'border-2 border-gray-300'
                              }`}
                            >
                              {cashbackType === 'fixed' && (
                                <div className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" />
                              )}
                            </div>
                            <Coins className="w-4 h-4 text-gray-400" />
                          </div>
                          <div>
                            <div className="text-sm font-black text-[#1A102F]">Fixed amount</div>
                            <div className="text-[10.5px] text-gray-400">e.g. ₹50 cashback</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-black text-[#1A102F] block mb-1.5">
                        {cashbackType === 'percentage' ? 'Enter percentage' : 'Enter amount'}
                      </label>
                      <div className="bg-white border border-gray-200 rounded-2xl p-2 flex items-center justify-between shadow-2xs">
                        <input
                          type="text"
                          value={cashbackType === 'percentage' ? cashbackPercent : cashbackFixed}
                          onChange={(e) =>
                            cashbackType === 'percentage'
                              ? setCashbackPercent(e.target.value)
                              : setCashbackFixed(e.target.value)
                          }
                          className="text-lg font-black text-[#1A102F] bg-transparent outline-none w-full px-2"
                        />
                        <div className="bg-[#F3E8FF] text-[#7C3AED] font-black text-sm px-3.5 py-2 rounded-xl flex items-center justify-center">
                          {cashbackType === 'percentage' ? '%' : '₹'}
                        </div>
                      </div>
                    </div>

                    {/* Capping Card */}
                    <div className="bg-white border border-gray-200 rounded-3xl p-4 space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-black text-[#1A102F]">Capping (optional)</div>
                          <div className="text-[10.5px] text-gray-400">Prevent excessive cashback payouts</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCashbackCapping(!cashbackCapping)}
                          className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                            cashbackCapping ? 'bg-[#2D0F55]' : 'bg-gray-200'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                              cashbackCapping ? 'right-0.5' : 'left-0.5'
                            }`}
                          />
                        </button>
                      </div>

                      {cashbackCapping && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[9.5px] font-black uppercase text-gray-400 tracking-wider">
                            MAX CASHBACK AMOUNT
                          </span>
                          <div className="bg-[#F8F6FA] rounded-2xl p-3 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-base font-black text-[#1A102F]">
                              <span>₹</span>
                              <input
                                type="text"
                                value={cashbackMaxCap}
                                onChange={(e) => setCashbackMaxCap(e.target.value)}
                                className="bg-transparent font-black w-24 outline-none"
                              />
                            </div>
                            <RotateCcw className="w-4 h-4 text-gray-400" />
                          </div>
                          <p className="text-[10.5px] text-gray-400 pl-1">
                            e.g. {cashbackPercent}%, upto ₹{cashbackMaxCap}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Select applicable on */}
                    <div>
                      <label className="text-xs font-black text-[#1A102F] block mb-1.5">Select applicable on</label>
                      <div className="bg-white border border-gray-200 rounded-2xl p-3 flex items-center justify-between cursor-pointer shadow-2xs hover:border-purple-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
                            <Utensils className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-[#1A102F]">{cashbackApplicable}</div>
                            <div className="text-[10.5px] text-gray-400">Entire menu catalog included</div>
                          </div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Bottom Nav */}
                    <div className="pt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setIsConfiguringReward(false)}
                        className="text-xs font-black text-[#1A102F] hover:text-[#6D28D9] flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>←</span>
                        <span>Back</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(5)}
                        className="px-8 py-3 bg-[#2D0F55] hover:bg-[#3D1472] text-white rounded-2xl text-xs font-black shadow-md shadow-purple-950/20 cursor-pointer transition-all"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* 2. DISCOUNT REWARD (Campaign- Reward Type- Discount.png) */}
                {/* ========================================================= */}
                {rewardType === 'discount' && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div>
                      <label className="text-xs font-black text-[#1A102F] block mb-2">Type of cashback</label>
                      <div className="grid grid-cols-2 gap-3">
                        <div
                          onClick={() => setDiscountRewardType('percentage')}
                          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between min-h-[92px] ${
                            discountRewardType === 'percentage'
                              ? 'border-[#7C3AED] bg-white shadow-xs'
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                discountRewardType === 'percentage'
                                  ? 'border-2 border-[#7C3AED]'
                                  : 'border-2 border-gray-300'
                              }`}
                            >
                              {discountRewardType === 'percentage' && (
                                <div className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" />
                              )}
                            </div>
                            <Percent className="w-4 h-4 text-[#1A102F]" />
                          </div>
                          <div>
                            <div className="text-sm font-black text-[#1A102F]">Percentage</div>
                            <div className="text-[10.5px] text-gray-400">e.g. 10% of bill</div>
                          </div>
                        </div>

                        <div
                          onClick={() => setDiscountRewardType('fixed')}
                          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between min-h-[92px] ${
                            discountRewardType === 'fixed'
                              ? 'border-[#7C3AED] bg-white shadow-xs'
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                discountRewardType === 'fixed'
                                  ? 'border-2 border-[#7C3AED]'
                                  : 'border-2 border-gray-300'
                              }`}
                            >
                              {discountRewardType === 'fixed' && (
                                <div className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" />
                              )}
                            </div>
                            <Coins className="w-4 h-4 text-gray-400" />
                          </div>
                          <div>
                            <div className="text-sm font-black text-[#1A102F]">Fixed amount</div>
                            <div className="text-[10.5px] text-gray-400">e.g. ₹50 flat off</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-black text-[#1A102F] block mb-1.5">Enter percentage</label>
                      <div className="bg-white border border-gray-200 rounded-2xl p-2 flex items-center justify-between shadow-2xs">
                        <input
                          type="text"
                          value={discountRewardPercent}
                          onChange={(e) => setDiscountRewardPercent(e.target.value)}
                          className="text-lg font-black text-[#1A102F] bg-transparent outline-none w-full px-2"
                        />
                        <div className="bg-[#F3E8FF] text-[#7C3AED] font-black text-sm px-3.5 py-2 rounded-xl flex items-center justify-center">
                          %
                        </div>
                      </div>
                    </div>

                    {/* Capping Card */}
                    <div className="bg-white border border-gray-200 rounded-3xl p-4 space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-black text-[#1A102F]">Capping (optional)</div>
                          <div className="text-[10.5px] text-gray-400">Prevent excessive cashback payouts</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDiscountRewardCapping(!discountRewardCapping)}
                          className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                            discountRewardCapping ? 'bg-[#2D0F55]' : 'bg-gray-200'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                              discountRewardCapping ? 'right-0.5' : 'left-0.5'
                            }`}
                          />
                        </button>
                      </div>

                      {discountRewardCapping && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[9.5px] font-black uppercase text-gray-400 tracking-wider">
                            MAX DISCOUNT AMOUNT
                          </span>
                          <div className="bg-[#F8F6FA] rounded-2xl p-3 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-base font-black text-[#1A102F]">
                              <span>₹</span>
                              <input
                                type="text"
                                value={discountRewardMaxCap}
                                onChange={(e) => setDiscountRewardMaxCap(e.target.value)}
                                className="bg-transparent font-black w-24 outline-none"
                              />
                            </div>
                            <RotateCcw className="w-4 h-4 text-gray-400" />
                          </div>
                          <p className="text-[10.5px] text-gray-400 pl-1">
                            e.g. {discountRewardPercent}%, upto ₹{discountRewardMaxCap}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Select applicable on */}
                    <div>
                      <label className="text-xs font-black text-[#1A102F] block mb-1.5">Select applicable on</label>
                      <div className="bg-white border border-gray-200 rounded-2xl p-3 flex items-center justify-between cursor-pointer shadow-2xs hover:border-purple-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
                            <Utensils className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-[#1A102F]">{discountRewardApplicable}</div>
                            <div className="text-[10.5px] text-gray-400">Entire menu catalog included</div>
                          </div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Bottom Nav */}
                    <div className="pt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setIsConfiguringReward(false)}
                        className="text-xs font-black text-[#1A102F] hover:text-[#6D28D9] flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>←</span>
                        <span>Back</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(5)}
                        className="px-8 py-3 bg-[#2D0F55] hover:bg-[#3D1472] text-white rounded-2xl text-xs font-black shadow-md shadow-purple-950/20 cursor-pointer transition-all"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* 3. POINTS REWARD (Campaign- Reward Type- Points.png)     */}
                {/* ========================================================= */}
                {rewardType === 'points' && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div>
                      <label className="text-xs font-black text-[#1A102F] block mb-2">Points Type</label>
                      <div className="grid grid-cols-2 gap-3">
                        <div
                          onClick={() => setPointsRewardType('percentage')}
                          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between min-h-[92px] ${
                            pointsRewardType === 'percentage'
                              ? 'border-[#7C3AED] bg-white shadow-xs'
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                pointsRewardType === 'percentage'
                                  ? 'border-2 border-[#7C3AED]'
                                  : 'border-2 border-gray-300'
                              }`}
                            >
                              {pointsRewardType === 'percentage' && (
                                <div className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" />
                              )}
                            </div>
                            <Percent className="w-4 h-4 text-[#1A102F]" />
                          </div>
                          <div>
                            <div className="text-sm font-black text-[#1A102F]">Percentage</div>
                            <div className="text-[10.5px] text-gray-400">e.g. 10% of bill</div>
                          </div>
                        </div>

                        <div
                          onClick={() => setPointsRewardType('fixed')}
                          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between min-h-[92px] ${
                            pointsRewardType === 'fixed'
                              ? 'border-[#7C3AED] bg-white shadow-xs'
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                pointsRewardType === 'fixed'
                                  ? 'border-2 border-[#7C3AED]'
                                  : 'border-2 border-gray-300'
                              }`}
                            >
                              {pointsRewardType === 'fixed' && (
                                <div className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" />
                              )}
                            </div>
                            <Coins className="w-4 h-4 text-gray-400" />
                          </div>
                          <div>
                            <div className="text-sm font-black text-[#1A102F]">Fixed amount</div>
                            <div className="text-[10.5px] text-gray-400">e.g. 50 points flat</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-black text-[#1A102F] block mb-1.5">Enter percentage</label>
                      <div className="bg-white border border-gray-200 rounded-2xl p-2 flex items-center justify-between shadow-2xs">
                        <input
                          type="text"
                          value={pointsRewardPercent}
                          onChange={(e) => setPointsRewardPercent(e.target.value)}
                          className="text-lg font-black text-[#1A102F] bg-transparent outline-none w-full px-2"
                        />
                        <div className="bg-[#F3E8FF] text-[#7C3AED] font-black text-sm px-3.5 py-2 rounded-xl flex items-center justify-center">
                          %
                        </div>
                      </div>
                    </div>

                    {/* Points Value Card with Formula */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-[#1A102F]">Points value</label>
                        <span className="bg-[#FFE4E6] text-[#E11D48] text-[9.5px] font-bold px-2 py-0.5 rounded-full">
                          1 Point = ₹1
                        </span>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-3xl p-3.5 space-y-2.5 shadow-2xs">
                        <div className="bg-[#F8F6FA] rounded-xl p-3 flex items-center justify-between">
                          <input
                            type="text"
                            value={pointsRewardValueRupee}
                            onChange={(e) => setPointsRewardValueRupee(e.target.value)}
                            className="bg-transparent font-black text-base text-[#1A102F] outline-none w-20"
                          />
                          <span className="text-xs font-bold text-gray-400">INR (₹)</span>
                        </div>
                        <div className="bg-[#F4EEFD] rounded-xl p-2.5 flex items-center gap-2 text-[11px] font-bold text-[#6D28D9]">
                          <Receipt className="w-4 h-4 text-[#7C3AED] flex-shrink-0" />
                          <span>e.g. 5% = 1 point per ₹20 spent</span>
                        </div>
                      </div>
                    </div>

                    {/* Capping Card */}
                    <div className="bg-white border border-gray-200 rounded-3xl p-4 space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-black text-[#1A102F]">Capping (optional)</div>
                          <div className="text-[10.5px] text-gray-400">Prevent excessive cashback payouts</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPointsRewardCapping(!pointsRewardCapping)}
                          className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                            pointsRewardCapping ? 'bg-[#2D0F55]' : 'bg-gray-200'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                              pointsRewardCapping ? 'right-0.5' : 'left-0.5'
                            }`}
                          />
                        </button>
                      </div>

                      {pointsRewardCapping && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[9.5px] font-black uppercase text-gray-400 tracking-wider">
                            MAX CASHBACK AMOUNT
                          </span>
                          <div className="bg-[#F8F6FA] rounded-2xl p-3 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-base font-black text-[#1A102F]">
                              <span>₹</span>
                              <input
                                type="text"
                                value={pointsRewardMaxCap}
                                onChange={(e) => setPointsRewardMaxCap(e.target.value)}
                                className="bg-transparent font-black w-24 outline-none"
                              />
                            </div>
                            <RotateCcw className="w-4 h-4 text-gray-400" />
                          </div>
                          <p className="text-[10.5px] text-gray-400 pl-1">
                            e.g. {pointsRewardPercent}%, upto ₹{pointsRewardMaxCap}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Select applicable on */}
                    <div>
                      <label className="text-xs font-black text-[#1A102F] block mb-1.5">Select applicable on</label>
                      <div className="bg-white border border-gray-200 rounded-2xl p-3 flex items-center justify-between cursor-pointer shadow-2xs hover:border-purple-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
                            <Utensils className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-[#1A102F]">{pointsRewardApplicable}</div>
                            <div className="text-[10.5px] text-gray-400">Entire menu catalog included</div>
                          </div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Bottom Nav */}
                    <div className="pt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setIsConfiguringReward(false)}
                        className="text-xs font-black text-[#1A102F] hover:text-[#6D28D9] flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>←</span>
                        <span>Back</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(5)}
                        className="px-8 py-3 bg-[#2D0F55] hover:bg-[#3D1472] text-white rounded-2xl text-xs font-black shadow-md shadow-purple-950/20 cursor-pointer transition-all"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* 4. FREE ITEM REWARD (Campaign- Reward Type- Free item.png) */}
                {/* ========================================================= */}
                {rewardType === 'free_item' && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#1A102F]">
                        SELECT ITEM
                      </span>
                      <span className="text-xs font-bold text-[#7C3AED]">1 Selected</span>
                    </div>

                    {/* Search bar */}
                    <div className="bg-[#FBF8FD] border border-gray-200 rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 text-xs text-gray-400">
                      <Search className="w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search menu items..."
                        value={freeItemSearch}
                        onChange={(e) => setFreeItemSearch(e.target.value)}
                        className="bg-transparent outline-none w-full text-xs text-[#1A102F] placeholder-gray-400"
                      />
                    </div>

                    {/* Items List */}
                    <div className="space-y-2.5">
                      {[
                        {
                          name: 'Margherita Pizza',
                          price: '₹ 299',
                          sub: 'Regular',
                          badge: 'High conversion item',
                          img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=100&auto=format&fit=crop&q=80'
                        },
                        {
                          name: 'Pasta Alfredo',
                          price: '₹ 349',
                          img: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281292?w=100&auto=format&fit=crop&q=80'
                        },
                        {
                          name: 'Caesar Salad',
                          price: '₹ 249',
                          img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100&auto=format&fit=crop&q=80'
                        },
                        {
                          name: 'Cold Coffee',
                          price: '₹ 149',
                          img: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=100&auto=format&fit=crop&q=80'
                        }
                      ].map((item) => {
                        const isSelected = freeItemSelected === item.name;
                        return (
                          <div
                            key={item.name}
                            onClick={() => setFreeItemSelected(item.name)}
                            className={`p-3 bg-white rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                              isSelected
                                ? 'border-2 border-[#2D0F55] shadow-xs'
                                : 'border border-[#F1EBF5] hover:border-purple-200'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                  isSelected ? 'bg-[#2D0F55] text-white' : 'border-2 border-gray-300'
                                }`}
                              >
                                {isSelected && <Check className="w-3.5 h-3.5" />}
                              </div>
                              <img
                                src={item.img}
                                alt={item.name}
                                className="w-12 h-12 rounded-xl object-cover"
                              />
                              <div>
                                <div className="text-xs font-black text-[#1A102F]">{item.name}</div>
                                {item.badge && (
                                  <span className="bg-[#F3E8FF] text-[#7C3AED] text-[9.5px] font-bold px-2 py-0.5 rounded-md inline-block mt-1">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-black text-[#1A102F]">{item.price}</div>
                              {item.sub && <div className="text-[10px] text-gray-400">{item.sub}</div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Quantity Section */}
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#1A102F] block mb-2">
                        QUANTITY
                      </span>
                      <div className="bg-white border border-[#F1EBF5] rounded-3xl p-4 flex flex-col items-center justify-center gap-2.5 shadow-2xs">
                        <span className="text-xs font-bold text-gray-600">How many free items?</span>
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => setFreeItemQty((q) => Math.max(1, q - 1))}
                            className="w-11 h-9 rounded-xl bg-purple-100 text-[#7C3AED] font-black text-lg flex items-center justify-center hover:bg-purple-200 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-black text-xl text-[#1A102F] px-4">{freeItemQty}</span>
                          <button
                            type="button"
                            onClick={() => setFreeItemQty((q) => q + 1)}
                            className="w-11 h-9 rounded-xl bg-purple-100 text-[#7C3AED] font-black text-lg flex items-center justify-center hover:bg-purple-200 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Nav */}
                    <div className="pt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setIsConfiguringReward(false)}
                        className="text-xs font-black text-[#1A102F] hover:text-[#6D28D9] flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>←</span>
                        <span>Back</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(5)}
                        className="px-8 py-3 bg-[#2D0F55] hover:bg-[#3D1472] text-white rounded-2xl text-xs font-black shadow-md shadow-purple-950/20 cursor-pointer transition-all"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* 5. NOMINAL PRICED ITEM REWARD                             */}
                {/* (Campaign- Reward Type- Nominal Priced Item.png)          */}
                {/* ========================================================= */}
                {rewardType === 'nominal_item' && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div>
                      <h3 className="text-sm font-black text-[#1A102F]">Select Item(s) & Set Revised Price</h3>
                      <p className="text-[10.5px] text-gray-500 leading-tight mt-0.5">
                        Original rates shown with configurable revised offer pricing for selected items
                      </p>
                    </div>

                    {/* Search and filter */}
                    <div className="bg-white border border-gray-200 rounded-2xl px-3.5 py-2.5 flex items-center justify-between text-xs shadow-2xs">
                      <div className="flex items-center gap-2 flex-1">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search menu items..."
                          value={nominalSearch}
                          onChange={(e) => setNominalSearch(e.target.value)}
                          className="bg-transparent outline-none w-full text-xs text-[#1A102F] placeholder-gray-400"
                        />
                      </div>
                      <SlidersHorizontal className="w-4 h-4 text-gray-500 cursor-pointer" />
                    </div>

                    {/* Items List */}
                    <div className="space-y-3">
                      {/* Margherita Pizza */}
                      <div
                        className={`bg-white rounded-2xl p-3.5 space-y-2.5 transition-all ${
                          nominalSelectedItems['margherita']?.selected
                            ? 'border-2 border-[#2D0F55] shadow-xs'
                            : 'border border-[#F1EBF5]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                setNominalSelectedItems((prev) => ({
                                  ...prev,
                                  margherita: { ...prev['margherita'], selected: !prev['margherita']?.selected }
                                }))
                              }
                              className={`w-5 h-5 rounded-md flex items-center justify-center cursor-pointer ${
                                nominalSelectedItems['margherita']?.selected
                                  ? 'bg-[#2D0F55] text-white'
                                  : 'border-2 border-gray-300'
                              }`}
                            >
                              {nominalSelectedItems['margherita']?.selected && <Check className="w-3.5 h-3.5" />}
                            </button>
                            <img
                              src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=100&auto=format&fit=crop&q=80"
                              alt="Margherita Pizza"
                              className="w-11 h-11 rounded-xl object-cover"
                            />
                            <div>
                              <div className="text-xs font-black text-[#1A102F]">Margherita Pizza</div>
                              <div className="text-[10px] font-bold text-rose-600 flex items-center gap-1 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 inline-block" />
                                <span>Best seller</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                              ORIGINAL RATE
                            </div>
                            <div
                              className={`text-xs font-bold ${
                                nominalSelectedItems['margherita']?.selected
                                  ? 'line-through text-gray-400'
                                  : 'text-[#1A102F]'
                              }`}
                            >
                              ₹ 299
                            </div>
                          </div>
                        </div>

                        {nominalSelectedItems['margherita']?.selected ? (
                          <div className="bg-[#FAF7FD] border border-purple-100 rounded-xl p-2.5 flex items-center justify-between">
                            <div>
                              <div className="text-[9.5px] font-black uppercase text-[#1A102F]">
                                REVISED OFFER PRICE
                              </div>
                              <div className="text-[10px] font-bold text-rose-600">
                                {nominalSelectedItems['margherita']?.discountText}
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="bg-white border border-rose-300 rounded-lg px-2.5 py-1 text-xs font-black text-[#1A102F] flex items-center gap-1">
                                <span>₹</span>
                                <input
                                  type="text"
                                  value={nominalSelectedItems['margherita']?.revisedPrice}
                                  onChange={(e) =>
                                    setNominalSelectedItems((prev) => ({
                                      ...prev,
                                      margherita: { ...prev['margherita'], revisedPrice: e.target.value }
                                    }))
                                  }
                                  className="w-8 outline-none font-black text-center"
                                />
                              </div>
                              <button
                                type="button"
                                className="bg-[#BE123C] hover:bg-[#9F1239] text-white text-[10px] font-black px-3 py-1.5 rounded-lg cursor-pointer"
                              >
                                APPLY
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-[10px] text-gray-500 pt-1 border-t border-gray-100">
                            Enable item to customize revised offer rate
                            <button
                              type="button"
                              onClick={() =>
                                setNominalSelectedItems((prev) => ({
                                  ...prev,
                                  margherita: { ...prev['margherita'], selected: true }
                                }))
                              }
                              className="text-[#7C3AED] font-bold ml-1 hover:underline cursor-pointer"
                            >
                              + Set revised price
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Pasta Alfredo */}
                      <div
                        className={`bg-white rounded-2xl p-3.5 space-y-2.5 transition-all ${
                          nominalSelectedItems['pasta']?.selected
                            ? 'border-2 border-[#2D0F55] shadow-xs'
                            : 'border border-[#F1EBF5]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                setNominalSelectedItems((prev) => ({
                                  ...prev,
                                  pasta: { ...prev['pasta'], selected: !prev['pasta']?.selected }
                                }))
                              }
                              className={`w-5 h-5 rounded-md flex items-center justify-center cursor-pointer ${
                                nominalSelectedItems['pasta']?.selected
                                  ? 'bg-[#2D0F55] text-white'
                                  : 'border-2 border-gray-300'
                              }`}
                            >
                              {nominalSelectedItems['pasta']?.selected && <Check className="w-3.5 h-3.5" />}
                            </button>
                            <img
                              src="https://images.unsplash.com/photo-1621996346565-e3d5d6281292?w=100&auto=format&fit=crop&q=80"
                              alt="Pasta Alfredo"
                              className="w-11 h-11 rounded-xl object-cover"
                            />
                            <div>
                              <div className="text-xs font-black text-[#1A102F]">Pasta Alfredo</div>
                              <div className="text-[10px] text-gray-400 mt-0.5">Signature cream sauce</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                              ORIGINAL RATE
                            </div>
                            <div
                              className={`text-xs font-bold ${
                                nominalSelectedItems['pasta']?.selected
                                  ? 'line-through text-gray-400'
                                  : 'text-[#1A102F]'
                              }`}
                            >
                              ₹ 349
                            </div>
                          </div>
                        </div>

                        {nominalSelectedItems['pasta']?.selected ? (
                          <div className="bg-[#FAF7FD] border border-purple-100 rounded-xl p-2.5 flex items-center justify-between">
                            <div>
                              <div className="text-[9.5px] font-black uppercase text-[#1A102F]">
                                REVISED OFFER PRICE
                              </div>
                              <div className="text-[10px] font-bold text-rose-600">
                                {nominalSelectedItems['pasta']?.discountText}
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="bg-white border border-rose-300 rounded-lg px-2.5 py-1 text-xs font-black text-[#1A102F] flex items-center gap-1">
                                <span>₹</span>
                                <input
                                  type="text"
                                  value={nominalSelectedItems['pasta']?.revisedPrice}
                                  onChange={(e) =>
                                    setNominalSelectedItems((prev) => ({
                                      ...prev,
                                      pasta: { ...prev['pasta'], revisedPrice: e.target.value }
                                    }))
                                  }
                                  className="w-8 outline-none font-black text-center"
                                />
                              </div>
                              <button
                                type="button"
                                className="bg-[#BE123C] hover:bg-[#9F1239] text-white text-[10px] font-black px-3 py-1.5 rounded-lg cursor-pointer"
                              >
                                APPLY
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-[10px] text-gray-500 pt-1 border-t border-gray-100">
                            Enable item to customize revised offer rate
                            <button
                              type="button"
                              onClick={() =>
                                setNominalSelectedItems((prev) => ({
                                  ...prev,
                                  pasta: { ...prev['pasta'], selected: true }
                                }))
                              }
                              className="text-[#7C3AED] font-bold ml-1 hover:underline cursor-pointer"
                            >
                              + Set revised price
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Caesar Salad */}
                      <div
                        className={`bg-white rounded-2xl p-3.5 space-y-2.5 transition-all ${
                          nominalSelectedItems['salad']?.selected
                            ? 'border-2 border-[#2D0F55] shadow-xs'
                            : 'border border-[#F1EBF5]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                setNominalSelectedItems((prev) => ({
                                  ...prev,
                                  salad: { ...prev['salad'], selected: !prev['salad']?.selected }
                                }))
                              }
                              className={`w-5 h-5 rounded-md flex items-center justify-center cursor-pointer ${
                                nominalSelectedItems['salad']?.selected
                                  ? 'bg-[#2D0F55] text-white'
                                  : 'border-2 border-gray-300'
                              }`}
                            >
                              {nominalSelectedItems['salad']?.selected && <Check className="w-3.5 h-3.5" />}
                            </button>
                            <img
                              src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100&auto=format&fit=crop&q=80"
                              alt="Caesar Salad"
                              className="w-11 h-11 rounded-xl object-cover"
                            />
                            <div>
                              <div className="text-xs font-black text-[#1A102F]">Caesar Salad</div>
                              <div className="text-[10px] text-gray-400 mt-0.5">Parmesan & croutons</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                              ORIGINAL RATE
                            </div>
                            <div
                              className={`text-xs font-bold ${
                                nominalSelectedItems['salad']?.selected
                                  ? 'line-through text-gray-400'
                                  : 'text-[#1A102F]'
                              }`}
                            >
                              ₹ 249
                            </div>
                          </div>
                        </div>

                        {nominalSelectedItems['salad']?.selected ? (
                          <div className="bg-[#FAF7FD] border border-purple-100 rounded-xl p-2.5 flex items-center justify-between">
                            <div>
                              <div className="text-[9.5px] font-black uppercase text-[#1A102F]">
                                REVISED OFFER PRICE
                              </div>
                              <div className="text-[10px] font-bold text-rose-600">
                                {nominalSelectedItems['salad']?.discountText}
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="bg-white border border-rose-300 rounded-lg px-2.5 py-1 text-xs font-black text-[#1A102F] flex items-center gap-1">
                                <span>₹</span>
                                <input
                                  type="text"
                                  value={nominalSelectedItems['salad']?.revisedPrice}
                                  onChange={(e) =>
                                    setNominalSelectedItems((prev) => ({
                                      ...prev,
                                      salad: { ...prev['salad'], revisedPrice: e.target.value }
                                    }))
                                  }
                                  className="w-8 outline-none font-black text-center"
                                />
                              </div>
                              <button
                                type="button"
                                className="bg-[#BE123C] hover:bg-[#9F1239] text-white text-[10px] font-black px-3 py-1.5 rounded-lg cursor-pointer"
                              >
                                APPLY
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-[10px] text-gray-500 pt-1 border-t border-gray-100">
                            Enable item to customize revised offer rate
                            <button
                              type="button"
                              onClick={() =>
                                setNominalSelectedItems((prev) => ({
                                  ...prev,
                                  salad: { ...prev['salad'], selected: true }
                                }))
                              }
                              className="text-[#7C3AED] font-bold ml-1 hover:underline cursor-pointer"
                            >
                              + Set revised price
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Cold Coffee */}
                      <div
                        className={`bg-white rounded-2xl p-3.5 space-y-2.5 transition-all ${
                          nominalSelectedItems['coffee']?.selected
                            ? 'border-2 border-[#2D0F55] shadow-xs'
                            : 'border border-[#F1EBF5]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                setNominalSelectedItems((prev) => ({
                                  ...prev,
                                  coffee: { ...prev['coffee'], selected: !prev['coffee']?.selected }
                                }))
                              }
                              className={`w-5 h-5 rounded-md flex items-center justify-center cursor-pointer ${
                                nominalSelectedItems['coffee']?.selected
                                  ? 'bg-[#2D0F55] text-white'
                                  : 'border-2 border-gray-300'
                              }`}
                            >
                              {nominalSelectedItems['coffee']?.selected && <Check className="w-3.5 h-3.5" />}
                            </button>
                            <img
                              src="https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=100&auto=format&fit=crop&q=80"
                              alt="Cold Coffee"
                              className="w-11 h-11 rounded-xl object-cover"
                            />
                            <div>
                              <div className="text-xs font-black text-[#1A102F]">Cold Coffee</div>
                              <div className="text-[10px] font-bold text-rose-600 flex items-center gap-1 mt-0.5">
                                <Sparkles className="w-3 h-3 text-rose-600" />
                                <span>High conversion</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                              ORIGINAL RATE
                            </div>
                            <div
                              className={`text-xs font-bold ${
                                nominalSelectedItems['coffee']?.selected
                                  ? 'line-through text-gray-400'
                                  : 'text-[#1A102F]'
                              }`}
                            >
                              ₹ 149
                            </div>
                          </div>
                        </div>

                        {nominalSelectedItems['coffee']?.selected ? (
                          <div className="bg-[#FAF7FD] border border-purple-100 rounded-xl p-2.5 flex items-center justify-between">
                            <div>
                              <div className="text-[9.5px] font-black uppercase text-[#1A102F]">
                                REVISED OFFER PRICE
                              </div>
                              <div className="text-[10px] font-bold text-rose-600">
                                {nominalSelectedItems['coffee']?.discountText}
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="bg-white border border-rose-300 rounded-lg px-2.5 py-1 text-xs font-black text-[#1A102F] flex items-center gap-1">
                                <span>₹</span>
                                <input
                                  type="text"
                                  value={nominalSelectedItems['coffee']?.revisedPrice}
                                  onChange={(e) =>
                                    setNominalSelectedItems((prev) => ({
                                      ...prev,
                                      coffee: { ...prev['coffee'], revisedPrice: e.target.value }
                                    }))
                                  }
                                  className="w-8 outline-none font-black text-center"
                                />
                              </div>
                              <button
                                type="button"
                                className="bg-[#BE123C] hover:bg-[#9F1239] text-white text-[10px] font-black px-3 py-1.5 rounded-lg cursor-pointer"
                              >
                                APPLY
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-[10px] text-gray-500 pt-1 border-t border-gray-100">
                            Enable item to customize revised offer rate
                            <button
                              type="button"
                              onClick={() =>
                                setNominalSelectedItems((prev) => ({
                                  ...prev,
                                  coffee: { ...prev['coffee'], selected: true }
                                }))
                              }
                              className="text-[#7C3AED] font-bold ml-1 hover:underline cursor-pointer"
                            >
                              + Set revised price
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Nav */}
                    <div className="pt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setIsConfiguringReward(false)}
                        className="text-xs font-black text-[#1A102F] hover:text-[#6D28D9] flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>←</span>
                        <span>Back</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(5)}
                        className="px-8 py-3 bg-[#2D0F55] hover:bg-[#3D1472] text-white rounded-2xl text-xs font-black shadow-md shadow-purple-950/20 cursor-pointer transition-all"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* 6. BUY X GET Y FREE (BOGO) REWARD                         */}
                {/* (Campaign- Reward Type- Buy X get Y free.png)             */}
                {/* ========================================================= */}
                {rewardType === 'bogo' && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    {/* Steppers Row: BUY QUANTITY & GET FREE */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Buy Qty */}
                      <div className="bg-white border border-[#F1EBF5] rounded-2xl p-3 space-y-2 shadow-2xs">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider block">
                          BUY QUANTITY
                        </span>
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setBogoBuyQty((q) => Math.max(1, q - 1))}
                            className="w-9 h-8 rounded-xl bg-purple-100 text-[#7C3AED] font-black flex items-center justify-center hover:bg-purple-200 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-black text-base text-[#1A102F]">{bogoBuyQty}</span>
                          <button
                            type="button"
                            onClick={() => setBogoBuyQty((q) => q + 1)}
                            className="w-9 h-8 rounded-xl bg-purple-100 text-[#7C3AED] font-black flex items-center justify-center hover:bg-purple-200 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Get Free Qty */}
                      <div className="bg-white border border-[#F1EBF5] rounded-2xl p-3 space-y-2 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
                            GET FREE
                          </span>
                          <span className="bg-[#FCE7F3] text-[#DB2777] text-[9px] font-black px-1.5 py-0.5 rounded-md">
                            100% OFF
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setBogoGetFreeQty((q) => Math.max(1, q - 1))}
                            className="w-9 h-8 rounded-xl bg-purple-100 text-[#7C3AED] font-black flex items-center justify-center hover:bg-purple-200 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-black text-base text-[#1A102F]">{bogoGetFreeQty}</span>
                          <button
                            type="button"
                            onClick={() => setBogoGetFreeQty((q) => q + 1)}
                            className="w-9 h-8 rounded-xl bg-purple-100 text-[#7C3AED] font-black flex items-center justify-center hover:bg-purple-200 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Select Items Section */}
                    <div className="space-y-2.5">
                      <div>
                        <h3 className="text-sm font-black text-[#1A102F]">Select items</h3>
                        <p className="text-[10.5px] text-gray-500">Choose the items that qualify for this offer.</p>
                      </div>

                      {/* Filter Bar */}
                      <div className="flex items-center gap-2">
                        <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 flex items-center gap-2 flex-1 shadow-2xs">
                          <Search className="w-3.5 h-3.5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search menu items"
                            value={bogoSearch}
                            onChange={(e) => setBogoSearch(e.target.value)}
                            className="bg-transparent outline-none w-full text-xs text-[#1A102F] placeholder-gray-400"
                          />
                        </div>

                        <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-[#1A102F] flex items-center gap-1 cursor-pointer shadow-2xs">
                          <span>{bogoCategory}</span>
                          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        </div>

                        <button
                          type="button"
                          onClick={() => setBogoSelectAll(!bogoSelectAll)}
                          className="flex items-center gap-1.5 text-xs font-bold text-[#1A102F] cursor-pointer"
                        >
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center ${
                              bogoSelectAll ? 'bg-[#2D0F55] text-white' : 'border border-gray-300'
                            }`}
                          >
                            {bogoSelectAll && <Check className="w-3 h-3" />}
                          </div>
                          <span>Select all</span>
                        </button>
                      </div>

                      {/* Items List */}
                      <div className="bg-white border border-[#F1EBF5] rounded-3xl divide-y divide-gray-100 shadow-2xs overflow-hidden">
                        {[
                          { name: 'Margherita Pizza', price: '₹299', icon: '🍕' },
                          { name: 'Farmhouse Pizza', price: '₹349', icon: '🍕' },
                          { name: 'Paneer Tikka Pizza', price: '₹399', icon: '🍕' },
                          { name: 'Veggie Burger', price: '₹249', icon: '🍔' },
                          { name: 'Chicken Burger', price: '₹299', icon: '🍔' }
                        ]
                          .slice(0, bogoShowMore ? 5 : 5)
                          .map((item) => {
                            const isChecked = bogoSelectedItems.includes(item.name);
                            return (
                              <div
                                key={item.name}
                                onClick={() => {
                                  if (isChecked) {
                                    setBogoSelectedItems(bogoSelectedItems.filter((i) => i !== item.name));
                                  } else {
                                    setBogoSelectedItems([...bogoSelectedItems, item.name]);
                                  }
                                }}
                                className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-4 h-4 rounded flex items-center justify-center ${
                                      isChecked ? 'bg-[#2D0F55] text-white' : 'border border-gray-300'
                                    }`}
                                  >
                                    {isChecked && <Check className="w-3 h-3" />}
                                  </div>
                                  <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-base">
                                    {item.icon}
                                  </div>
                                  <span className="text-xs font-black text-[#1A102F]">{item.name}</span>
                                </div>
                                <span className="text-xs font-black text-[#1A102F]">{item.price}</span>
                              </div>
                            );
                          })}

                        <div
                          onClick={() => setBogoShowMore(!bogoShowMore)}
                          className="p-3 text-center text-xs font-bold text-[#7C3AED] hover:bg-purple-50/50 cursor-pointer flex items-center justify-center gap-1"
                        >
                          <span>{bogoShowMore ? 'Show fewer items' : 'Show more items'}</span>
                          <ChevronDown className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>

                    {/* Free item rule */}
                    <div className="space-y-2">
                      <div>
                        <h3 className="text-sm font-black text-[#1A102F]">Free item rule</h3>
                        <p className="text-[10.5px] text-gray-500">What should the customer get for free?</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {/* Same item */}
                        <div
                          onClick={() => setBogoFreeRule('same_item')}
                          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-2.5 ${
                            bogoFreeRule === 'same_item'
                              ? 'border-[#2D0F55] bg-white shadow-xs'
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-xs font-black text-[#1A102F]">Same item</div>
                              <div className="text-[9.5px] text-gray-500 leading-snug mt-0.5">
                                Get the same item they purchased for free.
                              </div>
                            </div>
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                                bogoFreeRule === 'same_item'
                                  ? 'border-2 border-[#2D0F55]'
                                  : 'border-2 border-gray-300'
                              }`}
                            >
                              {bogoFreeRule === 'same_item' && (
                                <div className="w-2 h-2 rounded-full bg-[#2D0F55]" />
                              )}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-gray-100 flex flex-col items-center">
                            <div className="flex items-center gap-2 text-base">
                              <span>🍕</span>
                              <span className="text-xs text-gray-400">→</span>
                              <span>🍕</span>
                            </div>
                            <span className="text-[9px] font-bold text-gray-400 mt-1">Buy 1 → Get 1</span>
                          </div>
                        </div>

                        {/* Any item at same price */}
                        <div
                          onClick={() => setBogoFreeRule('any_item_same_price')}
                          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-2.5 ${
                            bogoFreeRule === 'any_item_same_price'
                              ? 'border-[#2D0F55] bg-white shadow-xs'
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-xs font-black text-[#1A102F]">Any item at the same price</div>
                              <div className="text-[9.5px] text-gray-500 leading-snug mt-0.5">
                                Customer can choose another item of the same price for free.
                              </div>
                            </div>
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                                bogoFreeRule === 'any_item_same_price'
                                  ? 'border-2 border-[#2D0F55]'
                                  : 'border-2 border-gray-300'
                              }`}
                            >
                              {bogoFreeRule === 'any_item_same_price' && (
                                <div className="w-2.5 h-2.5 rounded-full bg-[#2D0F55]" />
                              )}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-gray-100 flex flex-col items-center">
                            <div className="flex items-center gap-2 text-base">
                              <span>🍔</span>
                              <span className="text-xs text-gray-400">→</span>
                              <span>🍕</span>
                            </div>
                            <span className="text-[9px] font-bold text-gray-400 mt-1">Buy ₹299 → Get ₹299</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Informational banner */}
                    <div className="bg-[#FAF7FD] border border-purple-200 rounded-2xl p-3 flex items-center gap-2.5 text-[11px] font-bold text-[#6D28D9]">
                      <Info className="w-4 h-4 text-[#7C3AED] flex-shrink-0" />
                      <span>The free item must have the same price as the qualifying item purchased.</span>
                    </div>

                    {/* Bottom Nav */}
                    <div className="pt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setIsConfiguringReward(false)}
                        className="text-xs font-black text-[#1A102F] hover:text-[#6D28D9] flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>←</span>
                        <span>Back</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(5)}
                        className="px-8 py-3 bg-[#2D0F55] hover:bg-[#3D1472] text-white rounded-2xl text-xs font-black shadow-md shadow-purple-950/20 cursor-pointer transition-all"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* 7. COMBO OFFERS REWARD                                    */}
                {/* ========================================================= */}
                {rewardType === 'combo' && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div>
                      <h3 className="text-sm font-black text-[#1A102F]">Curate or offer fixed & custom item bundles</h3>
                      <p className="text-[10.5px] text-gray-500">Configure bundle combo pricing and item pairings.</p>
                    </div>

                    {/* Toggle fixed vs custom */}
                    <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-2xl gap-1">
                      <button
                        type="button"
                        onClick={() => setComboMode('fixed')}
                        className={`py-2 text-xs font-black rounded-xl cursor-pointer transition-all ${
                          comboMode === 'fixed' ? 'bg-white text-[#1A102F] shadow-xs' : 'text-gray-500'
                        }`}
                      >
                        Fixed combo
                      </button>
                      <button
                        type="button"
                        onClick={() => setComboMode('custom')}
                        className={`py-2 text-xs font-black rounded-xl cursor-pointer transition-all ${
                          comboMode === 'custom' ? 'bg-[#2D0F55] text-white shadow-xs' : 'text-gray-500'
                        }`}
                      >
                        Custom combo
                      </button>
                    </div>

                    {/* Combo Bundle Summary Card */}
                    <div className="bg-white rounded-3xl p-4 border border-[#F1EBF5] shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                          <span className="text-xs font-black text-[#1A102F]">Your combo bundle</span>
                        </div>
                        <Edit3 className="w-4 h-4 text-gray-400" />
                      </div>

                      <div className="space-y-2">
                        <div className="p-2.5 rounded-2xl bg-[#FBF9FE] border border-purple-50 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-sm">
                              🍕
                            </div>
                            <div>
                              <div className="text-xs font-black text-[#1A102F]">Margherita Pizza</div>
                              <div className="text-[10px] text-gray-400">Hand-tossed 8" classic</div>
                            </div>
                          </div>
                          <span className="text-[11px] font-bold text-gray-500">x1</span>
                        </div>

                        <div className="p-2.5 rounded-2xl bg-[#FBF9FE] border border-purple-50 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-sm">
                              ☕
                            </div>
                            <div>
                              <div className="text-xs font-black text-[#1A102F]">Cold Coffee</div>
                              <div className="text-[10px] text-gray-400">Signature cold brew 250ml</div>
                            </div>
                          </div>
                          <span className="text-[11px] font-bold text-gray-500">x1</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                        <div>
                          <div className="text-[9px] font-bold uppercase text-gray-400">TOTAL VALUE</div>
                          <div className="text-xs font-bold text-gray-400 line-through">₹448</div>
                        </div>
                        <span className="bg-[#FFE4E6] text-[#E11D48] text-[10px] font-black px-2 py-0.5 rounded-full">
                          11% OFF
                        </span>
                        <div className="text-right">
                          <div className="text-[9px] font-bold uppercase text-gray-400">COMBO PRICE</div>
                          <div className="text-base font-black text-[#1A102F]">₹399</div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Nav */}
                    <div className="pt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setIsConfiguringReward(false)}
                        className="text-xs font-black text-[#1A102F] hover:text-[#6D28D9] flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>←</span>
                        <span>Back</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(5)}
                        className="px-8 py-3 bg-[#2D0F55] hover:bg-[#3D1472] text-white rounded-2xl text-xs font-black shadow-md shadow-purple-950/20 cursor-pointer transition-all"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ===================================================================== */}
        {/* STEP 5: CUSTOMIZE BANNER (Templates) (Images from c:\Users\fab\Downloads\customize) */}
        {/* ===================================================================== */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h1 className="text-[22px] font-black text-[#1A102F]">Customize Banner</h1>
            </div>

            {/* Segmented 3-tab pill switch */}
            <div className="grid grid-cols-3 p-1 bg-[#F1F5F9] rounded-2xl gap-1">
              <button
                type="button"
                onClick={() => setBannerTab('content')}
                className={`py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                  bannerTab === 'content' ? 'bg-[#2D0F55] text-white shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Content
              </button>
              <button
                type="button"
                onClick={() => setBannerTab('design')}
                className={`py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                  bannerTab === 'design' ? 'bg-[#2D0F55] text-white shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Design
              </button>
              <button
                type="button"
                onClick={() => setBannerTab('layout')}
                className={`py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                  bannerTab === 'layout' ? 'bg-[#2D0F55] text-white shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Layout
              </button>
            </div>

            {/* TAB 1: CONTENT */}
            {bannerTab === 'content' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {conditionType === 'stamps' ? (
                  <>
                    <div
                      className="rounded-3xl p-5 text-white flex flex-col justify-between shadow-lg relative overflow-hidden min-h-[140px]"
                      style={{
                        background:
                          bannerBgStyle === 'solid'
                            ? bannerColorTheme
                            : `linear-gradient(135deg, ${bannerColorTheme} 0%, #A21CAF 100%)`
                      }}
                    >
                      <div className="text-center space-y-0.5">
                        <div
                          className={`font-black text-sm tracking-wide ${
                            bannerFontStyle === 'classic'
                              ? 'font-serif italic'
                              : bannerFontStyle === 'playful'
                              ? 'font-mono'
                              : 'font-sans'
                          }`}
                        >
                          Collect Stamps
                        </div>
                        <div className="text-[11px] font-bold text-white/80">Get Rewarded!</div>
                      </div>

                      {/* 5 Slots */}
                      <div className="flex items-center justify-center gap-3 pt-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center text-white shadow-xs">
                          <Star className="w-4 h-4 fill-white" />
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-dashed border-white/50" />
                        <div className="w-8 h-8 rounded-full border-2 border-dashed border-white/50" />
                        <div className="w-8 h-8 rounded-full border-2 border-dashed border-white/50" />
                        <div className="w-8 h-8 rounded-full bg-[#EC4899] flex items-center justify-center text-white shadow-xs">
                          <Gift className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-1">
                      <span className="text-xs font-black text-[#1A102F] block">Banner Text</span>
                      <div>
                        <label className="text-[11px] text-gray-500 font-bold block mb-1">Banner Title</label>
                        <div className="bg-white border border-gray-200 rounded-2xl px-3.5 py-2.5 flex items-center justify-between shadow-2xs">
                          <input
                            type="text"
                            value={bannerOfferTitle}
                            onChange={(e) => setBannerOfferTitle(e.target.value)}
                            className="text-xs font-black text-[#1A102F] bg-transparent outline-none w-full"
                          />
                          <span className="text-[10px] font-bold text-gray-400 pl-2">16/40</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-gray-500 font-bold block mb-1">Subtext</label>
                        <div className="bg-white border border-gray-200 rounded-2xl px-3.5 py-2.5 flex items-center justify-between shadow-2xs">
                          <input
                            type="text"
                            value={bannerSubtext}
                            onChange={(e) => setBannerSubtext(e.target.value)}
                            className="text-xs font-black text-[#1A102F] bg-transparent outline-none w-full"
                          />
                          <span className="text-[10px] font-bold text-gray-400 pl-2">12/60</span>
                        </div>
                      </div>
                    </div>

                    {/* Show Stamp Progress Bar */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-black text-[#1A102F]">Show Stamp Progress Bar</span>
                      <button
                        type="button"
                        onClick={() => setBannerShowStampProgress(!bannerShowStampProgress)}
                        className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                          bannerShowStampProgress ? 'bg-[#2D0F55]' : 'bg-gray-200'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                            bannerShowStampProgress ? 'right-0.5' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    <div>
                      <label className="text-[11px] text-gray-500 font-bold block mb-1">Progress Text</label>
                      <div className="bg-white border border-gray-200 rounded-2xl px-3.5 py-2.5 flex items-center justify-between shadow-2xs">
                        <input
                          type="text"
                          value={bannerProgressText}
                          onChange={(e) => setBannerProgressText(e.target.value)}
                          className="text-xs font-black text-[#1A102F] bg-transparent outline-none w-full"
                        />
                        <span className="text-[10px] font-bold text-gray-400 pl-2">12/30</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-gray-500 font-bold block mb-1">Valid Till</label>
                      <div className="bg-white border border-gray-200 rounded-2xl px-3.5 py-2.5 flex items-center justify-between shadow-2xs">
                        <input
                          type="text"
                          value={bannerValidityDate}
                          onChange={(e) => setBannerValidityDate(e.target.value)}
                          className="text-xs font-black text-[#1A102F] bg-transparent outline-none w-full"
                        />
                        <Calendar className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <span className="text-xs font-black text-[#1A102F] block">Banner Text</span>

                      <div>
                        <label className="text-[11px] text-gray-500 font-bold block mb-1">Offer Title</label>
                        <div className="bg-white border border-gray-200 rounded-2xl px-3.5 py-2.5 flex items-center justify-between shadow-2xs">
                          <input
                            type="text"
                            value={bannerOfferTitle}
                            onChange={(e) => setBannerOfferTitle(e.target.value)}
                            className="text-xs font-black text-[#1A102F] bg-transparent outline-none w-full"
                          />
                          <span className="text-[10px] font-bold text-gray-400 pl-2">16/40</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-gray-500 font-bold block mb-1">Subtext</label>
                        <div className="bg-white border border-gray-200 rounded-2xl px-3.5 py-2.5 flex items-center justify-between shadow-2xs">
                          <input
                            type="text"
                            value={bannerSubtext}
                            onChange={(e) => setBannerSubtext(e.target.value)}
                            className="text-xs font-black text-[#1A102F] bg-transparent outline-none w-full"
                          />
                          <span className="text-[10px] font-bold text-gray-400 pl-2">12/60</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-gray-500 font-bold block mb-1">Special Tag (Optional)</label>
                        <div className="bg-white border border-gray-200 rounded-2xl px-3.5 py-2.5 flex items-center justify-between shadow-2xs">
                          <input
                            type="text"
                            value={bannerSpecialTag}
                            onChange={(e) => setBannerSpecialTag(e.target.value)}
                            className="text-xs font-black text-[#1A102F] bg-transparent outline-none w-full"
                          />
                          <span className="text-[10px] font-bold text-gray-400 pl-2">12/20</span>
                        </div>
                      </div>
                    </div>

                    {/* Show Validity Date */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-black text-[#1A102F]">Show Validity Date</span>
                      <button
                        type="button"
                        onClick={() => setBannerShowValidity(!bannerShowValidity)}
                        className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                          bannerShowValidity ? 'bg-[#2D0F55]' : 'bg-gray-200'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                            bannerShowValidity ? 'right-0.5' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    {bannerShowValidity && (
                      <div>
                        <label className="text-[11px] text-gray-500 font-bold block mb-1">Validity Till</label>
                        <div className="bg-white border border-gray-200 rounded-2xl px-3.5 py-2.5 flex items-center justify-between shadow-2xs">
                          <input
                            type="text"
                            value={bannerValidityDate}
                            onChange={(e) => setBannerValidityDate(e.target.value)}
                            className="text-xs font-black text-[#1A102F] bg-transparent outline-none w-full"
                          />
                          <Calendar className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    )}

                    {/* Show Location */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-black text-[#1A102F]">Show Location</span>
                      <button
                        type="button"
                        onClick={() => setBannerShowLocation(!bannerShowLocation)}
                        className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                          bannerShowLocation ? 'bg-[#2D0F55]' : 'bg-gray-200'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                            bannerShowLocation ? 'right-0.5' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </>
                )}

                {/* Bottom Nav */}
                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(4);
                      setIsConfiguringReward(true);
                    }}
                    className="text-xs font-black text-[#1A102F] hover:text-[#6D28D9] flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>←</span>
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(6)}
                    className="px-8 py-3 bg-[#2D0F55] hover:bg-[#3D1472] text-white rounded-2xl text-xs font-black shadow-md shadow-purple-950/20 cursor-pointer transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: DESIGN (Matching Campaign- Customize Offer Banner- Design.png) */}
            {bannerTab === 'design' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {/* Colour Theme */}
                <div>
                  <label className="text-xs font-black text-[#1A102F] block mb-2">Colour Theme</label>
                  <div className="flex items-center gap-3">
                    {[
                      { id: '#2D0F55', color: 'bg-[#2D0F55]' },
                      { id: '#F97316', color: 'bg-[#F97316]' },
                      { id: '#FCD34D', color: 'bg-[#FCD34D]' },
                      { id: '#38BDF8', color: 'bg-[#38BDF8]' },
                      { id: '#2DD4BF', color: 'bg-[#2DD4BF]' },
                      { id: '#EC4899', color: 'bg-[#EC4899]' }
                    ].map((th) => (
                      <button
                        key={th.id}
                        type="button"
                        onClick={() => setBannerColorTheme(th.id)}
                        className={`w-9 h-9 rounded-full ${th.color} transition-all cursor-pointer ${
                          bannerColorTheme === th.id
                            ? 'ring-2 ring-offset-2 ring-[#2D0F55] scale-110 shadow-xs'
                            : 'hover:scale-105'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Background Style */}
                <div>
                  <label className="text-xs font-black text-[#1A102F] block mb-2">Background Style</label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      {
                        id: 'gradient',
                        label: 'Gradient',
                        icon: <RotateCcw className="w-5 h-5 text-gray-500" />
                      },
                      {
                        id: 'solid',
                        label: 'Solid',
                        icon: <div className="w-4 h-4 border-2 border-gray-400 rounded-sm" />
                      },
                      {
                        id: 'image',
                        label: 'Image',
                        icon: <ImageIcon className="w-5 h-5 text-gray-500" />
                      }
                    ].map((bg) => (
                      <div
                        key={bg.id}
                        onClick={() => setBannerBgStyle(bg.id as any)}
                        className={`p-3.5 bg-white rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                          bannerBgStyle === bg.id
                            ? 'border-2 border-[#2D0F55] shadow-xs'
                            : 'border border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {bg.icon}
                        <span className="text-xs font-bold text-[#1A102F]">{bg.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Font Style */}
                <div>
                  <label className="text-xs font-black text-[#1A102F] block mb-2">Font Style</label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'modern', label: 'Modern', preview: 'font-sans font-black' },
                      { id: 'classic', label: 'Classic', preview: 'font-serif italic font-bold' },
                      { id: 'playful', label: 'Playful', preview: 'font-mono font-bold' }
                    ].map((fnt) => (
                      <div
                        key={fnt.id}
                        onClick={() => setBannerFontStyle(fnt.id as any)}
                        className={`p-3.5 bg-white rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                          bannerFontStyle === fnt.id
                            ? 'border-2 border-[#2D0F55] shadow-xs'
                            : 'border border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className={`text-base text-[#1A102F] ${fnt.preview}`}>Aa</span>
                        <span className="text-xs font-bold text-[#1A102F]">{fnt.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Button Style (Offer) or Icon Style (Stamp) */}
                {conditionType === 'stamps' ? (
                  <div>
                    <label className="text-xs font-black text-[#1A102F] block mb-2">Icon Style</label>
                    <div className="grid grid-cols-6 gap-2">
                      {[
                        { id: 'star', icon: <Star className="w-4 h-4 fill-current" /> },
                        { id: 'heart', icon: <Heart className="w-4 h-4 fill-current" /> },
                        { id: 'gift', icon: <Gift className="w-4 h-4" /> },
                        { id: 'bag', icon: <ShoppingBag className="w-4 h-4" /> },
                        { id: 'hexagon', icon: <Shield className="w-4 h-4" /> },
                        { id: 'crown', icon: <Crown className="w-4 h-4" /> }
                      ].map((ic) => (
                        <button
                          key={ic.id}
                          type="button"
                          onClick={() => setBannerIconStyle(ic.id as any)}
                          className={`p-3 bg-white rounded-2xl flex items-center justify-center cursor-pointer transition-all ${
                            bannerIconStyle === ic.id
                              ? 'border-2 border-[#2D0F55] text-[#2D0F55] shadow-xs'
                              : 'border border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}
                        >
                          {ic.icon}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-black text-[#1A102F] block mb-2">Button Style</label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        {
                          id: 'filled',
                          label: 'Filled',
                          preview: <div className="w-10 h-4 bg-[#2D0F55] rounded-full" />
                        },
                        {
                          id: 'outline',
                          label: 'Outline',
                          preview: <div className="w-10 h-4 border-2 border-gray-400 rounded-full" />
                        },
                        {
                          id: 'text',
                          label: 'Text',
                          preview: <span className="text-xs font-bold text-gray-600">Aa</span>
                        }
                      ].map((btn) => (
                        <div
                          key={btn.id}
                          onClick={() => setBannerButtonStyle(btn.id as any)}
                          className={`p-3.5 bg-white rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                            bannerButtonStyle === btn.id
                              ? 'border-2 border-[#2D0F55] shadow-xs'
                              : 'border border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {btn.preview}
                          <span className="text-xs font-bold text-[#1A102F]">{btn.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Nav */}
                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(4);
                      setIsConfiguringReward(true);
                    }}
                    className="text-xs font-black text-[#1A102F] hover:text-[#6D28D9] flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>←</span>
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(6)}
                    className="px-8 py-3 bg-[#2D0F55] hover:bg-[#3D1472] text-white rounded-2xl text-xs font-black shadow-md shadow-purple-950/20 cursor-pointer transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: LAYOUT (Matching Campaign- Customize Offer Banner- Layout.png) */}
            {bannerTab === 'layout' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div>
                  <label className="text-xs font-black text-[#1A102F] block mb-2">Banner Layout</label>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Layout 1 */}
                    <div onClick={() => setBannerLayout('layout1')} className="cursor-pointer space-y-1.5">
                      <div
                        className={`h-24 rounded-2xl p-2.5 flex items-center justify-between text-white overflow-hidden transition-all ${
                          bannerLayout === 'layout1' ? 'ring-2 ring-[#2D0F55] shadow-xs' : 'opacity-90'
                        }`}
                        style={{ background: 'linear-gradient(135deg, #2D0F55 0%, #BE123C 100%)' }}
                      >
                        <img
                          src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=100&auto=format&fit=crop&q=80"
                          alt="thumb"
                          className="w-10 h-10 rounded-full object-cover border border-white/40 shadow-xs"
                        />
                        <div className="text-right space-y-0.5">
                          <span className="bg-[#BE123C] text-[8px] font-black px-1.5 py-0.5 rounded-full inline-block">
                            SPECIAL
                          </span>
                          <div className="text-[10px] font-black leading-tight">Buy 1 Get 1</div>
                          <div className="text-[7.5px] text-white/80">On all pizzas</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-1.5">
                        <div
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                            bannerLayout === 'layout1' ? 'border-2 border-[#2D0F55]' : 'border-2 border-gray-300'
                          }`}
                        >
                          {bannerLayout === 'layout1' && <div className="w-1.5 h-1.5 rounded-full bg-[#2D0F55]" />}
                        </div>
                        <span className="text-xs font-bold text-[#1A102F]">Layout 1</span>
                      </div>
                    </div>

                    {/* Layout 2 */}
                    <div onClick={() => setBannerLayout('layout2')} className="cursor-pointer space-y-1.5">
                      <div
                        className={`h-24 rounded-2xl p-2.5 flex items-center justify-between text-white overflow-hidden transition-all ${
                          bannerLayout === 'layout2' ? 'ring-2 ring-[#2D0F55] shadow-xs' : 'opacity-90'
                        }`}
                        style={{ background: 'linear-gradient(135deg, #2D0F55 0%, #BE123C 100%)' }}
                      >
                        <div className="text-left space-y-0.5">
                          <div className="text-[10px] font-black leading-tight">Buy 1 Get 1</div>
                          <div className="text-[7.5px] text-white/80">1 Free</div>
                          <div className="text-[7.5px] text-white/80">On all pizzas</div>
                        </div>
                        <img
                          src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=100&auto=format&fit=crop&q=80"
                          alt="thumb"
                          className="w-10 h-10 rounded-full object-cover border border-white/40 shadow-xs"
                        />
                      </div>
                      <div className="flex items-center justify-center gap-1.5">
                        <div
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                            bannerLayout === 'layout2' ? 'border-2 border-[#2D0F55]' : 'border-2 border-gray-300'
                          }`}
                        >
                          {bannerLayout === 'layout2' && <div className="w-1.5 h-1.5 rounded-full bg-[#2D0F55]" />}
                        </div>
                        <span className="text-xs font-bold text-[#1A102F]">Layout 2</span>
                      </div>
                    </div>

                    {/* Layout 3 */}
                    <div onClick={() => setBannerLayout('layout3')} className="cursor-pointer space-y-1.5">
                      <div
                        className={`h-24 rounded-2xl p-2.5 flex items-center gap-2 text-white overflow-hidden transition-all ${
                          bannerLayout === 'layout3' ? 'ring-2 ring-[#2D0F55] shadow-xs' : 'opacity-90'
                        }`}
                        style={{ background: 'linear-gradient(135deg, #2D0F55 0%, #BE123C 100%)' }}
                      >
                        <img
                          src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=100&auto=format&fit=crop&q=80"
                          alt="thumb"
                          className="w-10 h-10 rounded-full object-cover border border-white/40 shadow-xs"
                        />
                        <div className="space-y-0.5">
                          <span className="bg-[#BE123C] text-[7.5px] font-black px-1.5 py-0.5 rounded-full inline-block">
                            LIMITED
                          </span>
                          <div className="text-[9.5px] font-black leading-tight">Buy 1 Get 1</div>
                          <div className="text-[7.5px] text-white/80">On all pizzas</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-1.5">
                        <div
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                            bannerLayout === 'layout3' ? 'border-2 border-[#2D0F55]' : 'border-2 border-gray-300'
                          }`}
                        >
                          {bannerLayout === 'layout3' && <div className="w-1.5 h-1.5 rounded-full bg-[#2D0F55]" />}
                        </div>
                        <span className="text-xs font-bold text-[#1A102F]">Layout 3</span>
                      </div>
                    </div>

                    {/* Layout 4 */}
                    <div onClick={() => setBannerLayout('layout4')} className="cursor-pointer space-y-1.5">
                      <div
                        className={`h-24 rounded-2xl p-2 flex flex-col items-center justify-center text-center text-white overflow-hidden transition-all ${
                          bannerLayout === 'layout4' ? 'ring-2 ring-[#2D0F55] shadow-xs' : 'opacity-90'
                        }`}
                        style={{ background: 'linear-gradient(135deg, #2D0F55 0%, #BE123C 100%)' }}
                      >
                        <img
                          src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=100&auto=format&fit=crop&q=80"
                          alt="thumb"
                          className="w-5 h-5 rounded-full object-cover mb-1 border border-white/40 shadow-xs"
                        />
                        <div className="text-[9px] font-black leading-tight">Buy 1 Get 1</div>
                        <div className="text-[7px] text-white/80">On all pizzas</div>
                      </div>
                      <div className="flex items-center justify-center gap-1.5">
                        <div
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                            bannerLayout === 'layout4' ? 'border-2 border-[#2D0F55]' : 'border-2 border-gray-300'
                          }`}
                        >
                          {bannerLayout === 'layout4' && <div className="w-1.5 h-1.5 rounded-full bg-[#2D0F55]" />}
                        </div>
                        <span className="text-xs font-bold text-[#1A102F]">Layout 4</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Show/Hide Elements */}
                <div>
                  <label className="text-xs font-black text-[#1A102F] block mb-2">Show/Hide Elements</label>
                  <div className="bg-white border border-[#F1EBF5] rounded-3xl p-4 divide-y divide-gray-100 shadow-2xs space-y-3">
                    {conditionType === 'stamps' ? (
                      <>
                        <div className="flex items-center justify-between pb-1">
                          <span className="text-xs font-bold text-[#1A102F]">Show Stamp Icons</span>
                          <button
                            type="button"
                            onClick={() => setStampShowIcons(!stampShowIcons)}
                            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                              stampShowIcons ? 'bg-[#2D0F55]' : 'bg-gray-200'
                            }`}
                          >
                            <div
                              className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                                stampShowIcons ? 'right-0.5' : 'left-0.5'
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex items-center justify-between pt-3 pb-1">
                          <span className="text-xs font-bold text-[#1A102F]">Show Gift Icon</span>
                          <button
                            type="button"
                            onClick={() => setStampShowGift(!stampShowGift)}
                            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                              stampShowGift ? 'bg-[#2D0F55]' : 'bg-gray-200'
                            }`}
                          >
                            <div
                              className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                                stampShowGift ? 'right-0.5' : 'left-0.5'
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex items-center justify-between pt-3 pb-1">
                          <span className="text-xs font-bold text-[#1A102F]">Show Progress Bar</span>
                          <button
                            type="button"
                            onClick={() => setStampShowProgressBar(!stampShowProgressBar)}
                            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                              stampShowProgressBar ? 'bg-[#2D0F55]' : 'bg-gray-200'
                            }`}
                          >
                            <div
                              className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                                stampShowProgressBar ? 'right-0.5' : 'left-0.5'
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex items-center justify-between pt-3">
                          <span className="text-xs font-bold text-[#1A102F]">Show Progress Text</span>
                          <button
                            type="button"
                            onClick={() => setStampShowProgressText(!stampShowProgressText)}
                            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                              stampShowProgressText ? 'bg-[#2D0F55]' : 'bg-gray-200'
                            }`}
                          >
                            <div
                              className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                                stampShowProgressText ? 'right-0.5' : 'left-0.5'
                              }`}
                            />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between pb-1">
                          <span className="text-xs font-bold text-[#1A102F]">Offer Badge</span>
                          <button
                            type="button"
                            onClick={() => setBannerShowBadge(!bannerShowBadge)}
                            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                              bannerShowBadge ? 'bg-[#2D0F55]' : 'bg-gray-200'
                            }`}
                          >
                            <div
                              className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                                bannerShowBadge ? 'right-0.5' : 'left-0.5'
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex items-center justify-between pt-3 pb-1">
                          <span className="text-xs font-bold text-[#1A102F]">Food Image</span>
                          <button
                            type="button"
                            onClick={() => setBannerShowFoodImage(!bannerShowFoodImage)}
                            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                              bannerShowFoodImage ? 'bg-[#2D0F55]' : 'bg-gray-200'
                            }`}
                          >
                            <div
                              className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                                bannerShowFoodImage ? 'right-0.5' : 'left-0.5'
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex items-center justify-between pt-3">
                          <span className="text-xs font-bold text-[#1A102F]">Icons (Validity & Location)</span>
                          <button
                            type="button"
                            onClick={() => setBannerShowIcons(!bannerShowIcons)}
                            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                              bannerShowIcons ? 'bg-[#2D0F55]' : 'bg-gray-200'
                            }`}
                          >
                            <div
                              className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                                bannerShowIcons ? 'right-0.5' : 'left-0.5'
                              }`}
                            />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Bottom Nav */}
                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(4);
                      setIsConfiguringReward(true);
                    }}
                    className="text-xs font-black text-[#1A102F] hover:text-[#6D28D9] flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>←</span>
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(6)}
                    className="px-8 py-3 bg-[#2D0F55] hover:bg-[#3D1472] text-white rounded-2xl text-xs font-black shadow-md shadow-purple-950/20 cursor-pointer transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================== */}
        {/* STEP 6: REVIEW AND PUBLISH (Image: Campaign- Review and Publish.png)  */}
        {/* ===================================================================== */}
        {currentStep === 6 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h1 className="text-[22px] font-black text-[#1A102F]">Review and Publish</h1>
              <p className="text-xs text-[#64748B] mt-0.5 leading-snug">
                Review all the details of your campaign before publishing. You can make changes if needed.
              </p>
            </div>

            {/* 1. Campaign Details Card */}
            <div className="bg-white rounded-3xl p-4 border border-[#F1EBF5] shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black text-[#1A102F]">Campaign Details</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="flex items-start gap-3 pt-1">
                <div className="w-12 h-12 rounded-2xl bg-[#F3E8FF] flex items-center justify-center text-[#7C3AED] flex-shrink-0">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Campaign Name</div>
                  <div className="text-xs font-black text-[#1A102F]">
                    {bannerOfferTitle || campaignName} – Pizzas
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1.5">
                    Description
                  </div>
                  <div className="text-[11px] text-gray-600 leading-snug">
                    {audienceDesc || 'Enjoy 1+1 on all pizzas. Treat yourself and a friend to your favourite pizzas!'}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Audience Card */}
            <div className="bg-white rounded-3xl p-4 border border-[#F1EBF5] shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black text-[#1A102F]">Audience</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold text-gray-400">Target Audience</div>
                    <div className="text-xs font-black text-[#1A102F]">{audienceCategory || 'All Customers'}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold text-gray-400">Location</div>
                    <div className="text-xs font-black text-[#1A102F]">All Outlets</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold text-gray-400">Age Range</div>
                    <div className="text-xs font-black text-[#1A102F]">All Ages</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold text-gray-400">Visit Frequency</div>
                    <div className="text-xs font-black text-[#1A102F] leading-tight">
                      First-time & Returning Customers
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Conditions Card */}
            <div className="bg-white rounded-3xl p-4 border border-[#F1EBF5] shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black text-[#1A102F]">Conditions</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div className="flex items-start gap-2">
                  <ShoppingCart className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold text-gray-400">Minimum Purchase</div>
                    <div className="text-xs font-black text-[#1A102F]">₹ 499</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold text-gray-400">Applicable At</div>
                    <div className="text-xs font-black text-[#1A102F]">All Outlets</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold text-gray-400">Valid From</div>
                    <div className="text-xs font-black text-[#1A102F]">{startDate || '12 Sep 2025'}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Tag className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold text-gray-400">Offer Type</div>
                    <div className="text-xs font-black text-[#1A102F]">Special Offer</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold text-gray-400">Valid To</div>
                    <div className="text-xs font-black text-[#1A102F]">{endDate || '30 Sep 2025'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Rewards Card */}
            <div className="bg-white rounded-3xl p-4 border border-[#F1EBF5] shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                    <Gift className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black text-[#1A102F]">Rewards</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(4);
                    setIsConfiguringReward(true);
                  }}
                  className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div className="flex items-start gap-2">
                  <Trophy className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold text-gray-400">Reward Type</div>
                    <div className="text-xs font-black text-[#1A102F]">
                      {rewardType === 'bogo' ? 'Buy 1 Get 1 Free' : rewardType.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold text-gray-400">Reward Limit</div>
                    <div className="text-xs font-black text-[#1A102F]">1 per customer</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Tag className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold text-gray-400">Reward Value</div>
                    <div className="text-xs font-black text-[#1A102F]">Free item (2nd pizza)</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <RotateCcw className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold text-gray-400">Show Progress</div>
                    <div className="text-xs font-black text-[#1A102F]">Enabled</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Banner Preview Card */}
            <div className="bg-white rounded-3xl p-4 border border-[#F1EBF5] shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                    <Eye className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black text-[#1A102F]">Banner Preview</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              {/* Rendered Banner in Step 6 */}
              <div
                className="rounded-2xl p-3.5 text-white flex items-center justify-between shadow-md relative overflow-hidden"
                style={{
                  background:
                    bannerBgStyle === 'solid'
                      ? bannerColorTheme
                      : `linear-gradient(135deg, ${bannerColorTheme} 0%, #BE123C 100%)`
                }}
              >
                <div className="flex items-center gap-3">
                  {bannerShowFoodImage && (
                    <img
                      src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=120&auto=format&fit=crop&q=80"
                      alt="Banner Pizza"
                      className="w-14 h-14 rounded-full object-cover border-2 border-white/40 shadow-sm flex-shrink-0"
                    />
                  )}
                  <div className="space-y-1">
                    {bannerShowBadge && (
                      <span className="bg-[#BE123C] text-white text-[8.5px] font-black px-2 py-0.5 rounded-full inline-block">
                        {bannerSpecialTag || 'SPECIAL OFFER'}
                      </span>
                    )}
                    <div className="text-xs font-black leading-tight">{bannerOfferTitle}</div>
                    <div className="text-[10px] text-white/80">{bannerSubtext}</div>

                    {bannerShowIcons && (
                      <div className="flex items-center gap-3 pt-1 text-[8.5px] text-white/90 font-bold">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Valid till {bannerValidityDate || '30 Sep 2025'}</span>
                        </div>
                        {bannerShowLocation && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>All outlets</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 6 Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  alert('Campaign posted successfully!');
                  setViewMode('dashboard');
                }}
                className="w-full py-4 bg-[#2D0F55] hover:bg-[#3D1472] text-white rounded-2xl text-xs font-black shadow-lg shadow-purple-950/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Post Campaign</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="w-full py-3.5 bg-white border border-[#E9D5FF] text-[#2D0F55] rounded-2xl text-xs font-black hover:bg-purple-50/50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Details</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER NAVIGATION BUTTONS (For Steps 1 to 5) */}
      {currentStep < 6 && !(currentStep === 3 && isConfiguringCondition) && !(currentStep === 4 && isConfiguringReward) && currentStep !== 5 && (
        <div className="px-5 pt-3 border-t border-[#F0EBF5] bg-white/90 backdrop-blur-md flex items-center justify-between max-w-sm mx-auto w-full">
          <button
            onClick={() => {
              if (currentStep === 1) {
                setCreationSetupStep(campaignCreationMode === 'multiple' ? 'configure_multiple' : 'choose_type');
              } else if (currentStep === 2) {
                if (audienceSubStep === 'sliders') setAudienceSubStep('tiers');
                else if (audienceSubStep === 'tiers') setAudienceSubStep('order_types');
                else if (audienceSubStep === 'order_types') setAudienceSubStep('audience_type');
                else setCurrentStep(1);
              } else if (currentStep === 3) {
                setCurrentStep(2);
                setAudienceSubStep('sliders');
              } else if (currentStep === 4) {
                setCurrentStep(3);
                setIsConfiguringCondition(false);
              } else {
                setCurrentStep((s) => Math.max(1, s - 1));
              }
            }}
            className="text-xs font-black text-[#1A102F] hover:text-[#6D28D9] flex items-center gap-1.5 cursor-pointer"
          >
            <span>←</span>
            <span>Back</span>
          </button>

          {/* Next button (hidden on Step 3 Condition Catalog where tapping a condition advances, matching Image 4) */}
          {currentStep !== 3 ? (
            <button
              onClick={() => {
                if (currentStep === 2) {
                  if (audienceSubStep === 'audience_type') setAudienceSubStep('order_types');
                  else if (audienceSubStep === 'order_types') setAudienceSubStep('tiers');
                  else if (audienceSubStep === 'tiers') setAudienceSubStep('sliders');
                  else {
                    setCurrentStep(3);
                    setIsConfiguringCondition(false);
                  }
                } else if (currentStep === 4) {
                  setIsConfiguringReward(true);
                } else {
                  setCurrentStep((s) => Math.min(6, s + 1));
                }
              }}
              className="px-8 py-3 bg-[#2D0F55] hover:bg-[#3D1472] text-white rounded-2xl text-xs font-black shadow-md shadow-purple-950/20 cursor-pointer transition-all"
            >
              Next
            </button>
          ) : (
            <div />
          )}
        </div>
      )}
    </div>
  );
};

export default MobileCampaignView;
