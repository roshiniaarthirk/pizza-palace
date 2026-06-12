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

const TOPPINGS = [
  { id: "extra_cheese", label: "Extra Cheese 🧀", price: 40 },
  { id: "mushrooms", label: "Mushrooms 🍄", price: 30 },
  { id: "olives", label: "Black Olives 🫒", price: 25 },
  { id: "jalapenos", label: "Jalapeños 🌶️", price: 20 },
  { id: "corn", label: "Sweet Corn 🌽", price: 20 },
  { id: "onions", label: "Caramelised Onions 🧅", price: 20 },
  { id: "peppers", label: "Bell Peppers 🫑", price: 25 },
  { id: "paneer", label: "Paneer Cubes 🟨", price: 50 },
  { id: "chicken", label: "Grilled Chicken 🍗", price: 60 },
  { id: "pepperoni", label: "Pepperoni 🍕", price: 55 },
];

function StarRating({ rating, reviews }) {
  return (
    <div className="card-rating">
      <span className="stars">{"★".repeat(Math.floor(rating))}</span>
      <span>{rating} ({reviews} reviews)</span>
    </div>
  );
}

function ToppingsModal({ pizza, onClose, onConfirm }) {
  const [selected, setSelected] = useState({});

  const toggleTopping = (id) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedToppings = TOPPINGS.filter((t) => selected[t.id]);
  const toppingsTotal = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const totalPrice = pizza.price + toppingsTotal;

  const handleConfirm = () => {
    onConfirm(pizza, selectedToppings, totalPrice);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-header">
          <img src={pizza.image || pizza.imageUrl} alt={pizza.name} className="modal-pizza-img" />
          <div>
            <h3 className="modal-pizza-name">{pizza.name}</h3>
            <p className="modal-pizza-desc">{pizza.description}</p>
            <span className="modal-base-price">Base price: ₹{pizza.price}</span>
          </div>
        </div>
        <h4 className="modal-toppings-title">Choose Your Toppings</h4>
        <p className="modal-toppings-sub">Each topping is charged extra</p>
        <div className="toppings-grid">
          {TOPPINGS.map((topping) => (
            <label key={topping.id} className={`topping-chip ${selected[topping.id] ? "selected" : ""}`}>
              <input type="checkbox" checked={!!selected[topping.id]} onChange={() => toggleTopping(topping.id)} />
              <span className="topping-label">{topping.label}</span>
              <span className="topping-price">+₹{topping.price}</span>
            </label>
          ))}
        </div>
        <div className="modal-footer">
          <div className="modal-total">
            <span>Total</span>
            <span className="modal-total-price">₹{totalPrice}</span>
          </div>
          {selectedToppings.length > 0 && (
            <p className="modal-selected-summary">{selectedToppings.map((t) => t.label).join(", ")}</p>
          )}
          <button className="modal-confirm-btn" onClick={handleConfirm}>Add to Cart 🛒</button>
        </div>
      </div>
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
  const [modalPizza, setModalPizza] = useState(null);
  const { cartItems, addToCart, updateQty, removeFromCart } = useContext(CartContext);

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        setLoading(true);
        const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const url = active === "All" ? `${base}/api/pizzas` : `${base}/api/pizzas?category=${active}`;
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
    setTimeout(() => setToast(""), 2500);
  };

  const handleAddClick = (pizza) => setModalPizza(pizza);

  const handleConfirmToppings = (pizza, selectedToppings, totalPrice) => {
    addToCart({ ...pizza, toppings: selectedToppings, price: totalPrice, originalPrice: pizza.price });
    showToast(`${pizza.name} added to cart! 🛒`);
  };

  const getQty = (id) => {
    const item = cartItems.find((i) => i._id === id);
    return item ? item.qty : 0;
  };

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
      <div className="menu-controls">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search pizzas..." value={search} onChange={(e) => setSearch(e.target.value)} />
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
      <div className="menu-filters">
        {filters.map((f) => (
          <button key={f.value} className={`filter-btn ${active === f.value ? "active" : ""}`}
            onClick={() => { setActive(f.value); setSearch(""); }}>
            {f.label}
          </button>
        ))}
      </div>
      <div className="results-count">Showing {filtered.length} pizza{filtered.length !== 1 ? "s" : ""}</div>

      {loading ? (
        <div className="skeleton-grid">
          {[1,2,3,4].map((n) => (
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
          <button className="filter-btn active" onClick={() => { setSearch(""); setActive("All"); }}>Clear Search</button>
        </div>
      ) : (
        <div className="menu-grid">
          {filtered.map((pizza) => {
            const qty = getQty(pizza._id);
            const disc = pizza.oldPrice ? Math.round((1 - pizza.price / pizza.oldPrice) * 100) : null;
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
                  <div className="card-details">
                    {pizza.size && <span className="detail-chip">📏 {pizza.size}</span>}
                    {pizza.crust && <span className="detail-chip">🍞 {pizza.crust} Crust</span>}
                    {pizza.prepTime && <span className="detail-chip">⏱️ {pizza.prepTime}</span>}
                  </div>
                  {pizza.rating && <StarRating rating={pizza.rating} reviews={pizza.reviews} />}
                  <div className="card-footer">
                    <div className="card-price">
                      <span className="price-main">₹{pizza.price}</span>
                      {pizza.oldPrice && <span className="price-old">₹{pizza.oldPrice}</span>}
                    </div>
                    {qty === 0 ? (
                      <button className="add-btn" onClick={() => handleAddClick(pizza)}>+ Add</button>
                    ) : (
                      <div className="qty-wrap">
                        <button className="qty-btn" onClick={() => qty === 1 ? removeFromCart(pizza._id) : updateQty(pizza._id, qty - 1)}>−</button>
                        <span className="qty-num">{qty}</span>
                        <button className="qty-btn" onClick={() => updateQty(pizza._id, qty + 1)}>+</button>
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

      {modalPizza && (
        <ToppingsModal
          pizza={modalPizza}
          onClose={() => setModalPizza(null)}
          onConfirm={handleConfirmToppings}
        />
      )}
    </section>
  );
}

export default Menu;