const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');

module.exports.createRide = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { origin, destination, vehicleType } = req.body;
    const userId = req.user._id;
    try{
        const ride = await rideService.createRide(userId, origin, destination, vehicleType);
        res.status(201).json(ride);
    }
    catch(err){
        res.status(400).json({
            error: err.message,
            message: "Ride could not be created"
        });
    }
}