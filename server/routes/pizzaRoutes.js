const express = require("express");
const {
  addPizza,
  getPizzas,
  updatePizza,
  deletePizza,
} = require("../controllers/pizzaController");

const router = express.Router();

router.get("/", getPizzas);
router.post("/", addPizza);
router.put("/:id", updatePizza);
router.delete("/:id", deletePizza);

module.exports = router;