import mongoose from "mongoose";

const pricePercentageSchema = new mongoose.Schema({
    hotelId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Hotel',
    },
    category: {
        type: String,
        required: true,
        enum: ['Appetizer', 'Main Course', 'Dessert', 'Beverage'],
    },
    percentage: {
        type: Number,
        required: true,
    },
});

const PricePercentage = mongoose.model("PricePercentage", pricePercentageSchema);
export default PricePercentage;
