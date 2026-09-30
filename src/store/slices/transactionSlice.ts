import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

export interface Transaction {
  id: string;
  guestName: string;
  avatar: string;
  tier: string;
  type: string;
  items: string;
  channel: string;
  time: string;
  amount: string;
  commission: string;
  stamps: string;
  status: string;
}

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  isLoading: false,
  error: null,
};

const mockTransactions: Transaction[] = [
  {
    id: '#ORD-94812 (NFC-TAP-44)',
    guestName: 'Marcus Vance',
    avatar: 'MV',
    tier: 'BLACK TIER',
    type: 'Purchase + 2 Stamps',
    items: '2x Panama Geisha Pour-Over',
    channel: 'Mobile App Redeem',
    time: '2m ago',
    amount: '₹18.50',
    commission: '1.85',
    stamps: '+2 Stamps',
    status: 'Completed',
  },
  {
    id: '#ORD-94811 (VOUCHER-51)',
    guestName: 'Sophia Lin',
    avatar: 'SL',
    tier: 'RESERVE',
    type: 'Voucher Redemption',
    items: 'Free Pour-Over Reward [-10 Stamps]',
    channel: 'Mobile App Redeem',
    time: '8m ago',
    amount: 'Free Perk',
    commission: '0.00',
    stamps: '-10 Stamps',
    status: 'Verified',
  },
  {
    id: '#ORD-94810 (STAMP-EARN)',
    guestName: 'Arthur Lehmann',
    avatar: 'AL',
    tier: 'MEMBER',
    type: 'Stamp Earn Only',
    items: 'Counter Scan [Cold Brew Growler]',
    channel: 'Mobile App Redeem',
    time: '14m ago',
    amount: '₹24.00',
    commission: '2.40',
    stamps: '+1 Stamp',
    status: 'Completed',
  },
  {
    id: '#ORD-94889 (NFC-TAP-43)',
    guestName: 'Clara Hughes',
    avatar: 'CH',
    tier: 'BLACK TIER',
    type: 'Single Origin Tasting Flight',
    items: '3-Varietal Cup Tasting + Beans',
    channel: 'Mobile App Redeem',
    time: '22m ago',
    amount: '₹36.50',
    commission: '3.65',
    stamps: '+3 Stamps',
    status: 'Completed',
  },
  {
    id: '#ORD-94888 (FAST-COUNTER)',
    guestName: 'Guest Walk-in',
    avatar: 'GW',
    tier: 'NON-MEMBER',
    type: 'Espresso Romano + Croissant',
    items: 'Direct Register Entry',
    channel: '2-Varietal Cup Tasting ',
    time: '31m ago',
    amount: '₹11.20',
    commission: '1.12',
    stamps: '0 Stamps',
    status: 'Completed',
  },
];

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('merchant/transactions');
      let items = response.data;
      if (items?.data && !Array.isArray(items)) items = items.data;
      if (items?.data && !Array.isArray(items)) items = items.data;

      if (!Array.isArray(items) || items.length === 0) {
        // Fallback to mock data if API returns no data
        return mockTransactions;
      }
      return items;
    } catch (error: any) {
      // Fallback to mock data if API fails
      return mockTransactions;
    }
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, action) => {
      state.transactions = [action.payload, ...state.transactions];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;
