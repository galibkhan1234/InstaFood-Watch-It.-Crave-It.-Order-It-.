const Product = require('../models/product.model');
const Restaurant = require('../models/restaurant.model');

exports.createProduct = async (req, res, next) => {
    try {

        const { restaurant } = req.body;

        const restaurantDoc = await Restaurant.findById(restaurant);

        if (!restaurantDoc)
            return res.status(404).json({ message: "Restaurant not found" });

        if (restaurantDoc.owner.toString() !== req.user.id)
            return res.status(403).json({ message: "Not your restaurant" });

        const { name, description, price, foodType, category, image, preparationTime } = req.body;
        const product = await Product.create({
            restaurant: restaurant,
            name, description, price, foodType, category, image, preparationTime
        });

        res.status(201).json({
            success: true,
            product
        });

    } catch (error) {
        next(error);
    }
};

exports.getProductsByRestaurant = async (req, res, next) => {
    try {

        const { restaurantId } = req.params;

        const products = await Product.find({
            restaurant: restaurantId,
            isDeleted: false,
            isAvailable: true
        });

        res.json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        next(error);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {

        const { id } = req.params;

        const product = await Product.findById(id).populate('restaurant');

        if (!product)
            return res.status(404).json({ message: "Not found" });

        if (product.restaurant.owner.toString() !== req.user.id)
            return res.status(403).json({ message: "Not allowed" });

        // Whitelist allowed fields to prevent mass assignment
        const allowedFields = ['name', 'description', 'price', 'foodType', 'category', 'image', 'preparationTime', 'isAvailable'];
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                product[field] = req.body[field];
            }
        });
        await product.save();

        res.json({
            success: true,
            product
        });

    } catch (error) {
        next(error);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {

        const { id } = req.params;

        const product = await Product.findById(id).populate('restaurant');

        if (!product)
            return res.status(404).json({ message: "Not found" });

        if (product.restaurant.owner.toString() !== req.user.id)
            return res.status(403).json({ message: "Not allowed" });

        product.isDeleted = true;
        await product.save();

        res.json({ success: true });

    } catch (error) {
        next(error);
    }
};