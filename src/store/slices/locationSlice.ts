import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

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
  states: StateObj[];
  cities: CityObj[];
  isStatesLoading: boolean;
  isCitiesLoading: boolean;
  error: string | null;
}

const initialState: LocationState = {
  states: [],
  cities: [],
  isStatesLoading: false,
  isCitiesLoading: false,
  error: null,
};

export const fetchStates = createAsyncThunk(
  'location/fetchStates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/states');
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
    clearCities(state) {
      state.cities = [];
    }
  },
  extraReducers: (builder) => {
    builder
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

export const { clearCities } = locationSlice.actions;

export default locationSlice.reducer;
