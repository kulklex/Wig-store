import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

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
      const itemIndex = state.items.findIndex(
        (item) => item.variantId === action.payload.variantId
      );

      if (itemIndex >= 0) {
        state.items[itemIndex].cartQty += 1;
        toast.info(`Added More ${action.payload.title} To Cart`, {
          position: "bottom-left",
          theme: "colored",
        });
      } else {
        const tempProduct = { ...action.payload, cartQty: 1 };
        state.items.push(tempProduct);
        toast.success(`Added ${action.payload.title} To Cart`, {
          position: "bottom-left",
        });
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
          toast.error(`Removed ${action.payload.title} from cart`, {
            position: "bottom-left",
          });
        } else if (state.items[itemIndex].cartQty === 1) {
          toast.error(`You have one ${action.payload.title} left`, {
            position: "bottom-left",
          });
        }

        localStorage.setItem("cartState", JSON.stringify(state));
      }
    },

    removeFromCart(state, action) {
      const remainingCartItems = state.items.filter(
        (item) => item.variantId !== action.payload.variantId
      );
      state.items = remainingCartItems;

      toast.error(`Removed ${action.payload.title} from cart`, {
        position: "bottom-left",
      });

      localStorage.setItem("cartState", JSON.stringify(state));
    },

    clearCart(state, action) {
      state.items = [];
      toast.done("Cart Cleared!");
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
