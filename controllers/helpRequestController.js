const HelpRequest = require('../models/HelpRequest');
const User = require('../models/User');

// @desc    Create a help request
// @route   POST /api/help-requests
// @access  Private
exports.createHelpRequest = async (req, res) => {
  try {
    const { description, category, location, address } = req.body;
    
    // Convert frontend location format {lat, lng} to GeoJSON format
    let geoLocation = {
      type: 'Point',
      coordinates: [0, 0],
      address: address || 'Location not specified'
    };
    
    if (location) {
      if (location.lat && location.lng) {
        // Frontend format: {lat, lng}
        geoLocation.coordinates = [location.lng, location.lat];
      } else if (location.coordinates) {
        // Already GeoJSON format
        geoLocation.coordinates = location.coordinates;
      }
      if (location.address) {
        geoLocation.address = location.address;
      }
    }
    
    const helpRequest = await HelpRequest.create({
      user: req.user.id,
      description,
      category: category || 'General',
      location: geoLocation,
      title: description ? description.substring(0, 50) : 'Help Request'
    });

    res.status(201).json({
      success: true,
      data: helpRequest
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all help requests
// @route   GET /api/help-requests
// @access  Private
exports.getHelpRequests = async (req, res) => {
  try {
    const { status, category, priority } = req.query;
    
    let query = {};
    
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    const helpRequests = await HelpRequest.find(query)
      .populate('user', 'name phone profilePicture rating')
      .populate('helper', 'name phone profilePicture rating')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: helpRequests.length,
      data: helpRequests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get nearby help requests
// @route   GET /api/help-requests/nearby
// @access  Private
exports.getNearbyHelpRequests = async (req, res) => {
  try {
    const { longitude, latitude, radius = 10 } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide longitude and latitude'
      });
    }

    const helpRequests = await HelpRequest.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: radius * 1000 // Convert to meters
        }
      },
      status: 'pending'
    })
      .populate('user', 'name phone profilePicture rating')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: helpRequests.length,
      data: helpRequests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single help request
// @route   GET /api/help-requests/:id
// @access  Private
exports.getHelpRequest = async (req, res) => {
  try {
    const helpRequest = await HelpRequest.findById(req.params.id)
      .populate('user', 'name phone profilePicture rating')
      .populate('helper', 'name phone profilePicture rating');

    if (!helpRequest) {
      return res.status(404).json({
        success: false,
        message: 'Help request not found'
      });
    }

    res.status(200).json({
      success: true,
      data: helpRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update help request
// @route   PUT /api/help-requests/:id
// @access  Private
exports.updateHelpRequest = async (req, res) => {
  try {
    let helpRequest = await HelpRequest.findById(req.params.id);

    if (!helpRequest) {
      return res.status(404).json({
        success: false,
        message: 'Help request not found'
      });
    }

    // Make sure user is help request owner
    if (helpRequest.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this help request'
      });
    }

    helpRequest = await HelpRequest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: helpRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Accept help request
// @route   PUT /api/help-requests/:id/accept
// @access  Private
exports.acceptHelpRequest = async (req, res) => {
  try {
    let helpRequest = await HelpRequest.findById(req.params.id);

    if (!helpRequest) {
      return res.status(404).json({
        success: false,
        message: 'Help request not found'
      });
    }

    if (helpRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'This help request has already been accepted'
      });
    }

    helpRequest.helper = req.user.id;
    helpRequest.status = 'accepted';
    helpRequest.acceptedAt = Date.now();

    await helpRequest.save();

    res.status(200).json({
      success: true,
      data: helpRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Complete help request
// @route   PUT /api/help-requests/:id/complete
// @access  Private
exports.completeHelpRequest = async (req, res) => {
  try {
    let helpRequest = await HelpRequest.findById(req.params.id);

    if (!helpRequest) {
      return res.status(404).json({
        success: false,
        message: 'Help request not found'
      });
    }

    if (helpRequest.helper.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to complete this help request'
      });
    }

    helpRequest.status = 'completed';
    helpRequest.completedAt = Date.now();

    await helpRequest.save();

    // Update helper's total helps
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { totalHelps: 1 }
    });

    res.status(200).json({
      success: true,
      data: helpRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Rate help request
// @route   PUT /api/help-requests/:id/rate
// @access  Private
exports.rateHelpRequest = async (req, res) => {
  try {
    const { rating, feedback } = req.body;

    let helpRequest = await HelpRequest.findById(req.params.id);

    if (!helpRequest) {
      return res.status(404).json({
        success: false,
        message: 'Help request not found'
      });
    }

    if (helpRequest.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to rate this help request'
      });
    }

    if (helpRequest.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate completed help requests'
      });
    }

    helpRequest.rating = rating;
    helpRequest.feedback = feedback;

    await helpRequest.save();

    // Update helper's rating
    const helperRequests = await HelpRequest.find({ 
      helper: helpRequest.helper,
      rating: { $exists: true }
    });

    const avgRating = helperRequests.reduce((acc, req) => acc + req.rating, 0) / helperRequests.length;

    await User.findByIdAndUpdate(helpRequest.helper, {
      rating: avgRating.toFixed(1)
    });

    res.status(200).json({
      success: true,
      data: helpRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete help request
// @route   DELETE /api/help-requests/:id
// @access  Private
exports.deleteHelpRequest = async (req, res) => {
  try {
    const helpRequest = await HelpRequest.findById(req.params.id);

    if (!helpRequest) {
      return res.status(404).json({
        success: false,
        message: 'Help request not found'
      });
    }

    // Make sure user is help request owner
    if (helpRequest.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this help request'
      });
    }

    await helpRequest.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
