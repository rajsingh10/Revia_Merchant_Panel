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

interface MasterState {
  ruleFields: RuleField[];
  tierOptions: TierOption[];
  isLoadingFields: boolean;
  isLoadingTiers: boolean;
  error: string | null;
}

const initialState: MasterState = {
  ruleFields: [],
  tierOptions: [],
  isLoadingFields: false,
  isLoadingTiers: false,
  error: null,
};

export const fetchRuleFields = createAsyncThunk(
  'master/fetchRuleFields',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/merchant/masters/rule-fields');
      return response.data?.data || response.data || [];
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
      return response.data?.data || response.data || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tier options');
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

const masterSlice = createSlice({
  name: 'master',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Rule Fields
    builder
      .addCase(fetchRuleFields.pending, (state) => {
        state.isLoadingFields = true;
        state.error = null;
      })
      .addCase(fetchRuleFields.fulfilled, (state, action) => {
        state.isLoadingFields = false;
        state.ruleFields = action.payload;
      })
      .addCase(fetchRuleFields.rejected, (state, action) => {
        state.isLoadingFields = false;
        state.error = action.payload as string;
      });

    // Tier Options
    builder
      .addCase(fetchTierOptions.pending, (state) => {
        state.isLoadingTiers = true;
        state.error = null;
      })
      .addCase(fetchTierOptions.fulfilled, (state, action) => {
        state.isLoadingTiers = false;
        state.tierOptions = action.payload;
      })
      .addCase(fetchTierOptions.rejected, (state, action) => {
        state.isLoadingTiers = false;
        state.error = action.payload as string;
      });
  },
});

export default masterSlice.reducer;
