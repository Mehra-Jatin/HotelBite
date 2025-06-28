import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    required: true,
  },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        required: true,
        enum:['admin','hotel','restaurant'],
        default: 'hotel'
    },
    address:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
    },
    partnerRestaurants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
    }],
});

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;
