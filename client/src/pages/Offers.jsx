import "./Offers.css";

const offers = [
  {
    id: 1,
    emoji: "🔥",
    title: "20% OFF Today",
    desc: "Get 20% off on all pizzas today only! Use code PIZZA20 at checkout.",
    code: "PIZZA20",
    color: "offer-red",
    expiry: "Today Only",
  },
  {
    id: 2,
    emoji: "🎉",
    title: "Buy 2 Get 1 Free",
    desc: "Order any 2 pizzas and get the third one absolutely free!",
    code: "B2G1FREE",
    color: "offer-orange",
    expiry: "This Weekend",
  },
  {
    id: 3,
    emoji: "🛵",
    title: "Free Delivery",
    desc: "Free delivery on all orders above ₹500. No minimum order on weekends!",
    code: "FREEDEL",
    color: "offer-green",
    expiry: "Ongoing",
  },
  {
    id: 4,
    emoji: "🌙",
    title: "Late Night Special",
    desc: "Order between 10PM - 1AM and get 15% off on all orders.",
    code: "NIGHT15",
    color: "offer-purple",
    expiry: "Every Night",
  },
  {
    id: 5,
    emoji: "👨‍👩‍👧‍👦",
    title: "Family Combo Deal",
    desc: "2 Large Pizzas + Garlic Bread + 4 Drinks at just ₹999!",
    code: "FAMILY999",
    color: "offer-blue",
    expiry: "Weekends Only",
  },
  {
    id: 6,
    emoji: "🎂",
    title: "Birthday Special",
    desc: "Celebrate your birthday with 30% off on your entire order!",
    code: "BDAY30",
    color: "offer-pink",
    expiry: "On Your Birthday",
  },
];

function Offers() {
  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Code "${code}" copied! 🎉`);
  };

  return (
    <div className="offers-page">
      <div className="offers-header">
        <h2>🎁 Exclusive Offers</h2>
        <p>Grab the best deals before they expire!</p>
      </div>

      <div className="offers-grid">
        {offers.map((offer) => (
          <div key={offer.id} className={`offer-card ${offer.color}`}>
            <div className="offer-emoji">{offer.emoji}</div>
            <div className="offer-expiry">{offer.expiry}</div>
            <h3 className="offer-title">{offer.title}</h3>
            <p className="offer-desc">{offer.desc}</p>
            <div className="offer-code-wrap">
              <span className="offer-code">{offer.code}</span>
              <button
                className="copy-btn"
                onClick={() => copyCode(offer.code)}
              >
                Copy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Offers;