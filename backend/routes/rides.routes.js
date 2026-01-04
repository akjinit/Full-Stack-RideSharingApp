const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const { body } = require('express-validator');

router.post("/create", body("userId").isString().isLength({ min: 24, max: 24 }).withMessage("Invalid user ID"),
    body("captainId").isString().isLength({ min: 24, max: 24 }).withMessage("Invalid captain ID"),
    body("origin").isString().isLength({ min: 3 }).withMessage("Origin must be at least 3 characters long"),
    body("destination").isString().isLength({ min: 3 }).withMessage("Destination must be at least 3 characters long"),)



moddule.exports = router;