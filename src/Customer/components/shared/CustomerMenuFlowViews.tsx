import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  Award,
  Bell,
  Box,
  Calendar,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Coffee,
  CreditCard,
  Edit3,
  Gift,
  Heart,
  HelpCircle,
  Info,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  Minus,
  Percent,
  Phone,
  Plus,
  Receipt,
  Search,
  Send,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Star,
  Store,
  Tag,
  Trash2,
  User,
  Users,
  Utensils,
  Wallet
} from 'lucide-react';

/* ============================================================================
   SHARED MENU DATA & TYPES (Matches menu.png, menu-1.png, menu-2.png)
   ============================================================================ */
export interface CustomerMenuItem {
  id: string;
  name: string;
  category: 'Starters' | 'Platters' | 'Main Course' | 'Pizza' | 'Beverages' | 'Desserts';
  subCategory: string;
  price: number;
  veg: boolean;
  rating: number;
  eyebrow: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
  sizes?: Array<{ label: string; extra: number }>;
}

export const CUSTOMER_MENU_ITEMS: CustomerMenuItem[] = [
  {
    id: 'margherita-pizza',
    name: 'Margherita Pizza',
    category: 'Pizza',
    subCategory: 'All Pizzas',
    price: 349,
    veg: true,
    rating: 4.9,
    eyebrow: 'WOOD-FIRED · HAND-TOSSED',
    shortDesc: 'Classic tomato, basil & mozzarella',
    fullDesc: 'Hand-stretched sourdough crust baked in our stone oven with San Marzano tomatoes, fresh basil, and melted buffalo mozzarella.',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80',
    sizes: [
      { label: 'Regular (9")', extra: 0 },
      { label: 'Medium +₹90', extra: 90 },
      { label: 'Cheese Burst +₹120', extra: 120 }
    ]
  },
  {
    id: 'onion-pizza',
    name: 'Onion Pizza',
    category: 'Pizza',
    subCategory: 'Cheese Burst',
    price: 319,
    veg: true,
    rating: 4.7,
    eyebrow: 'WOOD-FIRED · CRISPY & CHEESY',
    shortDesc: 'Cheesy goodness with fresh caramelized onions',
    fullDesc: 'Loaded with golden caramelized red onions, melted mozzarella blend, oregano, and house garlic olive oil.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
    sizes: [
      { label: 'Regular (9")', extra: 0 },
      { label: 'Medium +₹90', extra: 90 },
      { label: 'Cheese Burst +₹120', extra: 120 }
    ]
  },
  {
    id: 'truffle-mushroom-pizza',
    name: 'Truffle Gourmet Pizza',
    category: 'Pizza',
    subCategory: 'Gourmet',
    price: 429,
    veg: true,
    rating: 4.9,
    eyebrow: 'CHEF SIGNATURE · GOURMET',
    shortDesc: 'Roasted wild mushrooms, truffle oil & parmesan',
    fullDesc: 'Artisan crust finished with sautéed cremini mushrooms, aged parmesan shavings, arugula, and white truffle drizzle.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80',
    sizes: [
      { label: 'Regular (9")', extra: 0 },
      { label: 'Medium +₹90', extra: 90 },
      { label: 'Extra Truffle +₹110', extra: 110 }
    ]
  },
  {
    id: 'classic-cold-coffee',
    name: 'Classic Cold Coffee',
    category: 'Beverages',
    subCategory: 'All Coffee',
    price: 249,
    veg: true,
    rating: 4.9,
    eyebrow: 'COFFEE · CHILLED TO PERFECTION',
    shortDesc: 'Rich coffee with creamy blend',
    fullDesc: 'Smooth, chilled and made to order. Layered with creamy milk, fresh espresso and just the right touch of sweetness.',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80',
    sizes: [
      { label: 'Regular', extra: 0 },
      { label: 'Large +₹50', extra: 50 },
      { label: 'Extra shot +₹70', extra: 70 }
    ]
  },
  {
    id: 'mocha-cold-coffee',
    name: 'Mocha Cold Coffee',
    category: 'Beverages',
    subCategory: 'All Coffee',
    price: 279,
    veg: true,
    rating: 4.8,
    eyebrow: 'COFFEE · BELGIAN COCOA',
    shortDesc: 'Coffee with chocolate twist',
    fullDesc: 'Double shot Arabica espresso blended with Belgian dark cocoa, chilled velvet milk, and whipped cream.',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80',
    sizes: [
      { label: 'Regular', extra: 0 },
      { label: 'Large +₹50', extra: 50 },
      { label: 'Extra shot +₹70', extra: 70 }
    ]
  },
  {
    id: 'caramel-cold-coffee',
    name: 'Caramel Cold Coffee',
    category: 'Beverages',
    subCategory: 'Gourmet',
    price: 299,
    veg: true,
    rating: 4.9,
    eyebrow: 'COFFEE · SALTED CARAMEL',
    shortDesc: 'Smooth coffee with caramel drizzle',
    fullDesc: 'House-made sea salt caramel swirled into bold cold espresso and velvety steamed cream over ice.',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop&q=80',
    sizes: [
      { label: 'Regular', extra: 0 },
      { label: 'Large +₹50', extra: 50 },
      { label: 'Extra shot +₹70', extra: 70 }
    ]
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    category: 'Beverages',
    subCategory: 'All Coffee',
    price: 149,
    veg: true,
    rating: 4.8,
    eyebrow: 'BARISTA ROAST · HOT',
    shortDesc: 'Rich espresso topped with velvety steamed milk',
    fullDesc: 'Freshly ground single-origin beans pulled to golden crema and finished with silky micro-foam.',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&auto=format&fit=crop&q=80',
    sizes: [
      { label: 'Regular', extra: 0 },
      { label: 'Large +₹40', extra: 40 },
      { label: 'Oat Milk +₹60', extra: 60 }
    ]
  },
  {
    id: 'cheese-garlic-bread',
    name: 'Cheese Garlic Bread',
    category: 'Starters',
    subCategory: 'All Starters',
    price: 269,
    veg: true,
    rating: 4.8,
    eyebrow: 'WARM STARTER · OVEN BAKED',
    shortDesc: 'Crispy sourdough toasted with herb butter & melted cheese',
    fullDesc: 'Artisanal sourdough slices brushed with roasted garlic butter, parsley, and molten mozzarella.',
    image: 'https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'peri-peri-fries',
    name: 'Peri Peri Fries',
    category: 'Starters',
    subCategory: 'All Starters',
    price: 199,
    veg: true,
    rating: 4.7,
    eyebrow: 'CRISPY BITES · SPICED',
    shortDesc: 'Golden skin-on fries tossed in zesty peri-peri rub',
    fullDesc: 'Double-fried crispy potato fries dusted with smoky African bird-eye peri-peri spice and served with garlic aioli.',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'classic-veg-burger',
    name: 'Classic Veg Burger',
    category: 'Main Course',
    subCategory: 'Gourmet',
    price: 229,
    veg: true,
    rating: 4.8,
    eyebrow: 'BRIOCHE BUN · HOUSE PATTY',
    shortDesc: 'Crispy herb patty, cheddar, lettuce & smoked mayo',
    fullDesc: 'Toasted butter brioche stuffed with crunchy veggie-cheese patty, pickled gherkins, crisp lettuce, and signature café sauce.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'smoked-chicken-platter',
    name: 'Grilled Chicken Platter',
    category: 'Platters',
    subCategory: 'Gourmet',
    price: 449,
    veg: false,
    rating: 4.9,
    eyebrow: 'HIGH PROTEIN · CHEF PLATTER',
    shortDesc: 'Herb-grilled chicken skewers, hummus, pita & slaw',
    fullDesc: 'Tender char-grilled chicken breast paired with roasted garlic hummus, warm pita, pickled veggies, and toum dip.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'chocolate-brownie',
    name: 'Chocolate Brownie',
    category: 'Desserts',
    subCategory: 'All Desserts',
    price: 199,
    veg: true,
    rating: 4.9,
    eyebrow: 'SWEET FINISH · WARM FUDGE',
    shortDesc: 'Decadent 70% Belgian dark chocolate walnut brownie',
    fullDesc: 'Baked warm with gooey dark chocolate center, toasted walnuts, and drizzled with rich chocolate ganache.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80'
  }
];

const CATEGORY_TILES: Array<{
  id: CustomerMenuItem['category'];
  label: string;
  emoji: string;
  bg: string;
  bannerTitle: string;
  bannerSub: string;
  bannerGrad: string;
  bannerImg: string;
}> = [
  {
    id: 'Starters',
    label: 'Starters',
    emoji: '🍟',
    bg: 'bg-[#FFF3E0]',
    bannerTitle: 'Starters',
    bannerSub: 'Crispy bites & warm plates to begin your meal',
    bannerGrad: 'from-[#9A3412] via-[#C2410C] to-[#EA580C]',
    bannerImg: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'Platters',
    label: 'Platters',
    emoji: '🍱',
    bg: 'bg-[#FEF9C3]',
    bannerTitle: 'Platters',
    bannerSub: 'Generous sharing boards made for the whole table',
    bannerGrad: 'from-[#854D0E] via-[#B45309] to-[#D97706]',
    bannerImg: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'Main Course',
    label: 'Main Course',
    emoji: '🍔',
    bg: 'bg-[#DCFCE7]',
    bannerTitle: 'Mains',
    bannerSub: 'Hearty café comfort dishes cooked fresh to order',
    bannerGrad: 'from-[#065F46] via-[#047857] to-[#0D9488]',
    bannerImg: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'Pizza',
    label: 'Pizza',
    emoji: '🍕',
    bg: 'bg-[#FCE7F3]',
    bannerTitle: 'Pizza',
    bannerSub: 'Fresh from the oven, every bite a delight',
    bannerGrad: 'from-[#B8005C] via-[#D90467] to-[#9D174D]',
    bannerImg: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'Beverages',
    label: 'Beverages',
    emoji: '🧋',
    bg: 'bg-[#F3E8FF]',
    bannerTitle: 'Coffee',
    bannerSub: 'Made using fresh beans, every sip is a delight',
    bannerGrad: 'from-[#2D1408] via-[#4A220E] to-[#6B3314]',
    bannerImg: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'Desserts',
    label: 'Desserts',
    emoji: '🧁',
    bg: 'bg-[#F5F3FF]',
    bannerTitle: 'Desserts',
    bannerSub: 'Warm brownies & handcrafted sweet treats',
    bannerGrad: 'from-[#4C1D95] via-[#6D28D9] to-[#9333EA]',
    bannerImg: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80'
  }
];

