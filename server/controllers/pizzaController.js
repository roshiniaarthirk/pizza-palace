const Pizza = require("../models/Pizza");

// Add Pizza
const addPizza = async (req, res) => {
  try {
    const pizza = await Pizza.create(req.body);
    res.status(201).json(pizza);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get All Pizzas
const getPizzas = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const pizzas = await Pizza.find(filter);
    res.json(pizzas);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Update Pizza
const updatePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(pizza);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Delete Pizza
const deletePizza = async (req, res) => {
  try {
    await Pizza.findByIdAndDelete(req.params.id);
    res.json({ message: "Pizza deleted successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  addPizza,
  getPizzas,
  updatePizza,
  deletePizza,
};