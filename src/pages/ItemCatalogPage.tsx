import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Upload,
  Plus,
  TrendingUp,
  ShoppingCart,
  Search,
  SlidersHorizontal,
  ChevronDown,
  X,
  Check,
  ImageIcon,
  Award
} from 'lucide-react';
import { AddItemModal } from '../components/AddItemModal';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import {
  fetchProducts,
  addProduct,
  updateProduct,
  toggleItemSelection,
  selectAllItems,
  deselectAllItems,
  CatalogItem
} from '../store/slices/catalogSlice';

export const ItemCatalogPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, isLoading } = useSelector((state: RootState) => state.catalog);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loyaltyIntegration, setLoyaltyIntegration] = useState(true);
  const [addLoyaltyIntegration, setAddLoyaltyIntegration] = useState(false);

  // Filters & Sorting
  const [activeFilter, setActiveFilter] = useState('All Items');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Highest Grossing');

  // Add Modal state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && editingItem) {
      const file = e.target.files[0];
      setEditingItem({ ...editingItem, image: URL.createObjectURL(file) });
    }
  };

  const handleAddItem = (item: any) => {
    if (!item.branch) {
      setToastMessage('Branch selection is required');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    
    const newItem: CatalogItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: item.title,
      category: item.category,
      sku: item.sku || `#SKU-${Math.floor(Math.random() * 10000)}`,
      price: parseFloat(item.price) || 0,
      cost: parseFloat(item.cost) || 0,
      image: item.image || 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=200',
      selected: false,
    };

    dispatch(addProduct(newItem));
    setIsAddModalOpen(false);
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;
    if (!editingItem.branch) {
      setToastMessage('Branch selection is required');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    dispatch(updateProduct({ id: editingItem.id, data: editingItem }));
  };

  const editCalculatedMargin = useMemo(() => {
    if (!editingItem) return '-';
    const price = editingItem.price;
    const cost = editingItem.cost;
    if (!isNaN(price) && !isNaN(cost) && price > 0) {
      return (((price - cost) / price) * 100).toFixed(1) + '%';
    }
    return '-';
  }, [editingItem?.price, editingItem?.cost]);

  const processedItems = useMemo(() => {
    let result = [...items];

    if (activeFilter !== 'All Items') {
      result = result.filter(item => item.category === activeFilter);
    }

    if (searchQuery.trim() !== '') {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        item =>
          item.title.toLowerCase().includes(lowerQuery) ||
          item.sku.toLowerCase().includes(lowerQuery) ||
          item.category.toLowerCase().includes(lowerQuery)
      );
    }

    if (sortBy === 'Highest Grossing' || sortBy === 'Price: High to Low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'A-Z') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'Price: Low to High') {
      result.sort((a, b) => a.price - b.price);
    }

    return result;
  }, [items, activeFilter, searchQuery, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery, sortBy]);

  const totalPages = Math.ceil(processedItems.length / itemsPerPage);
  const paginatedItems = processedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categories = [
    { name: 'All Items', count: items.length },
    { name: 'Single Origin Coffee', count: items.filter(i => i.category === 'Single Origin Coffee').length },
    { name: 'Tasting Flights', count: items.filter(i => i.category === 'Tasting Flights').length },
    { name: 'Artisanal Bakery', count: items.filter(i => i.category === 'Artisanal Bakery').length }
  ];

  const toggleSelectAll = () => {
    const allSelected = paginatedItems.length > 0 && paginatedItems.every((i) => i.selected);
    if (allSelected) {
      dispatch(deselectAllItems());
    } else {
      dispatch(selectAllItems());
    }
  };

  const toggleSelect = (id: string) => {
    dispatch(toggleItemSelection(id));
  };

  return (
    <div className="p-4 lg:p-6 max-w-[1600px] mx-auto space-y-6 flex flex-col h-full font-sans relative">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[60] bg-[#DC2626] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold border border-[#991B1B] animate-in slide-in-from-bottom-5 fade-in">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#1A1615] mb-1.5">
            Item & Product Catalog
          </h1>
          <p className="text-[13px] text-[#6E6A66] max-w-2xl leading-relaxed">
            Curate your roastery offerings, seasonal tasting flights, single-origin retail bags, and POS menu availability across all salon destinations.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 self-start lg:self-auto">
          <button className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-[#1A1615] bg-white border border-[#EAE6E1] hover:bg-[#FAF8F5] rounded-lg transition-colors shadow-sm cursor-pointer">
            <Upload className="w-4 h-4" />
            Bulk Import CSV
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-white bg-gradient-to-r from-[#D4A753] to-[#9E782F] hover:opacity-95 rounded-lg transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            Add New Item
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      {items.length > 0 && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-5 border border-[#EAE6E1] shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FAF8F5] rounded-bl-[100px] -z-10" />
          <div>
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#6E6A66] truncate pr-2">ACTIVE MENU ITEMS</h3>
              <div className="w-8 h-8 shrink-0 rounded-lg bg-[#FAF8F5] border border-[#EAE6E1] flex items-center justify-center">
                <Plus className="w-4 h-4 text-[#8C827A]" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-black text-[#1A1615] tracking-tight">{items.length}</span>
              <span className="text-[11px] font-bold text-[#15803D] flex items-center gap-0.5">
                Up to date
              </span>
            </div>
          </div>
          <div className="pt-3 border-t border-[#EAE6E1] flex items-center justify-between text-xs">
            <span className="text-[#6E6A66]">POS Synchronization</span>
            <span className="font-bold text-[#15803D] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
              94% In-Stock (3 Salons)
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-5 border border-[#EAE6E1] shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FDF8EB] rounded-bl-[100px] -z-10" />
          <div>
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#6E6A66] truncate pr-2">TOP REVENUE PERFORMER</h3>
              <div className="w-8 h-8 shrink-0 rounded-lg bg-[#FDF8EB] border border-[#F3E5C8] flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-[#B38637]" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-[22px] font-black text-[#1A1615] tracking-tight">{items[0]?.title || 'None'}</span>
              <span className="text-[13px] font-bold text-[#B38637] ml-2">₹{items[0]?.price || 0}</span>
            </div>
          </div>
          <div className="pt-3 border-t border-[#EAE6E1] flex items-center justify-between text-xs">
            <span className="text-[#6E6A66]">Margin: <span className="font-bold text-[#1A1615]">{(items[0]?.cost ? ((items[0].price - items[0].cost) / items[0].price * 100).toFixed(1) : 0)}%</span></span>
            <span className="font-bold text-[#1A1615]">Trending ↑</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#FFF8F8] rounded-2xl p-5 border border-[#FEE2E2] shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FEF2F2] rounded-bl-[100px] -z-10" />
          <div>
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#6E6A66] truncate pr-2">LOW INVENTORY ALERTS</h3>
              <div className="w-8 h-8 shrink-0 rounded-lg bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-[#DC2626]" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-black text-[#DC2626] tracking-tight">0 Items</span>
              <span className="bg-[#E0F9ED] text-[#0D7A53] text-[10px] font-bold px-2 py-0.5 rounded border border-[#0D7A53]/30 ml-2">All Good</span>
            </div>
          </div>
          <div className="pt-3 border-t border-[#FECACA] flex items-center justify-between text-xs">
            <span className="text-[#6E6A66] truncate max-w-[200px]">No critical shortages</span>
            <span className="font-bold text-[#B38637] cursor-pointer hover:underline">Reorder</span>
          </div>
        </div>
      </div>
      )}

      {/* TABS & FILTERS */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveFilter(cat.name)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${activeFilter === cat.name
                ? 'bg-[#1A1615] text-white shadow-sm'
                : 'bg-[#FAF8F5] border border-[#EAE6E1] text-[#6E6A66] hover:text-[#1A1615]'
                }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 w-full xl:w-auto shrink-0">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C827A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter item name, SKU or origin..."
              className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#EAE6E1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#B38637] transition-colors"
            />
          </div>
          <button className="w-9 h-9 flex items-center justify-center bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg hover:bg-[#EAE6E1] transition-colors shrink-0 cursor-pointer">
            <SlidersHorizontal className="w-4 h-4 text-[#6E6A66]" />
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-col lg:flex-row flex-1 gap-6 min-h-0">

        {/* Table Area */}
        <div className="flex-1 bg-white rounded-2xl border border-[#EAE6E1] shadow-sm flex flex-col overflow-hidden">
          {/* Table Header Controls */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-5 py-4 border-b border-[#EAE6E1] bg-[#FAF8F5]/50">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={paginatedItems.length > 0 && paginatedItems.every((i) => i.selected)}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded border-[#D1CDC7] text-[#B38637] focus:ring-[#B38637] cursor-pointer"
              />
              <span className="text-[11px] font-bold text-[#8C827A] uppercase tracking-wider">
                SHOWING {paginatedItems.length} OF {items.length} ITEMS
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs relative group">
              <span className="text-[#8C827A]">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="font-bold text-[#1A1615] bg-transparent flex items-center gap-1 hover:bg-[#EAE6E1] px-2 py-1 rounded cursor-pointer transition-colors focus:outline-none appearance-none pr-6"
              >
                <option value="Highest Grossing">Highest Grossing</option>
                <option value="A-Z">A-Z</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2 pointer-events-none text-[#1A1615]" />
            </div>
          </div>

          <div className="px-5 py-3 border-b border-[#EAE6E1] bg-white">
            <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
              <div className="w-4"></div>
              <span className="text-[10px] font-bold text-[#8C827A] uppercase tracking-wider pl-[56px]">
                PRODUCT & SKU
              </span>
            </div>
          </div>

          {/* Table Body */}
          <div className="flex-1 overflow-y-auto">
            {paginatedItems.length === 0 ? (
              <div className="p-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-[#FDF8EB] rounded-full flex items-center justify-center mb-4 border border-[#F3E5C8]">
                  <ShoppingCart className="w-8 h-8 text-[#D4A753]" />
                </div>
                <h4 className="text-[#1A1615] font-bold text-lg mb-2">
                  {items.length === 0 ? "Your catalog is empty" : "No items found"}
                </h4>
                <p className="text-[#8C827A] text-sm max-w-sm mb-6">
                  {items.length === 0 
                    ? "Start adding products, seasonal tastings, and artisanal bakery items to build your catalog."
                    : "We couldn't find any items matching your current filters. Try adjusting your search criteria."}
                </p>
              </div>
            ) : paginatedItems.map((item) => (
              <div
                key={item.id}
                className={`group flex items-center gap-4 px-5 py-4 border-b border-[#F2EFE9] last:border-b-0 transition-colors hover:bg-[#FAF8F5] cursor-pointer ${item.selected ? 'bg-[#FAF8F5]' : 'bg-white'
                  }`}
                onClick={() => setEditingItem(item)}
              >
                <div onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => toggleSelect(item.id)}
                    className="w-4 h-4 rounded border-[#D1CDC7] text-[#B38637] focus:ring-[#B38637] cursor-pointer"
                  />
                </div>
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#EAE6E1]">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1A1615] group-hover:text-[#A37837] transition-colors">{item.title}</h4>
                    <p className="text-[11px] font-bold text-[#8C827A] mt-0.5">{item.sku}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Footer */}
          <div className="px-5 py-3 border-t border-[#EAE6E1] bg-[#FAF8F5]/50 flex flex-col sm:flex-row items-center sm:justify-between gap-3 sm:gap-0 text-xs text-[#6E6A66]">
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              <span>Per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="bg-white border border-[#EAE6E1] rounded px-2 py-1 font-bold text-[#1A1615] focus:outline-none focus:border-[#B38637]"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div className="text-center w-full sm:w-auto">
              {processedItems.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, processedItems.length)} of {processedItems.length} items
            </div>
            <div className="flex items-center gap-1 w-full sm:w-auto justify-center sm:justify-end">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#EAE6E1] disabled:opacity-50 text-[#1A1615] cursor-pointer"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                // Show a limited number of pages to prevent overflow
                if (
                  totalPages > 5 &&
                  i !== 0 &&
                  i !== totalPages - 1 &&
                  Math.abs(currentPage - 1 - i) > 1
                ) {
                  if (i === 1 || i === totalPages - 2) {
                    return <span key={i} className="px-1 text-[#8C827A]">...</span>;
                  }
                  return null;
                }
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-7 h-7 flex items-center justify-center rounded font-bold cursor-pointer ${currentPage === i + 1
                      ? 'bg-[#1A1615] text-white'
                      : 'hover:bg-[#EAE6E1] text-[#1A1615]'
                      }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#EAE6E1] disabled:opacity-50 text-[#1A1615] cursor-pointer"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>

        {/* Right Drawer (Edit Item) */}
        {editingItem && (
          <div className="w-full lg:w-[400px] xl:w-[500px] shrink-0 bg-white rounded-2xl border border-[#EAE6E1] shadow-xl flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b border-[#EAE6E1] flex items-start justify-between bg-white relative z-10">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <SlidersHorizontal className="w-4 h-4 text-[#B38637]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#1A1615] leading-tight">Edit Item: {editingItem.title}</h2>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">

              {/* Product Asset */}
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#6E6A66] mb-3">PRODUCT ASSET & PRESENTATION</h3>
                <div className="bg-[#FAF8F5] border border-[#EAE6E1] rounded-xl p-3 flex gap-4">
                  <input
                    type="file"
                    ref={editFileInputRef}
                    onChange={handleEditImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-[#D1CDC7] relative bg-white">
                    <img src={editingItem.image} alt={editingItem.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] font-bold px-1 rounded">RAW</span>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-xs font-bold text-[#1A1615] mb-1">product_image.jpg</p>
                    <p className="text-[10px] text-[#8C827A] mb-3">1.4 MB • 2400 × 2400 px</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => editFileInputRef.current?.click()}
                        className="px-4 py-2 text-[13px] font-bold text-[#1A1615] bg-white border border-[#EAE6E1] rounded-lg shadow-sm hover:bg-[#F2EFE9] transition-colors cursor-pointer"
                      >
                        Change Image
                      </button>
                      <button
                        onClick={() => setEditingItem({ ...editingItem, image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=200' })}
                        className="text-[13px] font-bold text-[#DC2626] hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#1A1615] mb-1.5">Item Title</label>
                  <input type="text" value={editingItem.title} onChange={e => setEditingItem({ ...editingItem, title: e.target.value })} className="w-full bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg px-3 py-2.5 text-[13px] text-[#1A1615] focus:outline-none focus:border-[#B38637]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#1A1615] mb-1.5">Branch</label>
                    <select value={editingItem.branch || ''} onChange={e => setEditingItem({ ...editingItem, branch: e.target.value })} className="w-full bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg px-3 py-2.5 text-[13px] text-[#1A1615] focus:outline-none focus:border-[#B38637] appearance-none cursor-pointer">
                      <option value="" disabled>Select branch</option>
                      <option value="Downtown Flagship">Downtown Flagship</option>
                      <option value="Northside Mall">Northside Mall</option>
                      <option value="West End Kiosk">West End Kiosk</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#1A1615] mb-1.5">Category</label>
                    <select value={editingItem.category} onChange={e => setEditingItem({ ...editingItem, category: e.target.value })} className="w-full bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg px-3 py-2.5 text-[13px] text-[#1A1615] focus:outline-none focus:border-[#B38637] appearance-none cursor-pointer">
                      <option value="Single Origin Coffee">Single Origin Coffee</option>
                      <option value="Tasting Flights">Tasting Flights</option>
                      <option value="Artisanal Bakery">Artisanal Bakery</option>
                      <option value="Seasonal Brews">Seasonal Brews</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#1A1615] mb-1.5">SKU Barcode</label>
                    <input type="text" value={editingItem.sku} onChange={e => setEditingItem({ ...editingItem, sku: e.target.value })} className="w-full bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg px-3 py-2.5 text-[13px] text-[#6E6A66] uppercase font-mono focus:outline-none focus:border-[#B38637]" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#6E6A66] uppercase tracking-wider mb-1.5">RETAIL PRICE ($)</label>
                    <input type="number" value={editingItem.price} onChange={e => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) || 0 })} className="w-full bg-white border border-[#EAE6E1] rounded-lg px-3 py-2.5 text-[15px] font-bold text-[#1A1615] focus:outline-none focus:border-[#B38637]" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#6E6A66] uppercase tracking-wider mb-1.5">COST OF GOODS ($)</label>
                    <input type="number" value={editingItem.cost} onChange={e => setEditingItem({ ...editingItem, cost: parseFloat(e.target.value) || 0 })} className="w-full bg-white border border-[#EAE6E1] rounded-lg px-3 py-2.5 text-[15px] font-bold text-[#1A1615] focus:outline-none focus:border-[#B38637]" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#6E6A66] uppercase tracking-wider mb-1.5">MARGIN</label>
                    <div className="w-full bg-transparent px-1 py-2.5 text-lg font-black text-[#15803D]">
                      {editCalculatedMargin}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#1A1615] mb-1.5">Sensory Cupping Notes</label>
                  <textarea rows={3} defaultValue="Washed Geisha with intense jasmine florals, white peach, bergamot finish, and clean silky tea-like body." className="w-full bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg px-3 py-2.5 text-[12px] text-[#6E6A66] leading-relaxed resize-none focus:outline-none focus:border-[#B38637]" />
                </div>
              </div>

              {/* Loyalty Integration */}
              <div className="bg-[#FAF8F5] border border-[#F3E5C8] rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 font-bold text-[#1A1615] text-[13px]">
                    <div className="w-6 h-6 rounded bg-[#FDF8EB] border border-[#F3E5C8] flex items-center justify-center">
                      <Award className="w-3.5 h-3.5 text-[#B38637]" />
                    </div>
                    Revia Loyalty Integration
                  </div>
                  {/* Toggle Switch */}
                  <button
                    onClick={() => setLoyaltyIntegration(!loyaltyIntegration)}
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${loyaltyIntegration ? 'bg-[#15803D]' : 'bg-[#D1CDC7]'}`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${loyaltyIntegration ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-[#EAE6E1] rounded-lg p-3">
                    <p className="text-[10px] font-bold text-[#6E6A66] mb-1">Stamps Awarded</p>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xl font-black text-[#B38637]">+2</span>
                      <span className="text-[10px] font-semibold text-[#8C827A]">per order</span>
                    </div>
                  </div>
                  <div className="bg-white border border-[#EAE6E1] rounded-lg p-3">
                    <p className="text-[10px] font-bold text-[#6E6A66] mb-1">Redeem Threshold</p>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xl font-black text-[#1A1615]">12</span>
                      <span className="text-[10px] font-semibold text-[#8C827A]">stamps needed</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="px-5 py-4 border-t border-[#EAE6E1] bg-[#FAF8F5] flex items-center justify-between gap-3">
              <button onClick={handleUpdateItem} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#D4A753] to-[#9E782F] hover:opacity-95 text-white text-[13px] font-bold rounded-lg transition-all shadow-md cursor-pointer">
                <Upload className="w-4 h-4 text-white" />
                Save & Publish to POS
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddItem}
      />
    </div>
  );
};
