const Restaurant = require("../models/restaurant.model");

exports.createRestaurant = async (req, res, next) => {
  try {
    // ✅ Validate location upfront
    if (!req.body.location?.coordinates || !req.body.location?.city) {
      return res.status(400).json({
        success: false,
        message: "location.coordinates and location.city are required"
      });
    }
    const {
      name,
      description,
      location,
      cuisineTags,
      category,
      image,
      phone,
      deliveryRadiusKm
    } = req.body;

    const restaurant = await Restaurant.create({
      name,
      description,
      location,
      cuisineTags,
      category,
      image,
      phone,
      deliveryRadiusKm,
      owner: req.user._id
    });

    return res.status(201).json({ success: true, restaurant });
  } catch (error) {
    next(error);
  }
};

exports.getMyRestaurants = async (req, res, next) => {
    try {

        const restaurants = await Restaurant.find({
            owner: req.user.id
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: restaurants.length,
            restaurants
        });

    } catch (error) {
        next(error);
    }
};

exports.getAllRestaurants = async (req, res, next) => {
    try {

        const { city, search, category } = req.query;

        let filter = {
            isApproved: true,
            isOpen: true
        };

        if (city) filter["location.city"] = city;
        if (category) filter.category = category;

        if (search) {
            filter.$text = { $search: search };
        }

        const restaurants = await Restaurant.find(filter)
            .sort({ ratingAverage: -1 });

        res.json({
            success: true,
            count: restaurants.length,
            restaurants
        });

    } catch (error) {
        next(error);
    }
};

exports.getNearbyRestaurants = async (req, res, next) => {
    try {

        const { lat, lng, radius = 5 } = req.query;

        if (!lat || !lng)
            return res.status(400).json({
                message: "Latitude and longitude required"
            });

        const restaurants = await Restaurant.find({
            isApproved: true,
            isOpen: true,
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: radius * 1000
                }
            }
        });

        res.json({
            success: true,
            count: restaurants.length,
            restaurants
        });

    } catch (error) {
        next(error);
    }
};

exports.getRestaurantById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const restaurant = await Restaurant
            .findById(id)
            .populate("owner", "name email");
            
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }

        res.json({
            success: true,
            restaurant
        });

    } catch (error) {
        next(error);
    }
};

exports.updateRestaurant = async (req, res, next) => {
    try {

        const { id } = req.params;

        const restaurant = await Restaurant.findById(id);

        if (!restaurant)
            return res.status(404).json({ message: "Not found" });

        if (restaurant.owner.toString() !== req.user.id)
            return res.status(403).json({ message: "Not allowed" });

        // Whitelist allowed fields to prevent mass assignment
        const allowedFields = ['name', 'description', 'location', 'cuisineTags', 'category', 'image', 'phone', 'deliveryRadiusKm', 'isOpen'];
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                restaurant[field] = req.body[field];
            }
        });

        await restaurant.save();

        res.json({
            success: true,
            restaurant
        });

    } catch (error) {
        next(error);
    }
};

exports.approveRestaurant = async (req, res, next) => {
    try {

        const { id } = req.params;

        const restaurant = await Restaurant.findByIdAndUpdate(
            id,
            { isApproved: true },
            { new: true }
        );

        if (!restaurant)
            return res.status(404).json({ message: "Not found" });

        res.json({
            success: true,
            restaurant
        });

    } catch (error) {
        next(error);
    }
};

exports.deleteRestaurant = async (req, res, next) => {
    try {
        const { id } = req.params;

        const restaurant = await Restaurant.findById(id);

        if (!restaurant)
            return res.status(404).json({ message: "Not found" });
        if (restaurant.owner.toString() !== req.user.id)
            return res.status(403).json({ message: "Not allowed" });

        await restaurant.deleteOne();
        res.json({ success: true,
            message:"Deleted !"
         });

    } catch (error) {
        next(error);
    }   
};
