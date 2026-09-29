import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import onboardingReducer from './slices/onboardingSlice';
import locationReducer from './slices/locationSlice';
import staffReducer from './slices/staffSlice';
import branchReducer from './slices/branchSlice';
import campaignReducer from './slices/campaignSlice';
import customerReducer from './slices/customerSlice';
import qrCodeReducer from './slices/qrCodeSlice';
import masterReducer from './slices/masterSlice';
import catalogReducer from './slices/catalogSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    onboarding: onboardingReducer,
    location: locationReducer,
    staff: staffReducer,
    branch: branchReducer,
    campaign: campaignReducer,
    customer: customerReducer,
    qrCode: qrCodeReducer,
    master: masterReducer,
    catalog: catalogReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
