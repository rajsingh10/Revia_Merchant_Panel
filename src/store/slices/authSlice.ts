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
  async (identifier: string, { rejectWithValue }) => {
    try {
      const isEmail = identifier.includes('@');
      const payload = isEmail ? { email: identifier } : { phone: identifier };
      const response = await apiClient.post('auth/merchant/request-register-otp', payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to request OTP');
    }
  }
);

export const registerMerchant = createAsyncThunk(
  'auth/registerMerchant',
  async (data: { identifier: string; otp: string; name?: string }, { rejectWithValue }) => {
    try {
      const isEmail = data.identifier.includes('@');
      const payload = {
        otp: data.otp,
        ...(data.name ? { name: data.name } : {}),
        ...(isEmail ? { email: data.identifier } : { phone: data.identifier }),
      };
      const response = await apiClient.post('auth/merchant/register', payload);
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
