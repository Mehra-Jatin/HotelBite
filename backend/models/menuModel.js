import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Restaurant',
    },
    hotels:[
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Hotel',
        }
    ],
    items:[ {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Item',
        }],
        isAvailable: {
            type: Boolean,
            required:true,
            default: true,
        },


});

const Menu = mongoose.model("Menu", menuSchema);
export default Menu;
