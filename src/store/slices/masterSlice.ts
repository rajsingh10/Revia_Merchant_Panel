import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

export interface RuleField {
  key: string;
  label: string;
  type: 'currency' | 'number' | 'date' | 'select';
  isActive: boolean;
}

export interface TierOption {
  value: string;
  label: string;
  isActive: boolean;
}

export interface RewardTypeOption {
  id: string;
  title: string;
  desc: string;
  iconName: string;
  isActive: boolean;
}

export interface AssetTypeOption {
  id?: string | number;
  name: string;
  isActive?: boolean;
  status?: boolean;
}

export interface PlacementTypeOption {
  id?: string | number;
  name: string;
  status?: boolean;
}

interface MasterState {
  ruleFields: RuleField[];
  tierOptions: TierOption[];
  rewardTypes: RewardTypeOption[];
  assetTypes: AssetTypeOption[];
  placementTypes: PlacementTypeOption[];
  isLoadingFields: boolean;
  isLoadingTiers: boolean;
  isLoadingRewards: boolean;
  isLoadingAssetTypes: boolean;
  isLoadingPlacementTypes: boolean;
  error: string | null;
}

const initialState: MasterState = {
  ruleFields: [],
  tierOptions: [],
  rewardTypes: [],
  assetTypes: [],
  placementTypes: [],
  isLoadingFields: false,
  isLoadingTiers: false,
  isLoadingRewards: false,
  isLoadingAssetTypes: false,
  isLoadingPlacementTypes: false,
  error: null,
};

export const fetchRuleFields = createAsyncThunk(
  'master/fetchRuleFields',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/merchant/masters/rule-fields');
      // Handle nested pagination structure
      let items = response.data;
      if (items?.data && !Array.isArray(items)) items = items.data;
      if (items?.data && !Array.isArray(items)) items = items.data;
      return Array.isArray(items) ? items : [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch rule fields');
    }
  }
);

export const fetchTierOptions = createAsyncThunk(
  'master/fetchTierOptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/merchant/masters/tiers');
      // Handle nested pagination structure
      let items = response.data;
      if (items?.data && !Array.isArray(items)) items = items.data;
      if (items?.data && !Array.isArray(items)) items = items.data;
      return Array.isArray(items) ? items : [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tier options');
    }
  }
);

export const fetchRewardTypes = createAsyncThunk(
  'master/fetchRewardTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/merchant/masters/reward-types');
      let items = response.data;
      if (items?.data && !Array.isArray(items)) items = items.data;
      if (items?.data && !Array.isArray(items)) items = items.data;
      
      // Fallback for demo if API fails/empty
      if (!Array.isArray(items) || items.length === 0) {
        return [
          { id: 'cashback', title: 'Cashback', desc: 'Credit fixed wallet amount back to customer balance', iconName: 'Wallet', isActive: true },
          { id: 'discount', title: 'Discount', desc: 'Apply % percentage or fixed value price deduction', iconName: 'Percent', isActive: true },
          { id: 'points', title: 'Reward Points', desc: 'Grant loyalty program bonus point boost', iconName: 'Star', isActive: true },
          { id: 'free_item', title: 'Free Item', desc: 'Give 100% complimentary product or Perk BOGO', iconName: 'Gift', isActive: true },
        ];
      }
      return items;
    } catch (error: any) {
      // Mock fallback
      return [
        { id: 'cashback', title: 'Cashback', desc: 'Credit fixed wallet amount back to customer balance', iconName: 'Wallet', isActive: true },
        { id: 'discount', title: 'Discount', desc: 'Apply % percentage or fixed value price deduction', iconName: 'Percent', isActive: true },
        { id: 'points', title: 'Reward Points', desc: 'Grant loyalty program bonus point boost', iconName: 'Star', isActive: true },
        { id: 'free_item', title: 'Free Item', desc: 'Give 100% complimentary product or Perk BOGO', iconName: 'Gift', isActive: true },
      ];
    }
  }
);

