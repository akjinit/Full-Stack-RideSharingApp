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
    destination: {
        type: String,
        required: true
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
    status: {
        type: String,
        enum: ['requested', 'accepted', 'in_progress', 'completed', 'cancelled'],
        default: 'requested'
    },
    paymentId: {
        type: String,
    },
    orderId: {
        type: String,
    },
    signature: {
        type: String,
    },
})

const rideModel = mongoose.model('ride', rideSchema);
module.exports = rideModel;