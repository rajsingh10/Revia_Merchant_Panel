import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Edit2, Trash2, Database, Search, X, ChevronDown, Check, Layers } from 'lucide-react';
import type { AppDispatch, RootState } from '../store/store';
import { 
  fetchRuleFields, fetchTierOptions, RuleField, TierOption,
  addRuleField, updateRuleField, deleteRuleField,
  addTierOption, updateTierOption, deleteTierOption
} from '../store/slices/masterSlice';

interface MastersPageProps {
  defaultTab?: 'fields' | 'tiers';
}

export const MastersPage: React.FC<MastersPageProps> = ({ defaultTab = 'fields' }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { ruleFields, tierOptions, isLoadingFields, isLoadingTiers } = useSelector((state: RootState) => state.master);
  
  const [activeTab, setActiveTab] = useState<'fields' | 'tiers'>(defaultTab);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    dispatch(fetchRuleFields());
    dispatch(fetchTierOptions());
  }, [dispatch]);

  // Modal states
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<RuleField | null>(null);

  const [isTierModalOpen, setIsTierModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<TierOption | null>(null);

  // Field Form State
  const [fieldKey, setFieldKey] = useState('');
  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldType, setFieldType] = useState<'currency' | 'number' | 'date' | 'select'>('currency');
  const [fieldIsActive, setFieldIsActive] = useState(true);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  // Tier Form State
  const [tierValue, setTierValue] = useState('');
  const [tierLabel, setTierLabel] = useState('');
  const [tierIsActive, setTierIsActive] = useState(true);

  const handleAddField = () => {
    setEditingField(null);
    setFieldKey('');
    setFieldLabel('');
    setFieldType('currency');
    setFieldIsActive(true);
    setIsFieldModalOpen(true);
  };

  const handleEditField = (field: RuleField) => {
    setEditingField(field);
    setFieldKey(field.key);
    setFieldLabel(field.label);
    setFieldType(field.type);
    setFieldIsActive(field.isActive ?? true);
    setIsFieldModalOpen(true);
  };

  const handleSaveField = () => {
    if (!fieldLabel) return;
    
    // Auto-generate key from label for new fields
    const actualKey = editingField ? editingField.key : fieldLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    
    const fieldData: RuleField = { key: actualKey, label: fieldLabel, type: fieldType, isActive: fieldIsActive };
    if (editingField) {
      dispatch(updateRuleField(fieldData));
    } else {
      dispatch(addRuleField(fieldData));
    }
    setIsFieldModalOpen(false);
  };

  const handleDeleteField = (key: string) => {
    if (window.confirm('Are you sure you want to delete this field?')) {
      dispatch(deleteRuleField(key));
    }
  };

  const handleAddTier = () => {
    setEditingTier(null);
    setTierValue('');
    setTierLabel('');
    setTierIsActive(true);
    setIsTierModalOpen(true);
  };

  const handleEditTier = (tier: TierOption) => {
    setEditingTier(tier);
    setTierValue(tier.value);
    setTierLabel(tier.label);
    setTierIsActive(tier.isActive ?? true);
    setIsTierModalOpen(true);
  };

  const handleSaveTier = () => {
    if (!tierLabel) return;

    // Auto-generate value from label for new tiers
    const actualValue = editingTier ? editingTier.value : tierLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_');

    const tierData: TierOption = { value: actualValue, label: tierLabel, isActive: tierIsActive };
    if (editingTier) {
      dispatch(updateTierOption(tierData));
    } else {
      dispatch(addTierOption(tierData));
    }
    setIsTierModalOpen(false);
  };

  const handleDeleteTier = (value: string) => {
    if (window.confirm('Are you sure you want to delete this tier?')) {
      dispatch(deleteTierOption(value));
    }
  };

  return (
    <div className="p-4 lg:p-6 max-w-[1600px] mx-auto space-y-6 flex flex-col h-full font-sans relative">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1615] flex items-center gap-2">
            <Database className="w-6 h-6 text-[#D4A753]" />
            {activeTab === 'fields' ? 'Rule Fields Master' : 'Tier Options Master'}
          </h1>
          <p className="text-sm text-[#6E6A66] mt-1">
            Manage {activeTab === 'fields' ? 'rule fields' : 'tier options'} for the platform.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={activeTab === 'fields' ? handleAddField : handleAddTier}
            className="flex items-center gap-2 px-4 py-2 bg-[#1A1615] text-white rounded-lg text-sm font-bold hover:bg-[#2A2422] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add {activeTab === 'fields' ? 'Field' : 'Tier'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-[#EFECE6] overflow-hidden">
        {activeTab === 'fields' ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#EFECE6]">
                <th className="py-3 px-4 text-xs font-bold text-[#9E9A93] uppercase tracking-wider">Label</th>
                <th className="py-3 px-4 text-xs font-bold text-[#9E9A93] uppercase tracking-wider">Type</th>
                <th className="py-3 px-4 text-xs font-bold text-[#9E9A93] uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-xs font-bold text-[#9E9A93] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingFields ? (
                <tr><td colSpan={4} className="py-8 text-center text-sm text-[#6E6A66]">Loading...</td></tr>
              ) : ruleFields.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-[#7C746C]">
                      <Database className="w-10 h-10 mb-3 text-[#D4A753]/40" />
                      <div className="text-sm font-bold text-[#1A1615]">No fields found</div>
                      <div className="text-xs mt-1">Add a new rule field to get started.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                ruleFields.map(field => (
                  <tr key={field.key} className="border-b border-[#EFECE6] hover:bg-[#FAF8F5]">
                    <td className="py-3 px-4 text-sm font-medium text-[#1A1615]">{field.label}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-[#EFECE6] text-[#6E6A66]">
                        {field.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {field.isActive !== false ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold bg-[#E0F9ED] text-[#0D7A53]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0D7A53]"></span> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold bg-[#F0F2F5] text-[#6E6A66]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#9E9A93]"></span> Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 flex items-center justify-end gap-2">
                      <button onClick={() => handleEditField(field)} className="p-1.5 text-[#6E6A66] hover:bg-[#EFECE6] rounded-md transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteField(field.key)} className="p-1.5 text-[#6E6A66] hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#EFECE6]">
                <th className="py-3 px-4 text-xs font-bold text-[#9E9A93] uppercase tracking-wider">Label</th>
                <th className="py-3 px-4 text-xs font-bold text-[#9E9A93] uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-xs font-bold text-[#9E9A93] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingTiers ? (
                <tr><td colSpan={3} className="py-8 text-center text-sm text-[#6E6A66]">Loading...</td></tr>
              ) : tierOptions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-[#7C746C]">
                      <Layers className="w-10 h-10 mb-3 text-[#D4A753]/40" />
                      <div className="text-sm font-bold text-[#1A1615]">No tiers found</div>
                      <div className="text-xs mt-1">Add a new tier option to get started.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                tierOptions.map(tier => (
                  <tr key={tier.value} className="border-b border-[#EFECE6] hover:bg-[#FAF8F5]">
                    <td className="py-3 px-4 text-sm font-medium text-[#1A1615]">{tier.label}</td>
                    <td className="py-3 px-4">
                      {tier.isActive !== false ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold bg-[#E0F9ED] text-[#0D7A53]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0D7A53]"></span> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold bg-[#F0F2F5] text-[#6E6A66]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#9E9A93]"></span> Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 flex items-center justify-end gap-2">
                      <button onClick={() => handleEditTier(tier)} className="p-1.5 text-[#6E6A66] hover:bg-[#EFECE6] rounded-md transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteTier(tier.value)} className="p-1.5 text-[#6E6A66] hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Field Modal */}
      {isFieldModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
            <button 
              onClick={() => setIsFieldModalOpen(false)} 
              className="absolute top-4 right-4 p-1.5 text-[#9E9A93] hover:bg-[#FAF8F5] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-[#1A1615] mb-4">
              {editingField ? 'Edit Field' : 'Add New Field'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6E6A66] mb-1">Label</label>
                <input 
                  type="text" 
                  value={fieldLabel}
                  onChange={e => setFieldLabel(e.target.value)}
                  className="w-full border border-[#EAE6E1] rounded-lg px-3 py-2 text-sm focus:border-[#D4A753] focus:ring-1 focus:ring-[#D4A753] outline-none" 
                  placeholder="Enter field label"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6E6A66] mb-1">Type</label>
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                    className="w-full flex items-center justify-between border border-[#EAE6E1] rounded-lg px-3 py-2 text-sm focus:border-[#D4A753] focus:ring-1 focus:ring-[#D4A753] outline-none bg-white text-left text-[#1A1615]"
                  >
                    {fieldType.charAt(0).toUpperCase() + fieldType.slice(1)}
                    <ChevronDown className={`w-4 h-4 text-[#9E9A93] transition-transform ${isTypeDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isTypeDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#EAE6E1] rounded-lg shadow-xl overflow-hidden z-10">
                      {[
                        { value: 'currency', label: 'Currency' },
                        { value: 'number', label: 'Number' },
                        { value: 'date', label: 'Date' },
                        { value: 'select', label: 'Select (Dropdown)' }
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setFieldType(opt.value as any);
                            setIsTypeDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-[#FAF8F5] flex items-center justify-between transition-colors text-[#1A1615]"
                        >
                          {opt.label}
                          {fieldType === opt.value && <Check className="w-4 h-4 text-[#D4A753]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${fieldIsActive ? 'bg-[#15803D]' : 'border-2 border-[#EAE6E1] bg-white'}`}>
                    {fieldIsActive && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                  </div>
                  <input type="checkbox" className="hidden" checked={fieldIsActive} onChange={(e) => setFieldIsActive(e.target.checked)} />
                  <span className="text-sm font-bold text-[#4A433D]">Active</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsFieldModalOpen(false)} className="px-4 py-2 text-sm font-bold text-[#6E6A66] hover:bg-[#FAF8F5] rounded-lg transition-colors">Cancel</button>
              <button onClick={handleSaveField} className="px-4 py-2 text-sm font-bold text-white bg-[#D4A753] hover:bg-[#B68F45] rounded-lg transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Tier Modal */}
      {isTierModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
            <button 
              onClick={() => setIsTierModalOpen(false)} 
              className="absolute top-4 right-4 p-1.5 text-[#9E9A93] hover:bg-[#FAF8F5] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-[#1A1615] mb-4">
              {editingTier ? 'Edit Tier' : 'Add New Tier'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6E6A66] mb-1">Label</label>
                <input 
                  type="text" 
                  value={tierLabel}
                  onChange={e => setTierLabel(e.target.value)}
                  className="w-full border border-[#EAE6E1] rounded-lg px-3 py-2 text-sm focus:border-[#D4A753] focus:ring-1 focus:ring-[#D4A753] outline-none" 
                  placeholder="Enter tier label"
                />
              </div>
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${tierIsActive ? 'bg-[#15803D]' : 'border-2 border-[#EAE6E1] bg-white'}`}>
                    {tierIsActive && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                  </div>
                  <input type="checkbox" className="hidden" checked={tierIsActive} onChange={(e) => setTierIsActive(e.target.checked)} />
                  <span className="text-sm font-bold text-[#4A433D]">Active</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsTierModalOpen(false)} className="px-4 py-2 text-sm font-bold text-[#6E6A66] hover:bg-[#FAF8F5] rounded-lg transition-colors">Cancel</button>
              <button onClick={handleSaveTier} className="px-4 py-2 text-sm font-bold text-white bg-[#D4A753] hover:bg-[#B68F45] rounded-lg transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
