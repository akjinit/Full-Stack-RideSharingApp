const express = require("express");
const router = express.Router();

const { body, query } = require("express-validator");
const captainController = require("../controllers/captain.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post(
  "/register",
  [
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
  ],
  captainController.registerCaptain
);



router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be atleast 6 chars long"),
  ],
  captainController.loginCaptain
);

router.get(
  "/profile",
  authMiddleware.authCaptain,
  captainController.getCaptainProfile
);

router.get(
  "/logout",
  authMiddleware.authCaptain,
  captainController.logoutCaptain
);

module.exports = router;
