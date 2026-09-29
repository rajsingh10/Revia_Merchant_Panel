import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import onboardingReducer from './slices/onboardingSlice';
import locationReducer from './slices/locationSlice';
import staffReducer from './slices/staffSlice';
import branchReducer from './slices/branchSlice';
import campaignReducer from './slices/campaignSlice';
import customerReducer from './slices/customerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    onboarding: onboardingReducer,
    location: locationReducer,
    staff: staffReducer,
    branch: branchReducer,
    campaign: campaignReducer,
    customer: customerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
