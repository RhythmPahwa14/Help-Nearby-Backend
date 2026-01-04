const mongoose = require('mongoose');

const helpRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
    default: 'Help Request'
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    enum: [
      'General',
      'Groceries', 
      'Medical',
      'Transport',
      'Household',
      'medical',
      'emergency',
      'transport',
      'food',
      'shelter',
      'assistance',
      'other'
    ]
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
    address: {
      type: String,
      default: 'Address not provided'
    },
    lat: Number,
    lng: Number
  },
  address: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  helper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  acceptedAt: Date,
  completedAt: Date,
  images: [{
    type: String
  }],
  contactNumber: {
    type: String,
    default: ''
  },
  estimatedTime: {
    type: Number, // in minutes
    default: 30
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: String
}, {
  timestamps: true
});

// Create geospatial index
helpRequestSchema.index({ location: '2dsphere' });
helpRequestSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('HelpRequest', helpRequestSchema);
