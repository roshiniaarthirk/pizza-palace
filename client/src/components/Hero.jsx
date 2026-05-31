import { useNavigate } from "react-router-dom";
import "./Hero.css";

function Hero() {
  const navigate = useNavigate();

  const scrollToMenu = () => {
    const menu = document.getElementById("menu");
    if (menu) {
      menu.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/menu");
    }
  };

  return (
    <section className="hero" id="home">
      <div className="hero-left">
        <span className="offer-badge">🔥 20% OFF Today</span>

        <h1>
          Hot & Cheesy <br />
          Pizza Delivered Fast 🍕
        </h1>

        <p>
          Fresh ingredients, melty cheese, and delicious
          flavors made just for pizza lovers.
        </p>

        <div className="hero-buttons">
          <button className="order-btn" onClick={scrollToMenu}>
            Order Now
          </button>
          <button className="explore-btn" onClick={scrollToMenu}>
            Explore Menu
          </button>
        </div>
      </div>

      <div className="hero-right">
        <img
          src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800"
          alt="Delicious pizza"
        />
      </div>
    </section>
  );
}

export default Hero;