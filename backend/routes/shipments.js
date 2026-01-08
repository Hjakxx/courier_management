const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createShipment,
  getShipments,
  getShipment,
  updateShipment,
  deleteShipment,
} = require('../controllers/shipmentController');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getShipments)
  .post(createShipment);

router.route('/:id')
  .get(getShipment)
  .put(updateShipment)
  .delete(deleteShipment);

module.exports = router;








