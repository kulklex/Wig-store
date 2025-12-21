import { createSlice } from "@reduxjs/toolkit";


const storedCart = localStorage.getItem("cartState");

const initialState = storedCart
  ? JSON.parse(storedCart)
  : {
      items: [],
      totalQuantity: 0,
      totalAmount: 0,
      showDrawer: false,
    };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const { variantId, cartQty = 1, stock } = action.payload;
      const itemIndex = state.items.findIndex((item) => item.variantId === variantId);
      const maxStock = stock ?? state.items[itemIndex]?.stock ?? Infinity;

      if (itemIndex >= 0) {
        const currentQty = state.items[itemIndex].cartQty;
        const desiredQty = currentQty + cartQty;
        const nextQty = Math.min(desiredQty, maxStock);
        state.items[itemIndex].cartQty = nextQty;
      } else {
        const allowedQty = Math.min(cartQty, maxStock);
        if (allowedQty <= 0) return; // nothing to add if no stock
        const tempProduct = { ...action.payload, cartQty: allowedQty };
        state.items.push(tempProduct);
      }
      state.showDrawer = true;
      localStorage.setItem("cartState", JSON.stringify(state));
    },

    decreaseCart(state, action) {
      const itemIndex = state.items.findIndex(
        (item) => item.variantId === action.payload.variantId
      );

      if (itemIndex >= 0) {
        if (state.items[itemIndex].cartQty > 1) {
          state.items[itemIndex].cartQty -= 1;
        }

        localStorage.setItem("cartState", JSON.stringify(state));
      }
    },

    removeFromCart(state, action) {
      const remainingCartItems = state.items.filter(
        (item) => item.variantId !== action.payload.variantId
      );
      state.items = remainingCartItems;

      localStorage.setItem("cartState", JSON.stringify(state));
    },

    clearCart(state, action) {
      state.items = [];
      localStorage.setItem("cartState", JSON.stringify(state));
    },

    openCartDrawer(state) {
        state.showDrawer = true;
    },
    
    closeCartDrawer(state) {
      state.showDrawer = false;
    },

    getTotals(state, action) {
      let { total, quantity } = state.items.reduce(
        (cartTotal, item) => {
          const { price, cartQty } = item;
          const itemTotal = price * cartQty;

          cartTotal.total += itemTotal;
          cartTotal.quantity += cartQty;

          return cartTotal;
        },
        {
          total: 0,
          quantity: 0,
        }
      );

      state.totalQuantity = quantity;
      state.totalAmount = total;
    },
  },
});

export const { addToCart, clearCart, decreaseCart, getTotals, removeFromCart, openCartDrawer, closeCartDrawer } =
  cartSlice.actions;

export default cartSlice.reducer;
