import Hotel from "../models/hotelModel.js";
import Menu from "../models/menuModel.js";
import HotelOrder from "../models/hotelOrderModel.js";
export const getHotelMenuByRestaurant = async (req, res) => {
     const { restaurantId } = req.body;
     const hotelId = req.user.id; // Assuming hotelId is set in the request object

     try {
        const menu = await Menu.findOne({ restaurantId, hotelId });
        if (!menu) {
            return res.status(404).json({ message: "Menu not found for this restaurant" });
        }
        res.status(200).json(menu);
     } catch (error) {
            console.error("Error fetching hotel menu:", error);
        res.status(500).json({ message: "Server error", error });
     }
};
export const orderForHotel = async (req, res) => {
    const orderData = req.body;
    const hotelId = req.user.id;

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
