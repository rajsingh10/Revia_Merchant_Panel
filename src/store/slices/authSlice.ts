import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

interface AuthState {
  mobileNumber: string;
  isOtpSent: boolean;
  isMobileVerified: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  mobileNumber: '',
  isOtpSent: false,
  isMobileVerified: false,
  isLoading: false,
  error: null,
};

export const requestRegisterOtp = createAsyncThunk(
  'auth/requestRegisterOtp',
  async (phone: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('auth/merchant/request-register-otp', {
        phone,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to request OTP');
    }
  }
);

export const registerMerchant = createAsyncThunk(
  'auth/registerMerchant',
  async (data: { name: string; phone?: string; email?: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('auth/merchant/register', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify OTP');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setMobileNumber(state, action) {
      state.mobileNumber = action.payload;
    },
    resetAuthState(state) {
      state.isOtpSent = false;
      state.isMobileVerified = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestRegisterOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestRegisterOtp.fulfilled, (state) => {
        state.isLoading = false;
        state.isOtpSent = true;
      })
      .addCase(requestRegisterOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(registerMerchant.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerMerchant.fulfilled, (state) => {
        state.isLoading = false;
        state.isMobileVerified = true;
      })
      .addCase(registerMerchant.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setMobileNumber, resetAuthState } = authSlice.actions;

export default authSlice.reducer;
