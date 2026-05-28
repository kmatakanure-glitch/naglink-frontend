const db = require('../models');
const Order = db.Order;
const OrderTruck = db.OrderTruck;
const Truck = db.Truck;
const User = db.User;

// Admin creates order with multiple trucks
const createMultiTruckOrder = async (req, res) => {
  try {
    const {
      customerId,
      pickupLocation,
      deliveryLocation,
      goodsDescription,
      weight,
      trucks
    } = req.body;
    
    // First validate all trucks and drivers are available
    for (const truck of trucks) {
      const truckData = await Truck.findByPk(truck.truckId);
      if (!truckData || !truckData.isAvailable) {
        return res.status(400).json({ 
          message: `Truck ${truck.truckId} is not available for assignment` 
        });
      }
      
      const driverData = await User.findByPk(truck.driverId);
      if (!driverData || !driverData.isAvailable || driverData.role !== 'driver') {
        return res.status(400).json({ 
          message: `Driver ${truck.driverId} is not available for assignment` 
        });
      }
    }
    
    // Create main order
    const order = await Order.create({
      customerId,
      pickupLocation,
      deliveryLocation,
      goodsDescription,
      weight,
      approvalStatus: 'approved',
      status: 'approved'
    });
    
    // Assign trucks to order and mark them as unavailable
    const assignedTrucks = [];
    for (const truck of trucks) {
      const orderTruck = await OrderTruck.create({
        orderId: order.id,
        truckId: truck.truckId,
        driverId: truck.driverId,
        packageNumber: truck.packageNumber,
        departureTime: truck.departureTime,
        forecastedArrival: truck.forecastedArrival,
        status: 'assigned'
      });
      
      // Mark truck as unavailable
      await Truck.update({ isAvailable: false }, { where: { id: truck.truckId } });
      
      // Mark driver as unavailable
      await User.update({ isAvailable: false }, { where: { id: truck.driverId } });
      
      assignedTrucks.push(orderTruck);
    }
    
    res.status(201).json({
      message: `Order created with ${assignedTrucks.length} trucks`,
      order,
      trucks: assignedTrucks
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating multi-truck order', error: error.message });
  }
};
// Get order with all trucks status
const getOrderWithTrucks = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findByPk(orderId, {
      include: [
        { model: User, as: 'customer', attributes: ['username', 'email', 'phone'] },
        { 
          model: OrderTruck, 
          as: 'trucks',
          include: [
            { model: Truck, as: 'truck' },
            { model: User, as: 'driver', attributes: ['username', 'email', 'phone'] }
          ]
        }
      ]
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Calculate overall progress
    const totalTrucks = order.trucks.length;
    const completedTrucks = order.trucks.filter(t => t.status === 'delivered').length;
    const inTransitTrucks = order.trucks.filter(t => t.status === 'in_transit').length;
    const progressPercentage = (completedTrucks / totalTrucks) * 100;
    
    res.json({
      order,
      summary: {
        totalTrucks,
        completedTrucks,
        inTransitTrucks,
        pendingTrucks: totalTrucks - completedTrucks - inTransitTrucks,
        progressPercentage
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
};

// Update individual truck status (for drivers)
const updateTruckStatus = async (req, res) => {
  try {
    const { orderTruckId } = req.params;
    const { 
      status, 
      currentLocation, 
      loadingDocumentUrl, 
      offloadingDocumentUrl,
      loadingNotes,
      actualDepartureTime,
      actualArrivalTime
    } = req.body;
    
    const orderTruck = await OrderTruck.findByPk(orderTruckId);
    if (!orderTruck) {
      return res.status(404).json({ message: 'Truck assignment not found' });
    }
    
    const updates = { status, lastUpdate: new Date() };
    if (currentLocation) updates.currentLocation = currentLocation;
    if (loadingDocumentUrl) updates.loadingDocumentUrl = loadingDocumentUrl;
    if (offloadingDocumentUrl) updates.offloadingDocumentUrl = offloadingDocumentUrl;
    if (loadingNotes) updates.loadingNotes = loadingNotes;
    if (actualDepartureTime) updates.actualDepartureTime = actualDepartureTime;
    if (actualArrivalTime) updates.actualArrivalTime = actualArrivalTime;
    
    await orderTruck.update(updates);
    
    // If truck is delivered, mark truck as available
    if (status === 'delivered') {
      await Truck.update({ isAvailable: true }, { where: { id: orderTruck.truckId } });
    }
    
    res.json({
      message: 'Truck status updated',
      orderTruck
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating truck status', error: error.message });
  }
};

// Admin approves loading for specific truck
const approveTruckLoading = async (req, res) => {
  try {
    const { orderTruckId } = req.params;
    
    const orderTruck = await OrderTruck.findByPk(orderTruckId);
    if (!orderTruck) {
      return res.status(404).json({ message: 'Truck assignment not found' });
    }
    
    await orderTruck.update({
      loadingApproved: true,
      status: 'in_transit',
      actualDepartureTime: new Date()
    });
    
    res.json({
      message: 'Loading approved for truck. Now in transit.',
      orderTruck
    });
  } catch (error) {
    res.status(500).json({ message: 'Error approving loading', error: error.message });
  }
};

// Admin approves offloading for specific truck
const approveTruckOffloading = async (req, res) => {
  try {
    const { orderTruckId } = req.params;
    
    const orderTruck = await OrderTruck.findByPk(orderTruckId);
    if (!orderTruck) {
      return res.status(404).json({ message: 'Truck assignment not found' });
    }
    
    await orderTruck.update({
      offloadingApproved: true,
      status: 'delivered',
      actualArrivalTime: new Date()
    });
    
    // Free up the truck
    await Truck.update({ isAvailable: true }, { where: { id: orderTruck.truckId } });
    
    // Free up the driver
    if (orderTruck.driverId) {
      await User.update({ isAvailable: true }, { where: { id: orderTruck.driverId } });
    }
    
    res.json({
      message: 'Offloading approved. Truck delivery completed.',
      orderTruck
    });
  } catch (error) {
    res.status(500).json({ message: 'Error approving offloading', error: error.message });
  }
};
module.exports = {
  createMultiTruckOrder,
  getOrderWithTrucks,
  updateTruckStatus,
  approveTruckLoading,
  approveTruckOffloading
};