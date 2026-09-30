import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Edit2, Trash2, Database, Search, X, ChevronDown, Check, Layers, Package } from 'lucide-react';
import type { AppDispatch, RootState } from '../store/store';
import { 
  fetchRuleFields, fetchTierOptions, RuleField, TierOption,
  addRuleField, updateRuleField, deleteRuleField,
  addTierOption, updateTierOption, deleteTierOption,
  fetchAssetTypes, addAssetType, updateAssetType, deleteAssetType, AssetTypeOption,
  fetchPlacementTypes, addPlacementType, updatePlacementType, deletePlacementType, PlacementTypeOption
} from '../store/slices/masterSlice';
import { fetchRewardTypes, addRewardType, updateRewardType, deleteRewardType, RewardTypeOption } from '../store/slices/masterSlice';

interface MastersPageProps {
  defaultTab?: 'fields' | 'tiers' | 'rewards' | 'assets' | 'placements';
}

export const MastersPage: React.FC<MastersPageProps> = ({ defaultTab = 'fields' }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { ruleFields, tierOptions, assetTypes, placementTypes, isLoadingFields, isLoadingTiers, isLoadingAssetTypes, isLoadingPlacementTypes } = useSelector((state: RootState) => state.master);
  const { rewardTypes: rewards, isLoadingRewards: isLoadingRewardTypes } = useSelector((state: RootState) => state.master);
  
  const [activeTab, setActiveTab] = useState<'fields' | 'tiers' | 'rewards' | 'assets' | 'placements'>(defaultTab);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    dispatch(fetchRuleFields());
    dispatch(fetchTierOptions());
    dispatch(fetchRewardTypes());
    dispatch(fetchAssetTypes());
    dispatch(fetchPlacementTypes());
  }, [dispatch]);

  // Modal states
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<RuleField | null>(null);

  const [isTierModalOpen, setIsTierModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<TierOption | null>(null);

  // Delete Confirmation State
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ type: 'field' | 'tier' | 'reward' | 'asset' | 'placement', id: string, name: string } | null>(null);

  const [hasSubmittedField, setHasSubmittedField] = useState(false);
  const [hasSubmittedTier, setHasSubmittedTier] = useState(false);
  const [hasSubmittedRewardType, setHasSubmittedRewardType] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

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
    setHasSubmittedField(false);
    setIsFieldModalOpen(true);
  };

  const handleEditField = (field: RuleField) => {
    setEditingField(field);
    setFieldKey(field.key);
    setFieldLabel(field.label);
    setFieldType(field.type);
    setFieldIsActive(field.isActive ?? true);
    setHasSubmittedField(false);
    setIsFieldModalOpen(true);
  };

  const handleSaveField = () => {
    setHasSubmittedField(true);
    if (!fieldLabel.trim()) return;
    
    // Auto-generate key from label for new fields
    const actualKey = editingField ? editingField.key : fieldLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    
    const fieldData: RuleField = { key: actualKey, label: fieldLabel, type: fieldType, isActive: fieldIsActive };
    if (editingField) {
      dispatch(updateRuleField(fieldData));
      showToast('Rule Field updated successfully!');
    } else {
      dispatch(addRuleField(fieldData));
      showToast('Rule Field added successfully!');
    }
    setHasSubmittedField(false);
    setIsFieldModalOpen(false);
  };

  const handleDeleteField = (field: RuleField) => {
    setDeleteConfirmation({ type: 'field', id: field.key, name: field.label });
  };

  const handleAddTier = () => {
    setEditingTier(null);
    setTierValue('');
    setTierLabel('');
    setTierIsActive(true);
    setHasSubmittedTier(false);
    setIsTierModalOpen(true);
  };

  const handleEditTier = (tier: TierOption) => {
    setEditingTier(tier);
    setTierValue(tier.value);
    setTierLabel(tier.label);
    setTierIsActive(tier.isActive ?? true);
    setHasSubmittedTier(false);
    setIsTierModalOpen(true);
  };

  const handleSaveTier = () => {
    setHasSubmittedTier(true);
    if (!tierLabel.trim()) return;

    // Auto-generate value from label for new tiers
    const actualValue = editingTier ? editingTier.value : tierLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_');

    const tierData: TierOption = { value: actualValue, label: tierLabel, isActive: tierIsActive };
    if (editingTier) {
      dispatch(updateTierOption(tierData));
      showToast('Tier Option updated successfully!');
    } else {
      dispatch(addTierOption(tierData));
      showToast('Tier Option added successfully!');
    }
    setHasSubmittedTier(false);
    setIsTierModalOpen(false);
  };

  const handleDeleteTier = (tier: TierOption) => {
    setDeleteConfirmation({ type: 'tier', id: tier.value, name: tier.label });
  };

  const [isRewardTypeModalOpen, setIsRewardTypeModalOpen] = useState(false);
  const [editingRewardType, setEditingRewardType] = useState<RewardTypeOption | null>(null);
  const [rewardTypeTitle, setRewardTypeTitle] = useState('');
  const [rewardTypeDesc, setRewardTypeDesc] = useState('');
  const [rewardTypeIcon, setRewardTypeIcon] = useState('Gift');
  const [rewardTypeIsActive, setRewardTypeIsActive] = useState(true);

  const handleAddRewardType = () => {
    setEditingRewardType(null);
    setRewardTypeTitle('');
    setRewardTypeDesc('');
    setRewardTypeIcon('Gift');
    setRewardTypeIsActive(true);
    setHasSubmittedRewardType(false);
    setIsRewardTypeModalOpen(true);
  };

  const handleEditRewardType = (reward: RewardTypeOption) => {
    setEditingRewardType(reward);
    setRewardTypeTitle(reward.title);
    setRewardTypeDesc(reward.desc || '');
    setRewardTypeIcon(reward.iconName || 'Gift');
    setRewardTypeIsActive(reward.isActive !== false);
    setHasSubmittedRewardType(false);
    setIsRewardTypeModalOpen(true);
  };

  const handleSaveRewardType = () => {
    setHasSubmittedRewardType(true);
    if (!rewardTypeTitle.trim()) return;

    const rewardData = {
      id: editingRewardType ? editingRewardType.id : rewardTypeTitle.toLowerCase().replace(/\s+/g, '_'),
      title: rewardTypeTitle.trim(),
      desc: rewardTypeDesc.trim(),
      iconName: rewardTypeIcon,
      isActive: rewardTypeIsActive
    };

    if (editingRewardType) {
      dispatch(updateRewardType(rewardData));
      showToast('Reward Type updated successfully!');
    } else {
      dispatch(addRewardType(rewardData));
      showToast('Reward Type added successfully!');
    }
    setHasSubmittedRewardType(false);
    setIsRewardTypeModalOpen(false);
  };

  const handleDeleteRewardType = (reward: RewardTypeOption) => {
    setDeleteConfirmation({ type: 'reward', id: reward.id, name: reward.title });
  };

  const [isAssetTypeModalOpen, setIsAssetTypeModalOpen] = useState(false);
  const [editingAssetType, setEditingAssetType] = useState<AssetTypeOption | null>(null);
  const [assetTypeName, setAssetTypeName] = useState('');
  const [assetTypeIsActive, setAssetTypeIsActive] = useState(true);
  const [hasSubmittedAssetType, setHasSubmittedAssetType] = useState(false);

  const handleAddAssetType = () => {
    setEditingAssetType(null);
    setAssetTypeName('');
    setAssetTypeIsActive(true);
    setHasSubmittedAssetType(false);
    setIsAssetTypeModalOpen(true);
  };

  const handleEditAssetType = (asset: AssetTypeOption) => {
    setEditingAssetType(asset);
    setAssetTypeName(asset.name);
    setAssetTypeIsActive(asset.status !== false);
    setHasSubmittedAssetType(false);
    setIsAssetTypeModalOpen(true);
  };

  const handleSaveAssetType = () => {
    setHasSubmittedAssetType(true);
    if (!assetTypeName.trim()) return;

    const assetData: any = {
      name: assetTypeName.trim(),
      type: 'asset',
      status: assetTypeIsActive
    };
    
    if (editingAssetType) {
      assetData.id = editingAssetType.id;
      dispatch(updateAssetType(assetData as AssetTypeOption));
      showToast('Asset Type updated successfully!');
    } else {
      dispatch(addAssetType(assetData as AssetTypeOption));
      showToast('Asset Type added successfully!');
    }
    setHasSubmittedAssetType(false);
    setIsAssetTypeModalOpen(false);
  };

  const [isPlacementTypeModalOpen, setIsPlacementTypeModalOpen] = useState(false);
  const [editingPlacementType, setEditingPlacementType] = useState<PlacementTypeOption | null>(null);
  const [placementTypeName, setPlacementTypeName] = useState('');
  const [placementTypeIsActive, setPlacementTypeIsActive] = useState(true);
  const [hasSubmittedPlacementType, setHasSubmittedPlacementType] = useState(false);

  const handleAddPlacementType = () => {
    setEditingPlacementType(null);
    setPlacementTypeName('');
    setPlacementTypeIsActive(true);
    setHasSubmittedPlacementType(false);
    setIsPlacementTypeModalOpen(true);
  };

  const handleEditPlacementType = (placement: PlacementTypeOption) => {
    setEditingPlacementType(placement);
    setPlacementTypeName(placement.name);
    setPlacementTypeIsActive(placement.status !== false);
    setHasSubmittedPlacementType(false);
    setIsPlacementTypeModalOpen(true);
  };

  const handleSavePlacementType = () => {
    setHasSubmittedPlacementType(true);
    if (!placementTypeName.trim()) return;

    const placementData: any = {
      name: placementTypeName.trim(),
      status: placementTypeIsActive
    };
    
    if (editingPlacementType) {
      placementData.id = editingPlacementType.id;
      dispatch(updatePlacementType(placementData as PlacementTypeOption));
      showToast('Placement Type updated successfully!');
    } else {
      dispatch(addPlacementType(placementData as PlacementTypeOption));
      showToast('Placement Type added successfully!');
    }
    setHasSubmittedPlacementType(false);
    setIsPlacementTypeModalOpen(false);
  };

  return (
    <div className="p-4 lg:p-6 max-w-[1600px] mx-auto space-y-6 flex flex-col h-full font-sans relative">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1615] flex items-center gap-2">
            {activeTab === 'rewards' ? <Package className="w-6 h-6 text-[#D4A753]" /> : <Database className="w-6 h-6 text-[#D4A753]" />}
            {activeTab === 'fields' ? 'Rule Fields Master' : activeTab === 'tiers' ? 'Tier Options Master' : activeTab === 'rewards' ? 'Reward Types Master' : activeTab === 'assets' ? 'Asset Types Master' : 'Placement Types Master'}
          </h1>
          <p className="text-sm text-[#6E6A66] mt-1">
            Manage {activeTab === 'fields' ? 'rule fields' : activeTab === 'tiers' ? 'tier options' : activeTab === 'rewards' ? 'rewards' : activeTab === 'assets' ? 'asset types' : 'placement types'} for the platform.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={activeTab === 'fields' ? handleAddField : activeTab === 'tiers' ? handleAddTier : activeTab === 'rewards' ? handleAddRewardType : activeTab === 'assets' ? handleAddAssetType : handleAddPlacementType}
            className="flex items-center gap-2 px-4 py-2 bg-[#1A1615] text-white rounded-lg text-sm font-bold hover:bg-[#2A2422] transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add {activeTab === 'fields' ? 'Field' : activeTab === 'tiers' ? 'Tier' : activeTab === 'rewards' ? 'Reward Type' : activeTab === 'assets' ? 'Asset Type' : 'Placement Type'}
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
                      <button onClick={() => handleEditField(field)} className="p-1.5 text-[#6E6A66] hover:bg-[#EFECE6] rounded-md transition-colors cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteField(field)} className="p-1.5 text-[#6E6A66] hover:bg-red-50 hover:text-red-600 rounded-md transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : activeTab === 'tiers' ? (
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
                      <button onClick={() => handleEditTier(tier)} className="p-1.5 text-[#6E6A66] hover:bg-[#EFECE6] rounded-md transition-colors cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteTier(tier)} className="p-1.5 text-[#6E6A66] hover:bg-red-50 hover:text-red-600 rounded-md transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : activeTab === 'rewards' ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#EFECE6]">
                <th className="py-3 px-4 text-xs font-bold text-[#9E9A93] uppercase tracking-wider">Reward Type Name</th>
                <th className="py-3 px-4 text-xs font-bold text-[#9E9A93] uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-xs font-bold text-[#9E9A93] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingRewardTypes ? (
                <tr><td colSpan={3} className="py-8 text-center text-sm text-[#6E6A66]">Loading...</td></tr>
              ) : rewards.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-[#7C746C]">
                      <Package className="w-10 h-10 mb-3 text-[#D4A753]/40" />
                      <div className="text-sm font-bold text-[#1A1615]">No rewards found</div>
                      <div className="text-xs mt-1">Add a new reward to get started.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                rewards.map(reward => (
                  <tr key={reward.id} className="border-b border-[#EFECE6] hover:bg-[#FAF8F5]">
                    <td className="py-3 px-4 text-sm font-medium text-[#1A1615]">
                      <div>{reward.title}</div>
                      <div className="text-xs text-[#6E6A66]">{reward.desc}</div>
                    </td>
                    <td className="py-3 px-4">
                      {reward.isActive !== false ? (
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
                      <button onClick={() => handleEditRewardType(reward)} className="p-1.5 text-[#6E6A66] hover:bg-[#EFECE6] rounded-md transition-colors cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteRewardType(reward)} className="p-1.5 text-[#6E6A66] hover:bg-red-50 hover:text-red-600 rounded-md transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : activeTab === 'assets' ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#EFECE6]">
                <th className="py-3 px-4 text-xs font-bold text-[#9E9A93] uppercase tracking-wider">ID</th>
                <th className="py-3 px-4 text-xs font-bold text-[#9E9A93] uppercase tracking-wider">Name</th>
                <th className="py-3 px-4 text-xs font-bold text-[#9E9A93] uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-xs font-bold text-[#9E9A93] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingAssetTypes ? (
                <tr><td colSpan={4} className="py-8 text-center text-sm text-[#6E6A66]">Loading...</td></tr>
              ) : assetTypes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-[#7C746C]">
                      <Database className="w-10 h-10 mb-3 text-[#D4A753]/40" />
                      <div className="text-sm font-bold text-[#1A1615]">No asset types found</div>
                      <div className="text-xs mt-1">Add a new asset type to get started.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                assetTypes.map(asset => (
                  <tr key={asset.id} className="border-b border-[#EFECE6] hover:bg-[#FAF8F5]">
                    <td className="py-3 px-4 text-sm font-medium text-[#1A1615]">{asset.id}</td>
                    <td className="py-3 px-4 text-sm font-medium text-[#1A1615]">{asset.name}</td>
                    <td className="py-3 px-4">
                      {asset.status !== false ? (
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
                      <button onClick={() => handleEditAssetType(asset)} className="p-1.5 text-[#6E6A66] hover:bg-[#EFECE6] rounded-md transition-colors cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => asset.id && setDeleteConfirmation({ type: 'asset', id: String(asset.id), name: asset.name })} className="p-1.5 text-[#6E6A66] hover:bg-red-50 hover:text-red-600 rounded-md transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : activeTab === 'placements' ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#EFECE6]">
                <th className="py-3 px-4 text-xs font-bold text-[#9E9A93] uppercase tracking-wider">ID</th>
                <th className="py-3 px-4 text-xs font-bold text-[#9E9A93] uppercase tracking-wider">Name</th>
                <th className="py-3 px-4 text-xs font-bold text-[#9E9A93] uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-xs font-bold text-[#9E9A93] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingPlacementTypes ? (
                <tr><td colSpan={4} className="py-8 text-center text-sm text-[#6E6A66]">Loading...</td></tr>
              ) : placementTypes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-[#7C746C]">
                      <Database className="w-10 h-10 mb-3 text-[#D4A753]/40" />
                      <div className="text-sm font-bold text-[#1A1615]">No placement types found</div>
                      <div className="text-xs mt-1">Add a new placement type to get started.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                placementTypes.map(placement => (
                  <tr key={placement.id} className="border-b border-[#EFECE6] hover:bg-[#FAF8F5]">
                    <td className="py-3 px-4 text-sm font-medium text-[#1A1615]">{placement.id}</td>
                    <td className="py-3 px-4 text-sm font-medium text-[#1A1615]">{placement.name}</td>
                    <td className="py-3 px-4">
                      {placement.status !== false ? (
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
                      <button onClick={() => handleEditPlacementType(placement)} className="p-1.5 text-[#6E6A66] hover:bg-[#EFECE6] rounded-md transition-colors cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => placement.id && setDeleteConfirmation({ type: 'placement', id: String(placement.id), name: placement.name })} className="p-1.5 text-[#6E6A66] hover:bg-red-50 hover:text-red-600 rounded-md transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : null}
      </div>

      {/* Reward Type Modal */}
      {isRewardTypeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
            <button 
              onClick={() => setIsRewardTypeModalOpen(false)} 
              className="absolute top-4 right-4 p-1.5 text-[#9E9A93] hover:bg-[#FAF8F5] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-[#1A1615] mb-4">
              {editingRewardType ? 'Edit Reward Type' : 'Add New Reward Type'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6E6A66] mb-1">Reward Type Name <span className="text-[#DC2626]">*</span></label>
                <input 
                  type="text" 
                  value={rewardTypeTitle}
                  onChange={e => setRewardTypeTitle(e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:border-[#D4A753] focus:ring-1 focus:ring-[#D4A753] outline-none ${hasSubmittedRewardType && !rewardTypeTitle.trim() ? 'border-[#DC2626] bg-[#FEF2F2]' : 'border-[#EAE6E1]'}`} 
                  placeholder="Enter reward name"
                />
                {hasSubmittedRewardType && !rewardTypeTitle.trim() && <p className="text-[#DC2626] text-[10px] font-bold mt-1">Name is required</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6E6A66] mb-1">Description</label>
                <textarea 
                  value={rewardTypeDesc}
                  onChange={e => setRewardTypeDesc(e.target.value)}
                  className="w-full border border-[#EAE6E1] rounded-lg px-3 py-2 text-sm focus:border-[#D4A753] focus:ring-1 focus:ring-[#D4A753] outline-none min-h-[80px]" 
                  placeholder="Enter description (optional)"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6E6A66] mb-1">Icon Selection</label>
                <div className="relative">
                  <select
                    value={rewardTypeIcon}
                    onChange={e => setRewardTypeIcon(e.target.value)}
                    className="w-full border border-[#EAE6E1] rounded-lg pl-3 pr-10 py-2 text-sm appearance-none focus:border-[#D4A753] focus:ring-1 focus:ring-[#D4A753] outline-none bg-white cursor-pointer"
                  >
                    <option value="Wallet">Wallet (Cashback)</option>
                    <option value="Percent">Percent (Discount)</option>
                    <option value="Star">Star (Points)</option>
                    <option value="Gift">Gift (Free Item)</option>
                    <option value="Package">Package</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#9E9A93] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer p-3 border border-[#EAE6E1] rounded-lg hover:bg-[#FAF8F5] transition-colors mt-2">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={rewardTypeIsActive}
                    onChange={(e) => setRewardTypeIsActive(e.target.checked)}
                    className="w-5 h-5 appearance-none border-2 border-[#D1CDC7] rounded-md checked:bg-[#D4A753] checked:border-[#D4A753] transition-colors cursor-pointer"
                  />
                  {rewardTypeIsActive && <Check className="w-3.5 h-3.5 text-white absolute pointer-events-none" />}
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1A1615]">Active Reward Type</div>
                  <div className="text-[11px] text-[#6E6A66]">Inactive rewards won't appear in the campaign builder.</div>
                </div>
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setHasSubmittedRewardType(false); setIsRewardTypeModalOpen(false); }} className="px-4 py-2 text-sm font-bold text-[#6E6A66] hover:bg-[#FAF8F5] rounded-lg transition-colors cursor-pointer">Cancel</button>
              <button onClick={handleSaveRewardType} className="px-4 py-2 text-sm font-bold text-white bg-[#D4A753] hover:bg-[#B68F45] rounded-lg transition-colors cursor-pointer">Save</button>
            </div>
          </div>
        </div>
      )}

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
                <label className="block text-xs font-bold text-[#6E6A66] mb-1">Label <span className="text-[#DC2626]">*</span></label>
                <input 
                  type="text" 
                  value={fieldLabel}
                  onChange={e => setFieldLabel(e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:border-[#D4A753] focus:ring-1 focus:ring-[#D4A753] outline-none ${hasSubmittedField && !fieldLabel.trim() ? 'border-[#DC2626] bg-[#FEF2F2]' : 'border-[#EAE6E1]'}`} 
                  placeholder="Enter field label"
                />
                {hasSubmittedField && !fieldLabel.trim() && <p className="text-[#DC2626] text-[10px] font-bold mt-1">Label is required</p>}
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
              <button onClick={() => { setHasSubmittedField(false); setIsFieldModalOpen(false); }} className="px-4 py-2 text-sm font-bold text-[#6E6A66] hover:bg-[#FAF8F5] rounded-lg transition-colors cursor-pointer">Cancel</button>
              <button onClick={handleSaveField} className="px-4 py-2 text-sm font-bold text-white bg-[#D4A753] hover:bg-[#B68F45] rounded-lg transition-colors cursor-pointer">Save</button>
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
                <label className="block text-xs font-bold text-[#6E6A66] mb-1">Label <span className="text-[#DC2626]">*</span></label>
                <input 
                  type="text" 
                  value={tierLabel}
                  onChange={e => setTierLabel(e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:border-[#D4A753] focus:ring-1 focus:ring-[#D4A753] outline-none ${hasSubmittedTier && !tierLabel.trim() ? 'border-[#DC2626] bg-[#FEF2F2]' : 'border-[#EAE6E1]'}`} 
                  placeholder="Enter tier label"
                />
                {hasSubmittedTier && !tierLabel.trim() && <p className="text-[#DC2626] text-[10px] font-bold mt-1">Label is required</p>}
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
              <button onClick={() => { setHasSubmittedTier(false); setIsTierModalOpen(false); }} className="px-4 py-2 text-sm font-bold text-[#6E6A66] hover:bg-[#FAF8F5] rounded-lg transition-colors cursor-pointer">Cancel</button>
              <button onClick={handleSaveTier} className="px-4 py-2 text-sm font-bold text-white bg-[#D4A753] hover:bg-[#B68F45] rounded-lg transition-colors cursor-pointer">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-[400px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-[#1A1615] mb-2">Delete {deleteConfirmation.type === 'field' ? 'Rule Field' : deleteConfirmation.type === 'tier' ? 'Tier Option' : deleteConfirmation.type === 'reward' ? 'Reward Type' : deleteConfirmation.type === 'asset' ? 'Asset Type' : 'Placement Type'}</h2>
              <p className="text-sm text-[#6E6A66]">
                Are you sure you want to delete <span className="font-bold text-[#1A1615]">{deleteConfirmation.name}</span>? This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 bg-[#FAF8F5] border-t border-[#EAE6E1] flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 text-sm font-bold text-[#6E6A66] hover:bg-[#EAE6E1] rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirmation.type === 'field') {
                    dispatch(deleteRuleField(deleteConfirmation.id));
                    showToast('Rule Field deleted successfully!');
                  } else if (deleteConfirmation.type === 'tier') {
                    dispatch(deleteTierOption(deleteConfirmation.id));
                    showToast('Tier Option deleted successfully!');
                  } else if (deleteConfirmation.type === 'reward') {
                    dispatch(deleteRewardType(deleteConfirmation.id));
                    showToast('Reward Type deleted successfully!');
                  } else if (deleteConfirmation.type === 'asset') {
                    dispatch(deleteAssetType(deleteConfirmation.id));
                    showToast('Asset Type deleted successfully!');
                  } else {
                    dispatch(deletePlacementType(deleteConfirmation.id));
                    showToast('Placement Type deleted successfully!');
                  }
                  setDeleteConfirmation(null);
                }}
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#0D7A53] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Check className="w-5 h-5" />
          <span className="font-semibold text-sm">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:opacity-75 transition-opacity">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {/* Asset Type Modal */}
      {isAssetTypeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsAssetTypeModalOpen(false)} 
              className="absolute top-4 right-4 p-1.5 text-[#9E9A93] hover:bg-[#FAF8F5] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-[#1A1615] mb-4">
              {editingAssetType ? 'Edit Asset Type' : 'Add New Asset Type'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6E6A66] mb-1">Asset Name <span className="text-[#DC2626]">*</span></label>
                <input 
                  type="text" 
                  value={assetTypeName}
                  onChange={e => setAssetTypeName(e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:border-[#D4A753] focus:ring-1 focus:ring-[#D4A753] outline-none ${hasSubmittedAssetType && !assetTypeName.trim() ? 'border-[#DC2626] bg-[#FEF2F2]' : 'border-[#EAE6E1]'}`} 
                  placeholder="Enter asset name"
                />
                {hasSubmittedAssetType && !assetTypeName.trim() && <p className="text-[#DC2626] text-[10px] font-bold mt-1">Name is required</p>}
              </div>
              <label className="flex items-center gap-3 cursor-pointer p-3 border border-[#EAE6E1] rounded-lg hover:bg-[#FAF8F5] transition-colors mt-2">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={assetTypeIsActive}
                    onChange={(e) => setAssetTypeIsActive(e.target.checked)}
                    className="w-5 h-5 appearance-none border-2 border-[#D1CDC7] rounded-md checked:bg-[#D4A753] checked:border-[#D4A753] transition-colors cursor-pointer"
                  />
                  {assetTypeIsActive && <Check className="w-3.5 h-3.5 text-white absolute pointer-events-none" />}
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1A1615]">Active Asset Type</div>
                  <div className="text-[11px] text-[#6E6A66]">Inactive asset types won't appear as options for QR codes.</div>
                </div>
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setHasSubmittedAssetType(false); setIsAssetTypeModalOpen(false); }} className="px-4 py-2 text-sm font-bold text-[#6E6A66] hover:bg-[#FAF8F5] rounded-lg transition-colors cursor-pointer">Cancel</button>
              <button onClick={handleSaveAssetType} className="px-4 py-2 bg-[#D4A753] text-white text-sm font-bold rounded-lg hover:bg-[#C29543] transition-colors cursor-pointer shadow-sm">
                {editingAssetType ? 'Save Changes' : 'Add Asset Type'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Placement Type Modal */}
      {isPlacementTypeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsPlacementTypeModalOpen(false)} 
              className="absolute top-4 right-4 p-1.5 text-[#9E9A93] hover:bg-[#FAF8F5] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-[#1A1615] mb-4">
              {editingPlacementType ? 'Edit Placement Type' : 'Add New Placement Type'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6E6A66] mb-1">Placement Name <span className="text-[#DC2626]">*</span></label>
                <input 
                  type="text" 
                  value={placementTypeName}
                  onChange={e => setPlacementTypeName(e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:border-[#D4A753] focus:ring-1 focus:ring-[#D4A753] outline-none ${hasSubmittedPlacementType && !placementTypeName.trim() ? 'border-[#DC2626] bg-[#FEF2F2]' : 'border-[#EAE6E1]'}`} 
                  placeholder="Enter placement name"
                />
                {hasSubmittedPlacementType && !placementTypeName.trim() && <p className="text-[#DC2626] text-[10px] font-bold mt-1">Name is required</p>}
              </div>
              <label className="flex items-center gap-3 cursor-pointer p-3 border border-[#EAE6E1] rounded-lg hover:bg-[#FAF8F5] transition-colors mt-2">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={placementTypeIsActive}
                    onChange={(e) => setPlacementTypeIsActive(e.target.checked)}
                    className="w-5 h-5 appearance-none border-2 border-[#D1CDC7] rounded-md checked:bg-[#D4A753] checked:border-[#D4A753] transition-colors cursor-pointer"
                  />
                  {placementTypeIsActive && <Check className="w-3.5 h-3.5 text-white absolute pointer-events-none" />}
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1A1615]">Active Placement Type</div>
                  <div className="text-[11px] text-[#6E6A66]">Inactive placement types won't appear as options.</div>
                </div>
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setHasSubmittedPlacementType(false); setIsPlacementTypeModalOpen(false); }} className="px-4 py-2 text-sm font-bold text-[#6E6A66] hover:bg-[#FAF8F5] rounded-lg transition-colors cursor-pointer">Cancel</button>
              <button onClick={handleSavePlacementType} className="px-4 py-2 bg-[#D4A753] text-white text-sm font-bold rounded-lg hover:bg-[#C29543] transition-colors cursor-pointer shadow-sm">
                {editingPlacementType ? 'Save Changes' : 'Add Placement Type'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
