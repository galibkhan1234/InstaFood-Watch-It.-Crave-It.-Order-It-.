const express = require ("express");
const router = express.Router()
const orderController = require ("../controllers/order.controller")
const {protect} = require("../middlewares/auth.middleware");
const {authorize} = require("../middlewares/role.middleware")


router.post('/', protect, authorize("USER"), orderController.placeOrder);
router.get('/my', protect, authorize("USER"), orderController.getMyOrders);
router.get('/restaurant/:restaurantId', protect, authorize("PARTNER"), orderController.getRestaurantOrders);
router.patch('/:id/status', protect, authorize("PARTNER"), orderController.updateOrderStatus);
router.patch('/:id/cancel', protect, authorize("USER"), orderController.cancelOrder);

module.exports = router;