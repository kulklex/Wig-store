import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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

export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async (params, thunkAPI) => {
    try {
      const query = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            query.append(key, value);
          }
        });
      }
      
      const res = await axios.get(`/api/products?${query.toString()}`);
      
      if (Array.isArray(res.data)) {
        return {
          products: res.data,
          page: 1,
          pages: 1,
          total: res.data.length,
        };
      } else {
        return {
          products: res.data.products || res.data,
          page: res.data.page || 1,
          pages: res.data.pages || 1,
          total: res.data.total || 0,
        };
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Search failed");
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/api/products/categories");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  productsData: [],
  loading: false,
  error: null,

  newArrivals: [],
  newArrivalsLoading: false,
  newArrivalsError: null,

  bestSellers: [],
  bestSellersLoading: false,
  bestSellersError: null,

  searchResults: [],
  searchLoading: false,
  searchError: null,
  searchPagination: {
    page: 1,
    pages: 1,
    total: 0,
  },

  categories: [],
  categoriesLoading: false,
  categoriesError: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      .addCase(searchProducts.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
        state.searchResults = [];
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.products;
        state.searchPagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total,
        };
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload || "Failed to search products";
      })
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.payload || "Failed to fetch categories";
      });
  },
});

export default productSlice.reducer;
