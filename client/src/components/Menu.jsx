import { useState, useEffect, useContext } from "react";
import { CartContext } from "../context/CartContext";
import "./Menu.css";

const filters = [
  { label: "🍽️ All", value: "All" },
  { label: "🥦 Veg", value: "Veg" },
  { label: "🍗 Non-Veg", value: "Non-Veg" },
  { label: "⭐ Specialty", value: "Specialty" },
  { label: "🍟 Sides", value: "Sides" },
];

function StarRating({ rating, reviews }) {
  return (
    <div className="card-rating">
      <span className="stars">{"★".repeat(Math.floor(rating))}</span>
      <span>{rating} ({reviews} reviews)</span>
    </div>
  );
}

function Menu() {
  const [pizzas, setPizzas] = useState([]);
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const { cartItems, addToCart, updateQty, removeFromCart } = useContext(CartContext);

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        setLoading(true);
        const url =
          active === "All"
            ? "http://localhost:5000/api/pizzas"
            : `http://localhost:5000/api/pizzas?category=${active}`;
        const res = await fetch(url);
        const data = await res.json();
        setPizzas(data);
      } catch (err) {
        console.error("Failed to fetch pizzas:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPizzas();
  }, [active]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const handleAdd = (pizza) => {
    addToCart(pizza);
    showToast(`${pizza.name} added to cart! 🛒`);
  };

  const getQty = (id) => {
    const item = cartItems.find((i) => i._id === id);
    return item ? item.qty : 0;
  };

  // Search + Sort
  let filtered = pizzas.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (sort === "price-low") filtered.sort((a, b) => a.price - b.price);
  else if (sort === "price-high") filtered.sort((a, b) => b.price - a.price);
  else if (sort === "rating") filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  else if (sort === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section className="menu-section" id="menu">
      <div className="menu-header">
        <h2>🍕 Our Menu</h2>
        <p>Hand-crafted with love, baked to perfection</p>
      </div>

      {/* SEARCH + SORT */}
      <div className="menu-controls">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search pizzas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="sort-wrap">
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="default">Sort By</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>

      {/* FILTERS */}
      <div className="menu-filters">
        {filters.map((f) => (
          <button
            key={f.value}
            className={`filter-btn ${active === f.value ? "active" : ""}`}
            onClick={() => { setActive(f.value); setSearch(""); }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="results-count">
        Showing {filtered.length} pizza{filtered.length !== 1 ? "s" : ""}
      </div>

      {loading ? (
        <div className="skeleton-grid">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="skeleton-card">
              <div className="skeleton-img" />
              <div className="skeleton-body">
                <div className="skeleton-line short" />
                <div className="skeleton-line" />
                <div className="skeleton-line medium" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="menu-empty">
          <p>😔 No pizzas found!</p>
          <button className="filter-btn active" onClick={() => { setSearch(""); setActive("All"); }}>
            Clear Search
          </button>
        </div>
      ) : (
        <div className="menu-grid">
          {filtered.map((pizza) => {
            const qty = getQty(pizza._id);
            const disc = pizza.oldPrice
              ? Math.round((1 - pizza.price / pizza.oldPrice) * 100)
              : null;
            return (
              <div key={pizza._id} className="card">
                <div className="card-img-wrap">
                  {pizza.bestSeller && <span className="best-badge">🔥 Best Seller</span>}
                  {pizza.isSpicy && <span className="spicy-badge">🌶️ Spicy</span>}
                  {disc && <span className="discount-badge">{disc}% OFF</span>}
                  <img src={pizza.image || pizza.imageUrl} alt={pizza.name} />
                </div>
                <div className="card-body">
                  <div className="card-top">
                    <span className="card-tag">
                      <span className={pizza.category === "Veg" ? "veg-dot" : "nonveg-dot"} />
                      {pizza.category}
                    </span>
                  </div>
                  <div className="card-name">{pizza.name}</div>
                  <div className="card-desc">{pizza.description}</div>

                  {/* DETAILS */}
                  <div className="card-details">
                    {pizza.size && <span className="detail-chip">📏 {pizza.size}</span>}
                    {pizza.crust && <span className="detail-chip">🍞 {pizza.crust} Crust</span>}
                    {pizza.prepTime && <span className="detail-chip">⏱️ {pizza.prepTime}</span>}
                  </div>

                  {pizza.rating && (
                    <StarRating rating={pizza.rating} reviews={pizza.reviews} />
                  )}

                  <div className="card-footer">
                    <div className="card-price">
                      <span className="price-main">₹{pizza.price}</span>
                      {pizza.oldPrice && (
                        <span className="price-old">₹{pizza.oldPrice}</span>
                      )}
                    </div>
                    {qty === 0 ? (
                      <button className="add-btn" onClick={() => handleAdd(pizza)}>
                        + Add
                      </button>
                    ) : (
                      <div className="qty-wrap">
                        <button
                          className="qty-btn"
                          onClick={() =>
                            qty === 1
                              ? removeFromCart(pizza._id)
                              : updateQty(pizza._id, qty - 1)
                          }
                        >−</button>
                        <span className="qty-num">{qty}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQty(pizza._id, qty + 1)}
                        >+</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {toast && <div className="toast show">{toast}</div>}
    </section>
  );
}

export default Menu;