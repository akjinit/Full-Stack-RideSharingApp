const captainModel = require("../models/captain.model");
const rideModel = require("../models/ride.model");
const userModel = require("../models/user.model");
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
    const originCoord = await mapService.getAddressCoordinate(origin);
    const destinationCoord = await mapService.getAddressCoordinate(destination);

    const fare = {
        car: this.calculateFare(distanceTime.distance, distanceTime.duration, 30, 8),
        auto: this.calculateFare(distanceTime.distance, distanceTime.duration, 19, 5),
        motorcycle: this.calculateFare(distanceTime.distance, distanceTime.duration, 10, 2)
    };

    const ride = await rideModel.create({
        userId,
        origin: distanceTime.origin,
        originCoordinates: {
            latitude: originCoord.latitude,
            longitude: originCoord.longitude
        },
        destination: distanceTime.destination,
        destinationCoordinates: {
            latitude: destinationCoord.latitude,
            longitude: destinationCoord.longitude
        },
        fare: fare[vehicleType].toFixed(2),
        duration: distanceTime.duration,
        distance: distanceTime.distance,
        vehicleType,
        OTP: OTPGenerator(4),
    })

    return ride;
}

module.exports.cancelRide = async (rideId) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    const ride = await rideModel.findById(rideId);

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status === 'completed' || ride.status === 'cancelled') {
        throw new Error('Ride already completed or cancelled');
    }

    if (ride.status === 'in_progress') {
        throw new Error('Cannot cancel ongoing ride');
    }

    await rideModel.findByIdAndUpdate(rideId, {
        status: 'cancelled'
    });

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
        throw new Error('Ride is required');
    }

    const ride = await rideModel.findOneAndUpdate(
        { _id: rideId, status: 'requested' },
        {
            status: 'accepted',
            captainId
        },
        { new: true }
    );

    if (!ride) {
        throw new Error('Ride already accepted');
    }

    await Promise.all([
        userModel.findByIdAndUpdate(ride.userId, {
            rideId
        }),

        captainModel.findByIdAndUpdate(captainId, {
            rideId
        })
    ]);

    const updatedRide = await rideModel
        .findById(rideId)
        .populate('userId')
        .populate('captainId')
        .select('+OTP');

    if (!updatedRide) {
        throw new Error('Error in accepting ride');
    }

    return updatedRide;
};


module.exports.startRide = async ({ rideId, OTP, captain }) => {
    if (!rideId || !OTP) {
        throw new Error('Ride id and OTP are required');
    }

    const ride = await rideModel.findById(rideId).populate('captainId').populate('userId').select('+OTP');
    if (!ride) {
        throw new Error('Ride not found');
    }


    console.log(ride);
    if (ride.status !== 'accepted' || ride.OTP !== OTP) {
        throw new Error('Ride not Accepted Captain may not be authorised to accept ride');
    }

    ride.status = 'in_progress'
    await ride.save();

    await Promise.all([
        userModel.findByIdAndUpdate(ride.userId, {
            userState: 'riding'
        }),
        captainModel.findByIdAndUpdate(ride.captainId, {
            captainState: 'riding'
        })
    ])

    return ride;
}


module.exports.endRide = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error('Ride id  required');
    }

    const ride = await rideModel.findOne({
        _id: rideId,
        captainId: captain._id
    }).populate('userId');

    if (!ride) {
        throw new Error('Ride not ended');
    }

    if (ride.status !== 'in_progress') {
        throw new Error('Ride not ongoing');
    }

    await rideModel.findByIdAndUpdate(
        {
            _id: rideId
        }, {
        status: 'completed'
    }
    );

    // Reset user and captain states
    const populatedRide = await rideModel.findById(rideId).populate('userId').populate('captainId');
    if (populatedRide.userId) {
        await userModel.findByIdAndUpdate(populatedRide.userId._id, {
            userState: 'active',
            rideId: null
        });
    }
    if (populatedRide.captainId) {
        await captainModel.findByIdAndUpdate(populatedRide.captainId._id, {
            captainState: 'active',
            rideId: null
        });
    }

    return ride;
}

module.exports.getRideById = async (rideId) => {
    const ride = await rideModel.findById(rideId)
        .populate('captainId', '-password -socketId ')
        .populate('userId', '-password -socketId');

    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;
}

module.exports.getActiveRideForUser = async (userId) => {
    const ride = await rideModel.findOne({
        userId,
        status: { $in: ['requested', 'accepted', 'in_progress'] }
    })
        .populate('captainId', '-password -socketId')
        .populate('userId', '-password -socketId')
        .select('+OTP');

    return ride;
}

module.exports.getActiveRideForCaptain = async (captainId) => {
    const ride = await rideModel.findOne({
        captainId,
        status: { $in: ['accepted', 'in_progress'] }
    })
        .populate('captainId', '-password -socketId')
        .populate('userId', '-password -socketId')
        .select('+OTP');

    return ride;
}

module.exports.updateUserLocation = async (rideId, latitude, longitude, userId) => {
    if (!rideId || !latitude || !longitude || !userId) {
        throw new Error('Ride ID, coordinates, and user ID are required');
    }

    const ride = await rideModel.findOneAndUpdate(
        { _id: rideId, userId },
        {
            userLocation: {
                type: 'Point',
                coordinates: [longitude, latitude]
            }
        },
        { new: true }
    ).populate('userId', '-password -socketId').populate('captainId', '-password -socketId').select('+OTP');

    if (!ride) {
        throw new Error('Ride not found or unauthorized');
    }

    return ride;
}

module.exports.updateCaptainLocation = async (rideId, latitude, longitude, captainId) => {
    if (!rideId || !latitude || !longitude || !captainId) {
        throw new Error('Ride ID, coordinates, and captain ID are required');
    }

    const ride = await rideModel.findOneAndUpdate(
        { _id: rideId, captainId },
        {
            captainLocation: {
                type: 'Point',
                coordinates: [longitude, latitude]
            }
        },
        { new: true }
    ).populate('userId', '-password -socketId').populate('captainId', '-password -socketId').select('+OTP');

    if (!ride) {
        throw new Error('Ride not found or unauthorized');
    }

    return ride;
}

module.exports.endRideAndUpdateStats = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error('Ride id required');
    }

    const ride = await rideModel.findOne({
        _id: rideId,
        captainId: captain._id
    }).populate('userId');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'in_progress') {
        throw new Error('Ride not ongoing');
    }

    // Update ride status
    ride.status = 'completed';
    await ride.save();

    // Reset user and captain states
    await userModel.findByIdAndUpdate(ride.userId._id, {
        userState: 'active',
        rideId: null
    });

    // We already have captain object, so we can use its ID directly
    // But captain object passed might be the one from req.captain which is a document, or plain object.
    // The query used captain._id so it should be available.
    // However, we want to update the DB document.
    await captainModel.findByIdAndUpdate(captain._id, {
        captainState: 'active',
        rideId: null
    });

    // Update captain stats
    // Update captain stats
    const distance = parseFloat(ride.distance) || 0;
    const duration = parseFloat(ride.duration) || 0;
    const earnings = parseFloat(ride.fare) || 0;

    await captainModel.findByIdAndUpdate(
        captain._id,
        {
            $inc: {
                'stats.totalRides': 1,
                'stats.totalEarnings': earnings,
                'stats.totalDistance': distance,
                'stats.totalDuration': duration
            }
        }
    );

    return ride;
}

function OTPGenerator(num) {
    let otp = '';
    for (let i = 0; i < num; i++) {
        otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;
}