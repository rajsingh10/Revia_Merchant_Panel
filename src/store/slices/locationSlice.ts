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
      const response = await apiClient.get('/countries');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch countries');
    }
  }
);

export const fetchStates = createAsyncThunk(
  'location/fetchStates',
  async (countryId: string | number, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/countries/${countryId}/states`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch states');
    }
  }
);

export const fetchCities = createAsyncThunk(
  'location/fetchCities',
  async (stateId: string | number, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/states/${stateId}/cities`);
      return response.data;
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
        state.countries = Array.isArray(action.payload?.data) ? action.payload.data : (Array.isArray(action.payload) ? action.payload : []);
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
        // Depending on response shape, it might be action.payload.data or action.payload
        state.states = Array.isArray(action.payload?.data) ? action.payload.data : (Array.isArray(action.payload) ? action.payload : []);
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
        state.cities = Array.isArray(action.payload?.data) ? action.payload.data : (Array.isArray(action.payload) ? action.payload : []);
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.isCitiesLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearStates, clearCities } = locationSlice.actions;

export default locationSlice.reducer;
