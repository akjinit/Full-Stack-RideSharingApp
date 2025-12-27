const express = require("express");
const router = express.Router();

const { body } = require("express-validator");
const captainController = require("../controllers/captain.controller");

router.post("/register", (req,res,next)=>{console.log(req.body)
  next();
},[
  body("email").isEmail().withMessage("Invalid Email"),
  body("fullName.firstName")
    .isLength({ min: 3 })
    .withMessage("First name must be atleast three chars long"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 chars long"),
  body("vehicle.color")
    .isLength({ min: 3 })
    .withMessage("Color must be of 3 characters"),
  body("vehicle.plate")
    .isLength({ min: 3 })
    .withMessage("Plate must be of 3 characters"),
  body("vehicle.capacity")
    .isInt({ min: 2, max: 20 })
    .withMessage("Capacity between 2 - 20"),
  body("vehicle.vehicleType")
    .isIn(["car", "motorcycle", "auto"])
    .withMessage("Plate must be of 3 characters"),
],captainController.registerCaptain);

module.exports = router;
