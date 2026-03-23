const Cart = require('../models/cart.models');
const Product = require('../models/product.models');

exports.addToCart = async (req, res, next) => {
    try {

        const { productId, quantity } = req.body;
        const userId = req.user.id;

        const product = await Product.findOne({
            _id: productId,
            isDeleted: false,
            isAvailable: true
        });

        if (!product)
            return res.status(400).json({ message: "Invalid product" });

        if (product.stock < quantity)
            return res.status(400).json({ message: "Insufficient stock" });

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = await Cart.create({
                user: userId,
                restaurant: product.restaurant,
                items: [],
                totalAmount: 0
            });
        }

        // Enforce single restaurant cart
        if (cart.restaurant.toString() !== product.restaurant.toString())
            return res.status(400).json({
                message: "Cart contains items from another restaurant"
            });

        const existingItem = cart.items.find(
            item => item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.totalPrice =
                existingItem.quantity * product.price;
        } else {
            cart.items.push({
                product: product._id,
                name: product.name,
                image: product.image,
                quantity,
                unitPrice: product.price,
                totalPrice: product.price * quantity
            });
        }

        cart.totalAmount = cart.items.reduce(
            (sum, item) => sum + item.totalPrice,
            0
        );

        await cart.save();

        res.json({ success: true, cart });

    } catch (error) {
        next(error);
    }
};

exports.getMyCart = async (req, res, next) => {
    try {

        const cart = await Cart.findOne({ user: req.user.id });

        res.json({
            success: true,
            cart
        });

    } catch (error) {
        next(error);
    }
};

exports.clearCart = async (req, res, next) => {
    try {

        await Cart.findOneAndDelete({ user: req.user.id });

        res.json({ success: true });

    } catch (error) {
        next(error);
    }
};