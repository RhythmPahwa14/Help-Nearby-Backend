const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Using OpenStreetMap Nominatim API (FREE - no API key required)
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

// @desc    Get location suggestions
// @route   GET /api/locations/search
// @access  Private
router.get('/search', protect, async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      });
    }

    // Use Nominatim API for geocoding (FREE)
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/search?q=${encodeURIComponent(query)}&format=json&limit=5`,
      {
        headers: {
          'User-Agent': 'HelpNearbyApp/1.0'
        }
      }
    );

    const data = await response.json();

    const locations = data.map(item => ({
      displayName: item.display_name,
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      type: item.type,
      importance: item.importance
    }));

    res.status(200).json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Reverse geocode coordinates
// @route   GET /api/locations/reverse
// @access  Private
router.get('/reverse', protect, async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide latitude and longitude'
      });
    }

    // Use Nominatim API for reverse geocoding (FREE)
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      {
        headers: {
          'User-Agent': 'HelpNearbyApp/1.0'
        }
      }
    );

    const data = await response.json();

    res.status(200).json({
      success: true,
      data: {
        address: data.display_name,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        details: data.address || {}
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
