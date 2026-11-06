import React, { useState } from 'react';
import {
  Upload,
  Search,
  ChevronDown,
  ChevronRight,
  Sparkles,
  MoreVertical,
  Home,
  Send,
  UtensilsCrossed,
  Menu,
  Store,
  Bell,
  LayoutGrid,
  Package,
  Image as ImageIcon,
  Camera,
  Video,
  ArrowRight,
  Signal,
  Wifi,
  BatteryMedium,
} from 'lucide-react';

// ── Types ───────────────────────────────────────────────────────────────────

interface CategoryRecord {
  id: string;
  name: string;
  itemCount: number;
  mediaCount: number;
  mediaType: 'images' | 'video';
  image: string;
}

interface RecentUpdate {
  id: string;
  name: string;
  badge: 'Updated' | 'New Item' | 'Removed';
  description: string;
  timeAgo: string;
  by: string;
  image: string;
}

// ── Static Data ──────────────────────────────────────────────────────────────

const CATEGORIES: CategoryRecord[] = [
  {
    id: 'starters',
    name: 'Starters',
    itemCount: 6,
    mediaCount: 2,
    mediaType: 'images',
    image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'main',
    name: 'Main Course',
    itemCount: 14,
    mediaCount: 1,
    mediaType: 'video',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'pizzas',
    name: 'Pizzas',
    itemCount: 5,
    mediaCount: 2,
    mediaType: 'images',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'pastas',
    name: 'Pastas',
    itemCount: 6,
    mediaCount: 1,
    mediaType: 'images',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'beverages',
    name: 'Beverages',
    itemCount: 6,
    mediaCount: 2,
    mediaType: 'images',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'desserts',
    name: 'Desserts',
    itemCount: 5,
    mediaCount: 1,
    mediaType: 'video',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=300',
  },
];

const RECENT_UPDATES: RecentUpdate[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    badge: 'Updated',
    description: 'Price changed from ₹249 to ₹269',
    timeAgo: '2 hours ago',
    by: 'By Rohit Mehta',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=120',
  },
  {
    id: '2',
    name: 'Cold Coffee',
    badge: 'New Item',
    description: 'Added to Beverages',
    timeAgo: '1 day ago',
    by: 'By Ananya Sharma',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&q=80&w=120',
  },
  {
    id: '3',
    name: 'Pasta Alfredo',
    badge: 'Removed',
    description: 'Removed from menu',
    timeAgo: '2 days ago',
    by: 'By Rohit Mehta',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=120',
  },
  {
    id: '4',
    name: 'Green Tea',
    badge: 'Removed',
    description: 'Removed from menu',
    timeAgo: '2 days ago',
    by: 'By Rohit Mehta',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=120',
  },
];

const FILTER_PILLS = [
  { label: 'All (8)', key: 'All' },
  { label: 'Starters (6)', key: 'Starters' },
  { label: 'Main Course (14)', key: 'Main Course' },
  { label: 'Pizzas (5)', key: 'Pizzas' },
  { label: 'Pastas (6)', key: 'Pastas' },
  { label: 'Beverages (6)', key: 'Beverages' },
  { label: 'Desserts (5)', key: 'Desserts' },
];

const badgeStyles: Record<RecentUpdate['badge'], string> = {
  Updated: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
  'New Item': 'bg-purple-50 text-purple-600 border border-purple-100',
  Removed: 'bg-rose-50 text-rose-500 border border-rose-100',
};

// ── Main Component ───────────────────────────────────────────────────────────

