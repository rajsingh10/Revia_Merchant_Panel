import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

export interface InviteStaffPayload {
  name: string;
  email: string;
  phone: string;
  type: string;
  branch_id: string;
  password?: string;
}

export interface UpdateStaffPayload {
  id: string;
  type: string;
  branch_id: string;
  status: string;
}

interface StaffState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  staffList: any[];
}

const initialState: StaffState = {
  isLoading: false,
  error: null,
  success: false,
  staffList: [],
};

export const inviteStaffMember = createAsyncThunk(
  'staff/inviteStaffMember',
  async (payload: InviteStaffPayload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('merchant/staff', payload);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const messages = Object.values(error.response.data.errors).flat().join(', ');
        return rejectWithValue(messages);
      }
      return rejectWithValue(
        error.response?.data?.message || 'Failed to invite staff member'
      );
    }
  }
);

export const fetchStaffList = createAsyncThunk(
  'staff/fetchStaffList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('merchant/staff');
      return response.data?.data || response.data || [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch staff members'
      );
    }
  }
);

export const updateStaffMember = createAsyncThunk(
  'staff/updateStaffMember',
  async (payload: UpdateStaffPayload, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`merchant/staff/${payload.id}`, payload);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const messages = Object.values(error.response.data.errors).flat().join(', ');
        return rejectWithValue(messages);
      }
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update staff member'
      );
    }
  }
);

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    resetStaffState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // inviteStaffMember
      .addCase(inviteStaffMember.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(inviteStaffMember.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(inviteStaffMember.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // fetchStaffList
      .addCase(fetchStaffList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStaffList.fulfilled, (state, action) => {
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
        
        state.staffList = extractedList;
      })
      .addCase(fetchStaffList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // updateStaffMember
      .addCase(updateStaffMember.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateStaffMember.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(updateStaffMember.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetStaffState } = staffSlice.actions;
export default staffSlice.reducer;
