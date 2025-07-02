import Hotel  from "../models/hotelModel.js";
import Restaurant from "../models/restaurantModel.js";
import RestaurantOrder from "../models/restaurantOrderModel.js";
import Menu from "../models/menuModel.js";
import cloudinary from "../lib/cloudinary.js";
import Item from "../models/itemModel.js";


export const getMenu = async (req, res) => {
    const restaurantId  = req.user.id;

    try {
        const menu = await Menu.findOne({ restaurantId })
            .populate('items.itemId', 'name price')
            .populate('restaurantId', 'name phoneNo');

        if (!menu) {
            return res.status(404).json({ message: "Menu not found for this restaurant" });
        }

        res.status(200).json(menu);
    } catch (error) {
        console.error("Error fetching menu:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMenuItems = async (req, res) => {
    const restaurantId  = req.user.id;
    try {
        const itema = await Item.find({ restaurantId });
        if (!itema || itema.length === 0) {
            return res.status(404).json({ message: "No menu items found for this restaurant" });
        }
        res.status(200).json(itema);
    } catch (error) {
        console.error("Error fetching menu items:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const addItem = async (req, res) => {
    const restaurantId  = req.user.id;
    const { name, price, description ,image,category } = req.body;
    try {

        if (!name || !price || !description || !image || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

         let imageUrl;
   if (image) {
    const upload = await cloudinary.uploader.upload(image);
    imageUrl = upload.secure_url; // Get the secure URL of the uploaded image
    if (!imageUrl) {
      return res.status(400).json({ message: "Image upload failed" });
    }
  }

        const newItem = new Item({
            restaurantId,
            name,
            price,
            description,
            image: imageUrl, // Use the uploaded image URL
            category
        });

        await newItem.save();

        const menu = await Menu.findOneAndUpdate(
            { restaurantId },
            { $push: { items: { itemId: newItem._id } } },
            { new: true, upsert: true }
        );
        if (!menu) {
            return res.status(404).json({ message: "Menu not found for this restaurant" });
        }
        await menu.save();
        res.status(201).json({ message: "Menu item added successfully" });
    } catch (error) {
        console.error("Error adding menu item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const updateItem = async (req, res) => {
    const restaurantId  = req.user.id;
    const { id:itemId } = req.params;
    const { name, price, description, image, category } = req.body;
    try {
        if (!name || !price || !description || !image || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const item = await Item.findById(itemId);
        if (!item || item.restaurantId.toString() !== restaurantId) {
            return res.status(404).json({ message: "Item not found or does not belong to this restaurant" });
        }
        let imageUrl;
        if (image) {
            const upload = await cloudinary.uploader.upload(image);
            imageUrl = upload.secure_url; // Get the secure URL of the uploaded image
            if (!imageUrl) {
                return res.status(400).json({ message: "Image upload failed" });
            }
        } else {
            imageUrl = item.image; // Keep the existing image if no new image is provided
        }

        item.name = name;
        item.price = price;

        item.description = description;
        item.image = imageUrl;
        item.category = category;
        await item.save();
  
        res.status(200).json({ message: "Menu item updated successfully" });
    } catch (error) {
        console.error("Error updating menu item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const deleteItem = async (req, res) => {
    const restaurantId  = req.user.id;
    const {id: itemId } = req.params;
    try {
        const item = await Item.findById(itemId);
        if (!item || item.restaurantId.toString() !== restaurantId) {
            return res.status(404).json({ message: "Item not found or does not belong to this restaurant" });
        }

        await Item.findByIdAndDelete(itemId);
        await Menu.findOneAndUpdate(
            { restaurantId },
            { $pull: { items: { itemId } } },
            { new: true }
        );

        res.status(200).json({ message: "Menu item deleted successfully" });
    } catch (error) {
        console.error("Error deleting menu item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};









export const getRestaurantOrders = async (req, res) => {
    const  restaurantId = req.user.id;
    try {
        const orders = await RestaurantOrder.find({ restaurantId })
            .populate('items.productId', 'name price')
            .populate('hotelId', 'name phoneNo')
            .sort({ createdAt: -1 });

        if (orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this restaurant" });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching restaurant orders:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const getOrdersByHotel = async (req, res) => {
    const {id: hotelId } = req.params;

    try {
        const orders = await RestaurantOrder.find({ hotelId })
            .populate('items.itemId', 'name price')
            .populate('restaurantId', 'name phoneNo')
            .sort({ createdAt: -1 });

        if (orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this hotel" });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders by hotel:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updatePaymentStatus = async (req, res) => {
    const {id: orderId } = req.params;
    const { paymentStatus } = req.body;

    try {
        const order = await RestaurantOrder.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.paymentStatus = paymentStatus;
        await order.save();

        res.status(200).json({ message: "Payment status updated successfully" });
    } catch (error) {
        console.error("Error updating payment status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updatePendingPayment = async (req, res) => {
    try{
        const orders = await RestaurantOrder.updateMany(
            { paymentStatus: "Pending" },
            { $set: { paymentStatus: "Completed" } }
        );

        if (orders.modifiedCount === 0) {
            return res.status(404).json({ message: "No pending orders found" });
        }

        res.status(200).json({ message: "Pending payment status updated successfully" });
    } catch (error) {
        console.error("Error updating pending payment status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const updateDeliveryStatus = async (req, res) => {
    const { id:orderId } = req.params;
    const { deliveryStatus } = req.body;

    try {
        const order = await RestaurantOrder.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if(deliveryStatus == "Completed" ) {
            order.status = "Completed";
        } else if(deliveryStatus == "Failed") {
            order.status = "Cancelled";
        }

        order.deliveryStatus = deliveryStatus;
        await order.save();

        res.status(200).json({ message: "Delivery status updated successfully" });
    } catch (error) {
        console.error("Error updating delivery status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



export const addHotel = async (req, res) => {
    const restaurantId  = req.user.id;
    const {id: hotelId } = req.params;

    try {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        // Check if the hotel is already a partner
        const isPartner = restaurant.partnerHotels.some(partner => partner.hotelId.toString() === hotelId);
        if (isPartner) {
            return res.status(400).json({ message: "Hotel is already a partner" });
        }

        // Add the hotel to the restaurant's partnerHotels array
        restaurant.partnerHotels.push({ hotelId: hotel._id });
        await restaurant.save();
        // Add the restaurant to the hotel's partnerRestaurants array
        hotel.partnerRestaurants.push({ restaurantId: restaurant._id });
        await hotel.save();

        res.status(200).json({ message: "Hotel added successfully" });
    }
    catch (error) {
        console.error("Error adding hotel:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const removeHotel = async (req, res) => {
    const restaurantId  = req.user.id;
    const {id: hotelId } = req.params;

    try {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

         restaurant.partnerHotels = restaurant.partnerHotels.filter(partner => partner.hotelId.toString() !== hotelId);
        await restaurant.save();

        hotel.partnerRestaurants = hotel.partnerRestaurants.filter(partner => partner.restaurantId.toString() !== restaurantId);
        await hotel.save();
        res.status(200).json({ message: "Hotel removed successfully" });
    } catch (error) {
        console.error("Error removing hotel:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const getPartnerHotels = async (req, res) => {
    const restaurantId  = req.user.id;

    try {
        const restaurant = await Restaurant.findById(restaurantId)
            .populate('partnerHotels.hotelId');
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        if (restaurant.partnerHotels.length === 0) {
            return res.status(404).json({ message: "No partner hotels found for this restaurant" });
        }
        res.status(200).json(restaurant.partnerHotels);
    }
    catch (error) {
        console.error("Error fetching partner hotels:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};




