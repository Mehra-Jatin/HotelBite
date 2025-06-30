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
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Menu',
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            price: {
                type: Number,
                required: true,
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
    status: {
        type: String,
        required: true,
        enum: ['Confirmed', 'Cancelled', 'Completed'],
        default: 'Confirmed',
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending',
    },

});

const HotelOrder = mongoose.model("HotelOrder", orderSchema);
export default HotelOrder;
