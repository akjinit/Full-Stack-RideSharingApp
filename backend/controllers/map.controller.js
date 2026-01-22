const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator');

module.exports.getCoordinates = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { address } = req.query;

    try {
        const coordinates = await mapService.getAddressCoordinate(address);
        res.status(200).json(coordinates);
    }
    catch (err) {
        res.status(400).json({
            message: "Coordinates not found"
        });
    }
}


module.exports.getDistanceTime = async (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { origins, destinations } = req.query;

    try {
        const distanceTime = await mapService.getDistanceTime(origins, destinations);
        res.status(200).json(distanceTime);
    }
    catch (err) {
        res.status(400).json({
            message: "Distance and time not found"
        });
    }
}


module.exports.getSuggestions = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { input } = req.query;
    try {
        const suggestions = await mapService.getSuggestions(input);
        res.status(200).json(suggestions);
    }
    catch (err) {
        res.status(400).json({
            message: "Suggestions not found"
        });
    }
}

