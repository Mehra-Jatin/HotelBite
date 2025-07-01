import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Restaurant',
    },
  name: {
    type: String,
    required: true,
  },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
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
});

const Item = mongoose.model("Item", itemSchema);
export default Item;
