const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getNearbyHelpers
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/nearby-helpers', protect, getNearbyHelpers);
router.get('/', protect, authorize('admin'), getUsers);
router.get('/:id', protect, getUser);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
