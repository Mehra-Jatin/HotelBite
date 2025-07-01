import Hotel from "../models/hotelModel.js";
import Menu from "../models/menuModel.js";
import HotelOrder from "../models/hotelOrderModel.js";
import PricePercentage from "../models/pricePercentageModel.js";

export const getHotelDetails = async (req, res) => {
    const {hotelId }=  req.body;

    try {
        const hotel = await Hotel.findById(hotelId).populate('address');
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        res.status(200).json(hotel);

    } catch (error) {
        console.error("Error fetching hotel details:", error);
        res.status(500).json({ message: "Server error", error });
    }
};


export const getHotelMenu = async (req, res) => {
    const { hotelId } = req.params; // Assuming hotelId is passed in the request params

    try {
        const menus = await Menu.find({ hotels: hotelId })
            .populate({
                path: 'items',
                model: 'Item',
            });

        if (!menus || menus.length === 0) {
            return res.status(404).json({ message: "Menu not found for this hotel" });
        }

        const percentages = await PricePercentage.find({ hotelId });

        const percentageMap = {};
        percentages.forEach(p => {
            percentageMap[p.category] = p.percentage;
        });

        const formattedMenus = menus.map(menu => {
            const updatedItems = menu.items.map(item => {
                const percent = percentageMap[item.category] || 0;
                const updatedPrice = item.price + (item.price * percent / 100);
                return {
                    ...item.toObject(),
                    adjustedPrice: Math.round(updatedPrice * 100) / 100,
                };
            });

            return {
                isAvailable: menu.isAvailable,
                items: updatedItems,
            };
        });

        res.status(200).json(formattedMenus);
    } catch (error) {
        console.error("Error fetching hotel menu:", error);
        res.status(500).json({ message: "Server error", error });
    }
};


export const getHotelMenuByRestaurant = async (req, res) => {
     const { restaurantId } = req.body;
     const hotelId = req.user.id; // Assuming hotelId is set in the request object

     try {
        const menu = await Menu.findOne({ restaurantId , hotels: hotelId });
        if (!menu) {
            return res.status(404).json({ message: "Menu not found for this restaurant" });
        }
        res.status(200).json(menu);
     } catch (error) {
            console.error("Error fetching hotel menu:", error);
        res.status(500).json({ message: "Server error", error });
     }
};

export const createHotelMenuPercentage = async (req, res) => {
    const { category, percentage } = req.body;
     const hotelId = req.user.id;

     try {

        if(!category || !percentage) {
            return res.status(400).json({ message: "Category and percentage are required" });
        }
        const existingPercentage = await PricePercentage.findOne({ category, hotelId });

        if (existingPercentage) {
            return res.status(400).json({ message: "Price percentage for this category already exists" });
        }

        const newPercentage = new PricePercentage({ category, percentage, hotelId });
        await newPercentage.save();

        res.status(201).json({ message: "Price percentage created successfully" });
     } catch (error) {
         console.error("Error creating hotel menu:", error);
         res.status(500).json({ message: "Server error", error });
     }
};


export const updateHotelMenuPercentage = async (req, res) => {
    const { category, percentage } = req.body;
     const hotelId = req.user.id;

     try {
        if(!category || !percentage) {
            return res.status(400).json({ message: "Category and percentage are required" });
        }

        const existingPercentage = await PricePercentage.findOneAndUpdate(
            { category, hotelId },
            { percentage },
            { new: true }
        );

        if (!existingPercentage) {
            return res.status(404).json({ message: "Price percentage not found for this category" });
        }

        res.status(200).json({ message: "Price percentage updated successfully" });
     } catch (error) {
         console.error("Error updating hotel menu:", error);
         res.status(500).json({ message: "Server error", error });
     }
};


export const orderFromHotel = async (req, res) => {
    const orderData = req.body;
    const { hotelId } = req.params;

    try {
        const { name, phoneNo, items, roomNo, totalAmount } = orderData;

        if (!name || !phoneNo || !items || !roomNo || totalAmount == null) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const hotelOrder = new HotelOrder({
            hotelId,
            roomNo,
            name,
            phoneNo,
            items,
            totalAmount
        });

        await hotelOrder.save();

        return res.status(201).json({
            message: "Order placed successfully",
        });
    } catch (error) {
        console.error("Error placing hotel order:", error);
        return res.status(500).json({ message: "Server error ",error });
    }
};


export const getHotelOrders = async (req, res) => {
    const hotelId = req.user.id;

    try {
        const orders = await HotelOrder.find({ hotelId })
            .populate('items.itemId') // Populate itemId inside items array
            .sort({ createdAt: -1 }); // Sort by latest orders first

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this hotel" });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching hotel orders:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
