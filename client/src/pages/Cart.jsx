import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import "./Cart.css";

function Cart() {
  const { cartItems, updateQty, removeFromCart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = cartItems.length > 0 ? 40 : 0;
  const grandTotal = total + deliveryFee;

  const handleCheckout = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            pizza: item._id,
            qty: item.qty,
          })),
          totalAmount: grandTotal,
          deliveryAddress: "Home",
        }),
      });

      if (res.ok) {
        clearCart();
        navigate("/orders");
      } else {
        alert("Order failed. Please try again.");
      }
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
        <button className="browse-btn" onClick={() => navigate("/")}>
          Browse Menu 🍕
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2 className="cart-title">🛒 Your Cart</h2>

      <div className="cart-layout">
        {/* ITEMS */}
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <img
                src={item.image || item.imageUrl}
                alt={item.name}
              />
              <div className="cart-item-info">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-category">{item.category}</div>
                <div className="cart-item-price">₹{item.price}</div>
              </div>
              <div className="cart-item-right">
                <div className="qty-wrap">
                  <button
                    className="qty-btn"
                    onClick={() =>
                      item.qty === 1
                        ? removeFromCart(item._id)
                        : updateQty(item._id, item.qty - 1)
                    }
                  >−</button>
                  <span className="qty-num">{item.qty}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQty(item._id, item.qty + 1)}
                  >+</button>
                </div>
                <div className="cart-item-subtotal">
                  ₹{item.price * item.qty}
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item._id)}
                >🗑️</button>
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="cart-summary">
          <h3>Order Summary</h3>

          <div className="summary-row">
            <span>Subtotal ({cartItems.length} items)</span>
            <span>₹{total}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>₹{deliveryFee}</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-row total">
            <span>Grand Total</span>
            <span>₹{grandTotal}</span>
          </div>

          <button className="checkout-btn" onClick={handleCheckout}>
            {user ? "Place Order 🍕" : "Login to Checkout 🔐"}
          </button>

          <button className="clear-btn" onClick={clearCart}>
            Clear Cart
          </button>

          <div className="cart-note">
            🔥 20% OFF applied on all orders today!
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;