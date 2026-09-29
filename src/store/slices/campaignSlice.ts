import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

export interface Campaign {
  id: number;
  title: string;
  type?: string;
  branch_id?: string | number;
  customer_type?: string;
  target_value?: string | number;
  min_bill_amount?: string | number;
  target_item_name?: string;
  schedule_config?: any;
  reward_type?: string;
  reward_value?: string | number;
  description?: string;
  status?: string;
  is_active?: boolean;
  valid_from?: string;
  valid_until?: string;
  created_at?: string;
  updated_at?: string;
}

interface CampaignState {
  campaigns: Campaign[];
  currentCampaign: Campaign | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CampaignState = {
  campaigns: [],
  currentCampaign: null,
  isLoading: false,
  error: null,
};

export const fetchCampaigns = createAsyncThunk(
  'campaign/fetchAll',
  async (params: any | undefined, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/merchant/campaigns', { params });
      return response.data.data?.data || response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch campaigns');
    }
  }
);

export const fetchCampaignById = createAsyncThunk(
  'campaign/fetchById',
  async (id: number | string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/merchant/campaigns/${id}`);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch campaign details');
    }
  }
);

export const createCampaign = createAsyncThunk(
  'campaign/create',
  async (campaignData: Partial<Campaign>, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/merchant/campaigns', campaignData);
      return response.data.data || response.data;
    } catch (error: any) {
      let msg = error.response?.data?.message || 'Failed to create campaign';
      if (error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0];
        if (Array.isArray(firstError)) msg = firstError[0] as string;
      }
      return rejectWithValue({ message: msg, errors: error.response?.data?.errors || null });
    }
  }
);

export const updateCampaign = createAsyncThunk(
  'campaign/update',
  async ({ id, data }: { id: number | string; data: Partial<Campaign> }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/merchant/campaigns/${id}`, data);
      return response.data.data || response.data;
    } catch (error: any) {
      let msg = error.response?.data?.message || 'Failed to update campaign';
      if (error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0];
        if (Array.isArray(firstError)) msg = firstError[0] as string;
      }
      return rejectWithValue({ message: msg, errors: error.response?.data?.errors || null });
    }
  }
);

export const deleteCampaign = createAsyncThunk(
  'campaign/delete',
  async (id: number | string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/merchant/campaigns/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete campaign');
    }
  }
);

const campaignSlice = createSlice({
  name: 'campaign',
  initialState,
  reducers: {
    clearCampaignError: (state) => {
      state.error = null;
    },
    setCurrentCampaign: (state, action) => {
      state.currentCampaign = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchCampaigns.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campaigns = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch single
      .addCase(fetchCampaignById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCampaignById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCampaign = action.payload;
      })
      .addCase(fetchCampaignById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create
      .addCase(createCampaign.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.campaigns.push(action.payload);
        }
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update
      .addCase(updateCampaign.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCampaign.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          const index = state.campaigns.findIndex(c => c.id === action.payload.id);
          if (index !== -1) {
            state.campaigns[index] = action.payload;
          }
          if (state.currentCampaign?.id === action.payload.id) {
            state.currentCampaign = action.payload;
          }
        }
      })
      .addCase(updateCampaign.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Delete
      .addCase(deleteCampaign.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCampaign.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campaigns = state.campaigns.filter(c => c.id !== Number(action.payload));
        if (state.currentCampaign?.id === Number(action.payload)) {
          state.currentCampaign = null;
        }
      })
      .addCase(deleteCampaign.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCampaignError, setCurrentCampaign } = campaignSlice.actions;
export default campaignSlice.reducer;
