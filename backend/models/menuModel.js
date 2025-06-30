import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Restaurant',
    },
    hotelId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Hotel',
    },
    item: 
        {
            name: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
            restaurantPrice: {
                type: Number,
                required: true,
            },
            hotelPrice: {
                type: Number,
            },
            category: {
                type: String,
                required: true,
                enum: ['Appetizer', 'Main Course', 'Dessert', 'Beverage'],
            },
            image: {
                type: String,
                required: true,
            },
        },
        isAvailable: {
            type: Boolean,
            required:true,
            default: true,
        },


});

const Menu = mongoose.model("Menu", menuSchema);
export default Menu;
