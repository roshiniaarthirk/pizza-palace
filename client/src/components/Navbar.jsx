import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const scrollToMenu = () => {
    const menu = document.getElementById("menu");
    if (menu) {
      menu.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  const cartCount = cartItems ? cartItems.length : 0;

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        🍕 Pizza Palace
      </div>

      <ul className="nav-links">
        <li onClick={() => navigate("/")}>Home</li>
        <li onClick={scrollToMenu}>Menu</li>
        <li onClick={() => navigate("/offers")}>Offers</li>
<li onClick={() => navigate("/contact")}>Contact</li>
      </ul>

      <div className="nav-right">
        <button className="cart-btn" onClick={() => navigate("/cart")}>
          🛒 Cart
          {cartCount > 0 && (
            <span className="cart-count">{cartCount}</span>
          )}
        </button>

        {user ? (
          <div className="nav-user">
            <span className="nav-username">Hi, {user.name} 👋</span>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <button className="login-btn" onClick={() => navigate("/auth")}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;