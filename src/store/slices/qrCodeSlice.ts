import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

interface QrCode {
  id: number;
  business_id: number;
  branch_id: number;
  identifier: string;
  type: string;
  table_number: string | null;
  campaign_id: string | null;
  item_barcode: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  qr_image_url: string;
  branch?: any;
}

interface QrCodeState {
  isLoading: boolean;
  error: string | null;
  qrCodes: QrCode[];
  currentQrCode: any | null;
  currentHistory: any[];
}

const initialState: QrCodeState = {
  isLoading: false,
  error: null,
  qrCodes: [],
  currentQrCode: null,
  currentHistory: [],
};

export const fetchQrCodes = createAsyncThunk(
  'qrCode/fetchQrCodes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('merchant/qr-codes');
      return response.data?.data || response.data || [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch QR codes'
      );
    }
  }
);

export const createQrCode = createAsyncThunk(
  'qrCode/createQrCode',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('merchant/qr-codes', payload);
      return response.data?.data || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create QR code'
      );
    }
  }
);

export const fetchQrCodeDetails = createAsyncThunk(
  'qrCode/fetchQrCodeDetails',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`merchant/qr-codes/${id}`);
      return response.data?.data || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch QR code details'
      );
    }
  }
);

export const updateQrCodeStatus = createAsyncThunk(
  'qrCode/updateQrCodeStatus',
  async ({ id, status }: { id: string | number, status: string }, { rejectWithValue }) => {
    try {
      // Typically PATCH or PUT for updates, let's use PUT as standard or POST if the framework requires it.
      // Often Laravel expects PUT/PATCH.
      const response = await apiClient.put(`merchant/qr-codes/${id}`, { status });
      return response.data?.data || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update QR code status'
      );
    }
  }
);

export const fetchQrCodeHistory = createAsyncThunk(
  'qrCode/fetchQrCodeHistory',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`merchant/qr-codes/${id}/history`);
      return response.data?.data || response.data || [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch QR code history'
      );
    }
  }
);

const qrCodeSlice = createSlice({
  name: 'qrCode',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQrCodes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQrCodes.fulfilled, (state, action) => {
        state.isLoading = false;
        
        let extractedList: any[] = [];
        const p = action.payload;

        if (Array.isArray(p)) {
          extractedList = p;
        } else if (p && Array.isArray(p.data)) {
          extractedList = p.data;
        } else if (p?.data && Array.isArray(p.data.data)) {
          extractedList = p.data.data;
        } else if (p?.data?.data && Array.isArray(p.data.data.data)) {
          extractedList = p.data.data.data;
        }
        
        state.qrCodes = extractedList;
      })
      .addCase(fetchQrCodes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createQrCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createQrCode.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.qrCodes.unshift(action.payload);
        }
      })
      .addCase(createQrCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchQrCodeDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.currentQrCode = null;
      })
      .addCase(fetchQrCodeDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentQrCode = action.payload;
      })
      .addCase(fetchQrCodeDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchQrCodeHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.currentHistory = [];
      })
      .addCase(fetchQrCodeHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        
        let extractedList: any[] = [];
        const p = action.payload;
        if (Array.isArray(p)) {
          extractedList = p;
        } else if (p && Array.isArray(p.data)) {
          extractedList = p.data;
        } else if (p?.data && Array.isArray(p.data.data)) {
          extractedList = p.data.data;
        } else if (p?.data?.data && Array.isArray(p.data.data.data)) {
          extractedList = p.data.data.data;
        }
        
        state.currentHistory = extractedList;
      })
      .addCase(fetchQrCodeHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateQrCodeStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateQrCodeStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the item in the list if it exists
        if (action.payload) {
          const index = state.qrCodes.findIndex(qr => qr.id === action.payload.id || qr.identifier === action.payload.identifier);
          if (index !== -1) {
            state.qrCodes[index] = { ...state.qrCodes[index], ...action.payload };
          }
          if (state.currentQrCode && (state.currentQrCode.id === action.payload.id || state.currentQrCode.identifier === action.payload.identifier)) {
             state.currentQrCode = { ...state.currentQrCode, ...action.payload };
          }
        }
      })
      .addCase(updateQrCodeStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default qrCodeSlice.reducer;