export const fetchAssetTypes = createAsyncThunk(
  'master/fetchAssetTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/merchant/masters/asset-types');
      let items = response.data;
      if (items?.data && !Array.isArray(items)) items = items.data;
      if (items?.data && !Array.isArray(items)) items = items.data;
      return Array.isArray(items) ? items : [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch asset types');
    }
  }
);

// --- Rule Fields CRUD ---
export const addRuleField = createAsyncThunk(
  'master/addRuleField',
  async (field: RuleField, { rejectWithValue, dispatch }) => {
    try {
      await apiClient.post('/merchant/masters/rule-fields', field);
      dispatch(fetchRuleFields());
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add rule field');
    }
  }
);

export const updateRuleField = createAsyncThunk(
  'master/updateRuleField',
  async (field: RuleField, { rejectWithValue, dispatch }) => {
    try {
      await apiClient.put(`/merchant/masters/rule-fields/${field.key}`, { label: field.label, type: field.type, isActive: field.isActive });
      dispatch(fetchRuleFields());
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update rule field');
    }
  }
);

export const deleteRuleField = createAsyncThunk(
  'master/deleteRuleField',
  async (key: string, { rejectWithValue, dispatch }) => {
    try {
      await apiClient.delete(`/merchant/masters/rule-fields/${key}`);
      dispatch(fetchRuleFields());
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete rule field');
    }
  }
);

// --- Tier Options CRUD ---
export const addTierOption = createAsyncThunk(
  'master/addTierOption',
  async (tier: TierOption, { rejectWithValue, dispatch }) => {
    try {
      await apiClient.post('/merchant/masters/tiers', tier);
      dispatch(fetchTierOptions());
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add tier');
    }
  }
);

export const updateTierOption = createAsyncThunk(
  'master/updateTierOption',
  async (tier: TierOption, { rejectWithValue, dispatch }) => {
    try {
      await apiClient.put(`/merchant/masters/tiers/${tier.value}`, { label: tier.label, isActive: tier.isActive });
      dispatch(fetchTierOptions());
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update tier');
    }
  }
);

export const deleteTierOption = createAsyncThunk(
  'master/deleteTierOption',
  async (value: string, { rejectWithValue, dispatch }) => {
    try {
      await apiClient.delete(`/merchant/masters/tiers/${value}`);
      dispatch(fetchTierOptions());
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete tier');
    }
  }
);

// --- Reward Types CRUD ---
export const addRewardType = createAsyncThunk(
  'master/addRewardType',
  async (reward: RewardTypeOption, { rejectWithValue, dispatch }) => {
    try {
      await apiClient.post('/merchant/masters/reward-types', reward);
      dispatch(fetchRewardTypes());
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add reward type');
    }
  }
);

export const updateRewardType = createAsyncThunk(
  'master/updateRewardType',
  async (reward: RewardTypeOption, { rejectWithValue, dispatch }) => {
    try {
      await apiClient.put(`/merchant/masters/reward-types/${reward.id}`, { title: reward.title, desc: reward.desc, iconName: reward.iconName, isActive: reward.isActive });
      dispatch(fetchRewardTypes());
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update reward type');
    }
  }
);

export const deleteRewardType = createAsyncThunk(
  'master/deleteRewardType',
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      await apiClient.delete(`/merchant/masters/reward-types/${id}`);
      dispatch(fetchRewardTypes());
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete reward type');
    }
  }
);

// --- Asset Types CRUD ---
export const addAssetType = createAsyncThunk(
  'master/addAssetType',
  async (assetType: AssetTypeOption, { rejectWithValue, dispatch }) => {
    try {
      await apiClient.post('/merchant/masters/asset-types', assetType);
      dispatch(fetchAssetTypes());
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add asset type');
    }
  }
);

export const updateAssetType = createAsyncThunk(
  'master/updateAssetType',
  async (assetType: AssetTypeOption, { rejectWithValue, dispatch }) => {
    try {
      await apiClient.put(`/merchant/masters/asset-types/${assetType.id}`, assetType);
      dispatch(fetchAssetTypes());
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update asset type');
    }
  }
);

