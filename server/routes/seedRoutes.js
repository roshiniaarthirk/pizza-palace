const express = require("express");
const router = express.Router();
const Pizza = require("../models/Pizza");

const pizzas = [
  { name: "Margherita", description: "Classic tomato and cheese", price: 199, category: "Veg", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400" },
  { name: "Pepperoni", description: "Loaded with pepperoni", price: 299, category: "Non-Veg", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400" },
  { name: "BBQ Chicken", description: "Smoky BBQ with chicken", price: 349, category: "Non-Veg", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400" },
  { name: "Veggie Supreme", description: "Fresh garden vegetables", price: 249, category: "Veg", image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400" },
  { name: "Paneer Tikka", description: "Spicy paneer with tikka sauce", price: 279, category: "Specialty", image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400" },
{ name: "Garlic Bread", description: "Crispy garlic bread", price: 99, category: "Sides", image: "https://images.unsplash.com/photo-1619531040576-f9416740661e?w=400" },
];

router.get("/", async (req, res) => {
  await Pizza.deleteMany({});
  await Pizza.insertMany(pizzas);
  res.json({ message: "✅ Pizzas seeded!" });
});

module.exports = router;