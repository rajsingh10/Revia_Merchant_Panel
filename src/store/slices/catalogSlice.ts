import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

export interface CatalogItem {
  id: string;
  title: string;
  sku: string;
  category: string;
  branch?: string;
  branch_id?: string | number | null;
  description?: string;
  price: number;
  cost: number;
  image: string;
  selected?: boolean;
}

const mockCatalog: CatalogItem[] = [
  {
    id: '1',
    title: 'Panama Geisha Reserve',
    sku: '#ROAST-PAN-01 • Boquete • Washed',
    category: 'Single Origin Coffee',
    price: 28.00,
    cost: 6.20,
    image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=200',
    selected: false,
  },
  {
    id: '2',
    title: 'Specialty Tasting Flight & Brioche',
    sku: '#MENU-FLIGHT-04 • Pairing Experience',
    category: 'Tasting Flights',
    price: 32.00,
    cost: 8.50,
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=200',
    selected: false,
  },
  {
    id: '3',
    title: 'Whole Bean 250g Ethiopia Yirgacheffe',
    sku: '#ROAST-ETH-250 • Natural • Heirloom',
    category: 'Single Origin Coffee',
    price: 24.00,
    cost: 5.50,
    image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&q=80&w=200',
    selected: false,
  },
  {
    id: '4',
    title: 'Valrhona Dark Chocolate Croissant',
    sku: '#BAKE-VAL-03 • Daily Fresh Daily Bake',
    category: 'Artisanal Bakery',
    price: 6.50,
    cost: 1.80,
    image: 'https://images.unsplash.com/photo-1549903072-7e6e0d656112?auto=format&fit=crop&q=80&w=200',
    selected: false,
  },
  {
    id: '5',
    title: 'Cascara Fizz Botanic Mocktail',
    sku: '#BEV-BOT-09 • Seasonal Harvest',
    category: 'Seasonal Brews',
    price: 8.00,
    cost: 2.20,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=200',
    selected: false,
  }
];

interface CatalogState {
  items: CatalogItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CatalogState = {
  items: [],
  isLoading: false,
  error: null,
};

// Async Thunks
export const fetchProducts = createAsyncThunk(
  'catalog/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/v1/catalog/products');
      let rawData = response.data;
      if (rawData.data && Array.isArray(rawData.data)) {
        rawData = rawData.data;
      } else if (rawData.data && rawData.data.data && Array.isArray(rawData.data.data)) {
        rawData = rawData.data.data;
      } else if (!Array.isArray(rawData)) {
        rawData = [];
      }
      return rawData.map((item: any) => ({
        ...item,
        image: item.image_url || item.image || '',
        branch: item.branch_name || (item.branch_id ? `Branch ${item.branch_id}` : ''),
        branch_id: item.branch_id || null,
        description: item.description || '',
      }));
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const addProduct = createAsyncThunk(
  'catalog/add',
  async (productData: Partial<CatalogItem>, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/v1/catalog/products', productData);
      const item = response.data.data || response.data;
      return {
        ...item,
        image: item.image_url || item.image || '',
        branch: item.branch_name || (item.branch_id ? `Branch ${item.branch_id}` : ''),
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'catalog/update',
  async ({ id, data }: { id: string; data: Partial<CatalogItem> }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/v1/catalog/products/${id}`, data);
      const item = response.data.data || response.data;
      return {
        ...item,
        image: item.image_url || item.image || '',
        branch: item.branch_name || (item.branch_id ? `Branch ${item.branch_id}` : ''),
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'catalog/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/v1/catalog/products/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    toggleItemSelection: (state, action) => {
      const item = state.items.find(i => i.id === action.payload);
      if (item) {
        item.selected = !item.selected;
      }
    },
    selectAllItems: (state) => {
      state.items.forEach(item => { item.selected = true; });
    },
    deselectAllItems: (state) => {
      state.items.forEach(item => { item.selected = false; });
    }
  },
  extraReducers: (builder) => {
    // Fetch Products
    builder.addCase(fetchProducts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = Array.isArray(action.payload) ? action.payload.map((item: any) => ({...item, selected: false})) : [];
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      // Fallback to mock data if API fails during development
      if (state.items.length === 0) {
        state.items = [...mockCatalog];
      }
    });

    // Add Product
    builder.addCase(addProduct.fulfilled, (state, action) => {
      state.items.unshift({ ...action.payload, selected: false });
    });

    // Update Product
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    });

    // Delete Product
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    });
  },
});

export const { toggleItemSelection, selectAllItems, deselectAllItems } = catalogSlice.actions;
export default catalogSlice.reducer;
