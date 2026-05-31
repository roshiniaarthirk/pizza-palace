import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
const res = await fetch(`${base}/api/orders/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "status-pending";
      case "Confirmed": return "status-confirmed";
      case "Preparing": return "status-preparing";
      case "Out for Delivery": return "status-delivery";
      case "Delivered": return "status-delivered";
      case "Cancelled": return "status-cancelled";
      default: return "";
    }
  };

  const getStatusEmoji = (status) => {
    switch (status) {
      case "Pending": return "⏳";
      case "Confirmed": return "✅";
      case "Preparing": return "👨‍🍳";
      case "Out for Delivery": return "🛵";
      case "Delivered": return "🎉";
      case "Cancelled": return "❌";
      default: return "📦";
    }
  };

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="spinner" />
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <div className="orders-empty-icon">📦</div>
        <h2>No orders yet!</h2>
        <p>You haven't placed any orders yet</p>
        <button className="browse-btn" onClick={() => navigate("/")}>
          Order Now 🍕
        </button>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h2 className="orders-title">📦 My Orders</h2>
      <p className="orders-subtitle">Track all your pizza orders here</p>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">

            {/* ORDER HEADER */}
            <div className="order-header">
              <div>
                <div className="order-id">
                  Order #{order._id.slice(-6).toUpperCase()}
                </div>
                <div className="order-date">
                  🕒 {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              <span className={`order-status ${getStatusColor(order.status)}`}>
                {getStatusEmoji(order.status)} {order.status}
              </span>
            </div>

            {/* ORDER ITEMS */}
            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <img
                    src={item.pizza?.image || item.pizza?.imageUrl}
                    alt={item.pizza?.name}
                  />
                  <div className="order-item-info">
                    <span className="order-item-name">{item.pizza?.name}</span>
                    <span className="order-item-qty">x{item.qty}</span>
                  </div>
                  <span className="order-item-price">
                    ₹{item.pizza?.price * item.qty}
                  </span>
                </div>
              ))}
            </div>

            {/* ORDER FOOTER */}
            <div className="order-footer">
              <div className="order-address">
                📍 {order.deliveryAddress}
              </div>
              <div className="order-total">
                Total: <span>₹{order.totalAmount}</span>
              </div>
            </div>

            {/* STATUS PROGRESS */}
            <div className="status-bar">
              {["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered"].map(
                (step, i) => {
                  const steps = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered"];
                  const currentIndex = steps.indexOf(order.status);
                  return (
                    <div
                      key={step}
                      className={`status-step ${i <= currentIndex ? "done" : ""}`}
                    >
                      <div className="status-dot" />
                      <span>{step}</span>
                    </div>
                  );
                }
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;