export const deleteAssetType = createAsyncThunk(
  'master/deleteAssetType',
  async (id: string | number, { rejectWithValue, dispatch }) => {
    try {
      await apiClient.delete(`/merchant/masters/asset-types/${id}`);
      dispatch(fetchAssetTypes());
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete asset type');
    }
  }
);

// --- Placement Types CRUD ---
export const fetchPlacementTypes = createAsyncThunk(
  'master/fetchPlacementTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/merchant/masters/placement-types');
      const data = response.data;
      if (data && data.data) {
        if (Array.isArray(data.data.data)) {
          return data.data.data;
        }
        if (Array.isArray(data.data)) {
          return data.data;
        }
      }
      return [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch placement types');
    }
  }
);

export const addPlacementType = createAsyncThunk(
  'master/addPlacementType',
  async (placementType: PlacementTypeOption, { rejectWithValue, dispatch }) => {
    try {
      await apiClient.post('/merchant/masters/placement-types', placementType);
      dispatch(fetchPlacementTypes());
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add placement type');
    }
  }
);

export const updatePlacementType = createAsyncThunk(
  'master/updatePlacementType',
  async (placementType: PlacementTypeOption, { rejectWithValue, dispatch }) => {
    try {
      await apiClient.put(`/merchant/masters/placement-types/${placementType.id}`, placementType);
      dispatch(fetchPlacementTypes());
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update placement type');
    }
  }
);

export const deletePlacementType = createAsyncThunk(
  'master/deletePlacementType',
  async (id: string | number, { rejectWithValue, dispatch }) => {
    try {
      await apiClient.delete(`/merchant/masters/placement-types/${id}`);
      dispatch(fetchPlacementTypes());
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete placement type');
    }
  }
);

const masterSlice = createSlice({
  name: 'master',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Rule Fields
    builder
      .addCase(fetchRuleFields.pending, (state) => {
        if (state.ruleFields.length === 0) state.isLoadingFields = true;
        state.error = null;
      })
      .addCase(fetchRuleFields.fulfilled, (state, action) => {
        state.isLoadingFields = false;
        state.ruleFields = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchRuleFields.rejected, (state, action) => {
        state.isLoadingFields = false;
        state.error = action.payload as string;
      });

    // Tier Options
    builder
      .addCase(fetchTierOptions.pending, (state) => {
        if (state.tierOptions.length === 0) state.isLoadingTiers = true;
        state.error = null;
      })
      .addCase(fetchTierOptions.fulfilled, (state, action) => {
        state.isLoadingTiers = false;
        state.tierOptions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTierOptions.rejected, (state, action) => {
        state.isLoadingTiers = false;
        state.error = action.payload as string;
      });

    // Reward Types
    builder
      .addCase(fetchRewardTypes.pending, (state) => {
        if (state.rewardTypes.length === 0) state.isLoadingRewards = true;
        state.error = null;
      })
      .addCase(fetchRewardTypes.fulfilled, (state, action) => {
        state.isLoadingRewards = false;
        state.rewardTypes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchRewardTypes.rejected, (state, action) => {
        state.isLoadingRewards = false;
        state.error = action.payload as string;
      });

    // Asset Types
    builder
      .addCase(fetchAssetTypes.pending, (state) => {
        if (state.assetTypes.length === 0) state.isLoadingAssetTypes = true;
        state.error = null;
      })
      .addCase(fetchAssetTypes.fulfilled, (state, action) => {
        state.isLoadingAssetTypes = false;
        state.assetTypes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAssetTypes.rejected, (state, action) => {
        state.isLoadingAssetTypes = false;
        state.error = action.payload as string;
      });

    // Placement Types
    builder
      .addCase(fetchPlacementTypes.pending, (state) => {
        if (state.placementTypes.length === 0) state.isLoadingPlacementTypes = true;
        state.error = null;
      })
      .addCase(fetchPlacementTypes.fulfilled, (state, action) => {
        state.isLoadingPlacementTypes = false;
        state.placementTypes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPlacementTypes.rejected, (state, action) => {
        state.isLoadingPlacementTypes = false;
        state.error = action.payload as string;
      });
  },
});

export default masterSlice.reducer;