export const TabletMenuView: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = CATEGORIES.filter((cat) => {
    if (activeFilter !== 'All' && !cat.name.toLowerCase().includes(activeFilter.toLowerCase())) return false;
    if (searchQuery && !cat.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF8FF] font-sans pb-28 text-[#1A1615]">
      {/* ── Status Bar Mock ── */}
      <div className="flex items-center justify-between px-6 pt-3 pb-1 text-xs font-semibold text-gray-800 select-none">
        <span>9:41</span>
        <div className="flex items-center gap-1.5 text-gray-700">
          <Signal className="w-3.5 h-3.5" />
          <Wifi className="w-3.5 h-3.5" />
          <BatteryMedium className="w-4 h-4" />
        </div>
      </div>

      {/* ── App Top Navigation Header ── */}
      <div className="flex items-center justify-between px-5 py-2.5">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5844A8] to-[#E11D48] flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4 fill-white" />
          </div>
          <div>
            <div className="text-base font-black text-gray-900 tracking-tight leading-none">Loyaltics</div>
            <div className="text-[10px] text-gray-400 font-semibold leading-none mt-1">The Food Plaza</div>
          </div>
        </div>

        {/* Right: Branch Selector, Notification Bell, User Avatar */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200/90 rounded-full text-xs font-semibold text-gray-700 shadow-2xs hover:border-gray-300 transition-colors cursor-pointer">
            <Store className="w-3.5 h-3.5 text-gray-500" />
            <span className="truncate max-w-[130px]">Noida - Sector 18</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          <button className="w-8 h-8 rounded-full bg-white border border-gray-200/90 flex items-center justify-center relative shadow-2xs text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white" />
          </button>

          <div className="hidden md:flex w-8 h-8 rounded-full bg-purple-100 border border-purple-200 items-center justify-center text-xs font-black text-[#5844A8]">
            RM
          </div>
        </div>
      </div>

      {/* ── Page Title Row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 pt-3 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E1548] tracking-tight">Menu</h1>
          <p className="text-xs text-gray-500 mt-0.5 leading-snug">
            Manage your digital menu, update items and keep your offerings fresh.
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold shadow-md shadow-[#5844A8]/20 transition-all shrink-0 cursor-pointer self-start sm:self-auto">
          <Upload className="w-3.5 h-3.5" />
          <span>Upload / Update Menu</span>
        </button>
      </div>

      <div className="px-5 space-y-4 max-w-[1280px] mx-auto">
        {/* ── Status Section ── */}
        {/* Tablet View: 4-card row */}
        <div className="hidden md:grid md:grid-cols-12 gap-3.5">
          {/* Outlet status card */}
          <div className="col-span-5 lg:col-span-4 bg-white rounded-3xl p-3.5 border border-gray-100/90 shadow-2xs flex items-center gap-3.5">
            <div className="relative w-28 h-20 rounded-2xl overflow-hidden shrink-0">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=300"
                alt="The Urban Kitchen"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-2">
                <span className="text-[10px] font-bold text-white leading-tight">The Urban Kitchen</span>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Menu Active</span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium">Last updated</p>
              <p className="text-xs font-bold text-gray-800">12 Apr 2025, 2:30 PM</p>
            </div>
          </div>

          {/* 3 KPI Cards */}
          <div className="col-span-7 lg:col-span-8 grid grid-cols-3 gap-3">
            <div className="bg-white rounded-3xl p-4 border border-gray-100/90 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-gray-500 text-[11px] font-bold">
                <LayoutGrid className="w-3.5 h-3.5 text-[#5844A8]" />
                <span>Total Categories</span>
              </div>
              <span className="text-2xl font-black text-gray-900 mt-2">8</span>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-gray-100/90 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-gray-500 text-[11px] font-bold">
                <Package className="w-3.5 h-3.5 text-[#5844A8]" />
                <span>Total Items</span>
              </div>
              <span className="text-2xl font-black text-gray-900 mt-2">48</span>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-gray-100/90 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-gray-500 text-[11px] font-bold">
                <ImageIcon className="w-3.5 h-3.5 text-rose-500" />
                <span>Media Added</span>
              </div>
              <span className="text-2xl font-black text-gray-900 mt-2">12</span>
            </div>
          </div>
        </div>

        {/* Mobile View: Single consolidated card */}
        <div className="md:hidden bg-white rounded-3xl p-3.5 border border-gray-100/90 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=300"
                alt="The Urban Kitchen"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-1.5">
                <span className="text-[9px] font-bold text-white leading-tight">The Urban Kitchen</span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Menu Active</span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium">Last updated</p>
              <p className="text-xs font-bold text-gray-800">12 Apr 2025, 2:30 PM</p>

              <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-gray-50 text-center">
                <div>
                  <LayoutGrid className="w-3 h-3 text-[#5844A8] mx-auto mb-0.5" />
                  <p className="text-[8px] text-gray-400 font-semibold">Total Cat.</p>
                  <p className="text-xs font-black text-gray-900">8</p>
                </div>
                <div>
                  <Package className="w-3 h-3 text-[#5844A8] mx-auto mb-0.5" />
                  <p className="text-[8px] text-gray-400 font-semibold">Total Items</p>
                  <p className="text-xs font-black text-gray-900">48</p>
                </div>
                <div>
                  <ImageIcon className="w-3 h-3 text-rose-500 mx-auto mb-0.5" />
                  <p className="text-[8px] text-gray-400 font-semibold">Media</p>
                  <p className="text-xs font-black text-gray-900">12</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── AI Banner ── */}
        <div className="bg-gradient-to-r from-[#FFF5F8] via-[#FAF5FF] to-[#FFF5F8] border border-pink-100 rounded-3xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-pink-100 flex items-center justify-center shrink-0 shadow-2xs">
              <Sparkles className="w-5 h-5 text-pink-500 fill-pink-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900">Update Menu With AI</span>
                <span className="bg-rose-100 text-rose-600 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                Scan your menu, use a template or add items manually with the help of AI.
              </p>
            </div>
          </div>
          <button className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold shadow-md shadow-[#5844A8]/20 transition-all shrink-0 cursor-pointer self-start sm:self-auto">
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ── Menu Overview Section ── */}
        <div>
          {/* Section Header */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-black text-gray-900">Menu Overview</h2>
            <button className="text-xs font-bold text-[#5844A8] flex items-center gap-0.5 cursor-pointer hover:underline">
              <span>View Full Menu</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Search + Category Dropdown */}
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search categories, items or ingredients..."
                className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white border border-gray-200/90 rounded-2xl focus:outline-none focus:border-[#5844A8] shadow-2xs text-gray-800 placeholder:text-gray-400"
              />
            </div>
            <div className="relative shrink-0">
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="text-xs font-bold text-gray-700 bg-white border border-gray-200/90 rounded-2xl px-3.5 py-2.5 pr-8 appearance-none cursor-pointer focus:outline-none shadow-2xs"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-3.5">
            {FILTER_PILLS.map((pill) => (
              <button
                key={pill.key}
                onClick={() => setActiveFilter(pill.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  activeFilter === pill.key
                    ? 'bg-[#5844A8] text-white shadow-2xs'
                    : 'bg-[#F3EFFE] text-[#5844A8] hover:bg-[#EAE4FC]'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Category Cards Grid — 2 columns matching screenshot */}
          <div className="grid grid-cols-2 gap-3 sm:gap-3.5 mb-6">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 border border-gray-100/90 shadow-2xs hover:shadow-xs transition-shadow flex items-center justify-between gap-2 cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate group-hover:text-[#5844A8] transition-colors">
                      {cat.name}
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium">
                      {cat.itemCount} items
                    </p>
                    <div className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-500 text-[9px] sm:text-[10px] font-semibold">
                      {cat.mediaType === 'images' ? (
                        <Camera className="w-3 h-3 text-rose-400" />
                      ) : (
                        <Video className="w-3 h-3 text-rose-400" />
                      )}
                      <span>{cat.mediaCount} {cat.mediaType === 'images' ? 'images' : 'video'}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 shrink-0 group-hover:text-[#5844A8] group-hover:translate-x-0.5 transition-all" />
              </div>
            ))}
          </div>

          {/* ── Recent Updates ── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base sm:text-lg font-black text-gray-900">Recent Updates</h2>
              <button className="text-xs font-bold text-[#5844A8] cursor-pointer hover:underline">View All</button>
            </div>

            <div className="space-y-2.5 mb-6">
              {RECENT_UPDATES.map((update) => (
                <div
                  key={update.id}
                  className="bg-white rounded-2xl p-3 sm:p-3.5 border border-gray-100/90 shadow-2xs flex items-center justify-between gap-3 hover:shadow-xs transition-shadow"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={update.image}
                      alt={update.name}
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                          {update.name}
                        </span>
                        <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${badgeStyles[update.badge]}`}>
                          {update.badge}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-gray-400 truncate mt-0.5">
                        {update.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <p className="text-[10px] sm:text-[11px] text-gray-400 font-semibold whitespace-nowrap">
                        {update.timeAgo}
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-gray-400 whitespace-nowrap">
                        {update.by}
                      </p>
                    </div>
                    <button className="p-1 text-gray-300 hover:text-gray-600 rounded transition-colors cursor-pointer">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Fixed Bottom Navigation Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 z-40 px-6 py-2 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between relative">
          {/* Home */}
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Home</span>
          </button>

          {/* Campaigns */}
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
            <Send className="w-5 h-5 -rotate-45 -translate-y-0.5" />
            <span className="text-[10px] font-semibold">Campaigns</span>
          </button>

          {/* Floating Center Circle Menu Button */}
          <div className="relative -top-5">
            <button className="w-13 h-13 rounded-full bg-[#2D124D] hover:bg-[#5844A8] text-white flex items-center justify-center shadow-lg shadow-purple-900/30 ring-4 ring-white cursor-pointer active:scale-95 transition-all">
              <Menu className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          {/* Menu (Active) */}
          <button className="flex flex-col items-center gap-1 text-[#5844A8] cursor-pointer">
            <UtensilsCrossed className="w-5 h-5" />
            <span className="text-[10px] font-black">Menu</span>
          </button>

          {/* More */}
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
            <Menu className="w-5 h-5" />
            <span className="text-[10px] font-semibold">More</span>
          </button>
        </div>

        {/* iOS Home Indicator Bar */}
        <div className="w-32 h-1 bg-gray-300 rounded-full mx-auto mt-2" />
      </div>
    </div>
  );
};

export default TabletMenuView;
