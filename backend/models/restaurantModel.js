import mongoose from "mongoose";
const restaurantSchema = new mongoose.Schema({
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
  role: {
    type: String,
    required: true,
    enum: ['admin', 'hotel', 'restaurant'],
    default: 'restaurant'
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
  },
  partnerHotels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
  }],
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export default Restaurant;
