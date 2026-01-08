const express = require('express');
const {
  createHelpRequest,
  getHelpRequests,
  getNearbyHelpRequests,
  getHelpRequest,
  updateHelpRequest,
  acceptHelpRequest,
  completeHelpRequest,
  rateHelpRequest,
  deleteHelpRequest,
  offerHelp
} = require('../controllers/helpRequestController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getHelpRequests)
  .post(protect, createHelpRequest);

router.get('/nearby', protect, getNearbyHelpRequests);

router.route('/:id')
  .get(protect, getHelpRequest)
  .put(protect, updateHelpRequest)
  .delete(protect, deleteHelpRequest);

router.put('/:id/accept', protect, acceptHelpRequest);
router.put('/:id/complete', protect, completeHelpRequest);
router.put('/:id/rate', protect, rateHelpRequest);
router.post('/:id/offer-help', protect, offerHelp);

module.exports = router;
