import React, { useEffect } from "react";
import { useNavigate,  useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  clearCart,
  decreaseCart,
  getTotals,
  removeFromCart,
} from "../redux/cartSlice";
import { baseUrl } from "../index";
import { FiX } from "react-icons/fi";

function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getTotals());
  }, [cart, dispatch]);

  const handleDelete = (item) => {
    dispatch(removeFromCart(item));
  };

  const handleIncrease = (item) => {
    dispatch(addToCart(item));
  };

  const handleDecrease = (item) => {
    dispatch(decreaseCart(item));
  };

  return (
    <div>
      <div className="position-relative align-items-center">
        <button
          onClick={() => navigate(from, { replace: true })}
          className="btn-close position-absolute top-0 end-0 m-3"
          aria-label="Close Cart"
        >
          <FiX />
        </button>
        <h2 className="text-center fs-2 fw-bold pt-4"> Cart </h2>
      </div>
      <hr />
      <div>
        {cart.items.length === 0 ? (
          <div className="text-center d-flex justify-content-center align-items-center">
            <p className="text-center d-flex justify-content-center align-items-center m-2 m-md-6 overflow-hidden">
              Your cart is empty
            </p>
          </div>
        ) : (
          <div className="w-full md:mx-4">
            {cart.items?.map((item) => (
              <div key={item._id}>
                <div className="flex justify-between m-1">
                  <div className="flex w-1/3 items-center">
                    <img
                      width={80}
                      height={50}
                      src={baseUrl + "/uploads/" + item.image}
                      alt={item.title}
                    />
                    <h3 className="md:mx-2 hidden md:block font-bold">
                      {item.title}
                    </h3>
                  </div>
                  <div className="w-1/3 flex items-center justify-center text-center">
                    <button onClick={() => handleDecrease(item)}>-</button>
                    <p className="md:mx-4 px-4">{item.cartQty}</p>
                    <button onClick={() => handleIncrease(item)}>+</button>
                  </div>
                  <div className="w-1/3 flex flex-1 items-center text-center">
                    <svg
                      onClick={() => {
                        handleDelete(item);
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 mx-2 md:mx-6 cursor-pointer hover:text-red-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                    <p>£{item.price?.toFixed(2)}</p>
                  </div>
                </div>
                <hr />
              </div>
            ))}
            <hr />
            <div className="mx-2 my-8 md:m-10 flex justify-between items-center md:w-[75%]">
              <button
                onClick={dispatch(clearCart())}
                className="font-bold bg-red-500 text-white rounded-lg p-2 hover:text-red-300"
              >
                Clear Cart
              </button>
              <div className="font-extrabold text-lg md:text-xl">
                Total: £{Math.trunc(cart.totalAmount * 100) / 100}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <button
                type="button"
                className="text-white w-[90%] my-4 lg:w-[20%] bg-black hover:bg-black-800 focus:ring-4 focus:ring-black-300
              font-medium rounded-lg text-sm p-4  dark:bg-black-600 dark:hover:bg-black-700
              focus:outline-none  dark:focus:ring-black-800"
                onClick={() => navigate("/checkout")}
              >
                Continue to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
