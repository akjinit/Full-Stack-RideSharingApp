const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
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
  ],
  userController.registerUser
); //register route

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be atleast 6 chars long"),
  ],
  userController.loginUser
); //login route

router.get("/profile", 
  authMiddleware.authUser, userController.getUserProfile
);

module.exports = router;
