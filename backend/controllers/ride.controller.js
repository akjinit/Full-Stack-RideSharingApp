const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');


module.exports.createRide = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { origin, destination, vehicleType } = req.body;
    const userId = req.user._id;
    try {
        const ride = await rideService.createRide(userId, origin, destination, vehicleType);
        const ridePopulatedByUser = await rideModel.findById(ride._id).populate('userId', '-password -socketId -__v');
        res.status(201).json(ridePopulatedByUser);

        const originCoord = await mapService.getAddressCoordinate(origin);
        const { latitude, longitude } = originCoord;
        const captainInRadius = await mapService.getCaptainsInTheRadius(latitude, longitude, 2);

        ridePopulatedByUser.OTP = null; //hide OTP info when notifying captains
        captainInRadius.forEach(captain => {
            sendMessageToSocketId(captain.socketId, 'new-ride-request', ridePopulatedByUser);
        });

        //notify captains about new ride request
    }
    catch (err) {
        res.status(400).json({
            error: err.message,
            message: "Ride could not be created"
        });
    }
}


module.exports.getFareEstimate = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { origin, destination, vehicleType } = req.query;
    try {
        const fareEstimate = await rideService.getFareEstimate(origin, destination, vehicleType);
        res.status(200).json(fareEstimate);
    }
    catch (err) {
        res.status(400).json({
            err,
            message: "Fare estimate not found"
        });
    }
}


module.exports.acceptRide = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.acceptRide(rideId, req.captain._id);
        
        const userSocket = ride.userId?.socketId;
        sendMessageToSocketId(userSocket, 'ride-accepted', ride);
        return res.status(200).json(ride);
    } catch (err) {
        return res.status(400).json({
            error: err.message,
            message: "Ride could not be accepted"
        });
    }
}