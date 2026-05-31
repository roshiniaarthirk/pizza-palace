const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

router.post("/", protect, placeOrder);
router.get("/my", protect, getMyOrders);
router.get("/", protect, getAllOrders);
router.put("/:id/status", protect, updateOrderStatus);

module.exports = router;