const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/isAdmin');
const {
  getAllShipments,
  updateShipmentStatus,
  getAllUsers,
} = require('../controllers/adminController');

// All admin routes require authentication and admin role
router.use(protect);
router.use(isAdmin);

router.get('/shipments', getAllShipments);
router.patch('/shipments/:id/status', updateShipmentStatus);
router.get('/users', getAllUsers);

module.exports = router;








