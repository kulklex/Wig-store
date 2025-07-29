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
      const { variantId, cartQty } = action.payload;
      const itemIndex = state.items.findIndex((item) => item.variantId === variantId);

      if (itemIndex >= 0) {
        state.items[itemIndex].cartQty += cartQty;
      } else {
        const tempProduct = { ...action.payload };
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
