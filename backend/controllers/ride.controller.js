const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');
const userModel = require('../models/user.model');


module.exports.getRideStatus = async (req, res, next) => { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { rideId } = req.query;
    try {
        const ride = await rideService.getRideById(rideId);
        return res.status(200).json(ride);
    } catch (err) {
        return res.status(400).json({
            error: err.message,
            message: "Could not fetch ride status"
        });
    }
}

module.exports.getActiveRideForUser = async (req, res, next) => {
    try {
        const ride = await rideService.getActiveRideForUser(req.user._id);
        return res.status(200).json(ride || null);
    } catch (err) {
        return res.status(400).json({
            error: err.message,
            message: "Could not fetch active ride"
        });
    }
}

module.exports.getActiveRideForCaptain = async (req, res, next) => {
    try {
        const ride = await rideService.getActiveRideForCaptain(req.captain._id);
        return res.status(200).json(ride || null);
    } catch (err) {
        return res.status(400).json({
            error: err.message,
            message: "Could not fetch active ride"
        });
    }
}


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
        const user = await userModel.findById(userId);
        user.userState = 'requested';
        user.rideId = ride._id;
        await user.save();
        const populatedUser = await userModel.findById(userId).populate('rideId');
        console.log("Populated User after ride creation: ", populatedUser);
        await populatedUser.save();

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


module.exports.startRide = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, OTP } = req.query;

    try {
        const ride = await rideService.startRide({ rideId, OTP, captain: req.captain });
        sendMessageToSocketId(ride.userId.socketId, 'ride-started', ride);

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


module.exports.endRide = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.query;

    try {
        const ride = await rideService.endRideAndUpdateStats({ rideId, captain: req.captain });
        sendMessageToSocketId(ride.userId?.socketId, 'ride-ended', ride);

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.updateUserLocation = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, latitude, longitude } = req.body;

    try {
        const ride = await rideService.updateUserLocation(rideId, latitude, longitude, req.user._id);
        return res.status(200).json(ride);
    } catch (err) {
        return res.status(400).json({
            error: err.message,
            message: "Could not update user location"
        });
    }
}

module.exports.updateCaptainLocation = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, latitude, longitude } = req.body;

    try {
        const ride = await rideService.updateCaptainLocation(rideId, latitude, longitude, req.captain._id);
        return res.status(200).json(ride);
    } catch (err) {
        return res.status(400).json({
            error: err.message,
            message: "Could not update captain location"
        });
    }
}

module.exports.getCaptainStats = async (req, res, next) => {
    try {
        const captainModel = require('../models/captain.model');
        const captain = await captainModel.findById(req.captain._id).select('stats');
        
        if (!captain) {
            return res.status(404).json({ message: "Captain not found" });
        }

        return res.status(200).json(captain.stats);
    } catch (err) {
        return res.status(400).json({
            error: err.message,
            message: "Could not fetch captain stats"
        });
    }
}

module.exports.getRideCoordinates = async (req, res, next) => {
    try {
        const { rideId } = req.params;
        
        if (!rideId) {
            return res.status(400).json({ message: "Ride ID is required" });
        }

        const ride = await rideModel.findById(rideId);
        
        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }

        // If coordinates already exist, return them
        if (ride.originCoordinates && ride.destinationCoordinates) {
            return res.status(200).json({
                originLat: ride.originCoordinates.latitude,
                originLng: ride.originCoordinates.longitude,
                destLat: ride.destinationCoordinates.latitude,
                destLng: ride.destinationCoordinates.longitude
            });
        }

        // If not, fetch them from maps service and update the ride
        try {
            const originCoord = await mapService.getAddressCoordinate(ride.origin);
            const destCoord = await mapService.getAddressCoordinate(ride.destination);

            // Update ride with coordinates
            await rideModel.findByIdAndUpdate(rideId, {
                originCoordinates: {
                    latitude: originCoord.latitude,
                    longitude: originCoord.longitude
                },
                destinationCoordinates: {
                    latitude: destCoord.latitude,
                    longitude: destCoord.longitude
                }
            });

            return res.status(200).json({
                originLat: originCoord.latitude,
                originLng: originCoord.longitude,
                destLat: destCoord.latitude,
                destLng: destCoord.longitude
            });
        } catch (err) {
            return res.status(400).json({
                error: err.message,
                message: "Could not fetch coordinates from maps service"
            });
        }
    } catch (err) {
        return res.status(400).json({
            error: err.message,
            message: "Could not fetch ride coordinates"
        });
    }
}