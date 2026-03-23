const mongoose = require('mongoose');
const Order = require('../models/order.model');
const Product = require('../models/product.models');
const Restaurant = require('../models/restaurant.model');
const User = require('../models/user.model');
const Reel = require('../models/reel.model');
const {getIO} = require("../socket");


exports.placeOrder = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const { items, deliveryAddress, paymentMethod } = req.body;

        if (!items || items.length === 0)
            return res.status(400).json({ message: "Cart is empty" });

        let totalAmount = 0;
        let restaurantId = null;
        const orderItems = [];

        for (const item of items) {

            const product = await Product.findOne({
                _id: item.product,
                isDeleted: false,
                isAvailable: true
            }).session(session);

            if (!product)
                throw new Error("Invalid product");

            if (product.stock < item.quantity)
                throw new Error(`Insufficient stock for ${product.name}`);

            if (!restaurantId)
                restaurantId = product.restaurant.toString();

            if (restaurantId !== product.restaurant.toString())
                throw new Error("All items must belong to same restaurant");

            // Deduct stock
            product.stock -= item.quantity;
            if (product.stock <= 0) product.isAvailable = false;

            await product.save({ session });

            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;

            orderItems.push({
                product: product._id,
                name: product.name,
                image: product.image,
                quantity: item.quantity,
                unitPrice: product.price,
                totalPrice: itemTotal
            });
        }

        const order = await Order.create([{
            user: req.user.id,
            restaurant: restaurantId,
            items: orderItems,
            totalAmount,
            deliveryAddress,
            paymentMethod
        }], { session });

        const user = await User.findById(req.user.id);

let reelAttribution = null;

// 30-minute attribution window
if (
  user.lastReelClick &&
  user.lastReelClickAt &&
  Date.now() - user.lastReelClickAt.getTime() < 30 * 60 * 1000
) {
  reelAttribution = {
    reel: user.lastReelClick,
    source: "FEED"
  };

  await Reel.findByIdAndUpdate(
    user.lastReelClick,
    { $inc: { conversionsCount: 1 } }
  );
}

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            order: order[0]
        });

        const io = getIO();

// Notify restaurant dashboard
io.to(`restaurant_${order.restaurant}`)
  .emit("newOrder", order);

// Notify user
io.to(`user_${order.user}`)
  .emit("orderPlaced", order);

    } catch (error) {

        await session.abortTransaction();
        session.endSession();

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.getMyOrders = async (req, res, next) => {
    try {

        const orders = await Order.find({
            user: req.user.id
        })
        .sort({ createdAt: -1 })
        .populate('restaurant', 'name image');

        res.json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {
        next(error);
    }
};

exports.getRestaurantOrders = async (req, res, next) => {
    try {

        const { restaurantId } = req.params;

        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant)
            return res.status(404).json({ message: "Restaurant not found" });

        if (restaurant.owner.toString() !== req.user.id)
            return res.status(403).json({ message: "Not allowed" });

        const orders = await Order.find({
            restaurant: restaurantId
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {
        next(error);
    }
};

exports.updateOrderStatus = async (req, res, next) => {
    try {

        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findById(id).populate('restaurant');

        if (!order)
            return res.status(404).json({ message: "Order not found" });

        if (order.restaurant.owner.toString() !== req.user.id)
            return res.status(403).json({ message: "Not allowed" });

        order.orderStatus = status;
        order.statusHistory.push({ status });

        await order.save();

        const io = getIO();

io.to(`restaurant_${order.restaurant}`)
  .emit("orderStatusUpdated", order);

io.to(`user_${order.user}`)
  .emit("orderStatusUpdated", order);

        res.json({
            success: true,
            order
        });

    } catch (error) {
        next(error);
    }
};

exports.cancelOrder = async (req, res, next) => {
    try {

        const { id } = req.params;

        const order = await Order.findById(id);

        if (!order)
            return res.status(404).json({ message: "Not found" });

        if (order.user.toString() !== req.user.id)
            return res.status(403).json({ message: "Not allowed" });

        if (order.orderStatus !== "PENDING")
            return res.status(400).json({
                message: "Cannot cancel after confirmation"
            });

        order.orderStatus = "CANCELLED";
        order.statusHistory.push({ status: "CANCELLED" });

        await order.save();

        res.json({ success: true });

    } catch (error) {
        next(error);
    }
};