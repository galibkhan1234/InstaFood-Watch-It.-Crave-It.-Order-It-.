const express = require ("express");
const router = express.Router();

const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const controller = require('../controllers/restaurant.controller');


router.post('/create', protect, authorize("PARTNER"), controller.createRestaurant);
router.get('/', controller.getAllRestaurants);
router.get('/nearby', controller.getNearbyRestaurants);
router.get('/my', protect, authorize("PARTNER"), controller.getMyRestaurants);
router.get('/:id', controller.getRestaurantById);
router.put('/:id', protect, authorize("PARTNER"), controller.updateRestaurant);
router.delete('/:id',protect,authorize("PARTNER"), controller.deleteRestaurant)

router.patch(
  '/approve/:id',
  protect,
  authorize("ADMIN"),
  controller.approveRestaurant
);

module.exports = router;