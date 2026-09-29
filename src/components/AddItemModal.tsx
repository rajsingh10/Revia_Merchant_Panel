import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Plus, X, Image as ImageIcon, Award } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchBranches } from '../store/slices/branchSlice';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: {
    title: string;
    category: string;
    branch: string;
    sku: string;
    price: string;
    cost: string;
    image: string | null;
    loyaltyIntegration: boolean;
  }) => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [newItemImage, setNewItemImage] = useState<string | null>(null);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemBranch, setNewItemBranch] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [newItemSku, setNewItemSku] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCost, setNewItemCost] = useState('');
  const [addLoyaltyIntegration, setAddLoyaltyIntegration] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const branches = useSelector((state: RootState) => state.branch.branches);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchBranches());
    }
  }, [isOpen, dispatch]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const calculatedMargin = useMemo(() => {
    return newItemPrice && newItemCost 
      ? `${Math.round(((parseFloat(newItemPrice) - parseFloat(newItemCost)) / parseFloat(newItemPrice)) * 100)}%` 
      : '-';
  }, [newItemPrice, newItemCost]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewItemImage(e.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleAddItem = () => {
    setHasSubmitted(true);
    
    if (!newItemTitle.trim() || !newItemBranch || !newItemCategory || !newItemPrice) {
      return;
    }

    onAdd({
      title: newItemTitle,
      category: newItemCategory,
      branch: newItemBranch,
      sku: newItemSku,
      price: newItemPrice,
      cost: newItemCost,
      image: newItemImage,
      loyaltyIntegration: addLoyaltyIntegration
    });

    // Reset Form
    setNewItemTitle('');
    setNewItemCategory('');
    setNewItemBranch('');
    setNewItemSku('');
    setNewItemPrice('');
    setNewItemCost('');
    setNewItemImage(null);
    setAddLoyaltyIntegration(false);
    setHasSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-[600px] max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="px-6 py-5 border-b border-[#EAE6E1] flex items-start justify-between bg-white relative z-10">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <Plus className="w-5 h-5 text-[#B38637]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1A1615] leading-tight">Add New Item</h2>
              <p className="text-sm text-[#6E6A66] mt-1">Create a new product for your catalog.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#FAF8F5] text-[#8C827A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Product Asset */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#6E6A66] mb-3">PRODUCT ASSET & PRESENTATION</h3>
            <div className="bg-[#FAF8F5] border border-[#EAE6E1] rounded-xl p-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              {!newItemImage ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-[#D1CDC7] rounded-lg bg-white cursor-pointer hover:bg-[#F2EFE9] transition-colors"
                >
                  <ImageIcon className="w-8 h-8 text-[#8C827A] mb-2" />
                  <span className="text-sm font-bold text-[#1A1615]">Click to upload product image</span>
                  <span className="text-xs text-[#8C827A] mt-1">JPG, PNG or WEBP (Max 5MB)</span>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-[#D1CDC7] relative bg-white">
                    <img src={newItemImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[11px] font-bold text-[#1A1615] bg-white border border-[#EAE6E1] px-3 py-1.5 rounded shadow-sm hover:bg-[#F2EFE9] transition-colors cursor-pointer"
                      >
                        Change Image
                      </button>
                      <button
                        onClick={() => setNewItemImage(null)}
                        className="text-[11px] font-bold text-[#DC2626] hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-[#1A1615] mb-1.5">Item Title <span className="text-[#DC2626]">*</span></label>
              <input type="text" value={newItemTitle} onChange={e => setNewItemTitle(e.target.value)} placeholder="Enter item title" className={`w-full bg-[#FAF8F5] border rounded-lg px-4 py-3 text-sm text-[#1A1615] focus:outline-none focus:border-[#B38637] ${hasSubmitted && !newItemTitle.trim() ? 'border-[#DC2626] bg-[#FEF2F2]' : 'border-[#EAE6E1]'}`} />
              {hasSubmitted && !newItemTitle.trim() && <p className="text-[#DC2626] text-[10px] font-bold mt-1">Item Title is required</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#1A1615] mb-1.5">Branch <span className="text-[#DC2626]">*</span></label>
                <select value={newItemBranch} onChange={e => setNewItemBranch(e.target.value)} className={`w-full bg-[#FAF8F5] border rounded-lg px-4 py-3 text-sm text-[#1A1615] focus:outline-none focus:border-[#B38637] appearance-none cursor-pointer ${hasSubmitted && !newItemBranch ? 'border-[#DC2626] bg-[#FEF2F2]' : 'border-[#EAE6E1]'}`}>
                  <option value="" disabled>Select branch</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.name}>{branch.name}</option>
                  ))}
                </select>
                {hasSubmitted && !newItemBranch && <p className="text-[#DC2626] text-[10px] font-bold mt-1">Branch is required</p>}
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#1A1615] mb-1.5">Category <span className="text-[#DC2626]">*</span></label>
                <select value={newItemCategory} onChange={e => setNewItemCategory(e.target.value)} className={`w-full bg-[#FAF8F5] border rounded-lg px-4 py-3 text-sm text-[#1A1615] focus:outline-none focus:border-[#B38637] appearance-none cursor-pointer ${hasSubmitted && !newItemCategory ? 'border-[#DC2626] bg-[#FEF2F2]' : 'border-[#EAE6E1]'}`}>
                  <option value="" disabled>Select category</option>
                  <option value="Single Origin Coffee">Single Origin Coffee</option>
                  <option value="Tasting Flights">Tasting Flights</option>
                  <option value="Artisanal Bakery">Artisanal Bakery</option>
                  <option value="Seasonal Brews">Seasonal Brews</option>
                </select>
                {hasSubmitted && !newItemCategory && <p className="text-[#DC2626] text-[10px] font-bold mt-1">Category is required</p>}
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#1A1615] mb-1.5">SKU Barcode</label>
                <input type="text" value={newItemSku} onChange={e => setNewItemSku(e.target.value)} placeholder="Enter SKU" className="w-full bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg px-4 py-3 text-sm text-[#6E6A66] uppercase font-mono focus:outline-none focus:border-[#B38637]" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#6E6A66] uppercase tracking-wider mb-1.5">RETAIL PRICE ($) <span className="text-[#DC2626]">*</span></label>
                <input
                  type="number"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  placeholder="0.00"
                  className={`w-full bg-white border rounded-lg px-4 py-3 text-base font-bold text-[#1A1615] focus:outline-none focus:border-[#B38637] ${hasSubmitted && !newItemPrice ? 'border-[#DC2626] bg-[#FEF2F2]' : 'border-[#EAE6E1]'}`}
                />
                {hasSubmitted && !newItemPrice && <p className="text-[#DC2626] text-[10px] font-bold mt-1">Price is required</p>}
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#6E6A66] uppercase tracking-wider mb-1.5">COST OF GOODS ($)</label>
                <input
                  type="number"
                  value={newItemCost}
                  onChange={(e) => setNewItemCost(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-white border border-[#EAE6E1] rounded-lg px-4 py-3 text-base font-bold text-[#1A1615] focus:outline-none focus:border-[#B38637]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#6E6A66] uppercase tracking-wider mb-1.5">MARGIN</label>
                <div className="w-full bg-white border border-[#EAE6E1] rounded-lg px-4 py-3 text-base font-bold flex items-center">
                  <span className={calculatedMargin !== '-' ? 'text-[#15803D]' : 'text-[#A8A29E]'}>{calculatedMargin}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#1A1615] mb-1.5">Sensory Cupping Notes</label>
              <textarea rows={3} placeholder="Enter description or notes" className="w-full bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg px-4 py-3 text-sm text-[#1A1615] leading-relaxed resize-none focus:outline-none focus:border-[#B38637]" />
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
              <button
                onClick={() => setAddLoyaltyIntegration(!addLoyaltyIntegration)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${addLoyaltyIntegration ? 'bg-[#15803D]' : 'bg-[#D1CDC7]'}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${addLoyaltyIntegration ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className={`grid grid-cols-2 gap-4 ${!addLoyaltyIntegration ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="bg-white border border-[#EAE6E1] rounded-lg p-3">
                <p className="text-[10px] font-bold text-[#6E6A66] mb-1">Stamps Awarded</p>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-black text-[#B38637]">{addLoyaltyIntegration ? '+2' : '+0'}</span>
                  <span className="text-[10px] font-semibold text-[#8C827A]">per order</span>
                </div>
              </div>
              <div className="bg-white border border-[#EAE6E1] rounded-lg p-3">
                <p className="text-[10px] font-bold text-[#6E6A66] mb-1">Redeem Threshold</p>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-black text-[#1A1615]">{addLoyaltyIntegration ? '12' : '0'}</span>
                  <span className="text-[10px] font-semibold text-[#8C827A]">stamps needed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#EAE6E1] bg-[#FAF8F5] flex items-center justify-between gap-3">
          <button
            onClick={() => {
              setHasSubmitted(false);
              onClose();
            }}
            className="px-6 py-3 bg-white border border-[#EAE6E1] hover:bg-[#F2EFE9] text-[#1A1615] text-sm font-bold rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button 
            onClick={handleAddItem} 
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-white text-sm font-bold rounded-xl transition-all shadow-md bg-gradient-to-r from-[#D4A753] to-[#9E782F] hover:opacity-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            Add Item to Catalog
          </button>
        </div>
      </div>
    </div>
  );
};
