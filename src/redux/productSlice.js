import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all products
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/api/products");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch new arrivals
export const fetchNewArrivals = createAsyncThunk(
  "products/fetchNewArrivals",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/api/products/new-arrivals?days=90");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch best sellers
export const fetchBestSellers = createAsyncThunk(
  "products/fetchBestSellers",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/api/products/best-sellers");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 🔍 Search products
export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async (searchTerm, thunkAPI) => {
    try {
      const res = await axios.get(`/api/products?search=${searchTerm}`);
      return res.data.products || res.data; // based on your API shape
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Search failed");
    }
  }
);

const initialState = {
  // All Products
  productsData: [],
  loading: false,
  error: null,

  // New Arrivals
  newArrivals: [],
  newArrivalsLoading: false,
  newArrivalsError: null,

  // Best Sellers
  bestSellers: [],
  bestSellersLoading: false,
  bestSellersError: null,

  // Search Results
  searchResults: [],
  searchLoading: false,
  searchError: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Add non-async reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      // All Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.productsData = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch products";
      })

      // New Arrivals
      .addCase(fetchNewArrivals.pending, (state) => {
        state.newArrivalsLoading = true;
        state.newArrivalsError = null;
      })
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        state.newArrivalsLoading = false;
        state.newArrivals = action.payload;
      })
      .addCase(fetchNewArrivals.rejected, (state, action) => {
        state.newArrivalsLoading = false;
        state.newArrivalsError = action.payload || "Failed to fetch new arrivals";
      })

      // Best Sellers
      .addCase(fetchBestSellers.pending, (state) => {
        state.bestSellersLoading = true;
        state.bestSellersError = null;
      })
      .addCase(fetchBestSellers.fulfilled, (state, action) => {
        state.bestSellersLoading = false;
        state.bestSellers = action.payload;
      })
      .addCase(fetchBestSellers.rejected, (state, action) => {
        state.bestSellersLoading = false;
        state.bestSellersError = action.payload || "Failed to fetch best sellers";
      })

      // Search Products
      .addCase(searchProducts.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
        state.searchResults = [];
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload || "Failed to search products";
      });
  },
});

export default productSlice.reducer;
