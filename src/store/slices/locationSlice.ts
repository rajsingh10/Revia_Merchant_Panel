import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

interface CountryObj {
  id: number;
  name: string;
  [key: string]: any;
}

interface StateObj {
  id: number;
  name: string;
  [key: string]: any;
}

interface CityObj {
  id: number;
  name: string;
  [key: string]: any;
}

interface LocationState {
  countries: CountryObj[];
  states: StateObj[];
  cities: CityObj[];
  isCountriesLoading: boolean;
  isStatesLoading: boolean;
  isCitiesLoading: boolean;
  error: string | null;
}

const initialState: LocationState = {
  countries: [],
  states: [],
  cities: [],
  isCountriesLoading: false,
  isStatesLoading: false,
  isCitiesLoading: false,
  error: null,
};

export const fetchCountries = createAsyncThunk(
  'location/fetchCountries',
  async (_, { rejectWithValue }) => {
    try {
      // API commented out for direct access without backend
      // const response = await apiClient.get('/countries');
      // return response.data;
      return [
        { id: 1, name: 'India', code: 'IN', phone_code: '+91' },
        { id: 2, name: 'United States', code: 'US', phone_code: '+1' },
        { id: 3, name: 'United Arab Emirates', code: 'AE', phone_code: '+971' },
        { id: 4, name: 'United Kingdom', code: 'GB', phone_code: '+44' }
      ];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch countries');
    }
  }
);

export const fetchStates = createAsyncThunk(
  'location/fetchStates',
  async (countryId: string | number, { rejectWithValue }) => {
    try {
      // API commented out for direct access without backend
      // const response = await apiClient.get(`/countries/${countryId}/states`);
      // return response.data;
      return [
        { id: 101, name: 'Gujarat', country_id: 1 },
        { id: 102, name: 'Maharashtra', country_id: 1 },
        { id: 103, name: 'Delhi', country_id: 1 },
        { id: 104, name: 'Karnataka', country_id: 1 },
        { id: 105, name: 'Tamil Nadu', country_id: 1 },
        { id: 201, name: 'California', country_id: 2 },
        { id: 202, name: 'New York', country_id: 2 },
        { id: 203, name: 'Texas', country_id: 2 }
      ];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch states');
    }
  }
);

export const fetchCities = createAsyncThunk(
  'location/fetchCities',
  async (stateId: string | number, { rejectWithValue }) => {
    try {
      // API commented out for direct access without backend
      // const response = await apiClient.get(`/states/${stateId}/cities`);
      // return response.data;
      return [
        { id: 1001, name: 'Ahmedabad' },
        { id: 1002, name: 'Surat' },
        { id: 1003, name: 'Mumbai' },
        { id: 1004, name: 'Bengaluru' },
        { id: 1005, name: 'New Delhi' }
      ];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cities');
    }
  }
);

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    clearStates(state) {
      state.states = [];
    },
    clearCities(state) {
      state.cities = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Countries
      .addCase(fetchCountries.pending, (state) => {
        state.isCountriesLoading = true;
        state.error = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.isCountriesLoading = false;
        state.countries = Array.isArray((action.payload as any)?.data) ? (action.payload as any).data : (Array.isArray(action.payload) ? action.payload : []);
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.isCountriesLoading = false;
        state.error = action.payload as string;
      })
      // States
      .addCase(fetchStates.pending, (state) => {
        state.isStatesLoading = true;
        state.error = null;
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.isStatesLoading = false;
        // Depending on response shape, it might be (action.payload as any).data or action.payload
        state.states = Array.isArray((action.payload as any)?.data) ? (action.payload as any).data : (Array.isArray(action.payload) ? action.payload : []);
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.isStatesLoading = false;
        state.error = action.payload as string;
      })
      // Cities
      .addCase(fetchCities.pending, (state) => {
        state.isCitiesLoading = true;
        state.error = null;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.isCitiesLoading = false;
        state.cities = Array.isArray((action.payload as any)?.data) ? (action.payload as any).data : (Array.isArray(action.payload) ? action.payload : []);
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.isCitiesLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearStates, clearCities } = locationSlice.actions;

export default locationSlice.reducer;
