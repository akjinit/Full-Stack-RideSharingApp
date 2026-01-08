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
    const fare = {
        car: this.calculateFare(distanceTime.distance, distanceTime.duration, 30, 8),
        auto: this.calculateFare(distanceTime.distance, distanceTime.duration, 19, 5),
        motorcycle: this.calculateFare(distanceTime.distance, distanceTime.duration, 10, 2)
    };

    const ride = await rideModel.create({
        userId,
        origin: distanceTime.origin,
        destination: distanceTime.destination,
        fare: fare[vehicleType].toFixed(2),
        duration: distanceTime.duration,
        distance: distanceTime.distance,
        vehicleType,
        OTP: OTPGenerator(4),
    })

    return ride;
}

module.exports.getFareEstimate = async function (origin, destination) {
    const distanceTime = await mapService.getDistanceTime(origin, destination);
    const fare = {
        car: this.calculateFare(distanceTime.distance, distanceTime.duration, 30, 8).toFixed(2),
        auto: this.calculateFare(distanceTime.distance, distanceTime.duration, 19, 5).toFixed(2),
        motorcycle: this.calculateFare(distanceTime.distance, distanceTime.duration, 10, 2).toFixed(2),
        duration: Math.round(distanceTime.duration / 60),
        distance: (distanceTime.distance / 1000).toFixed(2),
    };

    return fare;
}


module.exports.acceptRide = async (rideId, captainId) => {
    if (!rideId) {
        throw new Error('Ride is Required');
    }

    const ride = await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'accepted',
        captainId
    });

    const updatedRide = await rideModel.findById(rideId).populate('userId').populate('captainId').select('+OTP');
    if(!updatedRide){
        throw new Error('Error in accepting ride');
    }

    return updatedRide;
}

module.exports.startRide = async ({rideId ,OTP,captain}) => {
    if(!rideId || !OTP){
        throw new Error('Ride id and OTP are required');
    }

    const ride = await rideModel.findById(rideId).populate('captainId').populate('userId').select('+OTP');
    if(!ride){
        throw new Error('Ride not found');
    }


    console.log(ride);
    if(ride.status !== 'accepted' || ride.OTP !== OTP){
        throw new Error('Ride not Accepted Captain may not be authorised to accept ride');
    }

    ride.status = 'in_progress'
    await ride.save();

    return ride;
}

function OTPGenerator(num) {
    let otp = '';
    for (let i = 0; i < num; i++) {
        otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;
}