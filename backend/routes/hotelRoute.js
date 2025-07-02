import express from 'express';
import { addRestaurant, createHotelMenuPercentage, deleteHotelMenuPercentage, getHotelDetails, getHotelMenu, getHotelMenuByRestaurant, getHotelMenuPercentage, getHotelOrders, getOrdersByResturant, getOrdersByRoom, getPartnerRestaurants, orderFromHotel, placeOrderToRestaurant, removeRestaurant, updateHotelMenuPercentage } from '../controllers/hotelController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';


const router = express.Router();

router.get('/details/:id', authMiddleware, getHotelDetails); // Assuming hotelId is passed in the request params

router.get('/menu/:id', getHotelMenu); // Assuming hotelId is passed in the request params
router.get('/menu-restaurant/:id', authMiddleware, getHotelMenuByRestaurant); // Assuming restaurantId is passed in the request params



router.get('/menu-percentage', authMiddleware, getHotelMenuPercentage); // Get menu percentage for a hotel
router.post('/menu-percentage', authMiddleware, createHotelMenuPercentage); // Create or update menu percentage for a hotel
router.put('/menu-percentage', authMiddleware, updateHotelMenuPercentage); // Update menu percentage for a hotel
router.delete('/menu-percentage', authMiddleware, deleteHotelMenuPercentage); // Delete menu percentage for a hotel


router.post('/order/:id', authMiddleware, orderFromHotel); // Assuming hotelId is passed in the request params

router.get('/orders',authMiddleware, getHotelOrders);
router.get('/orders/room', authMiddleware, getOrdersByRoom); // Get orders by room number
router.get('/orders/restaurant/:id', authMiddleware, getOrdersByResturant); // Get orders by restaurantId

router.post('/order/restaurant',authMiddleware, placeOrderToRestaurant);


router.get('/partners',authMiddleware, getPartnerRestaurants); // Get partner restaurants for a hotel
router.post('/partners/:id', authMiddleware, addRestaurant); // Add a restaurant to the hotel
router.delete('/partners/:id',authMiddleware, removeRestaurant); // Remove a restaurant from the hotel

export default router;