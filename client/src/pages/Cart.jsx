import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import "./Cart.css";

const COUPONS = {
  PIZZA20:   { discount: 0.20, desc: "20% off applied! 🎉" },
  B2G1FREE:  { discount: 0.33, desc: "Buy 2 Get 1 Free applied! 🎉" },
  FREEDEL:   { discount: 0,    desc: "Free Delivery applied! 🚀", freeDelivery: true },
  NIGHT15:   { discount: 0.15, desc: "15% off applied! 🌙" },
  FAMILY999: { discount: 0,    desc: "Family Deal applied! 👨‍👩‍👧‍👦", flatDiscount: 999 },
  BDAY30:    { discount: 0.30, desc: "30% Birthday off applied! 🎂" },
};

function Cart() {
  const { cartItems, updateQty, removeFromCart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  let discountAmt = 0;
  let freeDelivery = false;
  if (appliedCoupon) {
    if (appliedCoupon.freeDelivery) {
      freeDelivery = true;
    } else if (appliedCoupon.flatDiscount) {
      discountAmt = Math.min(appliedCoupon.flatDiscount, total);
    } else {
      discountAmt = Math.round(total * appliedCoupon.discount);
    }
  }

  const deliveryFee = freeDelivery ? 0 : cartItems.length > 0 ? 40 : 0;
  const grandTotal = total - discountAmt + deliveryFee;

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) { setCouponError("Enter a coupon code."); return; }
    if (COUPONS[code]) {
      setAppliedCoupon(COUPONS[code]);
      setCouponError("");
    } else {
      setAppliedCoupon(null);
      setCouponError("Invalid coupon code. Try again!");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
  };

  const handleCheckout = async () => {
    if (!user) { navigate("/auth"); return; }
    try {
      const token = localStorage.getItem("token");
      const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${base}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            pizza: item._id,
            qty: item.qty,
            toppings: item.toppings || [],
          })),
          totalAmount: grandTotal,
          deliveryAddress: "Home",
        }),
      });
      if (res.ok) { clearCart(); navigate("/orders"); }
      else { alert("Order failed. Please try again."); }
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">🛒</div>
        <h2>Your cart is empty!</h2>
        <p>Add some delicious pizzas to get started</p>
        <button className="browse-btn" onClick={() => navigate("/")}>Browse Menu 🍕</button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2 className="cart-title">🛒 Your Cart</h2>

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <img src={item.image || item.imageUrl} alt={item.name} />
              <div className="cart-item-info">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-category">{item.category}</div>
                {item.toppings && item.toppings.length > 0 && (
                  <div className="cart-item-toppings">
                    <span className="toppings-tag">🍕 Toppings:</span>
                    <div className="toppings-list">
                      {item.toppings.map((t) => (
                        <span key={t.id} className="topping-badge">
                          {t.label} <span className="topping-badge-price">+₹{t.price}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="cart-item-price">
                  ₹{item.price}
                  {item.originalPrice && item.price !== item.originalPrice && (
                    <span className="cart-base-price"> (Base ₹{item.originalPrice})</span>
                  )}
                </div>
              </div>
              <div className="cart-item-right">
                <div className="qty-wrap">
                  <button className="qty-btn" onClick={() => item.qty === 1 ? removeFromCart(item._id) : updateQty(item._id, item.qty - 1)}>−</button>
                  <span className="qty-num">{item.qty}</span>
                  <button className="qty-btn" onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
                </div>
                <div className="cart-item-subtotal">₹{item.price * item.qty}</div>
                <button className="remove-btn" onClick={() => removeFromCart(item._id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>

          {!appliedCoupon ? (
            <div className="coupon-wrap">
              <input
                className="coupon-input"
                type="text"
                placeholder="Enter coupon code"
                value={couponInput}
                onChange={(e) => { setCouponInput(e.target.value); setCouponError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
              />
              <button className="coupon-btn" onClick={handleApplyCoupon}>Apply</button>
              {couponError && <span className="coupon-error">{couponError}</span>}
            </div>
          ) : (
            <div className="coupon-applied">
              <span>🎟️ {appliedCoupon.desc}</span>
              <button className="coupon-remove" onClick={handleRemoveCoupon}>✕</button>
            </div>
          )}

          <div className="summary-row">
            <span>Subtotal ({cartItems.length} items)</span>
            <span>₹{total}</span>
          </div>

          {discountAmt > 0 && (
            <div className="summary-row discount-row">
              <span>Discount</span>
              <span>− ₹{discountAmt}</span>
            </div>
          )}

          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>{freeDelivery ? <span className="free-tag">FREE</span> : `₹${deliveryFee}`}</span>
          </div>

          <div className="summary-divider" />

          <div className="summary-row total">
            <span>Grand Total</span>
            <span>₹{grandTotal}</span>
          </div>

          <button className="checkout-btn" onClick={handleCheckout}>
            {user ? "Place Order 🍕" : "Login to Checkout 🔐"}
          </button>

          <button className="clear-btn" onClick={clearCart}>Clear Cart</button>

          <div className="cart-note">
            🔥 Use code <strong>PIZZA20</strong> for 20% off today!
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;