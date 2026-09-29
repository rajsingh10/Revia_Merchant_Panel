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
}

const initialState: QrCodeState = {
  isLoading: false,
  error: null,
  qrCodes: [],
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
      });
  },
});

export default qrCodeSlice.reducer;
