const express = require('express');
const { authenticate, isAdmin } = require('../middleware/auth');
const { uploadTruckImage } = require('../config/upload');
const {
  createTruck,
  getAllTrucks,
  getAvailableTrucks,
  getTruckById,
  updateTruck,
  deleteTruck,
  uploadTruckImage: uploadTruckImageController
} = require('../controllers/truckController');

const router = express.Router();

// Public routes (anyone can view trucks)
router.get('/', getAllTrucks);
router.get('/available', getAvailableTrucks);
router.get('/:id', getTruckById);

// Admin only routes
router.post('/', authenticate, isAdmin, createTruck);
router.put('/:id', authenticate, isAdmin, updateTruck);
router.delete('/:id', authenticate, isAdmin, deleteTruck);
router.post('/:id/upload-image', authenticate, isAdmin, uploadTruckImage.single('image'), uploadTruckImageController);

module.exports = router;