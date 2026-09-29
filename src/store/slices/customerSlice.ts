import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

export interface Customer {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
  type?: string;
  created_at?: string;
  updated_at?: string;
}

interface CustomerState {
  customers: Customer[];
  currentCustomer: Customer | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  customers: [],
  currentCustomer: null,
  isLoading: false,
  error: null,
};

// Query parameters can include `search` and `status`
export const fetchCustomers = createAsyncThunk(
  'customer/fetchAll',
  async (params: { search?: string; status?: string } | undefined, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/merchant/customers', { params });
      return response.data.data?.data || response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customers');
    }
  }
);

export const fetchCustomerById = createAsyncThunk(
  'customer/fetchById',
  async (id: number | string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/merchant/customers/${id}`);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customer details');
    }
  }
);

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    clearCustomerError: (state) => {
      state.error = null;
    },
    setCurrentCustomer: (state, action) => {
      state.currentCustomer = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchCustomers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch single
      .addCase(fetchCustomerById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCustomer = action.payload;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCustomerError, setCurrentCustomer } = customerSlice.actions;
export default customerSlice.reducer;
