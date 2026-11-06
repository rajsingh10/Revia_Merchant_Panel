import React, { useState, useMemo, useRef, useEffect } from 'react';
import { TabletMenuView } from '../components/menu/TabletMenuView';
import {
  Upload,
  Plus,
  Search,
  ChevronDown,
  X,
  Check,
  ImageIcon,
  Trash2,
  AlertTriangle,
  Edit2,
  Sparkles,
  Camera,
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  FileText,
  ChevronRight,
  CheckCircle2,
  Loader2,
  LayoutGrid,
  Layers,
  Utensils,
  Coffee,
  Pizza,
  Wine,
  Flame,
  GripVertical,
  MoreVertical,
  Shield,
  Clock,
  FolderArchive,
  Store,
  ChevronUp,
  Tag,
  Sliders,
  LayoutTemplate
} from 'lucide-react';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  toggleItemSelection,
  CatalogItem
} from '../store/slices/catalogSlice';
import { fetchBranches } from '../store/slices/branchSlice';

// Natural Menu Lifecycle Flow matching all Figma screens
type CatalogView =
  | 'create_menu_choice'  // Step 1: Create Menu (Scan AI vs Manual Entry vs Keep Current)
  | 'scan_ai_upload'      // Step 2: Scan Menu with AI (Upload dropzone)
  | 'scan_ai_processing'  // Step 3: Scan Menu with AI (Reading 65% progress)
  | 'scan_ai_review'      // Step 4: Review & Edit Menu (Extracted Categories & Items)
  | 'design_menu_choice'  // Step 5: Design Menu (Templates vs Describe with AI)
  | 'choose_template'     // Step 6: Choose Template (8 templates)
  | 'manual_categories'   // Manual Step 2: Categories reorderable list
  | 'manual_items_list'   // Manual Step 3: Category items list
  | 'manual_add_item'     // Manual Step 4: Add / Edit item form
  | 'menu_overview';      // Step 7: Menu Overview (Active menu dashboard)

interface CategoryRecord {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  mediaCount: number;
  status: 'Active' | 'Inactive';
  lastUpdated: string;
  image: string;
  iconType: 'soup' | 'meat' | 'pizza' | 'pasta' | 'drink' | 'dessert' | 'fries';
  badgeBg: string;
}

interface MenuItemRecord {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  options?: string[];
}

interface ExtractedCategoryCard {
  id: string;
  name: string;
  itemCount: number;
  image: string;
  iconType: 'fries' | 'sparkle' | 'soup' | 'meat' | 'pizza' | 'pasta' | 'drink' | 'dessert';
  badgeBg: string;
  badgeColor: string;
  items: {
    id: string;
    name: string;
    price: number;
    description: string;
  }[];
}

const INITIAL_EXTRACTED_REVIEW_CATEGORIES: ExtractedCategoryCard[] = [
  {
    id: 'rev-1',
    name: 'Sides',
    itemCount: 4,
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&q=80&w=300',
    iconType: 'fries',
    badgeBg: '#FEF3C7',
    badgeColor: '#D97706',
    items: [
      { id: 'ri-1', name: 'Truffle Parmesan Fries', price: 180, description: 'Hand-cut potato fries with parmesan and truffle aioli' },
      { id: 'ri-2', name: 'Cheesy Garlic Bread', price: 160, description: 'Toasted baguette with garlic herb butter' },
      { id: 'ri-3', name: 'Crispy Onion Rings', price: 140, description: 'Golden battered sweet onion rings' },
      { id: 'ri-4', name: 'Spicy Potato Wedges', price: 150, description: 'Seasoned roasted potato wedges' },
    ]
  },
  {
    id: 'rev-2',
    name: 'Specials',
    itemCount: 4,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300',
    iconType: 'sparkle',
    badgeBg: '#F3E8FF',
    badgeColor: '#7C3AED',
    items: [
      { id: 'ri-5', name: 'Chef Signature Salmon Bowl', price: 420, description: 'Norwegian salmon with avocado & quinoa' },
      { id: 'ri-6', name: 'Smoked Duck Breast Platter', price: 460, description: 'Berry glaze with roasted root veggies' },
      { id: 'ri-7', name: 'Wild Mushroom Risotto', price: 380, description: 'Creamy arborio rice with porcini' },
      { id: 'ri-8', name: 'Pan-seared Sea Bass', price: 490, description: 'Lemon caper emulsion with asparagus' },
    ]
  },
  {
    id: 'rev-3',
    name: 'Sides',
    itemCount: 4,
    image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=300',
    iconType: 'fries',
    badgeBg: '#FEF3C7',
    badgeColor: '#D97706',
    items: [
      { id: 'ri-9', name: 'Sweet Potato Fries', price: 190, description: 'Served with chipotle aioli' },
      { id: 'ri-10', name: 'House Herb Coleslaw', price: 120, description: 'Crunchy cabbage with yogurt dressing' },
      { id: 'ri-11', name: 'Steamed Greens with Garlic', price: 140, description: 'Seasonal garden broccoli & beans' },
      { id: 'ri-12', name: 'Buttery Mashed Potatoes', price: 150, description: 'Velvety whipped Yukon gold potatoes' },
    ]
  },
  {
    id: 'rev-4',
    name: 'Specials',
    itemCount: 4,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=300',
    iconType: 'sparkle',
    badgeBg: '#F3E8FF',
    badgeColor: '#7C3AED',
    items: [
      { id: 'ri-13', name: 'Charcoal Grilled Lamb Chops', price: 540, description: 'Rosemary jus with grilled vine tomatoes' },
      { id: 'ri-14', name: 'Lobster & Crab Tail Bisque', price: 480, description: 'Rich seafood broth with brioche croutons' },
      { id: 'ri-15', name: 'Black Angus Ribeye 300g', price: 680, description: 'Aged beef with herb compound butter' },
      { id: 'ri-16', name: 'Truffle Wagyu Burger', price: 450, description: 'Brioche bun, caramelised shallots & gruyere' },
    ]
  },
  {
    id: 'rev-5',
    name: 'Starters',
    itemCount: 8,
    image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&q=80&w=300',
    iconType: 'soup',
    badgeBg: '#FFEDD5',
    badgeColor: '#EA580C',
    items: [
      { id: 'ri-17', name: 'Classic Tomato Bruschetta', price: 220, description: 'Ripe roma tomatoes, basil & balsamic glaze' },
      { id: 'ri-18', name: 'Garlic Bread Baguette', price: 180, description: 'Crispy sourdough with roasted garlic parsley butter' },
      { id: 'ri-19', name: 'Loaded Nachos Grande', price: 240, description: 'Tortilla chips with melted cheddar, jalapenos & guacamole' },
      { id: 'ri-20', name: 'Spicy Chicken Wings', price: 280, description: 'Crispy fried wings tossed in signature house sauce' },
    ]
  },
  {
    id: 'rev-6',
    name: 'Main Course',
    itemCount: 12,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=300',
    iconType: 'meat',
    badgeBg: '#DBEAFE',
    badgeColor: '#2563EB',
    items: [
      { id: 'ri-21', name: 'Grilled Herb Chicken Steak', price: 340, description: 'Tender chicken breast with herb butter sauce' },
      { id: 'ri-22', name: 'Fish & Chips Platter', price: 320, description: 'Crispy golden batter with pea puree' },
      { id: 'ri-23', name: 'Cottage Cheese Steak Sizzler', price: 310, description: 'Grilled paneer with herbed rice' },
      { id: 'ri-24', name: 'Butter Chicken with Naan', price: 360, description: 'Velvety makhani gravy with clay oven naan' },
    ]
  },
  {
    id: 'rev-7',
    name: 'Pizzas',
    itemCount: 5,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=300',
    iconType: 'pizza',
    badgeBg: '#FEE2E2',
    badgeColor: '#DC2626',
    items: [
      { id: 'ri-25', name: 'Margherita Pizza 12"', price: 320, description: 'Classic pizza with fresh mozzarella, basil and tomato sauce' },
      { id: 'ri-26', name: 'Pepperoni Feast Pizza', price: 399, description: 'Loaded spicy pepperoni slices' },
      { id: 'ri-27', name: 'Four Cheese Bianca', price: 380, description: 'Mozzarella, gorgonzola, parmesan & ricotta' },
      { id: 'ri-28', name: 'BBQ Chicken Pizza', price: 370, description: 'Smoked chicken, red onion & BBQ drizzle' },
      { id: 'ri-29', name: 'Garden Veggie Supreme', price: 320, description: 'Bell peppers, olives, mushrooms & corn' },
    ]
  },
  {
    id: 'rev-8',
    name: 'Pastas',
    itemCount: 4,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=300',
    iconType: 'pasta',
    badgeBg: '#CCFBF1',
    badgeColor: '#0D9488',
    items: [
      { id: 'ri-30', name: 'Pasta Alfredo', price: 280, description: 'Signature cream sauce with parmesan and garlic herbs' },
      { id: 'ri-31', name: 'Penne Arrabiata', price: 260, description: 'Spicy chili tomato sauce with black olives' },
      { id: 'ri-32', name: 'Spaghetti Aglio e Olio', price: 240, description: 'Olive oil, garlic, chili flakes & parsley' },
      { id: 'ri-33', name: 'Baked Lasagna Bolognese', price: 340, description: 'Layered meat ragu with bechamel sauce' },
    ]
  },
  {
    id: 'rev-9',
    name: 'Beverages',
    itemCount: 8,
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&q=80&w=300',
    iconType: 'drink',
    badgeBg: '#E0F2FE',
    badgeColor: '#0284C7',
    items: [
      { id: 'ri-34', name: 'Cappuccino Artisan', price: 120, description: 'Rich espresso with silky steamed microfoam' },
      { id: 'ri-35', name: 'Vanilla Bean Latte', price: 140, description: 'Smooth double shot with madagascar vanilla' },
      { id: 'ri-36', name: 'Iced Americano', price: 110, description: 'Bold cold water espresso over clear ice' },
      { id: 'ri-37', name: 'Fresh Mint Lemonade', price: 130, description: 'Crushed mint leaves with fresh lemon juice' },
    ]
  },
  {
    id: 'rev-10',
    name: 'Desserts',
    itemCount: 5,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=300',
    iconType: 'dessert',
    badgeBg: '#FCE7F3',
    badgeColor: '#DB2777',
    items: [
      { id: 'ri-38', name: 'New York Baked Cheesecake', price: 190, description: 'Velvety cream cheese with berry compote' },
      { id: 'ri-39', name: 'Fudge Walnut Brownie', price: 160, description: 'Warm dark chocolate brownie with gelato' },
      { id: 'ri-40', name: 'Classic Tiramisu Cup', price: 210, description: 'Espresso-soaked ladyfingers with mascarpone' },
      { id: 'ri-41', name: 'Molten Choco Lava Cake', price: 180, description: 'Oozing warm chocolate center' },
    ]
  }
];

