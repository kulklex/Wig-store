import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  clearCart,
  decreaseCart,
  getTotals,
  removeFromCart,
} from "../redux/cartSlice";
import { FiTrash2 } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

function CartDrawer({ show, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const drawerRef = useRef();

  useEffect(() => {
    dispatch(getTotals());
  }, [cart, dispatch]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (show && drawerRef.current && !drawerRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, onClose]);

  const handleDelete = (item) => dispatch(removeFromCart(item));
  const handleIncrease = (item) => dispatch(addToCart(item));
  const handleDecrease = (item) => dispatch(decreaseCart(item));
  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <div
      className={`container px-1 offcanvas offcanvas-end ${show ? "show" : ""}`}
      style={{ visibility: show ? "visible" : "hidden" }}
      tabIndex="-1"
      ref={drawerRef}
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="offcanvas-title">Your Cart</h5>
        <button
          type="button"
          className="btn-close text-reset"
          onClick={onClose}
        ></button>
      </div>
      <div className="offcanvas-body">
        {cart.items.length === 0 ? (
          <div className="text-center text-muted mt-5">Your cart is empty</div>
        ) : (
          <>
            <div className="d-flex flex-column gap-3">
              {cart.items.map((item) => (
                <div
                  key={item.media}
                  className="d-flex align-items-center justify-content-between border-bottom pb-2"
                >
                  <Link to={`/product/${item.productId}`} className="d-flex cart align-items-center flex-grow-1">
                    <img
                      src={item.media}
                      alt={item.title}
                      width={60}
                      height={60}
                      className="img-thumbnail me-2"
                    />
                    <div>
                      <div className="fw-semibold">{item.title}</div>
                      <small>{item.length}</small>|
                      <small className="fw-medium">{" "}{item.texture}</small>|
                      <small>{" "}{item.origin}</small>
                      <div className="small text-muted">£{item.price.toFixed(2)}</div>
                    </div>
                  </Link>

                  <div className="d-flex align-items-center mx-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleDecrease(item)}
                    >
                      −
                    </button>
                    <span className="mx-2">{item.cartQty}</span>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleIncrease(item)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(item)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer Summary */}
            <div className="mt-4 border-top pt-3">
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong>£{Math.trunc(cart.totalAmount * 100) / 100}</strong>
              </div>

              <div className="d-grid gap-2">
                <button
                  className="btn btn-dark"
                  onClick={handleCheckout}
                >
                  Continue to Checkout
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => dispatch(clearCart())}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
