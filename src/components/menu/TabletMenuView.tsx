import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  Search,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  MoreVertical,
  UtensilsCrossed,
  LayoutGrid,
  Package,
  Image as ImageIcon,
  Camera,
  Video,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  FileText,
  Loader2,
  Scan,
  Edit3,
  Trash2,
  Plus,
  Check,
  Eye,
  RefreshCw,
  Download,
  GripVertical,
  LayoutTemplate,
  Settings,
  User,
  SlidersHorizontal,
} from 'lucide-react';

// ── Types ───────────────────────────────────────────────────────────────────

export type MenuMobileView =
  | 'overview'
  | 'create_choice'
  | 'scan_upload'
  | 'scan_processing'
  | 'scan_review'
  | 'design_choice'
  | 'choose_template'
  | 'manual_categories'
  | 'manual_items'
  | 'manual_item_form'
  | 'menu_preview'
  | 'add_media'
  | 'menu_settings';

export interface CategoryRecord {
  id: string;
  name: string;
  itemCount: number;
  mediaCount: number;
  mediaType: 'images' | 'video';
  image: string;
}

export interface MenuItemRecord {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  isVeg: boolean;
  tag?: 'Chef\'s Pick' | 'Bestseller' | 'New' | '';
  variants?: string[];
}

export interface RecentUpdate {
  id: string;
  name: string;
  badge: 'Updated' | 'New Item' | 'Removed';
  description: string;
  timeAgo: string;
  by: string;
  image: string;
}

// ── Initial Static Data ──────────────────────────────────────────────────────

const INITIAL_CATEGORIES: CategoryRecord[] = [
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
  {
    id: 'sides',
    name: 'Sides',
    itemCount: 4,
    mediaCount: 1,
    mediaType: 'images',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'specials',
    name: 'Specials',
    itemCount: 4,
    mediaCount: 2,
    mediaType: 'images',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=300',
  },
];