const INITIAL_CATEGORIES: CategoryRecord[] = [
  {
    id: 'cat-starters',
    name: 'Starters',
    description: 'Light bites to start your meal',
    itemCount: 6,
    mediaCount: 2,
    status: 'Active',
    lastUpdated: '12 Apr 2025 2:30 PM',
    image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=300',
    iconType: 'soup',
    badgeBg: '#FCE7F3',
  },
  {
    id: 'cat-main',
    name: 'Main Course',
    description: 'Hearty and flavorful dishes',
    itemCount: 14,
    mediaCount: 3,
    status: 'Active',
    lastUpdated: '12 Apr 2025 2:30 PM',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=300',
    iconType: 'meat',
    badgeBg: '#FCE7F3',
  },
  {
    id: 'cat-pizzas',
    name: 'Pizzas',
    description: 'Wood-fired and classic pizzas',
    itemCount: 8,
    mediaCount: 3,
    status: 'Active',
    lastUpdated: '12 Apr 2025 2:30 PM',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=300',
    iconType: 'pizza',
    badgeBg: '#FEF3C7',
  },
  {
    id: 'cat-pastas',
    name: 'Pastas',
    description: 'Authentic Italian pastas',
    itemCount: 6,
    mediaCount: 2,
    status: 'Active',
    lastUpdated: '12 Apr 2025 2:30 PM',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=300',
    iconType: 'pasta',
    badgeBg: '#E0F2FE',
  },
  {
    id: 'cat-beverages',
    name: 'Beverages',
    description: 'Refreshing drinks and beverages',
    itemCount: 6,
    mediaCount: 1,
    status: 'Active',
    lastUpdated: '12 Apr 2025 2:30 PM',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&q=80&w=300',
    iconType: 'drink',
    badgeBg: '#E0F2FE',
  },
  {
    id: 'cat-desserts',
    name: 'Desserts',
    description: 'Sweet treats to end your meal',
    itemCount: 5,
    mediaCount: 1,
    status: 'Active',
    lastUpdated: '12 Apr 2025 2:30 PM',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=300',
    iconType: 'dessert',
    badgeBg: '#FCE7F3',
  },
];

const INITIAL_MENU_ITEMS: MenuItemRecord[] = [
  {
    id: 'item-1',
    categoryId: 'cat-starters',
    categoryName: 'Starters',
    name: 'Crispy Bruschetta',
    description: 'Toasted garlic bread with marinated cherry tomatoes, basil and olive oil.',
    price: 220,
    image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&q=80&w=300',
    available: true,
  },
  {
    id: 'item-2',
    categoryId: 'cat-starters',
    categoryName: 'Starters',
    name: 'Spicy Chicken Wings',
    description: 'Crispy fried wings tossed in signature house sauce.',
    price: 280,
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=300',
    available: true,
  },
  {
    id: 'item-3',
    categoryId: 'cat-starters',
    categoryName: 'Starters',
    name: 'Truffle Fries',
    description: 'Hand-cut potato fries with parmesan and truffle aioli.',
    price: 180,
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&q=80&w=300',
    available: true,
  },
  {
    id: 'item-4',
    categoryId: 'cat-main',
    categoryName: 'Main Course',
    name: 'Grilled Chicken Breast',
    description: 'Tender chicken breast with mashed potato and herb butter sauce.',
    price: 340,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=300',
    available: true,
  },
  {
    id: 'item-5',
    categoryId: 'cat-main',
    categoryName: 'Main Course',
    name: 'Pan-Seared Salmon',
    description: 'Atlantic salmon fillet with lemon dill cream and grilled asparagus.',
    price: 450,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=300',
    available: true,
  },
  {
    id: 'item-6',
    categoryId: 'cat-pizzas',
    categoryName: 'Pizzas',
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh mozzarella, basil and tomato sauce.',
    price: 320,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=300',
    available: true,
  },
  {
    id: 'item-7',
    categoryId: 'cat-pizzas',
    categoryName: 'Pizzas',
    name: 'Pepperoni Classic',
    description: 'Double pepperoni with aged mozzarella and spicy tomato sauce.',
    price: 380,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=300',
    available: true,
  },
  {
    id: 'item-8',
    categoryId: 'cat-pastas',
    categoryName: 'Pastas',
    name: 'Pasta Alfredo',
    description: 'Signature cream sauce with parmesan and garlic herbs.',
    price: 280,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=300',
    available: true,
  },
  {
    id: 'item-9',
    categoryId: 'cat-pastas',
    categoryName: 'Pastas',
    name: 'Pesto Penne Genovese',
    description: 'Fresh basil pesto with roasted pine nuts and shaved parmesan.',
    price: 290,
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281781?auto=format&fit=crop&q=80&w=300',
    available: true,
  },
  {
    id: 'item-10',
    categoryId: 'cat-beverages',
    categoryName: 'Beverages',
    name: 'Cappuccino Artisan',
    description: 'Rich espresso with silky steamed microfoam.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&q=80&w=300',
    available: true,
  },
  {
    id: 'item-11',
    categoryId: 'cat-beverages',
    categoryName: 'Beverages',
    name: 'Vanilla Bean Latte',
    description: 'Smooth double shot with madagascar vanilla.',
    price: 140,
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=300',
    available: true,
  },
  {
    id: 'item-12',
    categoryId: 'cat-desserts',
    categoryName: 'Desserts',
    name: 'New York Baked Cheesecake',
    description: 'Velvety cream cheese with fresh wild berry compote.',
    price: 190,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=300',
    available: true,
  },
  {
    id: 'item-13',
    categoryId: 'cat-desserts',
    categoryName: 'Desserts',
    name: 'Fudge Walnut Brownie',
    description: 'Warm dark chocolate brownie served with vanilla gelato.',
    price: 160,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=300',
    available: true,
  },
];

