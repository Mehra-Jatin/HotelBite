import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'userModel',
    },
    userModel: {
        type: String,
        required: true,
        enum: ['Hotel', 'Restaurant'],
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: 'Point',
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    zipCode: {
        type: String,
        required: true,
    },
});

// Create 2dsphere index for geospatial queries
addressSchema.index({ location: '2dsphere' });

const Address = mongoose.model('Address', addressSchema);

export default Address;
