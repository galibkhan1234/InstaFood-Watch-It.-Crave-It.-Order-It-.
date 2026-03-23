const Order = require ("../models/order.model");
const mongoose = require ("mongoose");

exports.getRestaurantAnalytics = async (req, res, next) => {
    try {

        const { restaurantId } = req.params;

        const stats = await Order.aggregate([
            {
                $match: {
                    restaurant: new mongoose.Types.ObjectId(restaurantId),
                    paymentStatus: "PAID"
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" },
                    totalOrders: { $sum: 1 },
                    deliveredOrders: {
                        $sum: {
                            $cond: [
                                { $eq: ["$orderStatus", "DELIVERED"] },
                                1,
                                0
                            ]
                        }
                    },
                    cancelledOrders: {
                        $sum: {
                            $cond: [
                                { $eq: ["$orderStatus", "CANCELLED"] },
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        res.json({
            success: true,
            stats: stats[0] || {}
        });

    } catch (error) {
        next(error);
    }
};

exports.getTopProducts = async (req, res, next) => {
    try {

        const { restaurantId } = req.params;

        const topProducts = await Order.aggregate([
            {
                $match: {
                    restaurant: new mongoose.Types.ObjectId(restaurantId),
                    paymentStatus: "PAID"
                }
            },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product",
                    name: { $first: "$items.name" },
                    totalSold: { $sum: "$items.quantity" },
                    revenue: { $sum: "$items.totalPrice" }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 }
        ]);

        res.json({
            success: true,
            topProducts
        });

    } catch (error) {
        next(error);
    }
};