export const WebItemCatalogView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((state: RootState) => state.catalog);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchBranches());
  }, [dispatch]);

  // Starts directly on Step 1: Create Menu matching the user's flow
  const [currentView, setCurrentView] = useState<CatalogView>('create_menu_choice');
  const [creationMethod, setCreationMethod] = useState<'scan' | 'manual' | 'existing'>('scan');

  // Categories & Items state
  const [categoriesList, setCategoriesList] = useState<CategoryRecord[]>(INITIAL_CATEGORIES);
  const [menuItemsList, setMenuItemsList] = useState<MenuItemRecord[]>(INITIAL_MENU_ITEMS);

  // Step 4: Review & Edit Menu state
  const [reviewTab, setReviewTab] = useState<'categories' | 'items'>('categories');
  const [reviewCategories, setReviewCategories] = useState<ExtractedCategoryCard[]>(INITIAL_EXTRACTED_REVIEW_CATEGORIES);
  const [selectedReviewCategory, setSelectedReviewCategory] = useState<ExtractedCategoryCard | null>(null);

  // Filter & Search in Menu Overview
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
  const [overviewSearchQuery, setOverviewSearchQuery] = useState('');

  // Selected Category in Manual Items view
  const [activeManualCategory, setActiveManualCategory] = useState('cat-starters');

  // Step 5: Design Menu Choice Step: 'templates' vs 'ai'
  const [designMethodChoice, setDesignMethodChoice] = useState<'templates' | 'ai'>('templates');
  const [aiInstructionsText, setAiInstructionsText] = useState('');

  // Manual Add Item Form state
  const [newItemForm, setNewItemForm] = useState<{
    name: string;
    description: string;
    category: string;
    price: number;
    available: boolean;
    image: string;
    showAdditionalOptions: boolean;
  }>({
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh mozzarella, basil and tomato sauce.',
    category: 'Pizzas',
    price: 320,
    available: true,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=300',
    showAdditionalOptions: false,
  });

  // Step 6: Template Selection
  const [selectedTemplateTab, setSelectedTemplateTab] = useState<'templates' | 'my_templates'>('templates');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('classic');

  // Step 3: Scan AI Progress
  const [scanProgress, setScanProgress] = useState(65);
  const uploadFileInputRef = useRef<HTMLInputElement>(null);
  const itemImageInputRef = useRef<HTMLInputElement>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // AI progress tick
  useEffect(() => {
    if (currentView === 'scan_ai_processing') {
      const interval = setInterval(() => {
        setScanProgress((prev) => (prev >= 100 ? 100 : prev + 1));
      }, 300);
      return () => clearInterval(interval);
    }
  }, [currentView]);

  // Handle Save New Item from Manual Form
  const handleSaveManualItem = () => {
    const newItem: MenuItemRecord = {
      id: 'item-' + Date.now(),
      categoryId: categoriesList.find((c) => c.name === newItemForm.category)?.id || 'cat-starters',
      categoryName: newItemForm.category,
      name: newItemForm.name,
      description: newItemForm.description,
      price: newItemForm.price,
      image: newItemForm.image,
      available: newItemForm.available,
    };
    setMenuItemsList((prev) => [...prev, newItem]);
    showToast(`Added "${newItemForm.name}" to menu!`);
    setCurrentView('manual_items_list');
  };

  // Toggle item availability
  const toggleItemAvailability = (id: string) => {
    setMenuItemsList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, available: !item.available } : item))
    );
  };

  // Delete item from list
  const deleteMenuItem = (id: string) => {
    setMenuItemsList((prev) => prev.filter((item) => item.id !== id));
    showToast('Item deleted');
  };

  // Delete category from list
  const deleteCategory = (id: string) => {
    setCategoriesList((prev) => prev.filter((cat) => cat.id !== id));
    showToast('Category deleted');
  };

  // Render category icons matching UI badges
  const renderCategoryIcon = (iconType: string) => {
    switch (iconType) {
      case 'soup':
        return <Utensils className="w-4 h-4 text-orange-600" />;
      case 'meat':
        return <Flame className="w-4 h-4 text-blue-600" />;
      case 'pizza':
        return <Pizza className="w-4 h-4 text-rose-600" />;
      case 'pasta':
        return <Coffee className="w-4 h-4 text-teal-600" />;
      case 'drink':
        return <Wine className="w-4 h-4 text-sky-600" />;
      case 'sparkle':
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case 'fries':
        return <Layers className="w-4 h-4 text-amber-600" />;
      case 'dessert':
      default:
        return <Sparkles className="w-4 h-4 text-pink-600" />;
    }
  };

  // Filtered categories for overview table
  const filteredCategories = useMemo(() => {
    return categoriesList.filter((cat) => {
      const matchesSearch =
        overviewSearchQuery === '' ||
        cat.name.toLowerCase().includes(overviewSearchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(overviewSearchQuery.toLowerCase());
      const matchesCategory =
        activeCategoryFilter === 'All' || cat.name.toLowerCase().includes(activeCategoryFilter.toLowerCase());
      return matchesSearch && matchesCategory;
    });
  }, [categoriesList, overviewSearchQuery, activeCategoryFilter]);

  // Current items for active manual category
  const activeCategoryItems = useMemo(() => {
    return menuItemsList.filter((item) => item.categoryId === activeManualCategory);
  }, [menuItemsList, activeManualCategory]);

  return (
    <div className="min-h-screen bg-[#FAF8FF] font-sans pb-16 flex flex-col justify-between">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[80] bg-[#1A1615] text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 text-[13px] font-bold border border-[#3D3732] animate-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* STEP 1: CREATE MENU (Scan AI vs Manual Entry vs Keep Current)   */}
      {/* ============================================================== */}
      {currentView === 'create_menu_choice' && (
        <div className="px-6 lg:px-12 pt-6 max-w-[1400px] w-full mx-auto flex-1 flex flex-col justify-between">
          <div>
            {/* Clickable Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
              <span className="hover:text-gray-700 cursor-pointer" onClick={() => setCurrentView('menu_overview')}>Home</span>
              <span>&gt;</span>
              <span className="hover:text-gray-700 cursor-pointer" onClick={() => setCurrentView('menu_overview')}>Menus</span>
              <span>&gt;</span>
              <span className="text-gray-900 font-bold">Create Menu</span>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-[#111827] flex items-center gap-2 tracking-tight">
                Create Menu <Sparkles className="w-5 h-5 text-pink-500 fill-pink-500" />
              </h1>
              <p className="text-sm text-gray-500 mt-1">Choose how you want to create your menu.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Scan with AI (Recommended) */}
                  <div
                    onClick={() => setCreationMethod('scan')}
                    className={`relative rounded-3xl p-5 border-2 bg-white flex flex-col justify-between h-[280px] cursor-pointer transition-all ${
                      creationMethod === 'scan'
                        ? 'border-[#5844A8] shadow-md ring-2 ring-purple-100'
                        : 'border-gray-200 hover:border-purple-200 shadow-sm'
                    }`}
                  >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-[#5844A8] text-white text-[9px] font-extrabold uppercase tracking-widest px-3 py-0.5 rounded-full">
                        RECOMMENDED
                      </span>
                    </div>
                    <div>
                      <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-4 mt-1">
                        <Camera className="w-5 h-5 text-[#5844A8]" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm mb-2">Scan Menu with AI</h3>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        Upload a photo of your menu and let AI digitize it. Items, categories and prices will be extracted automatically.
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCreationMethod('scan');
                        setCurrentView('scan_ai_upload');
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      Scan Menu with AI
                    </button>
                  </div>

                  {/* Manual Entry */}
                  <div
                    onClick={() => setCreationMethod('manual')}
                    className={`relative rounded-3xl p-5 border-2 bg-white flex flex-col justify-between h-[280px] cursor-pointer transition-all ${
                      creationMethod === 'manual'
                        ? 'border-[#5844A8] shadow-md ring-2 ring-purple-100'
                        : 'border-gray-200 hover:border-purple-200 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="w-10 h-10 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center mb-4 mt-1">
                        <Edit2 className="w-5 h-5 text-pink-500" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm mb-2">Manual Entry</h3>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        Add categories and items yourself. Best for creating a new menu from scratch.
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCreationMethod('manual');
                        setCurrentView('manual_categories');
                      }}
                      className="w-full py-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 text-xs font-bold transition-all cursor-pointer"
                    >
                      Create Manually
                    </button>
                  </div>

                  {/* Keep Current Menu */}
                  <div
                    onClick={() => setCreationMethod('existing')}
                    className={`relative rounded-3xl p-5 border-2 bg-white flex flex-col justify-between h-[280px] cursor-pointer transition-all ${
                      creationMethod === 'existing'
                        ? 'border-[#5844A8] shadow-md ring-2 ring-purple-100'
                        : 'border-gray-200 hover:border-purple-200 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-4 mt-1">
                        <FileText className="w-5 h-5 text-[#5844A8]" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm mb-2">Keep Current Menu</h3>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        Use your existing digital menu (if any) and continue editing or publish as is.
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCreationMethod('existing');
                        setCurrentView('menu_overview');
                      }}
                      className="w-full py-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 text-xs font-bold transition-all cursor-pointer"
                    >
                      Use Existing Menu
                    </button>
                  </div>
                </div>

                <div className="bg-[#FAF8FF] border border-purple-100 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white border border-purple-100 flex items-center justify-center shrink-0">
                    <Lightbulb className="w-4 h-4 text-[#5844A8]" />
                  </div>
                  <p className="text-xs text-gray-600">
                    <span className="font-bold text-gray-900">Not sure which option to choose?</span> Scan with AI is the fastest and easiest way to get started.
                  </p>
                </div>
              </div>

              {/* Right Illustration */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center pt-4">
                <div className="relative w-full max-w-[360px] p-4">
                  <div className="bg-[#FFFDF9] border border-amber-100 rounded-2xl p-6 shadow-md rotate-[-2deg]">
                    <div className="flex justify-between items-center border-b border-amber-100 pb-3 mb-3">
                      <div>
                        <h4 className="font-serif tracking-widest text-xs font-bold uppercase text-gray-800">MENU</h4>
                        <p className="text-[9px] text-gray-400">ARTISAN CAFÉ</p>
                      </div>
                      <span className="text-[10px] text-gray-400">✈</span>
                    </div>
                    <div className="space-y-2 text-[10px]">
                      <div className="flex justify-between"><span>Cappuccino</span><span className="font-bold">₹120</span></div>
                      <div className="flex justify-between"><span>Latte</span><span className="font-bold">₹140</span></div>
                      <div className="flex justify-between"><span>Sandwich</span><span className="font-bold">₹180</span></div>
                    </div>
                  </div>

                  <div className="mt-4 bg-white rounded-2xl p-4 shadow-xl border border-purple-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-3 bg-[#5844A8] rounded-full" />
                      <span className="text-xs font-bold text-gray-900">Menu Digitized</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1">
                      <span className="font-semibold text-gray-800">Cappuccino</span>
                      <span className="font-bold">₹120</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1">
                      <span className="font-semibold text-gray-800">Sandwich</span>
                      <span className="font-bold">₹180</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 pb-4 border-t border-gray-100 flex items-center justify-between mt-8">
            <button
              onClick={() => setCurrentView('menu_overview')}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => {
                if (creationMethod === 'scan') setCurrentView('scan_ai_upload');
                else if (creationMethod === 'manual') setCurrentView('manual_categories');
                else setCurrentView('menu_overview');
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STEP 2: SCAN MENU WITH AI - UPLOAD DROPZONE                    */}
      {/* ============================================================== */}
      {currentView === 'scan_ai_upload' && (
        <div className="px-6 lg:px-12 pt-6 max-w-[1400px] w-full mx-auto flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
              <span className="hover:text-gray-700 cursor-pointer" onClick={() => setCurrentView('menu_overview')}>Home</span>
              <span>&gt;</span>
              <span className="hover:text-gray-700 cursor-pointer" onClick={() => setCurrentView('menu_overview')}>Menus</span>
              <span>&gt;</span>
              <span className="hover:text-gray-700 cursor-pointer" onClick={() => setCurrentView('create_menu_choice')}>Create Menu</span>
              <span>&gt;</span>
              <span className="text-gray-900 font-bold">Scan Menu with AI</span>
            </div>

            <div className="mb-6">
              <h1 className="text-3xl font-extrabold text-[#111827] flex items-center gap-2 tracking-tight">
                Scan Menu with AI <Sparkles className="w-5 h-5 text-pink-500 fill-pink-500" />
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Upload a clear image of your menu and let AI digitize it. Items, categories and prices will be extracted automatically.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-purple-50 shadow-sm mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7">
                  <div
                    onClick={() => uploadFileInputRef.current?.click()}
                    className="border-2 border-dashed border-purple-200 hover:border-[#5844A8] rounded-3xl p-8 text-center bg-[#FAF8FF]/50 hover:bg-[#FAF8FF] transition-all cursor-pointer flex flex-col items-center justify-center"
                  >
                    <input
                      type="file"
                      ref={uploadFileInputRef}
                      onChange={() => {
                        showToast('Menu image loaded');
                        setCurrentView('scan_ai_processing');
                      }}
                      className="hidden"
                    />
                    <div className="w-16 h-16 rounded-2xl bg-white border border-purple-100 shadow-xs flex items-center justify-center mb-4 relative">
                      <FileText className="w-8 h-8 text-[#5844A8]" />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#5844A8] text-white flex items-center justify-center">
                        <Upload className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">Upload Menu Image</h3>
                    <p className="text-xs text-gray-500 max-w-sm mb-6 leading-relaxed">
                      Take a clear photo of your menu or upload from your device. Make sure the text is readable.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          uploadFileInputRef.current?.click();
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold shadow-sm cursor-pointer"
                      >
                        Upload Image
                      </button>
                    </div>
                    <div className="flex items-center gap-3 my-3 w-full max-w-xs">
                      <div className="h-px bg-gray-200 flex-1" />
                      <span className="text-[11px] font-bold text-gray-400">OR</span>
                      <div className="h-px bg-gray-200 flex-1" />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentView('scan_ai_processing');
                      }}
                      className="w-full max-w-xs py-2.5 px-4 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold cursor-pointer"
                    >
                      Use Camera
                    </button>
                    <p className="text-[10px] text-gray-400 mt-4">Supported formats: JPG, PNG (Max 10MB)</p>
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col items-center justify-center">
                  <div className="bg-[#FFFDF9] border border-amber-100 rounded-2xl p-6 shadow-md w-full max-w-[300px] rotate-[2deg]">
                    <h4 className="font-serif tracking-widest text-xs font-bold uppercase text-gray-800 border-b border-amber-100 pb-2 mb-3">
                      MENU - ARTISAN
                    </h4>
                    <div className="space-y-2 text-[10px] text-gray-600">
                      <div className="flex justify-between"><span>Bruschetta</span><span className="font-bold">₹220</span></div>
                      <div className="flex justify-between"><span>Margherita Pizza</span><span className="font-bold">₹320</span></div>
                      <div className="flex justify-between"><span>Pasta Alfredo</span><span className="font-bold">₹280</span></div>
                    </div>
                  </div>
                  <p className="mt-4 text-xs font-medium text-gray-500 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    AI will extract items, categories and prices automatically.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 pb-4 border-t border-gray-100 flex items-center justify-between mt-8">
            <button
              onClick={() => setCurrentView('create_menu_choice')}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentView('scan_ai_processing')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STEP 3: SCAN MENU WITH AI - READING PROGRESS (65%)             */}
      {/* ============================================================== */}
      {currentView === 'scan_ai_processing' && (
        <div className="px-6 lg:px-12 pt-6 max-w-[1400px] w-full mx-auto flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
              <span className="hover:text-gray-700 cursor-pointer" onClick={() => setCurrentView('menu_overview')}>Home</span>
              <span>&gt;</span>
              <span className="hover:text-gray-700 cursor-pointer" onClick={() => setCurrentView('menu_overview')}>Menus</span>
              <span>&gt;</span>
              <span className="hover:text-gray-700 cursor-pointer" onClick={() => setCurrentView('create_menu_choice')}>Create Menu</span>
              <span>&gt;</span>
              <span className="text-gray-900 font-bold">Scan Menu with AI</span>
            </div>

            <div className="mb-6">
              <h1 className="text-3xl font-extrabold text-[#111827] flex items-center gap-2 tracking-tight">
                Scan Menu with AI <Sparkles className="w-5 h-5 text-pink-500 fill-pink-500" />
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Upload a clear image of your menu and let AI digitize it. Items, categories and prices will be extracted automatically.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-purple-50 shadow-sm mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Viewfinder Scan */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative p-6 w-full max-w-[320px]">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#5844A8] rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#5844A8] rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#5844A8] rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#5844A8] rounded-br-xl" />

                    <div className="bg-[#FFFDF9] border border-amber-100 rounded-2xl p-5 shadow-sm text-[11px]">
                      <div className="flex items-center gap-3 pb-3 border-b border-amber-100 mb-3">
                        <img
                          src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=80"
                          alt="Menu sample"
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <h4 className="font-serif font-bold text-xs uppercase text-gray-900">MENU</h4>
                          <p className="text-[9px] text-gray-400">ARTISAN CAFÉ</p>
                        </div>
                      </div>
                      <div className="space-y-1.5 text-gray-600">
                        <div className="flex justify-between"><span>Cappuccino</span><span className="font-bold">₹120</span></div>
                        <div className="flex justify-between"><span>Latte</span><span className="font-bold">₹140</span></div>
                        <div className="flex justify-between"><span>Sandwich</span><span className="font-bold">₹180</span></div>
                        <div className="flex justify-between"><span>French Fries</span><span className="font-bold">₹150</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Progress Ring & Checklist */}
                <div className="lg:col-span-7 flex flex-col items-center lg:items-start pl-0 lg:pl-6 text-center lg:text-left">
                  <h3 className="text-xl font-extrabold text-gray-900 mb-1">Our AI is reading your menu...</h3>
                  <p className="text-xs text-gray-500 mb-6">
                    This may take a few minutes. We'll notify you once it's ready.
                  </p>

                  <div className="relative w-28 h-28 mb-6">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="#F3E8FF" strokeWidth="8" fill="transparent" />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#5844A8"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 40}
                        strokeDashoffset={2 * Math.PI * 40 * (1 - scanProgress / 100)}
                        strokeLinecap="round"
                        className="transition-all duration-300"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-black text-gray-900">{scanProgress}%</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-semibold text-gray-700 w-full max-w-xs">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Extracting text</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Identifying categories</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#5844A8]">
                      <Loader2 className="w-4 h-4 animate-spin text-[#5844A8]" />
                      <span>Structuring menu items</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                      <span>Finalizing results</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 pb-4 border-t border-gray-100 flex items-center justify-between mt-8">
            <button
              onClick={() => setCurrentView('scan_ai_upload')}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentView('scan_ai_review')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STEP 4: REVIEW & EDIT MENU (IN THE DIRECT AI FLOW)             */}
      {/* ============================================================== */}
      {currentView === 'scan_ai_review' && (
        <div className="px-6 lg:px-12 pt-6 max-w-[1500px] w-full mx-auto flex-1 flex flex-col justify-between">
          <div>
            {/* Clickable Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
              <span className="hover:text-gray-700 cursor-pointer" onClick={() => setCurrentView('menu_overview')}>Home</span>
              <span>&gt;</span>
              <span className="hover:text-gray-700 cursor-pointer" onClick={() => setCurrentView('menu_overview')}>Menus</span>
              <span>&gt;</span>
              <span className="hover:text-gray-700 cursor-pointer" onClick={() => setCurrentView('create_menu_choice')}>Create Menu</span>
              <span>&gt;</span>
              <span className="hover:text-gray-700 cursor-pointer" onClick={() => setCurrentView('scan_ai_upload')}>Scan Menu with AI</span>
              <span>&gt;</span>
              <span className="text-gray-900 font-bold">Review &amp; Edit Menu</span>
            </div>

            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight">Review &amp; Edit Menu</h1>
              <p className="text-sm text-gray-500 mt-1">
                We've extracted the following from your menu. Please review and make any changes.
              </p>
            </div>

            {/* Main Rounded Container */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 border border-purple-50 shadow-sm mb-6">
              {/* Category vs Items Tabs */}
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => setReviewTab('categories')}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    reviewTab === 'categories'
                      ? 'bg-[#5844A8] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Categories ({reviewCategories.length})
                </button>
                <button
                  onClick={() => setReviewTab('items')}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    reviewTab === 'items'
                      ? 'bg-[#5844A8] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Items (48)
                </button>
              </div>

              {/* View 1: 2-Column Categories Grid (10 cards matching screenshot) */}
              {reviewTab === 'categories' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reviewCategories.map((cat, index) => (
                    <div
                      key={cat.id + '-' + index}
                      onClick={() => setSelectedReviewCategory(cat)}
                      className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-xs bg-white transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 shadow-xs"
                        />

                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: cat.badgeBg }}
                        >
                          {renderCategoryIcon(cat.iconType)}
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#5844A8] transition-colors">
                            {cat.name}
                          </h4>
                          <p className="text-xs text-gray-400 mt-0.5">{cat.itemCount} items</p>
                        </div>
                      </div>

                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 group-hover:text-[#5844A8] group-hover:bg-purple-50 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* View 2: Items Tab (All extracted items) */}
              {reviewTab === 'items' && (
                <div className="border border-gray-100 rounded-2xl overflow-hidden">
                  <div className="bg-gray-50/75 px-5 py-3 border-b border-gray-100 grid grid-cols-12 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    <span className="col-span-6">Item Name &amp; Description</span>
                    <span className="col-span-3">Category</span>
                    <span className="col-span-2 text-right">Price</span>
                    <span className="col-span-1 text-center">Edit</span>
                  </div>
                  <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                    {reviewCategories.flatMap((cat) =>
                      cat.items.map((it) => (
                        <div
                          key={it.id}
                          className="px-5 py-3.5 grid grid-cols-12 items-center hover:bg-purple-50/20 text-xs transition-colors"
                        >
                          <div className="col-span-6 flex items-center gap-3">
                            <img
                              src={cat.image}
                              alt={it.name}
                              className="w-9 h-9 rounded-lg object-cover shrink-0"
                            />
                            <div>
                              <p className="font-bold text-gray-900">{it.name}</p>
                              <p className="text-[11px] text-gray-500 line-clamp-1">{it.description}</p>
                            </div>
                          </div>
                          <div className="col-span-3">
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-700">
                              {cat.name}
                            </span>
                          </div>
                          <div className="col-span-2 text-right font-bold text-gray-900">
                            ₹{it.price}
                          </div>
                          <div className="col-span-1 text-center">
                            <button
                              onClick={() => setSelectedReviewCategory(cat)}
                              className="p-1.5 text-gray-400 hover:text-[#5844A8] rounded-lg cursor-pointer transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="pt-8 pb-4 border-t border-gray-100 flex items-center justify-between mt-8">
            <button
              onClick={() => setCurrentView('scan_ai_processing')}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentView('design_menu_choice')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STEP 5: DESIGN MENU (Templates vs Describe with AI)            */}
      {/* ============================================================== */}
      {currentView === 'design_menu_choice' && (
        <div className="px-6 lg:px-12 pt-6 max-w-[1500px] w-full mx-auto flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
              <span className="hover:text-gray-700 cursor-pointer" onClick={() => setCurrentView('menu_overview')}>Home</span>
              <span>&gt;</span>
              <span className="hover:text-gray-700 cursor-pointer" onClick={() => setCurrentView('menu_overview')}>Menus</span>
              <span>&gt;</span>
              <span className="text-gray-900 font-bold">Design Menu</span>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-[#111827] flex items-center gap-2 tracking-tight">
                Design Menu <Sparkles className="w-5 h-5 text-pink-500 fill-pink-500" />
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Choose how you would like to design your menu.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
              <div className="lg:col-span-7 space-y-4">
                <div
                  onClick={() => setDesignMethodChoice('templates')}
                  className={`rounded-2xl p-5 border-2 transition-all cursor-pointer bg-white flex items-start gap-4 ${
                    designMethodChoice === 'templates'
                      ? 'border-[#5844A8] shadow-sm ring-2 ring-purple-100'
                      : 'border-gray-200 hover:border-purple-200'
                  }`}
                >
                  <div className="w-11 h-11 rounded-xl bg-[#FAF8FF] border border-purple-100 flex items-center justify-center shrink-0">
                    <LayoutTemplate className="w-5 h-5 text-[#5844A8]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-sm leading-tight">Choose from Templates</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Browse pre-designed menu templates for quick setup. Customize colors and layout to match your brand.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setDesignMethodChoice('ai')}
                  className={`rounded-2xl p-5 border-2 transition-all cursor-pointer bg-white flex items-start gap-4 ${
                    designMethodChoice === 'ai'
                      ? 'border-[#5844A8] shadow-sm ring-2 ring-purple-100'
                      : 'border-gray-200 hover:border-purple-200'
                  }`}
                >
                  <div className="w-11 h-11 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-pink-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-sm leading-tight">Describe with AI Instructions</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Tell AI your menu concept with simple instructions and let it create a customised menu with items, categories and pricing.
                    </p>

                    {designMethodChoice === 'ai' && (
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <textarea
                          rows={2}
                          value={aiInstructionsText}
                          onChange={(e) => setAiInstructionsText(e.target.value)}
                          placeholder="e.g. Modern Italian bistro with fresh pasta, truffle dishes and organic wine pairing..."
                          className="w-full bg-[#FAF8FF] border border-purple-100 rounded-xl p-3 text-xs text-gray-800 focus:outline-none focus:border-[#5844A8]"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Tilted Graphic */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center relative pt-2">
                <div className="relative w-full max-w-[360px] pb-6">
                  <div className="absolute -top-3 left-4 z-20 w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-xs">
                    <span className="text-[11px]">🌿</span>
                  </div>

                  <div className="absolute -top-4 -right-2 z-20 w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
                    <img
                      src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=240"
                      alt="Salmon Bowl"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="bg-[#FFFDF7] border border-amber-100 rounded-3xl p-6 shadow-xl rotate-[3.5deg] relative z-10 transition-transform hover:rotate-0">
                    <div className="text-center pb-3 border-b border-amber-100/80 mb-3">
                      <h3 className="font-serif tracking-widest text-sm font-bold uppercase text-gray-900">
                        MENU
                      </h3>
                      <p className="text-[7.5px] tracking-widest uppercase text-gray-400 mt-0.5">
                        GOOD FOOD • GOOD MOOD
                      </p>
                    </div>

                    <div className="space-y-3 text-[11px]">
                      <div>
                        <p className="text-[8.5px] font-extrabold uppercase tracking-wider text-gray-500 mb-1">
                          STARTERS
                        </p>
                        <div className="flex justify-between py-0.5 text-gray-700"><span>Bruschetta</span><span className="font-bold text-gray-900">₹220</span></div>
                        <div className="flex justify-between py-0.5 text-gray-700"><span>Garlic Bread</span><span className="font-bold text-gray-900">₹180</span></div>
                        <div className="flex justify-between py-0.5 text-gray-700"><span>Loaded Nachos</span><span className="font-bold text-gray-900">₹240</span></div>
                      </div>

                      <div className="pt-1">
                        <p className="text-[8.5px] font-extrabold uppercase tracking-wider text-gray-500 mb-1">
                          MAIN COURSE
                        </p>
                        <div className="flex justify-between py-0.5 text-gray-700"><span>Margherita Pizza</span><span className="font-bold text-gray-900">₹320</span></div>
                        <div className="flex justify-between py-0.5 text-gray-700"><span>Pasta Alfredo</span><span className="font-bold text-gray-900">₹280</span></div>
                        <div className="flex justify-between py-0.5 text-gray-700"><span>Grilled Chicken</span><span className="font-bold text-gray-900">₹340</span></div>
                      </div>

                      <div className="pt-2 flex justify-center items-center gap-1.5 text-amber-400 text-[10px]">
                        <span>✦</span>
                        <span>✦</span>
                        <span>✦</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -bottom-2 -left-3 z-20 w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
                    <img
                      src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=240"
                      alt="Pasta Bowl"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="absolute -bottom-4 right-4 z-20 flex flex-col items-center">
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-400 text-xs">↘</span>
                      <div className="w-4 h-4 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-xs">
                        <span className="text-[8px]">🌿</span>
                      </div>
                    </div>
                    <span className="font-serif italic font-bold text-xs text-gray-900 tracking-wide mt-0.5">
                      Freshly Made
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-xs flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 mt-0.5">
                <Lightbulb className="w-4 h-4 text-[#5844A8]" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-gray-900 mb-2">Why use templates?</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-[11px] text-gray-500 leading-relaxed">
                  <div>• Ready-to-use professional designs</div>
                  <div>• Save time with quick setup</div>
                  <div>• Easily customize to match your brand</div>
                  <div>• Ideal for cafes, restaurants and QSR brands</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 pb-4 border-t border-gray-100 flex items-center justify-between mt-8">
            <button
              onClick={() => setCurrentView('scan_ai_review')}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => {
                if (designMethodChoice === 'templates') {
                  setCurrentView('choose_template');
                } else {
                  showToast('AI Menu Generated! Returning to overview...');
                  setCurrentView('menu_overview');
                }
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STEP 6: CHOOSE TEMPLATE (8 template cards)                     */}
      {/* ============================================================== */}
      {currentView === 'choose_template' && (
        <div className="px-6 lg:px-12 pt-6 max-w-[1500px] w-full mx-auto flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
              <span className="hover:text-gray-700 cursor-pointer" onClick={() => setCurrentView('menu_overview')}>Home</span>
              <span>&gt;</span>
              <span className="hover:text-gray-700 cursor-pointer" onClick={() => setCurrentView('menu_overview')}>Menus</span>
              <span>&gt;</span>
              <span className="hover:text-gray-700 cursor-pointer" onClick={() => setCurrentView('design_menu_choice')}>Design Menu</span>
              <span>&gt;</span>
              <span className="text-gray-900 font-bold">Choose Template</span>
            </div>

            <div className="mb-6">
              <h1 className="text-3xl font-extrabold text-[#111827] flex items-center gap-2 tracking-tight">
                Choose Template <Sparkles className="w-5 h-5 text-pink-500 fill-pink-500" />
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Select a menu template and customize it with your brand colors, logo and images.
              </p>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => setSelectedTemplateTab('templates')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedTemplateTab === 'templates'
                    ? 'bg-[#5844A8] text-white shadow-xs'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Templates
              </button>
              <button
                onClick={() => setSelectedTemplateTab('my_templates')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedTemplateTab === 'my_templates'
                    ? 'bg-[#5844A8] text-white shadow-xs'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                My Templates
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { id: 'classic', name: 'Classic', bg: 'bg-[#FFFDF7]', dark: false },
                  { id: 'modern', name: 'Modern', bg: 'bg-white', dark: false },
                  { id: 'minimal', name: 'Minimal', bg: 'bg-[#FAFAFA]', dark: false },
                  { id: 'rustic', name: 'Rustic', bg: 'bg-[#1C1A1A]', dark: true },
                  { id: 'bold', name: 'Bold', bg: 'bg-[#161616]', dark: true },
                  { id: 'elegant', name: 'Elegant', bg: 'bg-[#FFFDF9]', dark: false },
                  { id: 'warm', name: 'Warm', bg: 'bg-[#FDF6E2]', dark: false },
                  { id: 'casual', name: 'Casual', bg: 'bg-white', dark: false },
                ].map((tpl) => {
                  const isSelected = selectedTemplateId === tpl.id;
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => setSelectedTemplateId(tpl.id)}
                      className={`rounded-2xl p-3 border-2 flex flex-col justify-between h-[210px] cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#5844A8] shadow-md ring-2 ring-purple-100'
                          : 'border-gray-200 hover:border-purple-200 bg-white'
                      }`}
                    >
                      <div className={`flex-1 rounded-xl p-2.5 flex flex-col justify-between ${tpl.bg} border border-gray-100 relative overflow-hidden`}>
                        <div className="text-center pt-1">
                          <p className={`font-serif tracking-widest text-[9px] font-bold uppercase ${tpl.dark ? 'text-amber-200' : 'text-gray-800'}`}>
                            MENU
                          </p>
                          <p className={`text-[6px] tracking-wider uppercase ${tpl.dark ? 'text-gray-400' : 'text-gray-400'}`}>
                            GOOD FOOD GOOD MOOD
                          </p>
                        </div>

                        <div className="flex justify-between items-center px-1">
                          <div className="w-5 h-5 rounded-full overflow-hidden border border-white/60 shadow-xs">
                            <img src="https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=80" alt="Food" className="w-full h-full object-cover" />
                          </div>
                          <div className="w-5 h-5 rounded-full overflow-hidden border border-white/60 shadow-xs">
                            <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=80" alt="Food" className="w-full h-full object-cover" />
                          </div>
                        </div>

                        <div className="space-y-1 px-1">
                          <div className={`h-1 rounded-full w-3/4 ${tpl.dark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                          <div className={`h-1 rounded-full w-1/2 ${tpl.dark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-800">{tpl.name}</span>
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                            isSelected
                              ? 'bg-[#5844A8] border-[#5844A8] text-white'
                              : 'border-gray-300'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="lg:col-span-4 flex flex-col items-center">
                <div className="relative w-full max-w-[340px]">
                  <div className="bg-[#FFFDF9] border border-amber-100 rounded-3xl p-6 shadow-xl rotate-[3deg] transition-transform hover:rotate-0">
                    <div className="text-center pb-3 border-b border-amber-100 mb-4">
                      <div className="w-8 h-8 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-1">
                        <span className="text-emerald-700 text-xs">🌿</span>
                      </div>
                      <h3 className="font-serif tracking-widest text-sm font-bold uppercase text-gray-900">
                        MENU
                      </h3>
                      <p className="text-[8px] tracking-widest uppercase text-gray-400">GOOD FOOD GOOD MOOD</p>
                    </div>

                    <div className="space-y-3 text-[11px]">
                      <div>
                        <p className="text-[9px] font-extrabold uppercase tracking-wider text-amber-900 mb-1">STARTERS</p>
                        <div className="flex justify-between py-0.5 text-gray-700"><span>Bruschetta</span><span className="font-bold">₹220</span></div>
                        <div className="flex justify-between py-0.5 text-gray-700"><span>Garlic Bread</span><span className="font-bold">₹180</span></div>
                        <div className="flex justify-between py-0.5 text-gray-700"><span>Loaded Nachos</span><span className="font-bold">₹240</span></div>
                      </div>

                      <div className="pt-1">
                        <p className="text-[9px] font-extrabold uppercase tracking-wider text-amber-900 mb-1">MAIN COURSE</p>
                        <div className="flex justify-between py-0.5 text-gray-700"><span>Margherita Pizza</span><span className="font-bold">₹320</span></div>
                        <div className="flex justify-between py-0.5 text-gray-700"><span>Pasta Alfredo</span><span className="font-bold">₹280</span></div>
                        <div className="flex justify-between py-0.5 text-gray-700"><span>Grilled Chicken</span><span className="font-bold">₹340</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center -mt-6 relative z-10">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
                        <img
                          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=200"
                          alt="Freshly made pasta"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="absolute -left-12 top-4 font-serif italic font-bold text-xs text-purple-900 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full shadow-xs">
                        Freshly Made
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 pb-4 border-t border-gray-100 flex items-center justify-between mt-8">
            <button
              onClick={() => setCurrentView('design_menu_choice')}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => {
                showToast('Menu Published Successfully!');
                setCurrentView('menu_overview');
              }}
              className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STEP 7: MENU OVERVIEW (Active Menu Dashboard)                  */}
      {/* ============================================================== */}
      {currentView === 'menu_overview' && (
        <div className="px-6 lg:px-12 pt-6 max-w-[1600px] w-full mx-auto space-y-6">
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] flex items-center gap-2 tracking-tight">
                <Sparkles className="w-5 h-5 text-purple-600 fill-purple-600" />
                Menu Overview
                <Sparkles className="w-4 h-4 text-pink-500 fill-pink-500" />
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Manage your menu, update items and keep your offerings fresh.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start lg:self-auto">
              {/* Outlet Active Badge Card */}
              <div className="bg-white border border-gray-200/80 rounded-2xl px-3.5 py-2 flex items-center gap-3 shadow-xs">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=80"
                  alt="The Urban Kitchen"
                  className="w-8 h-8 rounded-xl object-cover"
                />
                <div className="text-left">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Menu Active</span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 leading-tight">The Urban Kitchen</h4>
                  <p className="text-[9px] text-gray-400">Last updated 12 Apr 2025, 2:30 PM</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-1" />
              </div>

              {/* Add Menu Item Button */}
              <button
                onClick={() => setCurrentView('create_menu_choice')}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add Menu Item</span>
              </button>
            </div>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between h-36">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-pink-50 flex items-center justify-center">
                  <Tag className="w-3.5 h-3.5 text-pink-600" />
                </div>
                <span className="text-xs font-bold text-gray-500">Total Categories</span>
              </div>
              <div>
                <span className="text-3xl font-black text-gray-900 tracking-tight">{categoriesList.length}</span>
                <p className="text-[11px] font-semibold text-gray-400 mt-0.5">+2 this month</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between h-36">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <span className="text-xs font-bold text-gray-500">Total Items</span>
              </div>
              <div>
                <span className="text-3xl font-black text-gray-900 tracking-tight">{menuItemsList.length}</span>
                <p className="text-[11px] font-semibold text-gray-400 mt-0.5">86% active</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between h-36">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-amber-50 flex items-center justify-center">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <span className="text-xs font-bold text-gray-500">Media added</span>
              </div>
              <div>
                <span className="text-3xl font-black text-gray-900 tracking-tight">12</span>
                <p className="text-[11px] font-semibold text-gray-400 mt-0.5">Awaiting response</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between h-36">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-gray-100 flex items-center justify-center">
                  <FolderArchive className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <span className="text-xs font-bold text-gray-500">Items Archive</span>
              </div>
              <div>
                <span className="text-3xl font-black text-gray-900 tracking-tight">0</span>
                <p className="text-[11px] font-semibold text-gray-400 mt-0.5">—</p>
              </div>
            </div>
          </div>

          {/* Main Grid: Categories Table & Promo Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-base font-bold text-gray-900">Categories</h3>
                <div className="flex items-center gap-2">
                  <div className="relative w-full sm:w-60">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={overviewSearchQuery}
                      onChange={(e) => setOverviewSearchQuery(e.target.value)}
                      placeholder="Search categories, items..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#5844A8]"
                    />
                  </div>
                  <div className="relative">
                    <select
                      value={activeCategoryFilter}
                      onChange={(e) => setActiveCategoryFilter(e.target.value)}
                      className="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 pr-7 appearance-none cursor-pointer focus:outline-none"
                    >
                      <option value="All">All Categories</option>
                      <option value="Starters">Starters</option>
                      <option value="Main Course">Main Course</option>
                      <option value="Pizzas">Pizzas</option>
                      <option value="Pastas">Pastas</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Desserts">Desserts</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {['All (8)', 'Starters (6)', 'Main Course (14)', 'Pizzas (8)', 'Pastas (6)', 'Beverages (6)', 'Dessert'].map((pill) => {
                  const pillKey = pill.split(' ')[0];
                  const isActive = activeCategoryFilter === pillKey || (pillKey === 'All' && activeCategoryFilter === 'All');
                  return (
                    <button
                      key={pill}
                      onClick={() => setActiveCategoryFilter(pillKey)}
                      className={`px-3.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#5844A8] text-white shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {pill}
                    </button>
                  );
                })}
              </div>

              {/* Table Data */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden">
                <div className="bg-gray-50/70 px-4 py-2.5 grid grid-cols-12 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <span className="col-span-5 pl-8">Category</span>
                  <span className="col-span-2 text-center">Items</span>
                  <span className="col-span-1 text-center">Media</span>
                  <span className="col-span-2 text-center">Status</span>
                  <span className="col-span-2 text-right pr-2">Actions</span>
                </div>

                <div className="divide-y divide-gray-50">
                  {filteredCategories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setActiveManualCategory(cat.id);
                        setCurrentView('manual_items_list');
                      }}
                      className="px-4 py-3 grid grid-cols-12 items-center hover:bg-purple-50/20 transition-colors cursor-pointer group text-xs"
                    >
                      <div className="col-span-5 flex items-center gap-3">
                        <GripVertical className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-400 shrink-0" />
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: cat.badgeBg }}
                        >
                          {renderCategoryIcon(cat.iconType)}
                        </div>
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-10 h-10 rounded-xl object-cover shrink-0 border border-gray-100"
                        />
                        <div>
                          <h4 className="font-bold text-gray-900 group-hover:text-[#5844A8] transition-colors">
                            {cat.name}
                          </h4>
                          <p className="text-[10px] text-gray-400 line-clamp-1">{cat.description}</p>
                        </div>
                      </div>

                      <div className="col-span-2 text-center font-bold text-gray-800">
                        {cat.itemCount}
                      </div>

                      <div className="col-span-1 text-center text-gray-500 font-semibold">
                        {cat.mediaCount}
                      </div>

                      <div className="col-span-2 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          Active
                        </span>
                      </div>

                      <div className="col-span-2 text-right pr-2 flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setActiveManualCategory(cat.id);
                            setCurrentView('manual_items_list');
                          }}
                          className="p-1 text-gray-400 hover:text-[#5844A8] rounded transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteCategory(cat.id)}
                          className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Promo Banner Card */}
            <div className="lg:col-span-4 bg-[#F2EBFF]/60 rounded-3xl p-6 border border-purple-100 shadow-xs flex flex-col justify-between h-[520px] relative overflow-hidden">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-purple-700">
                    CREATE DELICIOUS EXPERIENCES
                  </span>
                  <div className="w-6 h-6 rounded-full bg-teal-400/80 flex items-center justify-center">
                    <span className="text-[10px] text-white">🌿</span>
                  </div>
                </div>

                <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-tight mb-2">
                  Build a Menu Your Customers Will Love
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-6">
                  Organize categories, add items, update prices and showcase mouth-watering images.
                </p>
              </div>

              <div className="rounded-2xl overflow-hidden shadow-md mt-auto">
                <img
                  src="https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=500"
                  alt="Delicious food display"
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MANUAL FLOW STEP 2: CATEGORIES LIST                           */}
      {/* ============================================================== */}
      {currentView === 'manual_categories' && (
        <div className="px-6 lg:px-12 pt-6 max-w-[1400px] w-full mx-auto flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
              <span className="hover:text-gray-700 cursor-pointer" onClick={() => setCurrentView('menu_overview')}>Home</span>
              <span>&gt;</span>
              <span className="hover:text-gray-700 cursor-pointer" onClick={() => setCurrentView('menu_overview')}>Menus</span>
              <span>&gt;</span>
              <span className="hover:text-gray-700 cursor-pointer" onClick={() => setCurrentView('create_menu_choice')}>Create Menu</span>
              <span>&gt;</span>
              <span className="text-gray-900 font-bold hover:text-[#5844A8] cursor-pointer" onClick={() => setCurrentView('manual_categories')}>Categories</span>
            </div>

            <div className="mb-6">
              <h1 className="text-3xl font-extrabold text-[#111827] flex items-center gap-2 tracking-tight">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Add Menu Manually
                <Sparkles className="w-4 h-4 text-pink-500" />
              </h1>
              <p className="text-sm text-gray-500 mt-1">Add categories for your menu items.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-3">
                <h3 className="text-sm font-bold text-gray-900 mb-2">Menu Categories</h3>

                {categoriesList.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setActiveManualCategory(cat.id);
                      setCurrentView('manual_items_list');
                    }}
                    className="flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-2xl shadow-xs hover:border-[#5844A8] hover:shadow-xs transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical
                        className="w-4 h-4 text-gray-300 group-hover:text-gray-400 cursor-grab"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: cat.badgeBg }}
                      >
                        {renderCategoryIcon(cat.iconType)}
                      </div>
                      <span className="text-xs font-bold text-gray-900 group-hover:text-[#5844A8] transition-colors">
                        {cat.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCategory(cat.id);
                        }}
                        className="p-1.5 text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#5844A8] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => {
                    const newCatName = prompt('Enter new category name:');
                    if (newCatName && newCatName.trim()) {
                      const newCat: CategoryRecord = {
                        id: 'cat-' + Date.now(),
                        name: newCatName.trim(),
                        description: 'New menu section',
                        itemCount: 0,
                        mediaCount: 0,
                        status: 'Active',
                        lastUpdated: 'Just now',
                        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300',
                        iconType: 'soup',
                        badgeBg: '#FCE7F3',
                      };
                      setCategoriesList((prev) => [...prev, newCat]);
                      showToast(`Added category "${newCatName}"`);
                    }
                  }}
                  className="w-full py-3 border-2 border-dashed border-purple-200 hover:border-[#5844A8] rounded-2xl text-xs font-bold text-[#5844A8] bg-[#FAF8FF] hover:bg-purple-50 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Add Category</span>
                </button>
              </div>

              <div className="lg:col-span-5 flex items-center justify-center pt-8">
                <div className="relative w-80 h-80 rounded-full bg-purple-100/60 p-4 flex items-center justify-center">
                  <div className="w-64 h-64 rounded-full overflow-hidden shadow-2xl border-4 border-white">
                    <img
                      src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=600"
                      alt="Gourmet Pasta Bowl"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="absolute top-4 right-4 w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=150"
                      alt="Fresh salad"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="absolute bottom-6 right-8 w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=100"
                      alt="Garnish"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 pb-4 border-t border-gray-100 flex items-center justify-between mt-8">
            <button
              onClick={() => setCurrentView('create_menu_choice')}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentView('manual_items_list')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MANUAL FLOW STEP 3: CATEGORY ITEMS LIST                        */}
      {/* ============================================================== */}
      {currentView === 'manual_items_list' && (
        <div className="px-6 lg:px-12 pt-6 max-w-[1400px] w-full mx-auto flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
              <span className="hover:text-gray-700 cursor-pointer" onClick={() => setCurrentView('menu_overview')}>Home</span>
              <span>&gt;</span>
              <span className="hover:text-gray-700 cursor-pointer" onClick={() => setCurrentView('menu_overview')}>Menus</span>
              <span>&gt;</span>
              <span className="hover:text-gray-700 cursor-pointer" onClick={() => setCurrentView('create_menu_choice')}>Create Menu</span>
              <span>&gt;</span>
              <span className="text-gray-900 font-bold hover:text-[#5844A8] cursor-pointer" onClick={() => setCurrentView('manual_categories')}>Categories</span>
            </div>

            <div className="mb-6">
              <h1 className="text-3xl font-extrabold text-[#111827] flex items-center gap-2 tracking-tight">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Add Menu Manually
                <Sparkles className="w-4 h-4 text-pink-500" />
              </h1>
              <p className="text-sm text-gray-500 mt-1">Add categories for your menu items.</p>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
              {categoriesList.map((cat) => {
                const count = menuItemsList.filter((i) => i.categoryId === cat.id).length;
                const isActive = activeManualCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveManualCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#5844A8] text-white shadow-xs'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>

            <div className="space-y-3 max-w-4xl">
              {activeCategoryItems.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs">
                  <Utensils className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-gray-800">No items added yet in this category</h4>
                  <p className="text-xs text-gray-400 mt-1 mb-4">Click below to add your first menu item.</p>
                </div>
              ) : (
                activeCategoryItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-3xl shadow-xs hover:border-purple-200 transition-all"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <GripVertical className="w-4 h-4 text-gray-300 cursor-grab shrink-0" />
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-gray-100 shadow-xs"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-gray-900 leading-tight">{item.name}</h4>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 shrink-0 pl-4">
                      <span className="text-sm font-black text-gray-900">₹{item.price}</span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setNewItemForm({
                              name: item.name,
                              description: item.description,
                              category: item.categoryName,
                              price: item.price,
                              available: item.available,
                              image: item.image,
                              showAdditionalOptions: false,
                            });
                            setCurrentView('manual_add_item');
                          }}
                          className="p-1.5 text-gray-400 hover:text-[#5844A8] rounded transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteMenuItem(item.id)}
                          className="p-1.5 text-gray-300 hover:text-red-500 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => toggleItemAvailability(item.id)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                          item.available ? 'bg-[#5844A8]' : 'bg-gray-200'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            item.available ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                ))
              )}

              <button
                onClick={() => {
                  const catName = categoriesList.find((c) => c.id === activeManualCategory)?.name || 'Starters';
                  setNewItemForm({
                    name: '',
                    description: '',
                    category: catName,
                    price: 250,
                    available: true,
                    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300',
                    showAdditionalOptions: false,
                  });
                  setCurrentView('manual_add_item');
                }}
                className="w-full py-3.5 border-2 border-dashed border-purple-200 hover:border-[#5844A8] rounded-3xl text-xs font-bold text-[#5844A8] bg-[#FAF8FF] hover:bg-purple-50 flex items-center justify-center gap-2 transition-all cursor-pointer mt-4"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>
                  Add Item to {categoriesList.find((c) => c.id === activeManualCategory)?.name || 'Category'}
                </span>
              </button>
            </div>
          </div>

          <div className="pt-8 pb-4 border-t border-gray-100 flex items-center justify-between mt-8">
            <button
              onClick={() => setCurrentView('manual_categories')}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentView('design_menu_choice')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MANUAL FLOW STEP 4: ITEM FORM                                 */}
      {/* ============================================================== */}
      {currentView === 'manual_add_item' && (
        <div className="px-6 lg:px-12 pt-6 max-w-[1400px] w-full mx-auto flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
              <span className="hover:text-gray-700 cursor-pointer" onClick={() => setCurrentView('menu_overview')}>Home</span>
              <span>&gt;</span>
              <span className="hover:text-gray-700 cursor-pointer" onClick={() => setCurrentView('menu_overview')}>Menus</span>
              <span>&gt;</span>
              <span className="hover:text-gray-700 cursor-pointer" onClick={() => setCurrentView('create_menu_choice')}>Create Menu</span>
              <span>&gt;</span>
              <span className="text-gray-900 font-bold hover:text-[#5844A8] cursor-pointer" onClick={() => setCurrentView('manual_categories')}>Categories</span>
            </div>

            <div className="mb-6">
              <h1 className="text-3xl font-extrabold text-[#111827] flex items-center gap-2 tracking-tight">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Add Menu Manually
                <Sparkles className="w-4 h-4 text-pink-500" />
              </h1>
              <p className="text-sm text-gray-500 mt-1">Add categories for your menu items.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-xs space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-2">Item Image</label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-40 h-28 rounded-2xl overflow-hidden border border-gray-100 shadow-xs shrink-0 group">
                      <img
                        src={newItemForm.image}
                        alt="Item Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => setNewItemForm({ ...newItemForm, image: '' })}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div
                      onClick={() => itemImageInputRef.current?.click()}
                      className="flex-1 h-28 border-2 border-dashed border-purple-200 hover:border-[#5844A8] rounded-2xl p-4 flex flex-col items-center justify-center text-center bg-[#FAF8FF] hover:bg-purple-50/50 transition-all cursor-pointer"
                    >
                      <input
                        type="file"
                        ref={itemImageInputRef}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setNewItemForm({
                              ...newItemForm,
                              image: URL.createObjectURL(e.target.files[0]),
                            });
                          }
                        }}
                        className="hidden"
                      />
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mb-1">
                        <Upload className="w-4 h-4 text-[#5844A8]" />
                      </div>
                      <span className="text-xs font-bold text-[#5844A8]">Add Image / Video</span>
                      <span className="text-[10px] text-gray-400 mt-0.5">PNG, JPG, MP4 (Max 10MB)</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1.5">Item Name *</label>
                  <input
                    type="text"
                    value={newItemForm.name}
                    onChange={(e) => setNewItemForm({ ...newItemForm, name: e.target.value })}
                    placeholder="e.g. Margherita Pizza"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-900 focus:outline-none focus:border-[#5844A8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1.5">Description</label>
                  <textarea
                    rows={2}
                    value={newItemForm.description}
                    onChange={(e) => setNewItemForm({ ...newItemForm, description: e.target.value })}
                    placeholder="Describe ingredients, cooking style..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-900 focus:outline-none focus:border-[#5844A8]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5">Category *</label>
                    <div className="relative">
                      <select
                        value={newItemForm.category}
                        onChange={(e) => setNewItemForm({ ...newItemForm, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-900 focus:outline-none focus:border-[#5844A8] appearance-none cursor-pointer"
                      >
                        {categoriesList.map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5">Price *</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={newItemForm.price}
                        onChange={(e) => setNewItemForm({ ...newItemForm, price: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-900 focus:outline-none focus:border-[#5844A8]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-bold text-gray-900">Available</span>
                  <button
                    onClick={() => setNewItemForm({ ...newItemForm, available: !newItemForm.available })}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                      newItemForm.available ? 'bg-[#5844A8]' : 'bg-gray-200'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        newItemForm.available ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="border border-purple-100 rounded-2xl overflow-hidden bg-purple-50/20">
                  <button
                    onClick={() =>
                      setNewItemForm({
                        ...newItemForm,
                        showAdditionalOptions: !newItemForm.showAdditionalOptions,
                      })
                    }
                    className="w-full p-3.5 flex items-center justify-between text-xs font-bold text-gray-700 hover:bg-purple-50/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Sliders className="w-3.5 h-3.5 text-[#5844A8]" />
                      <span>Additional Options</span>
                    </div>
                    {newItemForm.showAdditionalOptions ? (
                      <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    )}
                  </button>

                  {newItemForm.showAdditionalOptions && (
                    <div className="p-4 pt-1 space-y-3 text-xs text-gray-600 border-t border-purple-100/60">
                      <div>
                        <span className="font-semibold block mb-1">Serving Sizes:</span>
                        <div className="flex gap-2">
                          {['Regular', 'Medium', 'Large'].map((sz) => (
                            <span key={sz} className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg font-bold text-[11px]">
                              {sz}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="font-semibold block mb-1">Spice Level:</span>
                        <div className="flex gap-2">
                          {['Mild', 'Medium', 'Spicy 🌶️'].map((sp) => (
                            <span key={sp} className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg font-bold text-[11px]">
                              {sp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-5 flex items-center justify-center pt-8">
                <div className="relative w-80 h-80 rounded-full bg-purple-100/40 p-4 flex items-center justify-center">
                  <div className="w-64 h-64 rounded-full overflow-hidden shadow-2xl border-4 border-white">
                    <img
                      src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600"
                      alt="Artisan Woodfired Pizza"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="absolute top-4 left-4 w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=150"
                      alt="Ripe Tomato"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="absolute bottom-6 right-6 w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=150"
                      alt="Fresh herbs"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 pb-4 border-t border-gray-100 flex items-center justify-between mt-8">
            <button
              onClick={() => setCurrentView('manual_items_list')}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleSaveManualItem}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              <span>Save &amp; Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Category Items Modal inside Review & Edit */}
      {selectedReviewCategory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: selectedReviewCategory.badgeBg }}
                >
                  {renderCategoryIcon(selectedReviewCategory.iconType)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{selectedReviewCategory.name}</h3>
                  <p className="text-xs text-gray-400">{selectedReviewCategory.itemCount} extracted items</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReviewCategory(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {selectedReviewCategory.items.map((it) => (
                <div
                  key={it.id}
                  className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      value={it.name}
                      onChange={(e) => {
                        const newName = e.target.value;
                        setReviewCategories((prev) =>
                          prev.map((c) =>
                            c.id === selectedReviewCategory.id
                              ? {
                                  ...c,
                                  items: c.items.map((i) => (i.id === it.id ? { ...i, name: newName } : i))
                                }
                              : c
                          )
                        );
                      }}
                      className="text-xs font-bold text-gray-900 bg-transparent border-b border-transparent focus:border-[#5844A8] focus:outline-none w-full mb-0.5"
                    />
                    <p className="text-[11px] text-gray-400">{it.description}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-xs font-bold text-gray-400">₹</span>
                    <input
                      type="number"
                      value={it.price}
                      onChange={(e) => {
                        const newPrice = parseFloat(e.target.value) || 0;
                        setReviewCategories((prev) =>
                          prev.map((c) =>
                            c.id === selectedReviewCategory.id
                              ? {
                                  ...c,
                                  items: c.items.map((i) => (i.id === it.id ? { ...i, price: newPrice } : i))
                                }
                              : c
                          )
                        );
                      }}
                      className="w-16 px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-900 text-right focus:border-[#5844A8] focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => {
                  setSelectedReviewCategory(null);
                  showToast('Category updates saved');
                }}
                className="px-5 py-2 rounded-xl bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export interface ItemCatalogPageProps {
  onNavigate?: (route: any) => void;
}

export const ItemCatalogPage: React.FC<ItemCatalogPageProps> = (props) => {
  const [isTabletOrMobile, setIsTabletOrMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'tablet' || params.get('device') === 'tablet') return true;
      return window.innerWidth < 1024;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      const params = new URLSearchParams(window.location.search);
      if (!params.get('view') && !params.get('device')) {
        setIsTabletOrMobile(window.innerWidth < 1024);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isTabletOrMobile) {
    return <TabletMenuView onNavigate={props.onNavigate} />;
  }

  return <WebItemCatalogView />;
};

export default ItemCatalogPage;
