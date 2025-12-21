import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../utils/axiosConfig";


export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/api/products");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { products } = getState();
      if (products.productsData.length > 0 && products.lastFetched && 
          Date.now() - products.lastFetched < 5 * 60 * 1000) {
        return false;
      }
    }
  }
);

export const fetchNewArrivals = createAsyncThunk(
  "products/fetchNewArrivals",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/api/products/new-arrivals");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { products } = getState();
      if (products.newArrivals.length > 0 && products.newArrivalsLastFetched && 
          Date.now() - products.newArrivalsLastFetched < 5 * 60 * 1000) {
        return false;
      }
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
  },
  {
    condition: (_, { getState }) => {
      const { products } = getState();
      if (products.bestSellers.length > 0 && products.bestSellersLastFetched && 
          Date.now() - products.bestSellersLastFetched < 5 * 60 * 1000) {
        return false;
      }
    }
  }
);

export const fetchRelatedProducts = createAsyncThunk(
  "products/fetchRelatedProducts",
  async (productId, thunkAPI) => {
    try {
      const res = await axios.get(`/api/products/${productId}/related`);
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
  },
  {
    condition: (_, { getState }) => {
      const { products } = getState();
      if (products.categories.length > 0 && products.categoriesLastFetched && 
          Date.now() - products.categoriesLastFetched < 10 * 60 * 1000) {
        return false;
      }
    }
  }
);

export const fetchProductAttributes = createAsyncThunk(
  "products/fetchProductAttributes",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/api/products/attributes");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { products } = getState();
      if (
        products.attributesLastFetched &&
        Date.now() - products.attributesLastFetched < 10 * 60 * 1000
      ) {
        return false;
      }
    }
  }
);

export const fetchHomepageData = createAsyncThunk(
  "products/fetchHomepageData",
  async (_, thunkAPI) => {
    try {
      const [categoriesRes, newArrivalsRes, bestSellersRes] = await Promise.all([
        axios.get("/api/products/categories"),
        axios.get("/api/products/new-arrivals?days=90"),
        axios.get("/api/products/best-sellers")
      ]);
      
      return {
        categories: categoriesRes.data,
        newArrivals: newArrivalsRes.data,
        bestSellers: bestSellersRes.data
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  productsData: [],
  loading: false,
  error: null,
  lastFetched: null,

  newArrivals: [],
  newArrivalsLoading: false,
  newArrivalsError: null,
  newArrivalsLastFetched: null,

  bestSellers: [],
  bestSellersLoading: false,
  bestSellersError: null,
  bestSellersLastFetched: null,

  relatedProducts: [],
  relatedProductsLoading: false,
  relatedProductsError: null,

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
  categoriesLastFetched: null,

  attributes: {
    categories: [],
    textures: [],
    laceSizes: [],
    laceTypes: [],
    colors: [],
  },
  attributesLoading: false,
  attributesError: null,
  attributesLastFetched: null,

  homepageDataLoading: false,
  homepageDataError: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchPagination = { page: 1, pages: 1, total: 0 };
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.productsData = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch products";
      })
      
      // Fetch new arrivals
      .addCase(fetchNewArrivals.pending, (state) => {
        state.newArrivalsLoading = true;
        state.newArrivalsError = null;
      })
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        state.newArrivalsLoading = false;
        state.newArrivals = action.payload;
        state.newArrivalsLastFetched = Date.now();
      })
      .addCase(fetchNewArrivals.rejected, (state, action) => {
        state.newArrivalsLoading = false;
        state.newArrivalsError = action.payload || "Failed to fetch new arrivals";
      })
      
      // Fetch best sellers
      .addCase(fetchBestSellers.pending, (state) => {
        state.bestSellersLoading = true;
        state.bestSellersError = null;
      })
      .addCase(fetchBestSellers.fulfilled, (state, action) => {
        state.bestSellersLoading = false;
        state.bestSellers = action.payload;
        state.bestSellersLastFetched = Date.now();
      })
      .addCase(fetchBestSellers.rejected, (state, action) => {
        state.bestSellersLoading = false;
        state.bestSellersError = action.payload || "Failed to fetch best sellers";
      })
      
      // Fetch related products
      .addCase(fetchRelatedProducts.pending, (state) => {
        state.relatedProductsLoading = true;
        state.relatedProductsError = null;
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.relatedProductsLoading = false;
        state.relatedProducts = action.payload;
      })
      .addCase(fetchRelatedProducts.rejected, (state, action) => {
        state.relatedProductsLoading = false;
        state.relatedProductsError = action.payload || "Failed to fetch related products";
      })
      
      // Search products
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
      
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
        state.categoriesLastFetched = Date.now();
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.payload || "Failed to fetch categories";
      })
      
      // Fetch homepage data (batch)
      .addCase(fetchHomepageData.pending, (state) => {
        state.homepageDataLoading = true;
        state.homepageDataError = null;
      })
      .addCase(fetchHomepageData.fulfilled, (state, action) => {
        state.homepageDataLoading = false;
        state.categories = action.payload.categories;
        state.newArrivals = action.payload.newArrivals;
        state.bestSellers = action.payload.bestSellers;
        state.categoriesLastFetched = Date.now();
        state.newArrivalsLastFetched = Date.now();
        state.bestSellersLastFetched = Date.now();
      })
      .addCase(fetchHomepageData.rejected, (state, action) => {
        state.homepageDataLoading = false;
        state.homepageDataError = action.payload || "Failed to fetch homepage data";
      })

      // Fetch product attributes for dynamic menus
      .addCase(fetchProductAttributes.pending, (state) => {
        state.attributesLoading = true;
        state.attributesError = null;
      })
      .addCase(fetchProductAttributes.fulfilled, (state, action) => {
        state.attributesLoading = false;
        state.attributes = action.payload;
        state.attributesLastFetched = Date.now();
      })
      .addCase(fetchProductAttributes.rejected, (state, action) => {
        state.attributesLoading = false;
        state.attributesError = action.payload || "Failed to fetch product attributes";
      });
  },
});

export const { clearSearchResults, clearError } = productSlice.actions;
export default productSlice.reducer;
