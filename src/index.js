import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import cartReducer, { getTotals } from "./redux/cartSlice";
import productReducer from "./redux/productSlice"
import authReducer from "./redux/authSlice"


export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productReducer,
    user: authReducer
  },
});

store.dispatch(getTotals());

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
