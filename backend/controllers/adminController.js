const Shipment = require('../models/Shipment');
const User = require('../models/User');

// @desc    Get all shipments (admin only)
// @route   GET /api/admin/shipments
// @access  Private/Admin
exports.getAllShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find()
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });
    res.json(shipments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update shipment status (admin only)
// @route   PATCH /api/admin/shipments/:id/status
// @access  Private/Admin
exports.updateShipmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!status || !['Created', 'In Transit', 'Delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be: Created, In Transit, or Delivered' });
    }

    const shipment = await Shipment.findById(req.params.id);

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    // Admin can only update status
    shipment.status = status;
    const updatedShipment = await shipment.save();

    res.json(updatedShipment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};








