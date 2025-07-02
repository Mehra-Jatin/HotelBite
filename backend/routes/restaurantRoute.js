import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { addHotel, addItem, deleteItem, getMenu, getMenuItems, getOrdersByHotel, getPartnerHotels, getRestaurantOrders, removeHotel, updateDeliveryStatus, updateItem, updatePaymentStatus, updatePendingPayment } from '../controllers/resturantController.js';

const router = express.Router();


router.get('/menu',authMiddleware, getMenu); // Get menu for a restaurant


router.get('/menu-items',authMiddleware, getMenuItems); // Get menu items for a restaurant
router.post('/menu-items',authMiddleware, addItem); // Add a new item to the restaurant's menu
router.put('/menu-items/:id',authMiddleware, updateItem); // Update an existing item in the restaurant's menu
router.delete('/menu-items/:id',authMiddleware, deleteItem); // Delete an item from the restaurant's menu

router.get('/orders',authMiddleware,getRestaurantOrders); // Get all orders for a restaurant
router.get('/orders/:id',authMiddleware,getOrdersByHotel); // Get orders by hotelId

router.post('/update-payment/:id',authMiddleware, updatePaymentStatus); // Update payment status for an order
router.post('/update-payment',authMiddleware, updatePendingPayment); // Update payment status for all pending payments

router.post('/update-delivery/:id', authMiddleware, updateDeliveryStatus); // Update delivery status for an order

router.post('/partners/:id',authMiddleware,addHotel); // Add a hotel to the restaurant's partner list
router.get('/partners',authMiddleware, getPartnerHotels); // Get all partner hotels for a restaurant
router.delete('/partners/:id',authMiddleware,removeHotel); // Remove a hotel from the restaurant's partner list
export default router;