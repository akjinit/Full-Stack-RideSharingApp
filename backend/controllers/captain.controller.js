const { validationResult } = require("express-validator");
const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");

module.exports.registerCaptain = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    fullName,
    email,
    password,
    vehicle,
  } = req.body;
  const hashedPassword = await captainModel.hashPassword(password);

  const doesCaptainExists = await captainModel.findOne({ email });
  if (doesCaptainExists) {
    return res.status(401).json({ message: "Email already registered" });
  }

  

  const captain = await captainService.createCaptain(
    fullName,
    email,
    password,
    vehicle
  );

  const token = captain.generateAuthToken();

  res.status(201).json({ token, captain });
};