export interface CartEntry {
  item: CustomerMenuItem;
  qty: number;
  sizeLabel?: string;
  unitPrice: number;
  servingTime: string;
}

/* ============================================================================
   1. MENU BROWSER VIEW (Matches menu.png & menu-1.png)
   Responsive across Mobile, Tablet, and Desktop
   ============================================================================ */
export interface CustomerMenuBrowserViewProps {
  merchantName: string;
  cartEntries: CartEntry[];
  onQuickAdd: (item: CustomerMenuItem) => void;
  onUpdateQty: (itemId: string, delta: number) => void;
  onSelectItem: (item: CustomerMenuItem) => void;
  onViewCart: () => void;
}

export const CustomerMenuBrowserView: React.FC<CustomerMenuBrowserViewProps> = ({
  merchantName,
  cartEntries,
  onQuickAdd,
  onUpdateQty,
  onSelectItem,
  onViewCart
}) => {
  const [selectedCat, setSelectedCat] = useState<CustomerMenuItem['category'] | 'All'>('Pizza');
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'nonveg'>('veg');
  const [subFilter, setSubFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const activeTile =
    CATEGORY_TILES.find((t) => t.id === (selectedCat === 'All' ? 'Pizza' : selectedCat)) ||
    CATEGORY_TILES[3];

  const subPills =
    selectedCat === 'Beverages'
      ? ['All', 'All Coffee', 'Gourmet']
      : selectedCat === 'Pizza'
      ? ['All', 'All Pizzas', 'Cheese Burst', 'Gourmet']
      : ['All', 'Gourmet', 'Chef Specials'];

  const filteredItems = CUSTOMER_MENU_ITEMS.filter((item) => {
    const matchesCat = selectedCat === 'All' || item.category === selectedCat;
    const matchesDiet =
      dietFilter === 'all' || (dietFilter === 'veg' ? item.veg : !item.veg);
    const matchesSub =
      subFilter === 'All' ||
      subFilter.startsWith('All ') ||
      item.subCategory === subFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesQ =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.shortDesc.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);
    return matchesCat && matchesDiet && matchesSub && matchesQ;
  });

  const totalItems = cartEntries.reduce((sum, e) => sum + e.qty, 0);
  const totalAmount = cartEntries.reduce((sum, e) => sum + e.unitPrice * e.qty, 0);

  const getItemQty = (id: string) =>
    cartEntries.filter((e) => e.item.id === id).reduce((s, e) => s + e.qty, 0);

  return (
    <div className="space-y-4 sm:space-y-5 pb-20 lg:pb-6 animate-in fade-in duration-200">
      {/* Top Editorial Header + Veg/Non-Veg Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#DB006A]">
            Made Fresh For You
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E1548] leading-tight mt-0.5 flex items-center gap-2">
            <span>What are you craving?</span>
            <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
          </h1>
          <p className="text-xs sm:text-sm text-[#7B748C] font-medium mt-1">
            Explore by category and discover your favourites at {merchantName}
          </p>
        </div>

        {/* Veg / Non-Veg Segmented Pill */}
        <div className="inline-flex items-center bg-white border border-[#EFEAF7] rounded-full p-1 shadow-2xs self-start sm:self-end shrink-0">
          <button
            type="button"
            onClick={() => setDietFilter((p) => (p === 'veg' ? 'all' : 'veg'))}
            className={`px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              dietFilter === 'veg'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'text-[#6B657E] hover:text-[#1E1548]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                dietFilter === 'veg' ? 'bg-white' : 'bg-[#16A34A]'
              }`}
            />
            <span>Veg</span>
          </button>
          <button
            type="button"
            onClick={() => setDietFilter((p) => (p === 'nonveg' ? 'all' : 'nonveg'))}
            className={`px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              dietFilter === 'nonveg'
                ? 'bg-[#DC2626] text-white shadow-xs'
                : 'text-[#6B657E] hover:text-[#1E1548]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                dietFilter === 'nonveg' ? 'bg-white' : 'bg-[#DC2626]'
              }`}
            />
            <span>Non-Veg</span>
          </button>
        </div>
      </div>

      {/* Mood Category Strip (menu.png / menu-1.png) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm sm:text-base font-black text-[#1E1548]">
            What are you in the mood for?
          </h2>
          <button
            type="button"
            onClick={() => {
              setSelectedCat('All');
              setSubFilter('All');
              setDietFilter('all');
            }}
            className="text-xs font-black text-[#DB006A] hover:underline cursor-pointer shrink-0"
          >
            View all categories &rarr;
          </button>
        </div>

        <div className="flex items-start gap-3 overflow-x-auto no-scrollbar pb-1 sm:grid sm:grid-cols-6 sm:overflow-visible">
          {CATEGORY_TILES.map((cat) => {
            const active = selectedCat === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCat(cat.id);
                  setSubFilter('All');
                }}
                className="flex flex-col items-center gap-1.5 shrink-0 w-[68px] sm:w-auto cursor-pointer group"
              >
                <div
                  className={`w-16 h-16 sm:w-full sm:aspect-square sm:max-w-[78px] rounded-2xl ${cat.bg} flex items-center justify-center text-2xl sm:text-3xl relative transition-all ${
                    active
                      ? 'ring-2 ring-[#DB006A] shadow-md scale-[1.03]'
                      : 'border border-transparent hover:border-[#E5DEF5]'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  {active && (
                    <span className="w-5 h-5 rounded-full bg-[#DB006A] text-white flex items-center justify-center absolute -top-1.5 -right-1.5 shadow-xs border-2 border-white">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <span
                  className={`text-[11px] font-bold text-center leading-tight ${
                    active ? 'text-[#DB006A] font-black' : 'text-[#5B546E]'
                  }`}
                >
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Feature Hero Banner (menu.png / menu-1.png) */}
      <div
        className={`rounded-3xl bg-gradient-to-r ${activeTile.bannerGrad} text-white overflow-hidden shadow-lg relative grid grid-cols-12 items-center min-h-[155px] sm:min-h-[185px]`}
      >
        <div className="col-span-7 p-5 sm:p-7 space-y-2 relative z-10">
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/80">
            {merchantName.toUpperCase()}&apos;S SPECIAL
          </div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-1.5">
            <span>{activeTile.bannerTitle}</span>
            <span className="text-amber-300 text-xl">⚡</span>
          </h3>
          <p className="text-xs sm:text-sm text-white/85 leading-snug max-w-xs">
            {activeTile.bannerSub}
          </p>
          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 border border-white/20 text-[11px] font-bold">
              <span>{activeTile.emoji}</span>
              <span>
                {filteredItems.length || CUSTOMER_MENU_ITEMS.length} delicious choices
              </span>
            </span>
          </div>
        </div>
        <div className="col-span-5 h-full relative min-h-[155px] sm:min-h-[185px]">
          <img
            src={activeTile.bannerImg}
            alt={activeTile.bannerTitle}
            className="w-full h-full object-cover rounded-l-full scale-110 shadow-2xl"
          />
        </div>
      </div>

      {/* Explore Our Menu + Search + Filter Pills */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-[#1E1548]">Explore our menu</h2>
            <span className="text-xs font-bold text-[#7B748C] sm:hidden">
              {filteredItems.length} options
            </span>
          </div>

          <div className="relative sm:w-64">
            <Search className="w-4 h-4 text-[#9890A8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, coffee..."
              className="w-full h-10 bg-white border border-[#EFEAF7] rounded-full pl-10 pr-4 text-xs font-semibold text-[#1E1548] placeholder:text-[#9890A8] focus:outline-none focus:border-[#5844A8]"
            />
          </div>
        </div>

        {/* Sub-filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {subPills.map((pill) => {
            const active = subFilter === pill;
            return (
              <button
                key={pill}
                type="button"
                onClick={() => setSubFilter(pill)}
                className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                  active
                    ? 'bg-[#58258B] text-white border-[#58258B] shadow-sm'
                    : 'bg-white text-[#240B4C] border-[#EFEAF7] hover:border-[#C4B5FD]'
                }`}
              >
                {pill}
              </button>
            );
          })}
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between pt-1">
          <h3 className="text-sm font-black text-[#1E1548] flex items-center gap-1.5">
            <span>{activeTile.emoji}</span>
            <span>
              {selectedCat === 'All' ? 'All Café Favourites' : `${selectedCat} favourites`}
            </span>
          </h3>
          <span className="text-xs font-bold text-[#7C3AED]">
            {filteredItems.length} delicious options
          </span>
        </div>

        {/* Menu Cards Grid (1-col Mobile, 2-col Tablet & Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {(filteredItems.length > 0 ? filteredItems : CUSTOMER_MENU_ITEMS).map((item) => {
            const qty = getItemQty(item.id);
            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="bg-white hover:bg-[#FDFBFF] rounded-3xl p-3.5 sm:p-4 border border-[#EFEAF7] hover:border-[#C4B5FD] shadow-2xs hover:shadow-md transition-all flex items-center justify-between gap-3.5 cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl object-cover shrink-0 shadow-xs group-hover:scale-[1.03] transition-transform"
                  />
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center shrink-0 ${
                          item.veg ? 'border-[#16A34A]' : 'border-[#DC2626]'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.veg ? 'bg-[#16A34A]' : 'bg-[#DC2626]'
                          }`}
                        />
                      </span>
                      <h4 className="text-sm sm:text-base font-black text-[#1E1548] truncate group-hover:text-[#58258B]">
                        {item.name}
                      </h4>
                    </div>
                    <p className="text-xs text-[#7B748C] line-clamp-2 leading-snug">
                      {item.shortDesc}
                    </p>
                    <div className="text-sm sm:text-base font-black text-[#DB006A] pt-0.5">
                      ₹{item.price}
                    </div>
                  </div>
                </div>

                {/* Add / Qty Circle Button */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0 flex flex-col items-center gap-1"
                >
                  {qty > 0 ? (
                    <div className="flex items-center gap-1.5 bg-[#F3EEFA] border border-[#D8C9F6] rounded-full p-1">
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.id, -1)}
                        className="w-7 h-7 rounded-full bg-white text-[#58258B] flex items-center justify-center shadow-2xs cursor-pointer hover:bg-[#58258B] hover:text-white transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-black text-[#240B4C] w-4 text-center">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.id, 1)}
                        className="w-7 h-7 rounded-full bg-[#58258B] text-white flex items-center justify-center shadow-2xs cursor-pointer hover:bg-[#3B1478] transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onQuickAdd(item)}
                      aria-label={`Add ${item.name}`}
                      className="w-10 h-10 rounded-full bg-[#58258B] hover:bg-[#3B1478] text-white flex items-center justify-center shadow-md shadow-purple-900/20 cursor-pointer transition-transform active:scale-95"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Cart Summary Bar (Matches menu.png & menu-1.png) */}
      {totalItems > 0 && (
        <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-8 lg:w-[420px] z-30 max-w-lg mx-auto animate-in slide-in-from-bottom-3 duration-200">
          <div className="bg-white/95 backdrop-blur-md rounded-full p-2 pl-3 border border-[#E5DEF5] shadow-xl shadow-purple-950/15 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#FFF1F5] text-[#DB006A] flex items-center justify-center shrink-0">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-black text-[#1E1548] truncate">
                  {totalItems} {totalItems === 1 ? 'Item' : 'Items'} Added
                </div>
                <div className="text-[11px] font-bold text-[#7B748C]">₹{totalAmount} total</div>
              </div>
            </div>

            <button
              type="button"
              onClick={onViewCart}
              className="px-5 py-2.5 rounded-full bg-[#58258B] hover:bg-[#3B1478] text-white text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-md cursor-pointer transition shrink-0"
            >
              <span>View Cart</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
   2. ITEM DETAIL & SIZE CUSTOMIZER VIEW (Matches menu-2.png)
   Responsive across Mobile, Tablet, and Desktop
   ============================================================================ */
export interface CustomerMenuItemDetailViewProps {
  merchantName: string;
  item: CustomerMenuItem;
  onBack: () => void;
  onAddToOrder: (item: CustomerMenuItem, sizeLabel: string, unitPrice: number, qty: number) => void;
}

export const CustomerMenuItemDetailView: React.FC<CustomerMenuItemDetailViewProps> = ({
  merchantName,
  item,
  onBack,
  onAddToOrder
}) => {
  const sizes = item.sizes || [
    { label: 'Regular', extra: 0 },
    { label: 'Large +₹50', extra: 50 },
    { label: 'Chef Extra +₹70', extra: 70 }
  ];
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(1 < sizes.length ? 1 : 0);
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);

  const chosen = sizes[selectedSizeIdx] || sizes[0];
  const unitPrice = item.price + chosen.extra;
  const total = unitPrice * qty;

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl overflow-hidden border border-[#EFEAF7] shadow-xl">
        {/* Top Espresso / Plum Curved Hero Showcase */}
        <div className="bg-gradient-to-b from-[#2B1206] via-[#3F1B0A] to-[#1D0A03] text-white p-5 sm:p-7 rounded-b-[36px] relative">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md flex items-center justify-center text-white cursor-pointer transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="text-xs sm:text-sm font-black tracking-tight">
              {merchantName}
            </div>
            <button
              type="button"
              onClick={() => setLiked((p) => !p)}
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md flex items-center justify-center text-white cursor-pointer transition"
            >
              <Heart className={`w-4 h-4 ${liked ? 'text-rose-400 fill-rose-400' : 'text-white'}`} />
            </button>
          </div>

          <div className="text-center space-y-1.5 max-w-md mx-auto">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200/80">
              {item.eyebrow}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{item.name}</h1>
            <p className="text-xs sm:text-sm text-amber-100/75">{item.shortDesc}</p>
          </div>

          <div className="mt-5 flex justify-center">
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/10">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Customization Body */}
        <div className="p-5 sm:p-7 space-y-6 bg-gradient-to-b from-white to-[#FAF6FF]">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1E1548]">Made just for you</h2>
              <span className="text-xs font-black text-[#7B5A44] flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                {item.rating} LOVED
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#6B657E] leading-relaxed">{item.fullDesc}</p>
          </div>

          {/* Choose your size */}
          <div className="space-y-2.5">
            <div className="text-sm font-black text-[#1E1548]">Choose your size</div>
            <div className="grid grid-cols-3 gap-2.5">
              {sizes.map((sz, idx) => {
                const active = idx === selectedSizeIdx;
                return (
                  <button
                    key={sz.label}
                    type="button"
                    onClick={() => setSelectedSizeIdx(idx)}
                    className={`py-3 px-2.5 rounded-full text-xs font-black transition-all cursor-pointer border text-center ${
                      active
                        ? 'bg-[#FFF5FA] text-[#DB006A] border-[#DB006A] shadow-xs'
                        : 'bg-white text-[#1E1548] border-[#EFEAF7] hover:border-[#C4B5FD]'
                    }`}
                  >
                    {sz.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Row */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <div className="text-sm font-black text-[#1E1548]">Your order</div>
              <div className="text-xs text-[#7B748C]">How many would you like?</div>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-full bg-white border border-[#E5DEF5] text-[#1E1548] flex items-center justify-center hover:border-[#58258B] cursor-pointer transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-lg font-black text-[#1E1548] w-6 text-center">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="w-9 h-9 rounded-full bg-white border border-[#E5DEF5] text-[#1E1548] flex items-center justify-center hover:border-[#58258B] cursor-pointer transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Total & Add to Order CTA */}
          <div className="pt-4 border-t border-[#EFEAF7] flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-[#7B748C]">Total</div>
              <div className="text-2xl font-black text-[#1E1548]">₹{total}</div>
            </div>
            <button
              type="button"
              onClick={() => onAddToOrder(item, chosen.label, unitPrice, qty)}
              className="px-7 py-3.5 rounded-full bg-[#58258B] hover:bg-[#3B1478] text-white text-sm font-black flex items-center gap-2 shadow-lg shadow-purple-900/25 cursor-pointer transition active:scale-[0.99]"
            >
              <span>Add to Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   3. CART + CUSTOMIZE ORDER SEQUENCE & TIMING (Matches list to order.png)
   Responsive across Mobile, Tablet, and Desktop
   ============================================================================ */
export interface CustomerCartViewProps {
  cartEntries: CartEntry[];
  onUpdateQty: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateServingTime: (itemId: string, time: string) => void;
  onPlaceOrder: (totalPayable: number, note: string) => void;
  onContinueBrowsing: () => void;
}

export const CustomerCartView: React.FC<CustomerCartViewProps> = ({
  cartEntries,
  onUpdateQty,
  onRemoveItem,
  onUpdateServingTime,
  onPlaceOrder,
  onContinueBrowsing
}) => {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [note, setNote] = useState('');
  const [couponApplied, setCouponApplied] = useState<string | null>(null);
  const [showCouponPicker, setShowCouponPicker] = useState(false);

  const totalQty = cartEntries.reduce((s, e) => s + e.qty, 0);
  const subtotal = cartEntries.reduce((s, e) => s + e.unitPrice * e.qty, 0);
  const discount = couponApplied === 'SLY20' ? Math.round(subtotal * 0.2) : 0;
  const taxes = Math.round((subtotal - discount) * 0.05);
  const grandTotal = Math.max(0, subtotal - discount + taxes);

  if (cartEntries.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center border border-[#EFEAF7] shadow-2xs max-w-lg mx-auto space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-[#F3EEFA] text-[#58258B] flex items-center justify-center mx-auto">
          <ShoppingCart className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-lg font-black text-[#1E1548]">Your cart is empty</h2>
          <p className="text-xs text-[#7B748C] mt-1">
            Explore our freshly crafted pizzas, coffees, and snacks to start an order.
          </p>
        </div>
        <button
          type="button"
          onClick={onContinueBrowsing}
          className="px-6 py-3 rounded-full bg-[#240B4C] text-white text-xs font-black cursor-pointer hover:bg-[#3B1478] transition"
        >
          Browse Menu &rarr;
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <h1 className="text-lg sm:text-2xl font-black text-[#1E1548] flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-[#240B4C]" />
          <span>Your Cart ({totalQty})</span>
        </h1>
        <button
          type="button"
          onClick={onContinueBrowsing}
          className="text-xs font-black text-[#5844A8] hover:underline cursor-pointer"
        >
          + Add more items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        {/* Left Column: Cart Items + Sequence & Timing */}
        <div className="lg:col-span-7 space-y-4">
          {/* Cart Items Card */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs divide-y divide-[#F4F0FA]">
            {cartEntries.map((entry) => (
              <div
                key={entry.item.id}
                className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={entry.item.image}
                    alt={entry.item.name}
                    className="w-15 h-15 rounded-2xl object-cover shrink-0 shadow-2xs"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-black text-[#1E1548] truncate">
                      {entry.item.name}
                    </h3>
                    {entry.sizeLabel && (
                      <div className="text-[10px] font-bold text-[#7B748C]">{entry.sizeLabel}</div>
                    )}
                    <div className="text-sm font-black text-[#1E1548] mt-0.5">
                      ₹{entry.unitPrice * entry.qty}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="flex items-center gap-2 bg-[#F6F2FC] border border-[#EAE2FB] rounded-full px-2.5 py-1">
                    <button
                      type="button"
                      onClick={() => onUpdateQty(entry.item.id, -1)}
                      className="text-[#58258B] cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-black text-[#1E1548] min-w-[14px] text-center">
                      {entry.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQty(entry.item.id, 1)}
                      className="text-[#58258B] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(entry.item.id)}
                    className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Customize Order Sequence & Timing Card (list to order.png) */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#58258B] text-white flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-[#240B4C]">
                  Customize Order Sequence &amp; Timing
                </h3>
                <p className="text-[11px] sm:text-xs text-[#7B748C] mt-0.5">
                  Set the order in which you want to receive each item and choose a serving time for each.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="grid grid-cols-12 text-[10px] font-black text-[#6B657E] uppercase tracking-wider px-1">
                <span className="col-span-2">Order</span>
                <span className="col-span-4">Item</span>
                <span className="col-span-2 text-center">Qty</span>
                <span className="col-span-4 text-right">Preferred Time</span>
              </div>

              {cartEntries.map((entry, idx) => (
                <div
                  key={entry.item.id}
                  className="grid grid-cols-12 items-center gap-1.5 py-1.5"
                >
                  <div className="col-span-2">
                    <span className="w-7 h-7 rounded-full bg-[#F3EEFA] text-[#58258B] font-black text-xs inline-flex items-center justify-center">
                      {idx + 1}
                    </span>
                  </div>
                  <div className="col-span-4 text-xs font-bold text-[#1E1548] truncate pr-1">
                    {entry.item.name}
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FAF8FF] border border-[#EFEAF7] text-xs font-black text-[#1E1548]">
                      {entry.qty}
                    </span>
                  </div>
                  <div className="col-span-4">
                    <select
                      value={entry.servingTime}
                      onChange={(e) => onUpdateServingTime(entry.item.id, e.target.value)}
                      className="w-full h-9 rounded-full bg-white border border-[#E5DEF5] px-2.5 text-[11px] font-bold text-[#240B4C] focus:outline-none focus:border-[#58258B] cursor-pointer"
                    >
                      <option value="At 01:45 PM">🕒 At 01:45 PM</option>
                      <option value="At 02:15 PM">🕒 At 02:15 PM</option>
                      <option value="At 03:00 PM">🕒 At 03:00 PM</option>
                      <option value="Serve Now">🕒 Serve Now</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            {showNoteInput ? (
              <div className="space-y-2">
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="E.g., Less spicy, serve coffee after starters..."
                  className="w-full rounded-2xl bg-[#FAF8FF] border border-[#E5DEF5] p-3 text-xs font-medium text-[#1E1548] focus:outline-none focus:border-[#58258B]"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowNoteInput(true)}
                className="w-full h-11 rounded-2xl border border-[#58258B]/50 hover:bg-[#FAF8FF] text-[#240B4C] text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Note for Items</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Coupon + Bill Details + Place Order */}
        <div className="lg:col-span-5 space-y-4">
          {/* Apply Coupon Card */}
          <div className="bg-white rounded-3xl p-4 border border-[#EFEAF7] shadow-2xs space-y-3">
            <button
              type="button"
              onClick={() => setShowCouponPicker((p) => !p)}
              className="w-full flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Tag className="w-4 h-4 text-[#58258B]" />
                <span className="text-sm font-black text-[#1E1548]">
                  {couponApplied ? `Coupon ${couponApplied} Applied` : 'Apply Coupon'}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#9890A8]" />
            </button>

            {showCouponPicker && (
              <div className="pt-2 border-t border-[#F4F0FA] flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-black text-[#1E1548]">SLY20</div>
                  <div className="text-[11px] text-[#7B748C]">Flat 20% off on your café order</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCouponApplied((prev) => (prev === 'SLY20' ? null : 'SLY20'));
                    setShowCouponPicker(false);
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-[#240B4C] text-white text-xs font-black cursor-pointer"
                >
                  {couponApplied === 'SLY20' ? 'Remove' : 'Apply'}
                </button>
              </div>
            )}
          </div>

          {/* Bill Details */}
          <div className="bg-white rounded-3xl p-5 border border-[#EFEAF7] shadow-2xs space-y-3">
            <h3 className="text-sm font-black text-[#1E1548]">Bill Details</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#6B657E]">
                <span>Item Total ({totalQty} Items)</span>
                <span className="font-bold text-[#1E1548]">₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount (SLY20)</span>
                  <span>- ₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between text-[#6B657E]">
                <span>Taxes (5%)</span>
                <span className="font-bold text-[#1E1548]">₹{taxes}</span>
              </div>
            </div>
            <div className="pt-3 border-t border-[#F2ECF9] flex items-center justify-between">
              <span className="text-base font-black text-[#1E1548]">Total Payable</span>
              <span className="text-lg font-black text-[#1E1548]">₹{grandTotal}</span>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            type="button"
            onClick={() => onPlaceOrder(grandTotal, note)}
            className="w-full h-14 rounded-full bg-[#240B4C] hover:bg-[#35146B] text-white text-sm sm:text-base font-black shadow-xl shadow-purple-950/25 flex items-center justify-center gap-3 cursor-pointer transition active:scale-[0.99]"
          >
            <span>Place Order</span>
            <span>₹{grandTotal}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   4. ORDER PLACED CELEBRATION OVERLAY (Matches menu-3.png)
   ============================================================================ */
export const OrderPlacedSuccessOverlay: React.FC<{ onContinue: () => void }> = ({
  onContinue
}) => (
  <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#B80066] via-[#C80071] to-[#A30059] flex flex-col items-center justify-center p-6 text-center text-white animate-in fade-in duration-200">
    <div className="w-40 h-40 rounded-full bg-white/10 flex items-center justify-center mb-6">
      <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center shadow-2xl">
        <Check className="w-12 h-12 text-[#C80071] stroke-[3.5]" />
      </div>
    </div>
    <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Order placed</h1>
    <p className="text-sm sm:text-base text-white/90 font-medium mt-2">
      Something delicious is on its way ✨
    </p>
    <button
      type="button"
      onClick={onContinue}
      className="mt-8 px-8 py-3.5 rounded-full bg-white hover:bg-pink-50 text-[#9D0056] text-sm font-black shadow-xl flex items-center gap-2 cursor-pointer transition active:scale-95"
    >
      <span>Keep exploring</span>
      <ArrowRight className="w-4 h-4" />
    </button>
  </div>
);

/* ============================================================================
   5. TRACK YOUR ORDER VIEW (Matches tracking.png & tracking simmary.png)
   ============================================================================ */
export interface CustomerOrderTrackerViewProps {
  merchantName: string;
  items: CartEntry[];
  totalPaid: number;
  onRequestItems: () => void;
  onCallWaiter: () => void;
  onMarkCompleted: () => void;
  onCancelOrder: () => void;
}

export const CustomerOrderTrackerView: React.FC<CustomerOrderTrackerViewProps> = ({
  merchantName,
  items,
  totalPaid,
  onRequestItems,
  onCallWaiter,
  onMarkCompleted,
  onCancelOrder
}) => {
  const [isDelayed, setIsDelayed] = useState(false);

  const summaryItems =
    items.length > 0
      ? items
      : [
          { item: CUSTOMER_MENU_ITEMS[7], qty: 1, unitPrice: 269, servingTime: 'At 01:45 PM' },
          { item: CUSTOMER_MENU_ITEMS[8], qty: 1, unitPrice: 199, servingTime: 'At 01:45 PM' },
          { item: CUSTOMER_MENU_ITEMS[9], qty: 1, unitPrice: 249, servingTime: 'At 01:45 PM' }
        ];
  const displayTotal = totalPaid > 0 ? totalPaid : 753;

  return (
    <div className="space-y-4 sm:space-y-5 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#240B4C] tracking-tight">
            Track Your Order
          </h1>
          <p className="text-xs sm:text-sm text-[#7B748C] font-medium">
            {merchantName} – Downtown
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsDelayed((p) => !p)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-black border cursor-pointer transition ${
              isDelayed
                ? 'bg-rose-50 border-rose-200 text-rose-700'
                : 'bg-white border-[#EFEAF7] text-[#5844A8]'
            }`}
          >
            {isDelayed ? 'Switch to On-Time' : 'Preview Delay State'}
          </button>
          <span className="px-3.5 py-1.5 rounded-full bg-white border border-[#EFEAF7] text-xs font-black text-[#240B4C] flex items-center gap-1.5 shadow-2xs">
            <Utensils className="w-3.5 h-3.5 text-[#5844A8]" />
            <span>Dine In</span>
          </span>
        </div>
      </div>

      {/* KOT / Order Meta Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#F3EEFA] text-[#58258B] flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[#8C84A0]">
                {isDelayed ? 'Order Number' : 'KOT Number'}
              </div>
              <div className="text-lg font-black text-[#1E1548]">#SG1045</div>
            </div>
          </div>

          <span
            className={`px-3.5 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 ${
              isDelayed
                ? 'bg-[#FFF1F2] text-[#DC2626] border border-[#FECDD3]'
                : 'bg-[#FAF5FF] text-[#58258B] border border-[#E9D5FF]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{isDelayed ? 'Running Late' : 'In Kitchen'}</span>
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#F4F0FA] text-xs">
          <div>
            <div className="text-[10px] font-semibold text-[#8C84A0]">Table No.</div>
            <div className="font-black text-[#1E1548] mt-0.5">12</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold text-[#8C84A0]">Order Time</div>
            <div className="font-black text-[#1E1548] mt-0.5">01:24 PM</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold text-[#8C84A0]">Estimated</div>
            <div className="font-black text-[#1E1548] mt-0.5">
              {isDelayed ? (
                <span className="text-[#DC2626]">Now: 25–30 mins</span>
              ) : (
                '15–20 mins'
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delayed Alert Banner (tracking simmary.png) */}
      {isDelayed && (
        <div className="bg-[#FFF2F2] border border-[#FECACA] rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-black text-[#B91C1C]">Your Order is Running Late</div>
            <p className="text-xs text-[#991B1B] mt-0.5">
              We&apos;re sorry for the delay. Your food will be ready in about 25–30 minutes.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Live Order Status Timeline */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 border border-[#EFEAF7] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-[#1E1548]">Live Order Status</h2>
            <button
              type="button"
              onClick={onMarkCompleted}
              className="text-xs font-black text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full cursor-pointer transition"
            >
              Simulate Served &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {/* Step 1 */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-[#58258B] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4 stroke-[3]" />
                </span>
                <div>
                  <div className="text-sm font-black text-[#1E1548]">Order Placed</div>
                  <div className="text-xs text-[#8C84A0]">Order #SG1045 sent to kitchen.</div>
                </div>
              </div>
              <span className="text-xs font-bold text-[#8C84A0]">01:24 PM</span>
            </div>

            {!isDelayed && (
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#58258B] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                  <div>
                    <div className="text-sm font-black text-[#1E1548]">Order Accepted</div>
                    <div className="text-xs text-[#8C84A0]">Order accepted by kitchen</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#8C84A0]">01:25 PM</span>
              </div>
            )}

            {/* Active Step: Preparing Food OR Running Late */}
            <div
              className={`rounded-2xl p-3.5 flex items-center justify-between gap-3 ${
                isDelayed
                  ? 'bg-[#FFF2F2] border border-[#FECACA]'
                  : 'bg-[#F5F0FC] border border-[#E5D7FA]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`w-8 h-8 rounded-full text-white flex items-center justify-center shrink-0 ${
                    isDelayed ? 'bg-[#DC2626]' : 'bg-[#7C3AED]'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <div
                    className={`text-sm font-black ${
                      isDelayed ? 'text-[#B91C1C]' : 'text-[#240B4C]'
                    }`}
                  >
                    {isDelayed ? 'Your Order is Running Late' : 'Preparing Food'}
                  </div>
                  <div
                    className={`text-xs ${isDelayed ? 'text-[#991B1B]' : 'text-[#6B657E]'}`}
                  >
                    {isDelayed ? "We're sorry for the delay." : 'Your food is being prepared.'}
                  </div>
                </div>
              </div>

              {isDelayed ? (
                <span className="px-3 py-1 rounded-full bg-[#DC2626] text-white text-xs font-black shrink-0">
                  Current
                </span>
              ) : (
                <button
                  type="button"
                  onClick={onCancelOrder}
                  className="px-3 py-1 rounded-full bg-white border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-bold cursor-pointer shrink-0 transition"
                >
                  Cancel Order
                </button>
              )}
            </div>

            {/* Upcoming Steps */}
            {[
              { title: 'Ready to Serve', sub: 'Waiting for kitchen confirmation.' },
              { title: 'Served at Table', sub: 'Food delivered to your table.' }
            ].map((st) => (
              <div key={st.title} className="flex items-start gap-3 opacity-65">
                <span className="w-7 h-7 rounded-full border-2 border-[#D4CCE6] bg-white shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-[#1E1548]">{st.title}</div>
                  <div className="text-xs text-[#8C84A0]">{st.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Order Summary + Need Anything Else */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-[#EFEAF7] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[#1E1548]">Order Summary</h3>
              <span className="px-3 py-1 rounded-full bg-[#F3EEFA] text-[#58258B] text-xs font-black">
                {summaryItems.reduce((s, i) => s + i.qty, 0)} Items
              </span>
            </div>

            <div className="divide-y divide-[#F4F0FA]">
              {summaryItems.map((entry) => (
                <div
                  key={entry.item.id}
                  className="py-2.5 first:pt-1 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={entry.item.image}
                      alt={entry.item.name}
                      className="w-11 h-11 rounded-xl object-cover shrink-0"
                    />
                    <span className="text-xs sm:text-sm font-bold text-[#1E1548] truncate">
                      {entry.qty} × {entry.item.name}
                    </span>
                  </div>
                  <span className="text-sm font-black text-[#1E1548] shrink-0">
                    ₹{entry.unitPrice * entry.qty}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#EFEAF7] flex items-center justify-between">
              <span className="text-sm font-black text-[#1E1548]">
                Total <span className="font-medium text-[#7B748C]">(incl. tax)</span>
              </span>
              <span className="text-lg font-black text-[#1E1548]">₹{displayTotal}</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#EFEAF7] shadow-2xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F3EEFA] text-[#7C3AED] flex items-center justify-center shrink-0">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#1E1548]">Need Anything Else?</h4>
                <p className="text-xs text-[#7B748C]">
                  Request tissues, salt, water, or call a waiter to your table.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onRequestItems}
                className="h-11 rounded-2xl border border-[#240B4C]/40 bg-white hover:bg-[#FAF8FF] text-[#240B4C] text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Request Items</span>
              </button>
              <button
                type="button"
                onClick={onCallWaiter}
                className="h-11 rounded-2xl bg-[#240B4C] hover:bg-[#35146B] text-white text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition"
              >
                <Bell className="w-4 h-4" />
                <span>Call Waiter</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   6. ORDER COMPLETED & EXPERIENCE REVIEW (Matches Order finished.png)
   ============================================================================ */
export interface CustomerOrderCompletedViewProps {
  totalPaid: number;
  onSubmitReview: (comment: string) => void;
  onSkip: () => void;
}

export const CustomerOrderCompletedView: React.FC<CustomerOrderCompletedViewProps> = ({
  totalPaid,
  onSubmitReview,
  onSkip
}) => {
  const [ratings, setRatings] = useState({ service: 5, food: 5, ambience: 4 });
  const [comment, setComment] = useState('');

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-in fade-in duration-200">
      <div className="text-center space-y-2 pt-2">
        <div className="w-24 h-24 rounded-full bg-[#F3EEFA] border border-[#E5DEF5] flex flex-col items-center justify-center mx-auto relative shadow-sm">
          <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md mb-1">
            <Check className="w-5 h-5 stroke-[3]" />
          </span>
          <span className="text-[10px] font-black text-[#240B4C]">Order Completed!</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#240B4C]">Thank You!</h1>
        <p className="text-xs sm:text-sm text-[#7B748C]">
          Your order is completed and the bill has been given.
        </p>
      </div>

      {/* Bill Details Pill Card */}
      <div className="bg-white rounded-3xl p-4 border border-[#EFEAF7] shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#F3EEFA] text-[#58258B] flex items-center justify-center shrink-0">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-black text-[#1E1548]">Bill Details</div>
            <div className="text-xs text-[#7B748C]">Order #SG1045</div>
          </div>
        </div>
        <div className="px-4 py-2 rounded-2xl bg-[#F6F2FC] text-center">
          <div className="text-[9px] font-bold uppercase tracking-wider text-[#7B748C]">
            Total Paid
          </div>
          <div className="text-base font-black text-[#1E1548]">₹{totalPaid || 753}</div>
        </div>
      </div>

      {/* Star Rating Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#EFEAF7] shadow-2xs space-y-4">
        <div>
          <h2 className="text-base font-black text-[#1E1548]">How was your experience?</h2>
          <p className="text-xs text-[#7B748C]">Your feedback helps us serve you better!</p>
        </div>

        <div className="divide-y divide-[#F4F0FA]">
          {(
            [
              { key: 'service', title: 'Service', sub: 'Rate the service quality' },
              { key: 'food', title: 'Quality of Food', sub: 'Rate the taste and freshness' },
              { key: 'ambience', title: 'Ambience', sub: 'Rate the overall atmosphere' }
            ] as const
          ).map((row) => (
            <div key={row.key} className="py-3 first:pt-1 last:pb-0 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-black text-[#1E1548]">{row.title}</div>
                <div className="text-[11px] text-[#7B748C]">{row.sub}</div>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRatings((p) => ({ ...p, [row.key]: n }))}
                    className="p-0.5 cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        n <= ratings[row.key]
                          ? 'text-[#58258B] fill-[#58258B]'
                          : 'text-[#C4B5FD]'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-4 border border-[#EFEAF7] shadow-2xs flex items-start gap-2.5">
        <MessageSquare className="w-4 h-4 text-[#8C84A0] mt-1 shrink-0" />
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts (optional)..."
          className="w-full text-xs sm:text-sm text-[#1E1548] placeholder:text-[#9890A8] bg-transparent outline-none resize-none"
        />
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => onSubmitReview(comment)}
          className="w-full h-13 rounded-full bg-gradient-to-r from-[#58258B] via-[#381263] to-[#240B4C] text-white text-sm font-black shadow-lg cursor-pointer hover:opacity-95 transition"
        >
          Submit Review
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="w-full h-12 rounded-full bg-white border border-[#240B4C]/35 text-[#240B4C] text-sm font-bold cursor-pointer hover:bg-[#FAF8FF] transition"
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
};

/* ============================================================================
   7. CALL WAITER DIRECTORY & LIVE TRACKER (Matches waiter list.png)
   ============================================================================ */
export interface CustomerCallWaiterViewProps {
  onNotify: (msg: string) => void;
}

export const CustomerCallWaiterView: React.FC<CustomerCallWaiterViewProps> = ({ onNotify }) => {
  const [search, setSearch] = useState('');
  const [activeWaiter, setActiveWaiter] = useState('Rohit Sharma');
  const [statusStep, setStatusStep] = useState<1 | 2 | 3>(2);

  const waiters = [
    {
      name: 'Rohit Sharma',
      rating: 4.8,
      reviews: 112,
      quote: '"Very polite and quick service!" – Priya M.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
    },
    {
      name: 'Neha Verma',
      rating: 4.7,
      reviews: 98,
      quote: '"Courteous and always attentive." – Arjun K.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80'
    },
    {
      name: 'Aman Singh',
      rating: 4.6,
      reviews: 76,
      quote: '"Great service, very friendly." – Sneha P.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
    },
    {
      name: 'Kavya Rao',
      rating: 4.5,
      reviews: 63,
      quote: '"Prompt and helpful. Highly recommend!"',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80'
    }
  ];

  const filtered = waiters.filter((w) =>
    w.name.toLowerCase().includes(search.trim().toLowerCase())
  );
  const currentObj = waiters.find((w) => w.name === activeWaiter) || waiters[0];

  return (
    <div className="space-y-4 sm:space-y-5 max-w-4xl mx-auto animate-in fade-in duration-200">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#240B4C] tracking-tight">
            Call Waiter
          </h1>
          <p className="text-xs sm:text-sm text-[#7B748C] mt-0.5">
            Choose an available waiter to assist you at your table.
          </p>
        </div>
        <span className="px-3.5 py-1.5 rounded-full bg-white border border-[#EFEAF7] text-xs font-black text-[#240B4C] shrink-0 shadow-2xs">
          Table No. 12
        </span>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#9890A8] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search waiter"
            className="w-full h-11 bg-white border border-[#EFEAF7] rounded-2xl pl-11 pr-4 text-xs sm:text-sm font-semibold text-[#1E1548] placeholder:text-[#9890A8] focus:outline-none focus:border-[#58258B]"
          />
        </div>
        <button
          type="button"
          onClick={() => onNotify('Sorted by highest rated available waiters')}
          className="w-11 h-11 rounded-2xl bg-[#F3EEFA] text-[#58258B] flex items-center justify-center cursor-pointer hover:bg-[#E9DDFB] transition shrink-0"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="text-xs font-black text-[#1E1548]">
        Available Waiters ({filtered.length})
      </div>

      {/* Waiter Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filtered.map((w) => {
          const isCalled = activeWaiter === w.name;
          return (
            <div
              key={w.name}
              className={`bg-white rounded-3xl p-4 border transition-all shadow-2xs space-y-3 ${
                isCalled ? 'border-[#58258B] ring-1 ring-[#58258B]/20' : 'border-[#EFEAF7]'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={w.avatar}
                    alt={w.name}
                    className="w-13 h-13 rounded-2xl object-cover shrink-0 shadow-2xs"
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-black text-[#1E1548] truncate">{w.name}</div>
                    <div className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Available
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveWaiter(w.name);
                    setStatusStep(2);
                    onNotify(`${w.name} has been called to Table 12!`);
                  }}
                  className="px-4 py-2 rounded-2xl bg-[#2F0E45] hover:bg-[#461A64] text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shrink-0 transition"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>{isCalled ? 'Called' : 'Call Waiter'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 text-[11px] pt-1">
                <span className="font-bold text-[#1E1548] flex items-center gap-1 shrink-0">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {w.rating} <span className="text-[#8C84A0] font-medium">({w.reviews})</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#FAF8FF] text-[#6B657E] truncate">
                  {w.quote}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Waiter Request Card */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-black text-[#1E1548]">Your Waiter Request</h3>
          <span className="px-3 py-1 rounded-full bg-[#FFF1F5] text-[#DB006A] text-xs font-black">
            {statusStep === 3 ? 'Arrived' : 'In Progress'}
          </span>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={currentObj.avatar}
              alt={currentObj.name}
              className="w-12 h-12 rounded-2xl object-cover shrink-0"
            />
            <div>
              <div className="text-sm font-black text-[#1E1548]">{currentObj.name}</div>
              <div className="text-xs text-[#8C84A0] flex items-center gap-1">
                <Clock className="w-3 h-3" /> Requested at 01:24 PM
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 text-[11px] font-bold">
            {[
              { step: 1, label: 'Request Sent' },
              { step: 2, label: 'On the Way' },
              { step: 3, label: 'Arrived' }
            ].map((s) => (
              <button
                key={s.step}
                type="button"
                onClick={() => setStatusStep(s.step as 1 | 2 | 3)}
                className="flex flex-col items-center gap-1 cursor-pointer"
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    statusStep >= s.step
                      ? 'bg-[#58258B] text-white'
                      : 'border-2 border-[#D4CCE6] bg-white'
                  }`}
                >
                  {statusStep >= s.step && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </span>
                <span className={statusStep >= s.step ? 'text-[#1E1548]' : 'text-[#9890A8]'}>
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Ping Waiter Card */}
        <div className="bg-[#F6F2FC] rounded-3xl p-4 border border-[#E5DEF5] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white text-[#240B4C] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black text-[#1E1548]">
                Waiter hasn&apos;t arrived yet?
              </div>
              <div className="text-[11px] text-[#7B748C]">
                You can ping the waiter to get their attention.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNotify(`Pinged ${activeWaiter}! Vibration alert sent to floor tablet.`)}
            className="px-4 py-2.5 rounded-2xl bg-[#2F0E45] hover:bg-[#461A64] text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shrink-0 transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ping Waiter</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   8. CUSTOMER PROFILE & EDIT PROFILE VIEWS (Matches profile.png & profile-1.png)
   ============================================================================ */
export interface CustomerProfileHubViewProps {
  merchantName: string;
  onOpenOrders: () => void;
  onOpenOffers: () => void;
  onOpenWalletHistory: () => void;
  onCallWaiter?: () => void;
  onRequestItems?: () => void;
  onLogout: () => void;
  onNotify: (msg: string) => void;
}

export const CustomerProfileHubView: React.FC<CustomerProfileHubViewProps> = ({
  merchantName,
  onOpenOrders,
  onOpenOffers,
  onOpenWalletHistory,
  onCallWaiter,
  onRequestItems,
  onLogout,
  onNotify
}) => {
  const [subView, setSubView] = useState<'main' | 'edit' | 'wallet' | 'orders'>('main');
  const [walletFilter, setWalletFilter] = useState<'All' | 'Orders' | 'Rewards' | 'Offers'>('All');
  const [profile, setProfile] = useState({
    firstName: 'Salena',
    lastName: 'Mishra',
    gender: 'Female' as 'Female' | 'Male' | 'Other',
    dob: '15 / 06 / 1996',
    age: '30',
    phone: '+91 98765 43210',
    email: 'salena.mishra@gmail.com',
    whatsappSame: true,
    maritalStatus: 'Married',
    anniversary: '20 / 02 / 2023',
    partnerName: 'Rahul Mishra',
    partnerMobile: '+91 98765 98765'
  });

  const walletItems = [
    {
      id: 'w1',
      category: 'Rewards' as const,
      title: 'Coffee Stamp',
      subtitle: merchantName,
      subtitlePurple: false,
      date: '12 Apr 2025, 10:24 AM',
      icon: <Utensils className="w-4 h-4" />,
      rightType: 'stamp_star' as const,
      rightVal: '+1'
    },
    {
      id: 'w2',
      category: 'Orders' as const,
      title: 'Burger Order',
      subtitle: merchantName,
      subtitlePurple: false,
      date: '10 Apr 2025, 02:15 PM',
      icon: <ShoppingBag className="w-4 h-4" />,
      rightType: 'order' as const,
      rightVal: '₹249',
      badge: 'Completed'
    },
    {
      id: 'w3',
      category: 'Offers' as const,
      title: 'Offer Redeemed',
      subtitle: '20% Off First Visit',
      subtitlePurple: true,
      date: '08 Apr 2025, 12:10 PM',
      icon: <Gift className="w-4 h-4" />,
      rightType: 'offer' as const,
      rightVal: '-₹120',
      badge: 'Applied'
    },
    {
      id: 'w4',
      category: 'Orders' as const,
      title: 'Coffee Order',
      subtitle: merchantName,
      subtitlePurple: false,
      date: '05 Apr 2025, 11:32 AM',
      icon: <Coffee className="w-4 h-4" />,
      rightType: 'order' as const,
      rightVal: '₹180',
      badge: 'Completed'
    },
    {
      id: 'w5',
      category: 'Rewards' as const,
      title: 'Stamp Earned',
      subtitle: 'Free Burger (3/5)',
      subtitlePurple: false,
      date: '02 Apr 2025, 06:20 PM',
      icon: <Award className="w-4 h-4" />,
      rightType: 'stamp_award' as const,
      rightVal: '+1'
    },
    {
      id: 'w6',
      category: 'Offers' as const,
      title: 'Offer Redeemed',
      subtitle: 'Buy 1 Get 1 Free',
      subtitlePurple: true,
      date: '30 Mar 2025, 01:45 PM',
      icon: <Percent className="w-4 h-4" />,
      rightType: 'offer' as const,
      rightVal: '-₹0',
      badge: 'Applied'
    }
  ];

  /* ── INSIDE PAGE 1: WALLET HISTORY (Matches wallet.png) ── */
  if (subView === 'wallet') {
    const visibleWallet = walletItems.filter(
      (w) => walletFilter === 'All' || w.category === walletFilter
    );

    return (
      <div className="max-w-2xl mx-auto space-y-5 animate-in fade-in duration-200">
        {/* Top Bar */}
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setSubView('main')}
            className="w-9 h-9 rounded-full bg-white border border-[#EFEAF7] flex items-center justify-center text-[#1E1548] shadow-2xs cursor-pointer hover:border-[#58258B] transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-base sm:text-lg font-black text-[#1E1548]">Wallet History</h1>
          <button
            type="button"
            onClick={onOpenWalletHistory}
            className="text-xs font-black text-[#58258B] hover:underline cursor-pointer"
          >
            By Merchant &rarr;
          </button>
        </div>

        {/* Deep Purple My Wallet Card (wallet.png) */}
        <div className="rounded-3xl p-5 bg-gradient-to-br from-[#3B125E] via-[#2B0C47] to-[#1D0733] text-white shadow-xl space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#9333EA] text-white flex items-center justify-center shadow-md relative">
              <Wallet className="w-6 h-6" />
              <span className="w-5 h-5 rounded-full bg-amber-400 text-[#240B4C] text-[10px] font-black flex items-center justify-center absolute -top-1.5 -right-1 shadow-xs">
                ₹
              </span>
            </div>
            <div>
              <div className="text-xs text-purple-200 font-semibold">My Wallet</div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight">₹1,250.00</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3.5 border-t border-white/15">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-purple-200" />
              </span>
              <div>
                <div className="text-[11px] text-purple-200/80">Total Cashback</div>
                <div className="text-sm font-black">₹200.00</div>
              </div>
            </div>
            <div className="border-l border-white/15 pl-3 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <ArrowLeftRight className="w-4 h-4 text-purple-200" />
              </span>
              <div>
                <div className="text-[11px] text-purple-200/80">Total Transactions</div>
                <div className="text-sm font-black">12</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Pills: All | Orders | Rewards | Offers */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {(['All', 'Orders', 'Rewards', 'Offers'] as const).map((tab) => {
            const active = walletFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setWalletFilter(tab)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                  active
                    ? 'bg-[#3B1161] text-white border-[#3B1161] shadow-sm'
                    : 'bg-white text-[#240B4C] border-[#EFEAF7] hover:border-[#C4B5FD]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Transaction Cards List (wallet.png) */}
        <div className="space-y-3">
          {visibleWallet.map((tx) => (
            <button
              key={tx.id}
              type="button"
              onClick={() =>
                tx.category === 'Orders'
                  ? onOpenOrders()
                  : tx.category === 'Offers'
                  ? onOpenOffers()
                  : onNotify(`${tx.title} • ${tx.date}`)
              }
              className="w-full bg-white hover:bg-[#FDFBFF] rounded-3xl p-4 border border-[#EFEAF7] hover:border-[#C4B5FD] shadow-2xs flex items-center justify-between gap-3 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-full bg-[#F5F0FC] text-[#58258B] flex items-center justify-center shrink-0">
                  {tx.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-black text-[#1E1548] truncate">{tx.title}</div>
                  <div
                    className={`text-xs font-semibold truncate mt-0.5 ${
                      tx.subtitlePurple ? 'text-[#6D28D9]' : 'text-[#6B657E]'
                    }`}
                  >
                    {tx.subtitle}
                  </div>
                  <div className="text-[11px] text-[#9890A8] flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3 text-[#8C84A0]" />
                    <span>{tx.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {tx.rightType === 'stamp_star' && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-[#1E1548]">{tx.rightVal}</span>
                    <span className="w-6 h-6 rounded-lg bg-[#F3EEFA] text-[#7C3AED] flex items-center justify-center">
                      <Star className="w-3.5 h-3.5 fill-[#7C3AED]" />
                    </span>
                  </div>
                )}

                {tx.rightType === 'stamp_award' && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-[#1E1548]">{tx.rightVal}</span>
                    <span className="w-6 h-6 rounded-lg bg-[#F3EEFA] text-[#7C3AED] flex items-center justify-center">
                      <Award className="w-3.5 h-3.5" />
                    </span>
                  </div>
                )}

                {tx.rightType === 'order' && (
                  <div className="text-right space-y-1">
                    <div className="text-sm font-black text-[#1E1548]">{tx.rightVal}</div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] text-[10px] font-black">
                      {tx.badge}
                    </span>
                  </div>
                )}

                {tx.rightType === 'offer' && (
                  <div className="text-right space-y-1">
                    <div className="text-sm font-black text-[#E11D48]">{tx.rightVal}</div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F3EEFA] text-[#6D28D9] text-[10px] font-black">
                      {tx.badge}
                    </span>
                  </div>
                )}

                <ChevronRight className="w-4 h-4 text-[#9890A8] group-hover:text-[#58258B] transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ── INSIDE PAGE 2: MY ORDERS / CURRENT PROCESS ORDER (Matches current process order.png) ── */
  if (subView === 'orders') {
    return (
      <div className="max-w-2xl mx-auto space-y-5 animate-in fade-in duration-200">
        {/* Back Row */}
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setSubView('main')}
            className="w-9 h-9 rounded-full bg-white border border-[#EFEAF7] flex items-center justify-center text-[#1E1548] shadow-2xs cursor-pointer hover:border-[#58258B] transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-base sm:text-lg font-black text-[#1E1548]">My Orders</h1>
          <div className="w-9" />
        </div>

        {/* Greeting Banner + Soft Storefront Illustration (current process order.png) */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1E1548] tracking-tight flex items-center gap-2">
              <span>Hi {profile.firstName}!</span>
              <span>👋</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#7B748C] font-medium max-w-xs leading-relaxed">
              Discover offers, earn rewards, and enjoy more at your favourite spots!
            </p>
          </div>
          <div className="w-22 h-18 sm:w-28 sm:h-22 rounded-3xl bg-gradient-to-br from-[#F3EEFA] to-[#EDE5FA] border border-[#E5DEF5] flex flex-col items-center justify-center text-[#A78BFA] shrink-0">
            <Store className="w-9 h-9 sm:w-11 sm:h-11 stroke-[1.5]" />
          </div>
        </div>

        {/* Active Processing Order Card (Exact match to current process order.png) */}
        <div className="space-y-3">
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-md shadow-purple-950/5 space-y-4">
            <div className="flex items-center gap-3.5">
              {/* Glowing Purple Cloche Dish Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F3EEFA] to-[#EDE5FA] flex items-center justify-center shrink-0 relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#58258B] via-[#7C3AED] to-[#A855F7] text-white flex items-center justify-center shadow-lg shadow-purple-700/30">
                  <Utensils className="w-6 h-6" />
                </div>
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-[#1E1548] leading-tight">
                      Your Order
                    </h3>
                    <div className="text-xs font-bold text-[#8C84A0] mt-0.5">#SG1045</div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-[#FAF6FF] border border-[#EAE2FB] text-[#240B4C] text-[11px] font-black flex items-center gap-1.5 shrink-0">
                    <Clock className="w-3 h-3 text-[#58258B]" />
                    <span>In Kitchen</span>
                  </span>
                </div>

                {/* Clickable Estimated Time Row -> Opens Live Tracker */}
                <button
                  type="button"
                  onClick={onOpenOrders}
                  className="w-full pt-2 border-t border-[#F4F0FA] flex items-center justify-between text-xs cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5 text-[#7B748C]">
                    <Clock className="w-3.5 h-3.5 text-[#8C84A0]" />
                    <span>Estimated Time</span>
                    <strong className="text-[#1E1548] font-black ml-1">15–20 mins</strong>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8C84A0] group-hover:text-[#58258B] group-hover:translate-x-0.5 transition-all" />
                </button>
              </div>
            </div>

            {/* Dual Action Buttons: Call Waiter | Request Item */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => (onCallWaiter ? onCallWaiter() : onOpenOrders())}
                className="h-11 rounded-full bg-white hover:bg-[#FAF8FF] border border-[#2F0E45]/45 text-[#1E1548] text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer transition active:scale-[0.99]"
              >
                <Bell className="w-4 h-4 text-[#2F0E45]" />
                <span>Call Waiter</span>
              </button>
              <button
                type="button"
                onClick={() => (onRequestItems ? onRequestItems() : onOpenOrders())}
                className="h-11 rounded-full bg-[#2F0E45] hover:bg-[#441763] text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-md shadow-purple-950/20 cursor-pointer transition active:scale-[0.99]"
              >
                <Box className="w-4 h-4 text-white" />
                <span>Request Item</span>
              </button>
            </div>
          </div>

          {/* 3-Dot Carousel Indicator */}
          <div className="flex items-center justify-center gap-1.5">
            <span className="w-5 h-1.5 rounded-full bg-[#2F0E45]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#DDD5EC]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#DDD5EC]" />
          </div>
        </div>

        {/* Past Orders Summary */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-[#1E1548]">Past Orders</h3>
            <button
              type="button"
              onClick={onOpenOrders}
              className="text-xs font-black text-[#58258B] hover:underline cursor-pointer"
            >
              Track Live Order &rarr;
            </button>
          </div>

          <div className="space-y-2.5">
            {[
              { id: '#SG1038', title: 'Burger Order', date: '10 Apr 2025, 02:15 PM', amount: '₹249' },
              { id: '#SG1021', title: 'Coffee Order', date: '05 Apr 2025, 11:32 AM', amount: '₹180' }
            ].map((ord) => (
              <div
                key={ord.id}
                onClick={onOpenOrders}
                className="bg-white hover:bg-[#FDFBFF] rounded-3xl p-4 border border-[#EFEAF7] shadow-2xs flex items-center justify-between gap-3 cursor-pointer transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#F5F0FC] text-[#58258B] flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-black text-[#1E1548] truncate">
                      {ord.title} <span className="text-xs font-semibold text-[#8C84A0]">{ord.id}</span>
                    </div>
                    <div className="text-[11px] text-[#8C84A0]">{merchantName} • {ord.date}</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-black text-[#1E1548]">{ord.amount}</div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] text-[10px] font-black mt-0.5">
                    Completed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── INSIDE PAGE 3: EDIT PROFILE (Matches profile-1.png) ── */
  if (subView === 'edit') {
    return (
      <div className="max-w-2xl mx-auto space-y-5 animate-in fade-in duration-200">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSubView('main')}
            className="w-9 h-9 rounded-full bg-white border border-[#EFEAF7] flex items-center justify-center text-[#1E1548] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-lg font-black text-[#1E1548]">Edit Profile</h1>
          <div className="w-9" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&auto=format&fit=crop&q=80"
              alt="Salena Mishra"
              className="w-22 h-22 rounded-full object-cover border-4 border-white shadow-md"
            />
            <button
              type="button"
              onClick={() => onNotify('Profile photo upload opened')}
              className="w-8 h-8 rounded-full bg-[#2F0E45] text-white flex items-center justify-center absolute bottom-0 right-0 border-2 border-white cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="text-xs font-black text-[#1E1548]">Change Photo</span>
        </div>

        {/* Personal Details Card (profile-1.png) */}
        <div className="bg-white rounded-3xl p-5 border border-[#EFEAF7] shadow-2xs space-y-4">
          <div className="px-3 py-2 rounded-xl bg-[#F3EEFA] text-xs font-black text-[#240B4C] flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>Personal Details</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#1E1548] block mb-1">
                First Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                className="w-full h-11 rounded-2xl bg-[#FAF8FF] border border-[#E5DEF5] px-3.5 text-sm font-semibold text-[#1E1548] outline-none focus:border-[#240B4C]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#1E1548] block mb-1">
                Last Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                className="w-full h-11 rounded-2xl bg-[#FAF8FF] border border-[#E5DEF5] px-3.5 text-sm font-semibold text-[#1E1548] outline-none focus:border-[#240B4C]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#1E1548] block mb-1.5">
              Gender <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['Female', 'Male', 'Other'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setProfile({ ...profile, gender: g })}
                  className={`h-10 rounded-2xl text-xs font-bold border cursor-pointer transition ${
                    profile.gender === g
                      ? 'bg-[#2F0E45] text-white border-[#2F0E45]'
                      : 'bg-white text-[#1E1548] border-[#E5DEF5]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#1E1548] block mb-1">Date of Birth</label>
              <input
                type="text"
                value={profile.dob}
                onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                className="w-full h-11 rounded-2xl bg-[#FAF8FF] border border-[#E5DEF5] px-3.5 text-xs sm:text-sm font-semibold text-[#1E1548] outline-none focus:border-[#240B4C]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#1E1548] block mb-1">Age</label>
              <input
                type="text"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                className="w-full h-11 rounded-2xl bg-[#FAF8FF] border border-[#E5DEF5] px-3.5 text-xs sm:text-sm font-semibold text-[#1E1548] outline-none focus:border-[#240B4C]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#1E1548] block mb-1">Mobile Number</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full h-11 rounded-2xl bg-[#FAF8FF] border border-[#E5DEF5] px-3.5 text-sm font-semibold text-[#1E1548] outline-none focus:border-[#240B4C]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#1E1548] block mb-1">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full h-11 rounded-2xl bg-[#FAF8FF] border border-[#E5DEF5] px-3.5 text-sm font-semibold text-[#1E1548] outline-none focus:border-[#240B4C]"
              />
            </div>
          </div>
        </div>

        {/* Additional Details Card */}
        <div className="bg-white rounded-3xl p-5 border border-[#EFEAF7] shadow-2xs space-y-4">
          <div className="px-3 py-2 rounded-xl bg-[#F3EEFA] text-xs font-black text-[#240B4C] flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Additional Details</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#1E1548] block mb-1">Marital Status</label>
              <select
                value={profile.maritalStatus}
                onChange={(e) => setProfile({ ...profile, maritalStatus: e.target.value })}
                className="w-full h-11 rounded-2xl bg-[#FAF8FF] border border-[#E5DEF5] px-3 text-sm font-semibold text-[#1E1548] outline-none"
              >
                <option value="Married">Married</option>
                <option value="Single">Single</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[#1E1548] block mb-1">Anniversary Date</label>
              <input
                type="text"
                value={profile.anniversary}
                onChange={(e) => setProfile({ ...profile, anniversary: e.target.value })}
                className="w-full h-11 rounded-2xl bg-[#FAF8FF] border border-[#E5DEF5] px-3.5 text-sm font-semibold text-[#1E1548] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#1E1548] block mb-1">Partner&apos;s Name</label>
              <input
                type="text"
                value={profile.partnerName}
                onChange={(e) => setProfile({ ...profile, partnerName: e.target.value })}
                className="w-full h-11 rounded-2xl bg-[#FAF8FF] border border-[#E5DEF5] px-3.5 text-sm font-semibold text-[#1E1548] outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#1E1548] block mb-1">Partner&apos;s Mobile</label>
              <input
                type="tel"
                value={profile.partnerMobile}
                onChange={(e) => setProfile({ ...profile, partnerMobile: e.target.value })}
                className="w-full h-11 rounded-2xl bg-[#FAF8FF] border border-[#E5DEF5] px-3.5 text-sm font-semibold text-[#1E1548] outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setSubView('main');
            onNotify('Profile changes saved!');
          }}
          className="w-full h-13 rounded-full bg-[#2F0E45] hover:bg-[#461A64] text-white text-sm font-black shadow-lg cursor-pointer transition"
        >
          Save Changes
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-in fade-in duration-200">
      <h1 className="text-2xl font-black text-[#240B4C]">My Profile</h1>

      {/* Identity Row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative shrink-0">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&auto=format&fit=crop&q=80"
              alt="Salena Mishra"
              className="w-18 h-18 rounded-full object-cover border-3 border-white shadow-md"
            />
            <span className="w-6 h-6 rounded-full bg-[#2F0E45] text-white flex items-center justify-center absolute bottom-0 right-0 border-2 border-white">
              <Camera className="w-3 h-3" />
            </span>
          </div>
          <div className="min-w-0">
            <div className="text-lg font-black text-[#1E1548] truncate">
              {profile.firstName} {profile.lastName}
            </div>
            <div className="text-xs text-[#6B657E] flex items-center gap-1.5 mt-0.5">
              <Phone className="w-3 h-3" /> {profile.phone}
            </div>
            <div className="text-xs text-[#6B657E] flex items-center gap-1.5 mt-0.5 truncate">
              <Mail className="w-3 h-3" /> {profile.email}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setSubView('edit')}
          className="w-10 h-10 rounded-2xl bg-white border border-[#EFEAF7] hover:border-[#58258B] flex items-center justify-center text-[#1E1548] shadow-2xs cursor-pointer shrink-0 transition"
          title="Edit Profile"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>

      {/* Deep Purple My Wallet Card (profile.png) */}
      <div
        onClick={() => setSubView('wallet')}
        className="rounded-3xl p-5 bg-gradient-to-br from-[#3B125E] via-[#2B0C47] to-[#1D0733] text-white shadow-xl space-y-4 cursor-pointer hover:opacity-98 transition"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center shadow-md relative">
            <Wallet className="w-6 h-6" />
            <span className="w-5 h-5 rounded-full bg-amber-400 text-[#240B4C] text-[10px] font-black flex items-center justify-center absolute -top-1.5 -right-1 shadow-xs">
              ₹
            </span>
          </div>
          <div>
            <div className="text-xs text-purple-200 font-semibold">My Wallet</div>
            <div className="text-2xl sm:text-3xl font-black tracking-tight">₹1,250.00</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/15">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Clock className="w-3.5 h-3.5 text-purple-200" />
            </span>
            <div>
              <div className="text-[11px] text-purple-200/80">Total Cashback</div>
              <div className="text-sm font-black">₹200.00</div>
            </div>
          </div>
          <div className="border-l border-white/15 pl-3 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <ArrowLeftRight className="w-3.5 h-3.5 text-purple-200" />
            </span>
            <div>
              <div className="text-[11px] text-purple-200/80">Total Transactions</div>
              <div className="text-sm font-black">12</div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Action Menu List */}
      <div className="bg-white rounded-3xl border border-[#EFEAF7] shadow-2xs divide-y divide-[#F4F0FA] overflow-hidden">
        {[
          { label: 'My Orders', icon: ShoppingBag, action: () => setSubView('orders') },
          { label: 'Offers & Rewards', icon: Percent, action: onOpenOffers },
          { label: 'Wallet History', icon: CreditCard, action: () => setSubView('wallet') },
          { label: 'Saved Addresses', icon: MapPin, action: () => onNotify('Saved Addresses: Home & Downtown Office') },
          { label: 'Payment Methods', icon: Wallet, action: () => onNotify('UPI & Saved Cards verified') },
          { label: 'Support & Help', icon: HelpCircle, action: () => onNotify('24/7 Guest Support connected') },
          { label: `About ${merchantName}`, icon: Info, action: () => onNotify(`${merchantName} • Powered by Loyaltics`) }
        ].map((row) => {
          const IconComp = row.icon;
          return (
            <button
              key={row.label}
              type="button"
              onClick={row.action}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#FAF8FF] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <span className="w-9 h-9 rounded-full bg-[#F3EEFA] text-[#58258B] flex items-center justify-center">
                  <IconComp className="w-4 h-4" />
                </span>
                <span className="text-sm font-bold text-[#1E1548]">{row.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#9890A8]" />
            </button>
          );
        })}
      </div>

      {/* Soft Rose Log Out Button */}
      <button
        type="button"
        onClick={onLogout}
        className="w-full h-13 rounded-2xl bg-[#FFF2F2] hover:bg-[#FFE4E6] border border-[#FECDD3] text-[#DC2626] text-sm font-black flex items-center justify-center gap-2 cursor-pointer transition"
      >
        <LogOut className="w-4 h-4" />
        <span>Log Out</span>
      </button>
    </div>
  );
};
