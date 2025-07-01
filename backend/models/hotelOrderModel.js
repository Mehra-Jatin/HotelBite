import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Hotel',
    },
    roomNo:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    }
    ,
    phoneNo:{
        type:String,
        required:true,
    },
    items: [
        {
            itemId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Item',
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const HotelOrder = mongoose.model("HotelOrder", orderSchema);
export default HotelOrder;