const INITIAL_ITEMS: MenuItemRecord[] = [
  {
    id: 'item-1',
    categoryId: 'starters',
    categoryName: 'Starters',
    name: 'Crispy Bruschetta',
    description: 'Toasted garlic bread with marinated cherry tomatoes, basil and olive oil.',
    price: 220,
    image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&q=80&w=300',
    available: true,
    isVeg: true,
    tag: 'Chef\'s Pick',
  },
  {
    id: 'item-2',
    categoryId: 'starters',
    categoryName: 'Starters',
    name: 'Spicy Chicken Wings',
    description: 'Crispy fried wings tossed in signature house hot sauce.',
    price: 280,
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=300',
    available: true,
    isVeg: false,
    tag: '',
  },
  {
    id: 'item-3',
    categoryId: 'starters',
    categoryName: 'Starters',
    name: 'Truffle Fries',
    description: 'Hand-cut potato fries with parmesan and truffle aioli.',
    price: 180,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=300',
    available: true,
    isVeg: true,
    tag: '',
  },
  {
    id: 'item-4',
    categoryId: 'main',
    categoryName: 'Main Course',
    name: 'Butter Chicken',
    description: 'Rich and creamy with aromatic spices and tender chicken.',
    price: 300,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=300',
    available: true,
    isVeg: false,
    tag: 'Bestseller',
  },
  {
    id: 'item-5',
    categoryId: 'pizzas',
    categoryName: 'Pizzas',
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh mozzarella, basil and tomato sauce.',
    price: 320,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=300',
    available: true,
    isVeg: true,
    tag: 'Bestseller',
  },
  {
    id: 'item-6',
    categoryId: 'pastas',
    categoryName: 'Pastas',
    name: 'Pasta Alfredo',
    description: 'Velvety fettuccine tossed in parmesan cream and fresh herbs.',
    price: 290,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=300',
    available: true,
    isVeg: true,
    tag: '',
  },
  {
    id: 'item-7',
    categoryId: 'beverages',
    categoryName: 'Beverages',
    name: 'Berry Mint Cooler',
    description: 'Fresh crushed berries with lime, garden mint, and sparkling soda.',
    price: 160,
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&q=80&w=300',
    available: true,
    isVeg: true,
    tag: '',
  },
  {
    id: 'item-8',
    categoryId: 'desserts',
    categoryName: 'Desserts',
    name: 'Chocolate Lava Cake',
    description: 'Warm molten chocolate center served with vanilla bean ice cream.',
    price: 240,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=300',
    available: true,
    isVeg: true,
    tag: 'Bestseller',
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

const GALLERY_MEDIA = [
  { id: 'm1', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=300', type: 'image' },
  { id: 'm2', url: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=300', type: 'image' },
  { id: 'm3', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=300', type: 'image' },
  { id: 'm4', url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=300', type: 'image' },
  { id: 'm5', url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=300', type: 'image' },
  { id: 'm6', url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=300', type: 'video' },
  { id: 'm7', url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&q=80&w=300', type: 'image' },
  { id: 'm8', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=300', type: 'image' },
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

export interface TabletMenuViewProps {
  onNavigate?: (route: string) => void;
}

export const TabletMenuView: React.FC<TabletMenuViewProps> = ({ onNavigate }) => {
  const navigate = useNavigate();

  // Navigation flow state
  const [currentView, setCurrentView] = useState<MenuMobileView>('overview');
  const [viewHistory, setViewHistory] = useState<MenuMobileView[]>([]);

  // Overview states
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // App data state
  const [categories, setCategories] = useState<CategoryRecord[]>(INITIAL_CATEGORIES);
  const [menuItems, setMenuItems] = useState<MenuItemRecord[]>(INITIAL_ITEMS);

  // AI Scanning state (Screen 2 & 3)
  const [scanProgress, setScanProgress] = useState(65);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Review & Edit state (Screen 4)
  const [reviewTab, setReviewTab] = useState<'categories' | 'items'>('categories');

  // Choose Template state (Screen 6)
  const [templateTab, setTemplateTab] = useState<'templates' | 'my_templates'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<'classic' | 'modern' | 'minimal' | 'rustic'>('classic');

  // Manual Categories state (Screen 7)
  const [newCatInput, setNewCatInput] = useState('');
  const [showAddCatRow, setShowAddCatRow] = useState(false);

  // Manual Items state (Screen 8 & 9)
  const [manualActiveCatId, setManualActiveCatId] = useState<string>('starters');
  const [editingItem, setEditingItem] = useState<MenuItemRecord | null>(null);
  const [itemFormName, setItemFormName] = useState('');
  const [itemFormDesc, setItemFormDesc] = useState('');
  const [itemFormCat, setItemFormCat] = useState('starters');
  const [itemFormPrice, setItemFormPrice] = useState('320');
  const [itemFormAvailable, setItemFormAvailable] = useState(true);

  // Menu Preview state (Screen 10)
  const [previewFilter, setPreviewFilter] = useState('All');
  const [isCustomerView, setIsCustomerView] = useState(false);

  // Add Media state (Screen 11)
  const [mediaTab, setMediaTab] = useState<'images' | 'videos'>('images');
  const [selectedMedia, setSelectedMedia] = useState<string[]>(['m1', 'm2', 'm3']);

  // Menu Settings state (Screen 12)
  const [menuVisibility, setMenuVisibility] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(false);

  // Coordinate with MobileBottomNav: hide bottom nav when in a subview/flow
  useEffect(() => {
    if (currentView !== 'overview') {
      document.body.classList.add('hide-mobile-bottom-nav');
    } else {
      document.body.classList.remove('hide-mobile-bottom-nav');
    }
    return () => {
      document.body.classList.remove('hide-mobile-bottom-nav');
    };
  }, [currentView]);

  // Listen to Bottom Bar (+) revia:add-action
  useEffect(() => {
    const handleBottomBarAdd = (e: any) => {
      if (!e.detail || e.detail.type === 'menu' || !e.detail.type) {
        navigateToView('create_choice');
      }
    };
    window.addEventListener('revia:add-action', handleBottomBarAdd);
    return () => {
      window.removeEventListener('revia:add-action', handleBottomBarAdd);
    };
  }, [currentView]);

  // Flow Navigation helpers
  const navigateToView = (view: MenuMobileView) => {
    setViewHistory((prev) => [...prev, currentView]);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (viewHistory.length > 0) {
      const prev = viewHistory[viewHistory.length - 1];
      setViewHistory((h) => h.slice(0, -1));
      setCurrentView(prev);
    } else {
      setCurrentView('overview');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // AI Scan trigger
  const handleStartScan = () => {
    navigateToView('scan_processing');
    setIsScanning(true);
    setScanProgress(65);

    setTimeout(() => setScanProgress(80), 900);
    setTimeout(() => setScanProgress(95), 1800);
    setTimeout(() => {
      setScanProgress(100);
      setIsScanning(false);
      setTimeout(() => {
        navigateToView('scan_review');
      }, 500);
    }, 2400);
  };

  // Save manual item
  const handleSaveItem = () => {
    if (!itemFormName.trim()) {
      showToast('Please enter an item name');
      return;
    }
    const targetCat = categories.find((c) => c.id === itemFormCat) || categories[0];
    if (editingItem) {
      setMenuItems((prev) =>
        prev.map((it) =>
          it.id === editingItem.id
            ? {
                ...it,
                name: itemFormName,
                description: itemFormDesc,
                categoryId: itemFormCat,
                categoryName: targetCat.name,
                price: Number(itemFormPrice.replace(/[^0-9]/g, '')) || 250,
                available: itemFormAvailable,
              }
            : it
        )
      );
      showToast(`Updated "${itemFormName}" successfully!`);
    } else {
      const newItem: MenuItemRecord = {
        id: `item-${Date.now()}`,
        categoryId: itemFormCat,
        categoryName: targetCat.name,
        name: itemFormName,
        description: itemFormDesc,
        price: Number(itemFormPrice.replace(/[^0-9]/g, '')) || 250,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300',
        available: itemFormAvailable,
        isVeg: true,
      };
      setMenuItems((prev) => [newItem, ...prev]);
      showToast(`Added "${itemFormName}" to ${targetCat.name}!`);
    }
    navigateToView('manual_items');
  };

  // Add new category
  const handleAddCategory = () => {
    if (!newCatInput.trim()) return;
    const newCat: CategoryRecord = {
      id: newCatInput.toLowerCase().replace(/\s+/g, '-'),
      name: newCatInput.trim(),
      itemCount: 0,
      mediaCount: 0,
      mediaType: 'images',
      image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=300',
    };
    setCategories((prev) => [...prev, newCat]);
    setNewCatInput('');
    setShowAddCatRow(false);
    showToast(`Category "${newCat.name}" added`);
  };

  // Delete category
  const handleDeleteCategory = (catId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId));
    showToast('Category removed');
  };

  // Delete item
  const handleDeleteItem = (itemId: string) => {
    setMenuItems((prev) => prev.filter((i) => i.id !== itemId));
    showToast('Item removed');
  };

  const handleOpenItemForm = (item?: MenuItemRecord) => {
    if (item) {
      setEditingItem(item);
      setItemFormName(item.name);
      setItemFormDesc(item.description);
      setItemFormCat(item.categoryId);
      setItemFormPrice(String(item.price));
      setItemFormAvailable(item.available);
    } else {
      setEditingItem(null);
      setItemFormName('');
      setItemFormDesc('');
      setItemFormCat(manualActiveCatId);
      setItemFormPrice('220');
      setItemFormAvailable(true);
    }
    navigateToView('manual_item_form');
  };

  const filteredCategories = categories.filter((cat) => {
    if (activeFilter !== 'All' && !cat.name.toLowerCase().includes(activeFilter.toLowerCase())) return false;
    if (searchQuery && !cat.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF8FF] font-sans pb-32 text-[#1A1615]">
      {/* ── Toast Notification Banner ── */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[130] bg-[#1E1548] text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-3 duration-200 border border-purple-500/30 max-w-[92vw]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors cursor-pointer ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 1: Create Menu (Menu.png)                                           */}
      {/* ========================================================================= */}
      {currentView === 'create_choice' && (
        <div className="max-w-md mx-auto px-5 pt-6 pb-20 animate-in fade-in slide-in-from-right-2 duration-200">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={goBack}
              className="p-1 -ml-2 text-[#1E1548] hover:bg-purple-100/50 rounded-full transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <h1 className="text-2xl font-black text-[#1E1548]">Create Menu</h1>
          </div>
          <p className="text-xs text-gray-500 mb-8 ml-8">Choose how you want to create your menu.</p>

          <div className="space-y-4">
            {/* Card 1: Scan Menu with AI (RECOMMENDED) */}
            <div
              onClick={() => navigateToView('scan_upload')}
              className="relative bg-white rounded-3xl p-5 border-2 border-[#5844A8] shadow-sm hover:shadow-md transition-all cursor-pointer group active:scale-[0.99]"
            >
              <span className="absolute -top-3 right-5 bg-[#5844A8] text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                Recommended
              </span>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-[#F4F0FF] text-[#5844A8] flex items-center justify-center shrink-0">
                    <Scan className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#1E1548] group-hover:text-[#5844A8] transition-colors">
                      Scan Menu with AI
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                      Upload a photo of your menu and let AI digitize it.
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 shrink-0 group-hover:text-[#5844A8] group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>

            {/* Card 2: Manual Entry */}
            <div
              onClick={() => navigateToView('manual_categories')}
              className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-all cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-[#F4F0FF] text-[#5844A8] flex items-center justify-center shrink-0">
                    <Edit3 className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#1E1548] group-hover:text-[#5844A8] transition-colors">
                      Manual Entry
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                      Add categories and items yourself.
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 shrink-0 group-hover:text-[#5844A8] group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 2: Scan Menu with AI - Upload (Menu-1.png)                           */}
      {/* ========================================================================= */}
      {currentView === 'scan_upload' && (
        <div className="max-w-md mx-auto px-5 pt-6 pb-20 animate-in fade-in slide-in-from-right-2 duration-200">
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={goBack}
              className="p-1 -ml-2 text-[#1E1548] hover:bg-purple-100/50 rounded-full transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <h1 className="text-2xl font-black text-[#1E1548]">Scan Menu with AI</h1>
          </div>

          {/* Centered Graphic Illustration */}
          <div className="flex flex-col items-center justify-center my-8">
            <div className="relative w-48 h-48 rounded-full bg-[#F4F0FF]/80 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#8869E0] absolute top-4 left-7 animate-pulse" />
              <Sparkles className="w-6 h-6 text-[#8869E0] absolute top-12 right-6 animate-pulse" />

              {/* Floating Document */}
              <div className="w-28 h-36 bg-white rounded-2xl shadow-xl border border-purple-100 p-3.5 relative flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-2 bg-purple-200 rounded-full" />
                  <div className="w-full h-1.5 bg-gray-100 rounded-full" />
                  <div className="w-4/5 h-1.5 bg-gray-100 rounded-full" />
                  <div className="w-3/5 h-1.5 bg-gray-100 rounded-full" />
                </div>
                {/* Purple Upload Badge */}
                <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-[#35155D] text-white flex items-center justify-center shadow-lg">
                  <Upload className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>
            </div>

            <h2 className="text-xl font-black text-[#1E1548] mt-6 text-center">
              Upload Menu Image
            </h2>
            <p className="text-xs text-gray-500 text-center max-w-xs mt-2 leading-relaxed">
              Take a clear photo of your menu or upload from your gallery. Make sure the text is readable.
            </p>
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*,.pdf"
            className="hidden"
            onChange={handleStartScan}
          />

          {/* Action Buttons */}
          <div className="space-y-3 mt-10">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 rounded-2xl bg-[#35155D] hover:bg-[#280E47] text-white text-sm font-bold shadow-lg shadow-[#35155D]/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
            >
              <Upload className="w-4 h-4 stroke-[2.5]" />
              <span>Upload Image</span>
            </button>

            <button
              onClick={handleStartScan}
              className="w-full py-4 rounded-2xl bg-white border border-[#35155D] hover:bg-purple-50/50 text-[#35155D] text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
            >
              <Camera className="w-4 h-4" />
              <span>Use Camera</span>
            </button>

            <p className="text-[11px] text-gray-400 text-center pt-2">
              Supported formats: JPG, PNG (Max 10MB)
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 3: Scan Menu with AI - Reading Progress (Menu-2.png)               */}
      {/* ========================================================================= */}
      {currentView === 'scan_processing' && (
        <div className="max-w-md mx-auto px-5 pt-6 pb-20 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={goBack}
              className="p-1 -ml-2 text-[#1E1548] hover:bg-purple-100/50 rounded-full transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <h1 className="text-2xl font-black text-[#1E1548]">Scan Menu with AI</h1>
          </div>

          <div className="flex flex-col items-center justify-center my-6">
            {/* Document with Sparkles */}
            <div className="relative w-36 h-44 bg-white rounded-3xl shadow-xl border border-purple-100 p-4 flex flex-col justify-between mb-8">
              <Sparkles className="w-5 h-5 text-[#8869E0] absolute -top-3 -right-2 animate-bounce" />
              <Sparkles className="w-4 h-4 text-[#8869E0] absolute top-8 -left-3 animate-pulse" />
              <div className="space-y-2">
                <div className="w-12 h-2.5 bg-purple-200 rounded-full" />
                <div className="w-full h-2 bg-gray-100 rounded-full" />
                <div className="w-4/5 h-2 bg-gray-100 rounded-full" />
                <div className="w-3/5 h-2 bg-gray-100 rounded-full" />
              </div>
              <div className="flex justify-center">
                <Sparkles className="w-6 h-6 text-[#5844A8] animate-spin" />
              </div>
            </div>

            <h2 className="text-xl font-black text-[#1E1548] text-center">
              Our AI is reading your menu...
            </h2>
            <p className="text-xs text-gray-400 text-center max-w-xs mt-1.5 leading-relaxed">
              This may take a few minutes. We'll notify you once it's ready.
            </p>

            {/* Radial 65% Progress Meter */}
            <div className="relative w-28 h-28 my-8 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#EBE8F5"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#5844A8"
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * scanProgress) / 100}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <span className="absolute text-2xl font-black text-[#1E1548] tracking-tight">
                {scanProgress}%
              </span>
            </div>

            {/* Checklist */}
            <div className="w-full max-w-xs space-y-3">
              <div className="flex items-center gap-3 text-xs font-semibold text-gray-700">
                <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                <span>Extracting text</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-gray-700">
                <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                <span>Identifying categories</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-[#1E1548]">
                {scanProgress >= 100 ? (
                  <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                ) : (
                  <Loader2 className="w-4 h-4 text-[#5844A8] animate-spin" />
                )}
                <span>Structuring menu</span>
              </div>
            </div>

            {/* Manual Skip / Continue button */}
            <button
              onClick={() => navigateToView('scan_review')}
              className="mt-8 text-xs font-bold text-[#5844A8] hover:underline cursor-pointer"
            >
              Skip to Review &rarr;
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 4: Review & Edit Menu (Menu-3.png)                                  */}
      {/* ========================================================================= */}
      {currentView === 'scan_review' && (
        <div className="max-w-md mx-auto px-5 pt-6 pb-36 animate-in fade-in slide-in-from-right-2 duration-200">
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={goBack}
              className="p-1 -ml-2 text-[#1E1548] hover:bg-purple-100/50 rounded-full transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <h1 className="text-2xl font-black text-[#1E1548]">Review & Edit Menu</h1>
          </div>
          <p className="text-xs text-gray-500 mb-5 ml-8 leading-relaxed">
            We've extracted the following from your menu. Please review and make any changes.
          </p>

          {/* Segmented Control Tabs */}
          <div className="bg-gray-100/90 p-1 rounded-2xl flex items-center mb-5">
            <button
              onClick={() => setReviewTab('categories')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                reviewTab === 'categories'
                  ? 'bg-[#35155D] text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Categories ({categories.length})
            </button>
            <button
              onClick={() => setReviewTab('items')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                reviewTab === 'items'
                  ? 'bg-[#35155D] text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Items ({menuItems.length})
            </button>
          </div>

          {/* Categories Tab Content */}
          {reviewTab === 'categories' ? (
            <div className="space-y-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => {
                    setManualActiveCatId(cat.id);
                    navigateToView('manual_items');
                  }}
                  className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-2xs flex items-center justify-between gap-3 hover:shadow-xs transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300';
                      }}
                      className="w-13 h-13 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-black text-[#1E1548]">{cat.name}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">{cat.itemCount} items</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            /* Items Tab Content */
            <div className="space-y-3">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-2xs flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300';
                      }}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-sm border flex items-center justify-center shrink-0 ${item.isVeg ? 'border-emerald-600' : 'border-rose-600'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                        </span>
                        <h4 className="text-xs font-bold text-gray-900 truncate">{item.name}</h4>
                      </div>
                      <p className="text-[11px] text-gray-400 truncate mt-0.5">{item.categoryName} • ₹{item.price}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenItemForm(item)}
                    className="p-1.5 text-gray-400 hover:text-[#5844A8] rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Sticky Footer Actions with Save and Next */}
          <div className="fixed bottom-0 inset-x-0 z-[70] bg-white border-t border-gray-100 p-3.5 sm:p-4 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] pb-[max(env(safe-area-inset-bottom,0px),16px)]">
            <div className="max-w-md mx-auto flex items-center justify-between gap-2.5">
              <button
                onClick={goBack}
                className="flex items-center gap-1 text-xs font-bold text-gray-700 hover:text-gray-900 px-3.5 py-3 rounded-2xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    showToast('Menu saved successfully!');
                    setCurrentView('overview');
                    setViewHistory([]);
                  }}
                  className="px-5 py-3 rounded-2xl bg-white border border-[#35155D] text-[#35155D] hover:bg-purple-50 text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-xs"
                >
                  Save Menu
                </button>
                <button
                  onClick={() => navigateToView('design_choice')}
                  className="px-6 py-3 rounded-2xl bg-[#35155D] hover:bg-[#280E47] text-white text-xs font-bold shadow-md shadow-[#35155D]/25 cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 5: Design Menu Choice (Menu-4.png)                                 */}
      {/* ========================================================================= */}
      {currentView === 'design_choice' && (
        <div className="max-w-md mx-auto px-5 pt-6 pb-20 animate-in fade-in slide-in-from-right-2 duration-200">
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={goBack}
              className="p-1 -ml-2 text-[#1E1548] hover:bg-purple-100/50 rounded-full transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <h1 className="text-2xl font-black text-[#1E1548]">Design Menu</h1>
          </div>
          <p className="text-xs text-gray-500 mb-8 ml-8">Choose how you would like to design your menu.</p>

          <div className="space-y-4">
            {/* Card 1: Choose from Templates */}
            <div
              onClick={() => navigateToView('choose_template')}
              className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-all cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-[#F4F0FF] text-[#5844A8] flex items-center justify-center shrink-0">
                    <LayoutTemplate className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#1E1548] group-hover:text-[#5844A8] transition-colors">
                      Choose from Templates
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                      Browse pre-designed restaurant layouts and customize colors, typography, and sections.
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 shrink-0 group-hover:text-[#5844A8] group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>

            {/* Card 2: Describe with AI Instructions (AI POWERED) */}
            <div
              onClick={() => {
                showToast('AI layout generated based on brand vibe!');
                navigateToView('menu_preview');
              }}
              className="relative bg-white rounded-3xl p-5 border-2 border-[#5844A8] shadow-sm hover:shadow-md transition-all cursor-pointer group active:scale-[0.99]"
            >
              <span className="absolute -top-3 right-5 bg-[#5844A8] text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                AI Powered
              </span>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-[#F4F0FF] text-[#5844A8] flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#1E1548] group-hover:text-[#5844A8] transition-colors">
                      Describe with AI Instructions
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                      Tell AI your restaurant vibe, style preferences, and cuisine to generate a tailored menu layout instantly.
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 shrink-0 group-hover:text-[#5844A8] group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 6: Choose Template (Menu-5.png)                                      */}
      {/* ========================================================================= */}
      {currentView === 'choose_template' && (
        <div className="max-w-md mx-auto px-5 pt-6 pb-28 animate-in fade-in slide-in-from-right-2 duration-200">
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={goBack}
              className="p-1 -ml-2 text-[#1E1548] hover:bg-purple-100/50 rounded-full transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <h1 className="text-2xl font-black text-[#1E1548]">Choose Template</h1>
          </div>
          <p className="text-xs text-gray-500 mb-5 ml-8 leading-relaxed">
            Select a menu template and customise it with your brand colours, logo and images.
          </p>

          {/* Segmented Control Tabs */}
          <div className="bg-gray-100/90 p-1 rounded-2xl flex items-center mb-6">
            <button
              onClick={() => setTemplateTab('templates')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                templateTab === 'templates'
                  ? 'bg-[#35155D] text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Templates
            </button>
            <button
              onClick={() => setTemplateTab('my_templates')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                templateTab === 'my_templates'
                  ? 'bg-[#35155D] text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              My Templates
            </button>
          </div>

          {/* 2x2 Grid matching Menu-5.png */}
          <div className="grid grid-cols-2 gap-4">
            {/* Template 1: Classic */}
            <div
              onClick={() => setSelectedTemplate('classic')}
              className="space-y-1.5 cursor-pointer"
            >
              <div
                className={`relative bg-white rounded-3xl p-3 border-2 transition-all aspect-[3/4] flex flex-col justify-between ${
                  selectedTemplate === 'classic'
                    ? 'border-[#5844A8] shadow-md ring-2 ring-[#5844A8]/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="h-9 rounded-xl bg-amber-100/70 flex items-center justify-center">
                      <span className="w-3.5 h-3.5 rounded-full bg-amber-400" />
                    </div>
                    <div className="h-9 rounded-xl bg-orange-100/70 flex items-center justify-center">
                      <span className="w-3.5 h-3.5 rounded-full bg-orange-400" />
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <div className="w-3/4 h-2 bg-gray-200 rounded-full" />
                    <div className="w-full h-1.5 bg-gray-100 rounded-full" />
                    <div className="w-5/6 h-1.5 bg-gray-100 rounded-full" />
                  </div>
                </div>
                {/* Purple Check badge at bottom right */}
                {selectedTemplate === 'classic' && (
                  <div className="self-end w-6 h-6 rounded-full bg-[#35155D] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>
              <p className="text-xs font-black text-gray-800 text-center">Classic</p>
            </div>

            {/* Template 2: Modern */}
            <div
              onClick={() => setSelectedTemplate('modern')}
              className="space-y-1.5 cursor-pointer"
            >
              <div
                className={`relative bg-[#F9FAFB] rounded-3xl p-3 border-2 transition-all aspect-[3/4] flex flex-col justify-between ${
                  selectedTemplate === 'modern'
                    ? 'border-[#5844A8] shadow-md ring-2 ring-[#5844A8]/10 bg-white'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="w-full h-10 rounded-xl bg-gray-200" />
                  <div className="space-y-1.5">
                    <div className="w-full h-1.5 bg-gray-200 rounded-full" />
                    <div className="w-4/5 h-1.5 bg-gray-200 rounded-full" />
                  </div>
                </div>
                {selectedTemplate === 'modern' && (
                  <div className="self-end w-6 h-6 rounded-full bg-[#35155D] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>
              <p className="text-xs font-black text-gray-800 text-center">Modern</p>
            </div>

            {/* Template 3: Minimal */}
            <div
              onClick={() => setSelectedTemplate('minimal')}
              className="space-y-1.5 cursor-pointer"
            >
              <div
                className={`relative bg-white rounded-3xl p-3 border-2 transition-all aspect-[3/4] flex flex-col justify-between ${
                  selectedTemplate === 'minimal'
                    ? 'border-[#5844A8] shadow-md ring-2 ring-[#5844A8]/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="w-12 h-2.5 bg-slate-400 rounded-full mx-auto" />
                  <div className="w-3/4 h-1.5 bg-gray-100 rounded-full" />
                  <div className="w-2/3 h-1.5 bg-gray-100 rounded-full" />
                </div>
                <div className="self-end w-5 h-5 rounded-full bg-amber-300/60 flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                </div>
              </div>
              <p className="text-xs font-black text-gray-800 text-center">Minimal</p>
            </div>

            {/* Template 4: Rustic */}
            <div
              onClick={() => setSelectedTemplate('rustic')}
              className="space-y-1.5 cursor-pointer"
            >
              <div
                className={`relative bg-[#FDFBF7] rounded-3xl p-3 border-2 transition-all aspect-[3/4] flex flex-col justify-between ${
                  selectedTemplate === 'rustic'
                    ? 'border-[#5844A8] shadow-md ring-2 ring-[#5844A8]/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="w-full h-6 rounded-xl bg-amber-100/80 border border-amber-200/50" />
                  <div className="space-y-1.5">
                    <div className="w-full h-1 bg-amber-200/60 rounded-full" />
                    <div className="w-4/5 h-1 bg-amber-200/60 rounded-full" />
                  </div>
                </div>
                <div className="w-8 h-1 bg-amber-300 rounded-full mx-auto" />
              </div>
              <p className="text-xs font-black text-gray-800 text-center">Rustic</p>
            </div>
          </div>

          {/* Bottom Button */}
          <div className="fixed bottom-0 inset-x-0 z-[70] bg-white border-t border-gray-100 p-3.5 sm:p-4 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] pb-[max(env(safe-area-inset-bottom,0px),16px)]">
            <div className="max-w-md mx-auto">
              <button
                onClick={() => {
                  showToast(`Applied ${selectedTemplate} template!`);
                  navigateToView('menu_preview');
                }}
                className="w-full py-3.5 rounded-2xl bg-[#35155D] hover:bg-[#280E47] text-white text-xs font-bold shadow-lg shadow-[#35155D]/20 cursor-pointer transition-all active:scale-[0.98]"
              >
                Use This Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 7: Add Menu Manually - Categories (Menu-6.png)                      */}
      {/* ========================================================================= */}
      {currentView === 'manual_categories' && (
        <div className="max-w-md mx-auto px-5 pt-6 pb-28 animate-in fade-in slide-in-from-right-2 duration-200">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={goBack}
              className="p-1 -ml-2 text-[#1E1548] hover:bg-purple-100/50 rounded-full transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <h1 className="text-2xl font-black text-[#1E1548]">Add Menu Manually</h1>
          </div>

          <div className="mb-4">
            <h2 className="text-base font-black text-[#1E1548]">Menu Categories</h2>
            <p className="text-xs text-gray-400 mt-0.5">Add categories for your menu.</p>
          </div>

          {/* Reorderable Categories List */}
          <div className="space-y-2.5">
            {categories.slice(0, 6).map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="w-4 h-4 text-gray-300 cursor-grab" />
                  <span className="text-xs font-bold text-gray-800">{cat.name}</span>
                </div>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-1 text-rose-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Inline Add Category input */}
            {showAddCatRow ? (
              <div className="bg-white rounded-2xl p-3 border border-purple-200 shadow-xs flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. Mocktails, Specials..."
                  value={newCatInput}
                  onChange={(e) => setNewCatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                  autoFocus
                  className="flex-1 text-xs px-2 py-1 outline-none text-gray-800"
                />
                <button
                  onClick={handleAddCategory}
                  className="px-3 py-1.5 rounded-xl bg-[#5844A8] text-white text-[11px] font-bold cursor-pointer"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowAddCatRow(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAddCatRow(true)}
                className="w-full py-3.5 text-xs font-bold text-[#5844A8] hover:text-[#47368E] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            )}
          </div>

          {/* Bottom Next Button */}
          <div className="fixed bottom-0 inset-x-0 z-[70] bg-white border-t border-gray-100 p-3.5 sm:p-4 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] pb-[max(env(safe-area-inset-bottom,0px),16px)]">
            <div className="max-w-md mx-auto flex items-center justify-between gap-2.5">
              <button
                onClick={goBack}
                className="flex items-center gap-1 text-xs font-bold text-gray-700 hover:text-gray-900 px-3.5 py-3 rounded-2xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => navigateToView('manual_items')}
                className="flex-1 py-3.5 rounded-2xl bg-[#35155D] hover:bg-[#280E47] text-white text-xs font-bold shadow-lg shadow-[#35155D]/20 cursor-pointer transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 8: Add Menu Manually - Items (Menu-7.png)                           */}
      {/* ========================================================================= */}
      {currentView === 'manual_items' && (
        <div className="max-w-md mx-auto px-5 pt-6 pb-28 animate-in fade-in slide-in-from-right-2 duration-200">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={goBack}
              className="p-1 -ml-2 text-[#1E1548] hover:bg-purple-100/50 rounded-full transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <h1 className="text-2xl font-black text-[#1E1548]">Add Menu Manually</h1>
          </div>

          <div className="mb-3">
            <h2 className="text-base font-black text-[#1E1548]">Menu Items</h2>
            <p className="text-xs text-gray-400 mt-0.5">Add items in each category for your menu.</p>
          </div>

          {/* Horizontal Category Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setManualActiveCatId(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  manualActiveCatId === cat.id
                    ? 'bg-gray-200 text-gray-900 shadow-2xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Item Cards matching Menu-7.png */}
          <div className="space-y-3">
            {menuItems
              .filter((it) => it.categoryId === manualActiveCatId)
              .map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-2xs space-y-2 hover:shadow-xs transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-black text-[#1E1548] truncate">{item.name}</h4>
                        <span className="text-xs font-black text-[#1E1548] shrink-0">₹{item.price}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 line-clamp-2 mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-1 border-t border-gray-50">
                    <button
                      onClick={() => handleOpenItemForm(item)}
                      className="p-1 text-gray-400 hover:text-[#5844A8] rounded transition-colors cursor-pointer"
                      title="Edit Item"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1 text-gray-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

            {/* Add Item Button */}
            <button
              onClick={() => handleOpenItemForm()}
              className="w-full py-4 text-xs font-bold text-[#5844A8] hover:text-[#47368E] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item to {categories.find((c) => c.id === manualActiveCatId)?.name || 'Category'}</span>
            </button>
          </div>

          {/* Bottom Actions with Save and Next */}
          <div className="fixed bottom-0 inset-x-0 z-[70] bg-white border-t border-gray-100 p-3.5 sm:p-4 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] pb-[max(env(safe-area-inset-bottom,0px),16px)]">
            <div className="max-w-md mx-auto flex items-center justify-between gap-2.5">
              <button
                onClick={goBack}
                className="flex items-center gap-1 text-xs font-bold text-gray-700 hover:text-gray-900 px-3.5 py-3 rounded-2xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    showToast('Menu saved successfully!');
                    setCurrentView('overview');
                    setViewHistory([]);
                  }}
                  className="px-5 py-3 rounded-2xl bg-white border border-[#35155D] text-[#35155D] hover:bg-purple-50 text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-xs"
                >
                  Save Menu
                </button>
                <button
                  onClick={() => navigateToView('menu_preview')}
                  className="px-6 py-3 rounded-2xl bg-[#35155D] hover:bg-[#280E47] text-white text-xs font-bold shadow-md shadow-[#35155D]/25 cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 9: Add / Edit Item Form (Menu-8.png)                                */}
      {/* ========================================================================= */}
      {currentView === 'manual_item_form' && (
        <div className="max-w-md mx-auto px-5 pt-6 pb-28 animate-in fade-in slide-in-from-right-2 duration-200">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={goBack}
              className="p-1 -ml-2 text-[#1E1548] hover:bg-purple-100/50 rounded-full transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <h1 className="text-2xl font-black text-[#1E1548]">Add Menu Manually</h1>
          </div>

          <h2 className="text-base font-black text-[#1E1548] mb-4">Item Details</h2>

          <div className="space-y-4">
            {/* Image Upload Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 border border-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=300"
                  alt="Food thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="border-2 border-dashed border-[#5844A8]/40 hover:border-[#5844A8] bg-[#FAF8FF] rounded-2xl flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-colors aspect-[4/3]">
                <Camera className="w-6 h-6 text-[#5844A8] mb-1.5" />
                <span className="text-[11px] font-bold text-[#5844A8]">Add Image / Video</span>
              </div>
            </div>

            {/* Field: Item Name */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Item Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Margherita Pizza"
                value={itemFormName}
                onChange={(e) => setItemFormName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#5844A8] bg-white transition-colors"
              />
            </div>

            {/* Field: Description */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Classic pizza with fresh mozzarella, basil and tomato sauce."
                value={itemFormDesc}
                onChange={(e) => setItemFormDesc(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#5844A8] bg-white transition-colors resize-none"
              />
            </div>

            {/* Field: Category */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={itemFormCat}
                  onChange={(e) => setItemFormCat(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#5844A8] bg-white appearance-none cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Field: Price */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Price <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="₹ 320"
                value={itemFormPrice.startsWith('₹') ? itemFormPrice : `₹ ${itemFormPrice}`}
                onChange={(e) => setItemFormPrice(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#5844A8] bg-white transition-colors"
              />
            </div>

            {/* Field: Available Toggle */}
            <div className="flex items-center justify-between py-2 border-t border-gray-100">
              <span className="text-xs font-bold text-gray-800">Available</span>
              <button
                type="button"
                onClick={() => setItemFormAvailable(!itemFormAvailable)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  itemFormAvailable ? 'bg-[#5844A8]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    itemFormAvailable ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Variants Option */}
            <div className="flex items-center justify-between text-xs font-bold text-[#5844A8] cursor-pointer hover:underline py-1">
              <div className="flex items-center gap-1.5">
                <Plus className="w-4 h-4" />
                <span>Add Variants (Optional)</span>
              </div>
              <Plus className="w-4 h-4" />
            </div>
          </div>

          {/* Bottom Save Item Button */}
          <div className="fixed bottom-0 inset-x-0 z-[70] bg-white border-t border-gray-100 p-3.5 sm:p-4 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] pb-[max(env(safe-area-inset-bottom,0px),16px)]">
            <div className="max-w-md mx-auto">
              <button
                onClick={handleSaveItem}
                className="w-full py-4 rounded-2xl bg-[#35155D] hover:bg-[#280E47] text-white text-xs font-bold shadow-lg shadow-[#35155D]/20 cursor-pointer transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Save Item</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 10: Menu Preview (Menu-9.png)                                       */}
      {/* ========================================================================= */}
      {currentView === 'menu_preview' && (
        <div className="max-w-md mx-auto px-5 pt-6 pb-28 animate-in fade-in slide-in-from-right-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={goBack}
                className="p-1 -ml-2 text-[#1E1548] hover:bg-purple-100/50 rounded-full transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              <h1 className="text-2xl font-black text-[#1E1548]">Menu Preview</h1>
            </div>
            <button
              onClick={() => setIsCustomerView(!isCustomerView)}
              className="flex items-center gap-1 text-[11px] font-bold text-[#5844A8] hover:underline cursor-pointer"
            >
              <span>View as Customer</span>
              <User className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Restaurant Banner matching Menu-9.png */}
          <div className="relative rounded-3xl overflow-hidden aspect-[16/9] shadow-md mb-5">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600"
              alt="The Urban Kitchen"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-between p-4">
              <button
                onClick={() => navigateToView('add_media')}
                className="self-end flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] font-bold border border-white/20 hover:bg-black/60 transition-colors cursor-pointer"
              >
                <Camera className="w-3 h-3" />
                <span>Change Banner</span>
              </button>

              <div>
                <span className="text-[10px] font-serif italic text-amber-200 block">Chef's Selection</span>
                <h2 className="text-xl font-black text-white tracking-tight">The Urban Kitchen</h2>
                <span className="text-[10px] text-gray-300 font-medium tracking-widest">EST. 2016</span>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-4">
            {['All', 'Starters', 'Main Course', 'Pizzas', 'Desserts'].map((pill) => (
              <button
                key={pill}
                onClick={() => setPreviewFilter(pill)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  previewFilter === pill
                    ? 'bg-[#35155D] text-white shadow-xs'
                    : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
                }`}
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Section: Starters */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[#1E1548]">Starters</h3>
              <span className="text-xs text-gray-400">2 Items</span>
            </div>

            <div className="space-y-2.5">
              {/* Item: Bruschetta */}
              <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-2xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src="https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&q=80&w=200"
                    alt="Bruschetta"
                    className="w-13 h-13 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-xs border border-emerald-600 flex items-center justify-center shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      </span>
                      <h4 className="text-xs font-black text-gray-900 truncate">Bruschetta</h4>
                      <span className="text-[9px] font-bold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-sm shrink-0">
                        Chef's Pick
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">Toasted bread with tomato, basil and olive oil</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-black text-gray-900">₹220</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Item: Chicken Wings */}
              <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-2xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src="https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=200"
                    alt="Chicken Wings"
                    className="w-13 h-13 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-xs border border-rose-600 flex items-center justify-center shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                      </span>
                      <h4 className="text-xs font-black text-gray-900 truncate">Chicken Wings</h4>
                    </div>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">Crispy wings with house special sauce</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-black text-gray-900">₹280</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Main Course */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[#1E1548]">Main Course</h3>
              <span className="text-xs text-gray-400">1 Item</span>
            </div>

            <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-2xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=200"
                  alt="Butter Chicken"
                  className="w-13 h-13 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs border border-rose-600 flex items-center justify-center shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                    </span>
                    <h4 className="text-xs font-black text-gray-900 truncate">Butter Chicken</h4>
                    <span className="text-[9px] font-bold bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded-sm shrink-0">
                      Bestseller
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 truncate mt-0.5">Rich and creamy with aromatic spices</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-black text-gray-900">₹300</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Bottom Save Menu Button */}
          <div className="fixed bottom-0 inset-x-0 z-[70] bg-white border-t border-gray-100 p-3.5 sm:p-4 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] pb-[max(env(safe-area-inset-bottom,0px),16px)]">
            <div className="max-w-md mx-auto">
              <button
                onClick={() => {
                  showToast('Menu saved & published live!');
                  setCurrentView('overview');
                  setViewHistory([]);
                }}
                className="w-full py-4 rounded-2xl bg-[#35155D] hover:bg-[#280E47] text-white text-xs font-bold shadow-lg shadow-[#35155D]/20 cursor-pointer transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Save Menu</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 11: Add Media (Menu-10.png)                                         */}
      {/* ========================================================================= */}
      {currentView === 'add_media' && (
        <div className="max-w-md mx-auto px-5 pt-6 pb-28 animate-in fade-in slide-in-from-right-2 duration-200">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={goBack}
              className="p-1 -ml-2 text-[#1E1548] hover:bg-purple-100/50 rounded-full transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <h1 className="text-2xl font-black text-[#1E1548]">Add Media</h1>
          </div>

          {/* Segmented Control Tabs */}
          <div className="bg-gray-100/90 p-1 rounded-2xl flex items-center mb-5">
            <button
              onClick={() => setMediaTab('images')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mediaTab === 'images'
                  ? 'bg-[#35155D] text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Images
            </button>
            <button
              onClick={() => setMediaTab('videos')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mediaTab === 'videos'
                  ? 'bg-[#35155D] text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Videos
            </button>
          </div>

          {/* Dashed Upload Area */}
          <div className="border-2 border-dashed border-[#5844A8]/30 hover:border-[#5844A8] bg-white rounded-3xl p-6 text-center cursor-pointer transition-all mb-5">
            <div className="w-12 h-12 rounded-2xl bg-[#F4F0FF] text-[#5844A8] mx-auto flex items-center justify-center mb-2">
              <Camera className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-gray-800">Upload Image or Video</p>
            <p className="text-[10px] text-gray-400 mt-1">JPG, PNG, MP4 (Max 10MB)</p>
          </div>

          {/* 3x3 Photo Grid with Selection Circles */}
          <div className="grid grid-cols-3 gap-2.5">
            {GALLERY_MEDIA.map((item) => {
              const isSelected = selectedMedia.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedMedia((prev) =>
                      isSelected ? prev.filter((id) => id !== item.id) : [...prev, item.id]
                    );
                  }}
                  className="relative rounded-2xl overflow-hidden aspect-square border border-gray-100 cursor-pointer group shadow-2xs"
                >
                  <img
                    src={item.url}
                    alt="Menu item"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  {/* Selection Radio / Check Circle */}
                  <div className="absolute top-1.5 right-1.5">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-[#5844A8] border-[#5844A8] text-white'
                          : 'border-white bg-black/20'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>

                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="w-7 h-7 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-gray-900 shadow-sm">
                        <Video className="w-3.5 h-3.5 ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* More tile */}
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center aspect-square text-xs font-bold text-gray-400 cursor-pointer hover:bg-gray-100 transition-colors">
              More
            </div>
          </div>

          {/* Bottom Save Button */}
          <div className="fixed bottom-0 inset-x-0 z-[70] bg-white border-t border-gray-100 p-3.5 sm:p-4 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] pb-[max(env(safe-area-inset-bottom,0px),16px)]">
            <div className="max-w-md mx-auto">
              <button
                onClick={() => {
                  showToast('Media gallery updated!');
                  goBack();
                }}
                className="w-full py-4 rounded-2xl bg-[#35155D] hover:bg-[#280E47] text-white text-xs font-bold shadow-lg shadow-[#35155D]/20 cursor-pointer transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 12: Menu Settings (Menu-11.png)                                     */}
      {/* ========================================================================= */}
      {currentView === 'menu_settings' && (
        <div className="max-w-md mx-auto px-5 pt-6 pb-20 animate-in fade-in slide-in-from-right-2 duration-200">
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={goBack}
              className="p-1 -ml-2 text-[#1E1548] hover:bg-purple-100/50 rounded-full transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <h1 className="text-2xl font-black text-[#1E1548]">Menu Settings</h1>
          </div>

          <div className="space-y-3">
            {/* Tile 1: Update Menu */}
            <div
              onClick={() => navigateToView('create_choice')}
              className="bg-white rounded-3xl p-4 border border-gray-100 shadow-2xs flex items-center justify-between gap-3 cursor-pointer hover:shadow-xs transition-shadow"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#F4F0FF] text-[#5844A8] flex items-center justify-center shrink-0">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-900">Update Menu</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">Re-scan or edit your menu anytime.</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
            </div>

            {/* Tile 2: Menu Visibility */}
            <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-2xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#F4F0FF] text-[#5844A8] flex items-center justify-center shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-900">Menu Visibility</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">Visible to customers</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-600">{menuVisibility ? 'On' : 'Off'}</span>
                <button
                  type="button"
                  onClick={() => setMenuVisibility(!menuVisibility)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    menuVisibility ? 'bg-emerald-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      menuVisibility ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Tile 3: Auto Update */}
            <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-2xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#F4F0FF] text-[#5844A8] flex items-center justify-center shrink-0">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-900">Auto Update</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">Keep menu updated with new items.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAutoUpdate(!autoUpdate)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  autoUpdate ? 'bg-[#5844A8]' : 'bg-gray-200'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    autoUpdate ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Tile 4: Manage Media */}
            <div
              onClick={() => navigateToView('add_media')}
              className="bg-white rounded-3xl p-4 border border-gray-100 shadow-2xs flex items-center justify-between gap-3 cursor-pointer hover:shadow-xs transition-shadow"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#F4F0FF] text-[#5844A8] flex items-center justify-center shrink-0">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-900">Manage Media</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">View and manage your images & videos.</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
            </div>

            {/* Tile 5: Download Menu */}
            <div
              onClick={() => showToast('Menu PDF downloaded successfully!')}
              className="bg-white rounded-3xl p-4 border border-gray-100 shadow-2xs flex items-center justify-between gap-3 cursor-pointer hover:shadow-xs transition-shadow"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#F4F0FF] text-[#5844A8] flex items-center justify-center shrink-0">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-900">Download Menu</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">Get a PDF copy of your menu.</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
            </div>

            {/* Tile 6: Delete Menu */}
            <div
              onClick={() => {
                if (window.confirm('Are you sure you want to permanently delete this menu?')) {
                  showToast('Menu deleted');
                  setCurrentView('overview');
                }
              }}
              className="bg-rose-50/50 rounded-3xl p-4 border border-rose-100 shadow-2xs flex items-center justify-between gap-3 cursor-pointer hover:bg-rose-50 transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-500 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-rose-600">Delete Menu</h4>
                  <p className="text-[11px] text-rose-400 mt-0.5">Permanently remove your menu.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 0: Main Menu Overview (Default Dashboard)                           */}
      {/* ========================================================================= */}
      {currentView === 'overview' && (
        <>
          {/* ── Page Header Row ── */}
          <div className="px-4 sm:px-5 pt-4 pb-3 sm:pb-4 max-w-[1280px] mx-auto">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 pr-1 sm:pr-2">
                <h1 className="text-2xl sm:text-3xl font-black text-[#1E1548] tracking-tight">Menu</h1>
                <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                  Manage your digital menu, update items and keep your offerings fresh.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => navigateToView('menu_settings')}
                  className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all cursor-pointer shadow-2xs"
                  title="Menu Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigateToView('create_choice')}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold shadow-md shadow-[#5844A8]/20 transition-all shrink-0 cursor-pointer active:scale-95"
                  title="Upload or update your menu"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Upload / Update Menu</span>
                  <span className="xs:hidden">Upload Menu</span>
                </button>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-5 space-y-4 max-w-[1280px] mx-auto">
            {/* ── Status Section ── */}
            {/* Tablet View (md+): 4 Cards */}
            <div className="hidden md:grid md:grid-cols-12 gap-3 items-stretch">
              <div
                onClick={() => navigateToView('menu_settings')}
                className="col-span-5 lg:col-span-4 bg-white rounded-3xl p-3.5 border border-gray-100/90 shadow-2xs flex items-center gap-3.5 cursor-pointer hover:shadow-xs transition-shadow"
              >
                <div className="relative w-24 h-20 rounded-2xl overflow-hidden shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=300"
                    alt="The Urban Kitchen"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-1.5">
                    <span className="text-[9px] font-bold text-white leading-tight">The Urban Kitchen</span>
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Menu Active</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">Last updated</p>
                  <p className="text-xs font-bold text-gray-800 truncate">12 Apr 2025, 2:30 PM</p>
                </div>
              </div>

              <div className="col-span-7 lg:col-span-8 grid grid-cols-3 gap-3">
                <div
                  onClick={() => navigateToView('manual_categories')}
                  className="bg-white rounded-3xl p-3.5 border border-gray-100/90 shadow-2xs flex flex-col justify-between cursor-pointer hover:shadow-xs"
                >
                  <div className="flex items-center gap-1.5 text-gray-500 text-[10px] sm:text-[11px] font-bold truncate">
                    <LayoutGrid className="w-3.5 h-3.5 text-[#5844A8] shrink-0" />
                    <span className="truncate">Total Categories</span>
                  </div>
                  <span className="text-2xl font-black text-gray-900 mt-2">{categories.length}</span>
                </div>

                <div
                  onClick={() => navigateToView('menu_preview')}
                  className="bg-white rounded-3xl p-3.5 border border-gray-100/90 shadow-2xs flex flex-col justify-between cursor-pointer hover:shadow-xs"
                >
                  <div className="flex items-center gap-1.5 text-gray-500 text-[10px] sm:text-[11px] font-bold truncate">
                    <Package className="w-3.5 h-3.5 text-[#5844A8] shrink-0" />
                    <span className="truncate">Total Items</span>
                  </div>
                  <span className="text-2xl font-black text-gray-900 mt-2">{menuItems.length}</span>
                </div>

                <div
                  onClick={() => navigateToView('add_media')}
                  className="bg-white rounded-3xl p-3.5 border border-gray-100/90 shadow-2xs flex flex-col justify-between cursor-pointer hover:shadow-xs"
                >
                  <div className="flex items-center gap-1.5 text-gray-500 text-[10px] sm:text-[11px] font-bold truncate">
                    <ImageIcon className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="truncate">Media Added</span>
                  </div>
                  <span className="text-2xl font-black text-gray-900 mt-2">12</span>
                </div>
              </div>
            </div>

            {/* Mobile View (< md): Single consolidated card matching mobile screenshot */}
            <div className="md:hidden bg-white rounded-3xl p-3.5 border border-gray-100/90 shadow-2xs">
              <div className="flex items-center gap-3">
                <div
                  onClick={() => navigateToView('menu_settings')}
                  className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 cursor-pointer"
                >
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
                    <div
                      onClick={() => navigateToView('manual_categories')}
                      className="cursor-pointer hover:opacity-80"
                    >
                      <LayoutGrid className="w-3 h-3 text-[#5844A8] mx-auto mb-0.5" />
                      <p className="text-[8px] text-gray-400 font-semibold">Total Cat.</p>
                      <p className="text-xs font-black text-gray-900">{categories.length}</p>
                    </div>
                    <div
                      onClick={() => navigateToView('menu_preview')}
                      className="cursor-pointer hover:opacity-80"
                    >
                      <Package className="w-3 h-3 text-[#5844A8] mx-auto mb-0.5" />
                      <p className="text-[8px] text-gray-400 font-semibold">Total Items</p>
                      <p className="text-xs font-black text-gray-900">{menuItems.length}</p>
                    </div>
                    <div
                      onClick={() => navigateToView('add_media')}
                      className="cursor-pointer hover:opacity-80"
                    >
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
                    <span className="text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-rose-50 text-rose-500 border border-rose-100">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Scan your menu, use a template or add items manually with the help of AI.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigateToView('scan_upload')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer justify-center"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* ── Categories Overview Section ── */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-gray-900">Menu Overview</h2>
                </div>
                <button
                  onClick={() => navigateToView('menu_preview')}
                  className="text-xs font-bold text-[#5844A8] cursor-pointer hover:underline flex items-center gap-1"
                >
                  <span>View Full Menu</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Search & Category Filter */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search categories, items or ingredients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200/80 bg-white text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#5844A8] transition-colors"
                  />
                </div>
                <div className="relative">
                  <select
                    value={activeFilter}
                    onChange={(e) => setActiveFilter(e.target.value)}
                    className="w-full sm:w-auto px-4 py-2.5 pr-8 rounded-xl border border-gray-200/80 bg-white text-xs font-bold text-gray-700 focus:outline-none focus:border-[#5844A8] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {FILTER_PILLS.map((pill) => (
                  <button
                    key={pill.key}
                    onClick={() => setActiveFilter(pill.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      activeFilter === pill.key
                        ? 'bg-[#5844A8] text-white shadow-xs'
                        : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>

              {/* Categories Grid (2 Columns on mobile, 3 on sm, 4 on md/lg) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-1">
                {filteredCategories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => {
                      setManualActiveCatId(category.id);
                      navigateToView('manual_items');
                    }}
                    className="bg-white rounded-2xl p-2.5 sm:p-3 border border-gray-100/90 shadow-2xs hover:shadow-xs transition-shadow flex items-center justify-between gap-2.5 group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#5844A8] transition-colors truncate">
                          {category.name}
                        </h3>
                        <p className="text-[10px] sm:text-[11px] text-gray-400 truncate">
                          {category.itemCount} items
                        </p>
                        <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-[#5844A8] font-medium mt-0.5">
                          {category.mediaType === 'video' ? (
                            <>
                              <Video className="w-2.5 h-2.5 text-rose-500" />
                              <span className="text-rose-500 font-bold">{category.mediaCount} video</span>
                            </>
                          ) : (
                            <>
                              <ImageIcon className="w-2.5 h-2.5 text-rose-500" />
                              <span className="text-rose-500 font-bold">{category.mediaCount} images</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#5844A8] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Recent Updates ── */}
            <div className="pt-2 mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base sm:text-lg font-black text-gray-900">Recent Updates</h2>
                <button
                  onClick={() => navigateToView('menu_preview')}
                  className="text-xs font-bold text-[#5844A8] cursor-pointer hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-2.5">
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
        </>
      )}
    </div>
  );
};

export default TabletMenuView;
