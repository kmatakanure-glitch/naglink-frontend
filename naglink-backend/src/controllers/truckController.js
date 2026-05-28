const db = require('../models');
const Truck = db.Truck;

// Create new truck (Admin only)
const createTruck = async (req, res) => {
  try {
    const { truckName, licensePlate, capacity, description, assignedDriverId } = req.body;
    
    // Check if license plate already exists
    const existingTruck = await Truck.findOne({ where: { licensePlate } });
    if (existingTruck) {
      return res.status(400).json({ message: 'Truck with this license plate already exists' });
    }
    
    const truck = await Truck.create({
      truckName,
      licensePlate,
      capacity,
      description: description || null,
      assignedDriverId: assignedDriverId || null,
      isAvailable: true
    });
    
    res.status(201).json({
      message: 'Truck created successfully',
      truck
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating truck', error: error.message });
  }
};

// Upload truck image (Admin only)
const uploadTruckImage = async (req, res) => {
  try {
    const { id } = req.params;
    const truck = await Truck.findByPk(id);
    
    if (!truck) {
      return res.status(404).json({ message: 'Truck not found' });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Generate URL for the uploaded file
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/trucks/${req.file.filename}`;
    
    await truck.update({ imageUrl });
    
    res.json({
      message: 'Truck image uploaded successfully',
      imageUrl: imageUrl,
      truck
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
};

// Get all trucks
const getAllTrucks = async (req, res) => {
  try {
    const trucks = await Truck.findAll({
      include: [
        {
          model: db.User,
          as: "assignedDriver",
          attributes: ["id", "username", "email", "phone", "isAvailable"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ trucks });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching trucks",
      error: error.message,
    });
  }
};

// Get available trucks only
const getAvailableTrucks = async (req, res) => {
  try {
    const trucks = await Truck.findAll({
      where: { isAvailable: true },
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ trucks });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available trucks', error: error.message });
  }
};

// Get single truck by ID
const getTruckById = async (req, res) => {
  try {
    const { id } = req.params;
    const truck = await Truck.findByPk(id);
    
    if (!truck) {
      return res.status(404).json({ message: 'Truck not found' });
    }
    
    res.json({ truck });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching truck', error: error.message });
  }
};

// Update truck (Admin only)
const updateTruck = async (req, res) => {
  try {
    const { id } = req.params;
    const { truckName, licensePlate, capacity, description, isAvailable, assignedDriverId } = req.body;
    
    const truck = await Truck.findByPk(id);
    if (!truck) {
      return res.status(404).json({ message: 'Truck not found' });
    }
    
    await truck.update({
      truckName: truckName || truck.truckName,
      licensePlate: licensePlate || truck.licensePlate,
      capacity: capacity || truck.capacity,
      description: description !== undefined ? description : truck.description,
      isAvailable: isAvailable !== undefined ? isAvailable : truck.isAvailable,
      assignedDriverId:
      assignedDriverId !== undefined ? assignedDriverId || null : truck.assignedDriverId,
      });
    
    res.json({
      message: 'Truck updated successfully',
      truck
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating truck', error: error.message });
  }
};

// Delete truck (Admin only)
const deleteTruck = async (req, res) => {
  try {
    const { id } = req.params;
    const truck = await Truck.findByPk(id);
    
    if (!truck) {
      return res.status(404).json({ message: 'Truck not found' });
    }
    
    await truck.destroy();
    res.json({ message: 'Truck deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting truck', error: error.message });
  }
};

module.exports = {
  createTruck,
  getAllTrucks,
  getAvailableTrucks,
  getTruckById,
  updateTruck,
  deleteTruck,
  uploadTruckImage
};