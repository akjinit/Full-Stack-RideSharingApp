const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    captainId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'captain'
    },
    origin: {
        type: String,
        required: true
    },
    originCoordinates: {
        latitude: Number,
        longitude: Number
    },
    destination: {
        type: String,
        required: true
    },
    destinationCoordinates: {
        latitude: Number,
        longitude: Number
    },
    fare: {
        type: Number,
        required: true
    },
    duration: {//in seconds
        type: String,
    },
    distance: {//in meters
        type: String,
    },
    vehicleType: {
        type: String,
        enum: ['car', 'auto', 'motorcycle'],
        required: true
    },
    status: {
        type: String,
        enum: ['requested', 'accepted', 'in_progress', 'completed', 'cancelled'],
        default: 'requested'
    },
    
    OTP: {
        type: String,
        select: false,
        required: true
    },

    // Location tracking
    userLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0]
        }
    },

    captainLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0]
        }
    }
}, { timestamps: true })

const rideModel = mongoose.model('ride', rideSchema);
module.exports = rideModel;