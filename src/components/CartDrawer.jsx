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
      className={`offcanvas offcanvas-end ${show ? "show" : ""}`}
      style={{ 
        visibility: show ? "visible" : "hidden",
        width: "420px",
        maxWidth: "100vw"
      }}
      data-bs-scroll="true"
      data-bs-backdrop="true"
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
              {cart.items.map((item) => {
                const price = Number(item.price ?? item.finalPrice ?? 0);
                return (
                  <div
                    key={item.variantId}
                    className="border-bottom pb-3"
                  >
                    <div className="d-flex align-items-start gap-3 flex-wrap">
                      <Link to={`/product/${item.productId}`} className="d-flex align-items-start text-decoration-none text-dark">
                        <img
                          src={item.media}
                          alt={item.title}
                          width={68}
                          height={68}
                          className="rounded border"
                        />
                        <div className="ms-3">
                          <div className="fw-semibold">{item.title}</div>
                          <div className="small text-muted">
                            {item.length} | {item.texture} | {item.origin}
                            {item.color ? ` | Color: ${item.color}` : ""}
                            {item.laceSize ? ` | Lace Size: ${item.laceSize}` : ""}
                          </div>
                          <div className="fw-semibold mt-1">£{price.toFixed(2)}</div>
                        </div>
                      </Link>

                      <div className="ms-auto d-flex align-items-center gap-2">
                        <div className="d-flex align-items-center border rounded px-2 py-1">
                          <button
                            className="btn btn-sm border-0 px-2"
                            onClick={() => handleDecrease(item)}
                          >
                            −
                          </button>
                          <span className="mx-2">{item.cartQty}</span>
                          <button
                            className="btn btn-sm border-0 px-2"
                            onClick={() => handleIncrease(item)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(item)}
                          aria-label="Remove item"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
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
