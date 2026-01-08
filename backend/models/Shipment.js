const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  trackingId: {
    type: String,
    required: [true, 'Tracking ID is required'],
    unique: true,
    trim: true,
  },
  senderName: {
    type: String,
    required: [true, 'Sender name is required'],
    trim: true,
  },
  receiverName: {
    type: String,
    required: [true, 'Receiver name is required'],
    trim: true,
  },
  sourceLocation: {
    type: String,
    required: [true, 'Source location is required'],
    trim: true,
  },
  destinationLocation: {
    type: String,
    required: [true, 'Destination location is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['Created', 'In Transit', 'Delivered'],
    default: 'Created',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Shipment', shipmentSchema);








