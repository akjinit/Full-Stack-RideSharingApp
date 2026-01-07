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


router.post('/accept-ride',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride ID'),
    rideController.acceptRide
);
module.exports = router;