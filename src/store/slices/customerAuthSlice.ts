import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

interface CustomerAuthState {
  isOtpLoading: boolean;
  isVerifyLoading: boolean;
  isProfileSaving: boolean;
  error: string | null;
  isAuthenticated: boolean;
  token: string | null;
}

const initialState: CustomerAuthState = {
  isOtpLoading: false,
  isVerifyLoading: false,
  isProfileSaving: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('customer_token'),
  token: localStorage.getItem('customer_token'),
};

export const requestCustomerOtp = createAsyncThunk(
  'customerAuth/requestOtp',
  async (payload: { identifier: string }, { rejectWithValue }) => {
    try {
      // The payload format depends on backend. I will map it to mobile_number if it's numeric, or email.
      // But the screenshot just says "Enter mobile number or email"
      // If the API expects `mobile_number` specifically, we'll send it as such. For now, assuming the API accepts either under some generic key or specifically handles mobile_number.
      // A common pattern is sending { mobile_number: value } or { email: value }.
      // Let's send the raw identifier and let backend handle, or map it if it's purely digits.
      const isEmail = payload.identifier.includes('@');
      const data = isEmail ? { email: payload.identifier } : { mobile_number: payload.identifier };
      
      const response = await apiClient.post('/customer/auth/request-otp', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to request OTP');
    }
  }
);

export const verifyCustomerOtp = createAsyncThunk(
  'customerAuth/verifyOtp',
  async (payload: { identifier: string; otp: string }, { rejectWithValue }) => {
    try {
      const isEmail = payload.identifier.includes('@');
      const data = isEmail 
        ? { email: payload.identifier, otp: payload.otp }
        : { mobile_number: payload.identifier, otp: payload.otp };

      const response = await apiClient.post('/customer/auth/verify-otp', data);
      const token = response.data?.data?.token || response.data?.token;
      
      if (token) {
        localStorage.setItem('customer_token', token);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify OTP');
    }
  }
);


export const saveCustomerProfile = createAsyncThunk(
  'customerAuth/saveProfile',
  async (payload: any, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.customerAuth?.token || localStorage.getItem('customer_token');
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...(payload instanceof FormData ? {} : { 'Content-Type': 'application/json' })
        }
      };

      const response = await apiClient.post('/customer/profile', payload, config);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save profile');
    }
  }
);

const customerAuthSlice = createSlice({
  name: 'customerAuth',
  initialState,
  reducers: {
    clearCustomerAuthError: (state) => {
      state.error = null;
    },
    logoutCustomer: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem('customer_token');
    }
  },
  extraReducers: (builder) => {
    builder
      // Save Profile
      .addCase(saveCustomerProfile.pending, (state) => {
        state.isProfileSaving = true;
        state.error = null;
      })
      .addCase(saveCustomerProfile.fulfilled, (state) => {
        state.isProfileSaving = false;
      })
      .addCase(saveCustomerProfile.rejected, (state, action) => {
        state.isProfileSaving = false;
        state.error = action.payload as string;
      })
      // Request OTP
      .addCase(requestCustomerOtp.pending, (state) => {
        state.isOtpLoading = true;
        state.error = null;
      })
      .addCase(requestCustomerOtp.fulfilled, (state) => {
        state.isOtpLoading = false;
      })
      .addCase(requestCustomerOtp.rejected, (state, action) => {
        state.isOtpLoading = false;
        state.error = action.payload as string;
      })
      // Verify OTP
      .addCase(verifyCustomerOtp.pending, (state) => {
        state.isVerifyLoading = true;
        state.error = null;
      })
      .addCase(verifyCustomerOtp.fulfilled, (state, action) => {
        state.isVerifyLoading = false;
        state.isAuthenticated = true;
        const token = action.payload?.data?.token || action.payload?.token;
        if (token) {
          state.token = token;
        }
      })
      .addCase(verifyCustomerOtp.rejected, (state, action) => {
        state.isVerifyLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCustomerAuthError, logoutCustomer } = customerAuthSlice.actions;
export default customerAuthSlice.reducer;
