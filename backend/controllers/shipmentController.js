const Shipment = require('../models/Shipment');

// @desc    Create a new shipment
// @route   POST /api/shipments
// @access  Private
exports.createShipment = async (req, res) => {
  try {
    const { trackingId, senderName, receiverName, sourceLocation, destinationLocation, status } = req.body;

    // Validation
    if (!trackingId || !senderName || !receiverName || !sourceLocation || !destinationLocation) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if tracking ID already exists
    const existingShipment = await Shipment.findOne({ trackingId });
    if (existingShipment) {
      return res.status(400).json({ message: 'Tracking ID already exists' });
    }

    const shipment = await Shipment.create({
      trackingId,
      senderName,
      receiverName,
      sourceLocation,
      destinationLocation,
      status: status || 'Created',
      createdBy: req.user._id,
    });

    res.status(201).json(shipment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all shipments
// @route   GET /api/shipments
// @access  Private
exports.getShipments = async (req, res) => {
  try {
    // Users can only see their own shipments, admins see all
    const query = req.user.role === 'admin' 
      ? {} 
      : { createdBy: req.user._id };
    
    const shipments = await Shipment.find(query)
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });
    res.json(shipments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single shipment
// @route   GET /api/shipments/:id
// @access  Private
exports.getShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id).populate('createdBy', 'name email');

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    res.json(shipment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update shipment
// @route   PUT /api/shipments/:id
// @access  Private (only creator)
exports.updateShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    // Check if user is the creator
    if (shipment.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this shipment' });
    }

    const { senderName, receiverName, sourceLocation, destinationLocation, status } = req.body;

    shipment.senderName = senderName || shipment.senderName;
    shipment.receiverName = receiverName || shipment.receiverName;
    shipment.sourceLocation = sourceLocation || shipment.sourceLocation;
    shipment.destinationLocation = destinationLocation || shipment.destinationLocation;
    shipment.status = status || shipment.status;

    const updatedShipment = await shipment.save();
    res.json(updatedShipment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete shipment
// @route   DELETE /api/shipments/:id
// @access  Private (only creator)
exports.deleteShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    // Check if user is the creator
    if (shipment.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this shipment' });
    }

    await shipment.deleteOne();
    res.json({ message: 'Shipment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

