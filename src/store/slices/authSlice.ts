import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

interface User {
  id?: number;
  user_id?: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  role?: string;
  roles?: string[];
  merchant_status?: string;
  admin_approved?: boolean;
  has_business?: boolean;
  [key: string]: any;
}

interface AuthState {
  mobileNumber: string;
  isOtpSent: boolean;
  isMobileVerified: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

const tokenFromStorage = localStorage.getItem('token');
const userFromStorage = localStorage.getItem('user');

const initialState: AuthState = {
  mobileNumber: '',
  isOtpSent: false,
  isMobileVerified: false,
  isLoading: false,
  error: null,
  token: tokenFromStorage,
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
  isAuthenticated: !!tokenFromStorage,
};

export const requestLoginOtp = createAsyncThunk(
  'auth/requestLoginOtp',
  async (identifier: string, { rejectWithValue }) => {
    try {
      const isEmail = identifier.includes('@');
      const payload = isEmail ? { email: identifier } : { phone: identifier };
      const response = await apiClient.post('auth/request-login-otp', payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to request login OTP');
    }
  }
);

export const loginWithOtp = createAsyncThunk(
  'auth/loginWithOtp',
  async (data: { identifier: string; otp: string }, { rejectWithValue }) => {
    try {
      const isEmail = data.identifier.includes('@');
      const payload = isEmail 
        ? { email: data.identifier, otp: data.otp } 
        : { phone: data.identifier, otp: data.otp };
      const response = await apiClient.post('auth/login-with-otp', payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify login OTP');
    }
  }
);

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
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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
      .addCase(registerMerchant.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isMobileVerified = true;
        
        const payloadData = action.payload?.data || action.payload;
        
        if (payloadData?.token) {
          state.token = payloadData.token;
          const userData = payloadData.user || payloadData;
          state.user = userData;
          state.isAuthenticated = true;
          localStorage.setItem('token', payloadData.token);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      })
      .addCase(registerMerchant.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(requestLoginOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestLoginOtp.fulfilled, (state) => {
        state.isLoading = false;
        state.isOtpSent = true;
      })
      .addCase(requestLoginOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(loginWithOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isMobileVerified = true;
        
        const payloadData = action.payload?.data || action.payload;
        
        if (payloadData?.token) {
          state.token = payloadData.token;
          // The login API returns { token, user: { ... } }
          const userData = payloadData.user || payloadData;
          state.user = userData;
          state.isAuthenticated = true;
          localStorage.setItem('token', payloadData.token);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      })
      .addCase(loginWithOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setMobileNumber, resetAuthState, logout } = authSlice.actions;

export default authSlice.reducer;
