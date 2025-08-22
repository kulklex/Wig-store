import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getWishlist = createAsyncThunk(
  "wishlist/getWishlist",
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
      
      const res = await axios.get(`/api/wishlist?${query.toString()}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId, thunkAPI) => {
    try {
      const res = await axios.post("/api/wishlist", { productId });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, thunkAPI) => {
    try {
      const res = await axios.delete(`/api/wishlist/${productId}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const checkWishlistStatus = createAsyncThunk(
  "wishlist/checkWishlistStatus",
  async (productId, thunkAPI) => {
    try {
      const res = await axios.get(`/api/wishlist/check/${productId}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getWishlistCount = createAsyncThunk(
  "wishlist/getWishlistCount",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/api/wishlist/count");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  wishlist: [],
  wishlistCount: 0,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlistError: (state) => {
      state.error = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload.products || [];
        state.currentPage = action.payload.page || 1;
        state.totalPages = action.payload.pages || 1;
        state.totalItems = action.payload.total || 0;
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch wishlist";
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.wishlistCount = action.payload.wishlistCount || state.wishlistCount;
        if (action.payload.product) {
          state.wishlist.unshift(action.payload.product);
        }
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.wishlistCount = action.payload.wishlistCount || state.wishlistCount;
        state.wishlist = state.wishlist.filter(
          item => item.product._id !== action.payload.productId
        );
      })
      .addCase(checkWishlistStatus.fulfilled, (state, action) => {
        state.wishlistCount = action.payload.wishlistCount || state.wishlistCount;
      })
      .addCase(getWishlistCount.fulfilled, (state, action) => {
        state.wishlistCount = action.payload.count || 0;
      });
  },
});

export const { clearWishlistError, setCurrentPage } = wishlistSlice.actions;
export default wishlistSlice.reducer;
