const rideModel = require("../models/ride.model");
const mapService = require("../services/maps.service");

module.exports.calculateFare = (distance, time, baseFare, perKmRate) => {
    const distanceFare = (distance / 1000) * perKmRate;
    const timeFare = (time / 60) * 1;
    return baseFare + distanceFare + timeFare;
}

module.exports.createRide = async (userId, origin, destination, vehicleType) => {
    if (!userId || !origin || !destination || !vehicleType) {
        throw new Error("Missing required parameters to create a ride");
    }

    const distanceTime = await mapService.getDistanceTime(origin, destination);
    const currFare = await getFareEstimate(origin, destination);

    const ride = await rideModel.create({
        userId,
        origin,
        destination,
        fare: currFare[vehicleType],
    })

    return ride;
}

module.exports.getFareEstimate = async function (origin, destination) {
    const distanceTime = await mapService.getDistanceTime(origin, destination);

    const fare = {
        car:    calculateFare(distanceTime.distance, distanceTime.time, 15, 8),
        auto: calculateFare(distanceTime.distance, distanceTime.time, 8, 5),
        motorcycle: calculateFare(distanceTime.distance, distanceTime.time, 5, 2)
    };

    return fare;
}

