import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

export interface Branch {
  id: number;
  name: string;
  code: string;
  address: string;
  contact_email: string;
  contact_phone: string;
  timezone: string;
  manager_id: number | null;
  operating_details: any;
  status: string;
  created_at?: string;
  updated_at?: string;
}

interface BranchState {
  branches: Branch[];
  currentBranch: Branch | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BranchState = {
  branches: [],
  currentBranch: null,
  isLoading: false,
  error: null,
};

export const fetchBranches = createAsyncThunk(
  'branch/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/merchant/branches');
      return response.data.data?.data || response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch branches');
    }
  }
);

export const fetchBranchById = createAsyncThunk(
  'branch/fetchById',
  async (id: number | string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/merchant/branches/${id}`);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch branch details');
    }
  }
);

export const createBranch = createAsyncThunk(
  'branch/create',
  async (branchData: Partial<Branch>, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/merchant/branches', branchData);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create branch');
    }
  }
);

export const updateBranch = createAsyncThunk(
  'branch/update',
  async ({ id, data }: { id: number | string; data: Partial<Branch> }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/merchant/branches/${id}`, data);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update branch');
    }
  }
);

export const deleteBranch = createAsyncThunk(
  'branch/delete',
  async (id: number | string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/merchant/branches/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete branch');
    }
  }
);

const branchSlice = createSlice({
  name: 'branch',
  initialState,
  reducers: {
    clearBranchError: (state) => {
      state.error = null;
    },
    setCurrentBranch: (state, action) => {
      state.currentBranch = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all branches
      .addCase(fetchBranches.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.branches = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch single branch
      .addCase(fetchBranchById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBranchById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBranch = action.payload;
      })
      .addCase(fetchBranchById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create branch
      .addCase(createBranch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBranch.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.branches.push(action.payload);
        }
      })
      .addCase(createBranch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update branch
      .addCase(updateBranch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBranch.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          const index = state.branches.findIndex(b => b.id === action.payload.id);
          if (index !== -1) {
            state.branches[index] = action.payload;
          }
          if (state.currentBranch?.id === action.payload.id) {
            state.currentBranch = action.payload;
          }
        }
      })
      .addCase(updateBranch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Delete branch
      .addCase(deleteBranch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.branches = state.branches.filter(b => b.id !== Number(action.payload));
        if (state.currentBranch?.id === Number(action.payload)) {
          state.currentBranch = null;
        }
      })
      .addCase(deleteBranch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBranchError, setCurrentBranch } = branchSlice.actions;
export default branchSlice.reducer;
