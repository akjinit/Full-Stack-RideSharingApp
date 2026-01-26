const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const rideController = require('../controllers/ride.controller');
const { body, query } = require('express-validator');

router.post("/create",
    body("origin").isString().isLength({ min: 3 }).withMessage("Origin must be at least 3 characters long"),
    body("destination").isString().isLength({ min: 3 }).withMessage("Destination must be at least 3 characters long"),
    body('vehicleType').isIn(['car', 'auto', 'motorcycle']).withMessage("Invalid vehicle type"),

    authMiddleware.authUser, rideController.createRide);

router.get("/fare-estimate",
    query("origin").isString().isLength({ min: 3 }).withMessage("Origin must be at least 3 characters long"),
    query("destination").isString().isLength({ min: 3 }).withMessage("Destination must be at least 3 characters long"),
    authMiddleware.authUser,
    rideController.getFareEstimate
);

router.get('/ride-status/user',
    authMiddleware.authUser,
    query('rideId').isMongoId().withMessage('Invalid ride ID'),
    rideController.getRideStatus
);

router.get('/active-ride/user',
    authMiddleware.authUser,
    rideController.getActiveRideForUser
);

router.get('/ride-status/captain',
    authMiddleware.authCaptain,
    query('rideId').isMongoId().withMessage('Invalid ride ID'),
    rideController.getRideStatus
);

router.get('/active-ride/captain',
    authMiddleware.authCaptain,
    rideController.getActiveRideForCaptain
);

router.post('/accept-ride',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride ID'),
    rideController.acceptRide
);

router.get('/start-ride',
    authMiddleware.authCaptain,
    query('rideId').isMongoId().withMessage("Invalid Ride Id"),
    query('OTP').isString().isLength({ min: 4, max: 4 }).withMessage('Invalid OTP format')
    ,
    rideController.startRide
)


router.get('/end-ride',
    authMiddleware.authCaptain,
    query('rideId').isMongoId().withMessage("Invalid Ride Id"),
    rideController.endRide
);

router.post('/update-user-location',
    authMiddleware.authUser,
    body('rideId').isMongoId().withMessage('Invalid ride ID'),
    body('latitude').isFloat().withMessage('Invalid latitude'),
    body('longitude').isFloat().withMessage('Invalid longitude'),
    rideController.updateUserLocation
);

router.post('/update-captain-location',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride ID'),
    body('latitude').isFloat().withMessage('Invalid latitude'),
    body('longitude').isFloat().withMessage('Invalid longitude'),
    rideController.updateCaptainLocation
);

router.get('/captain-stats',
    authMiddleware.authCaptain,
    rideController.getCaptainStats
);

router.get('/ride-coordinates/:rideId',
    authMiddleware.authUser,
    rideController.getRideCoordinates
);

router.post('/cancel',
    authMiddleware.authUser,
    body('rideId').isMongoId().withMessage('Invalid ride ID'),
    rideController.cancelRide
);

module.exports = router;