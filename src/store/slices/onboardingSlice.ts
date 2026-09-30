import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

interface OnboardingState {
  isOnboardingComplete: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: OnboardingState = {
  isOnboardingComplete: false,
  isLoading: false,
  error: null,
};

export const onboardMerchant = createAsyncThunk(
  'onboarding/onboardMerchant',
  async (
    data: {
      businessName: string;
      ownerName: string;
      businessCategory: string;
      branchName: string;
      address: string;
      timezone: string;
      hours: string;
      registerType: string;
      city?: string;
      state_province?: string;
      country?: string;
      postal_code?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const payload = {
        name: data.businessName,
        owner_name: data.ownerName,
        category_id: data.businessCategory,
        branch_name: data.branchName,
        address: data.address,
        timezone: data.timezone,
        hours: data.hours,
        register_type: data.registerType,
        city: data.city,
        state_province: data.state_province,
        country: data.country,
        postal_code: data.postal_code,
      };
      console.log('Sending payload to onboard:', payload);
      // Important to send token if required, but assuming apiClient handles it or it relies on cookies/sessions from auth.
      const response = await apiClient.post('merchant/business/onboard', payload);
      console.log('Onboard response:', response);
      return response.data;
    } catch (error: any) {
      console.error('Onboard error:', error);
      const data = error.response?.data;
      let errorMsg = data?.message || 'Failed to onboard merchant';
      if (data?.errors) {
        const errorList = Object.values(data.errors).flat();
        if (errorList.length > 0) {
          errorMsg = errorList.join(' ');
        }
      }
      return rejectWithValue(errorMsg);
    }
  }
);

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    resetOnboardingState(state) {
      state.isOnboardingComplete = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(onboardMerchant.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(onboardMerchant.fulfilled, (state) => {
        state.isLoading = false;
        state.isOnboardingComplete = true;
      })
      .addCase(onboardMerchant.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetOnboardingState } = onboardingSlice.actions;

export default onboardingSlice.reducer;