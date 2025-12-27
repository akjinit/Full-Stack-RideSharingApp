const { validationResult } = require("express-validator");
const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");
const blacklistTokenModel = require("../models/blacklistToken.model");

module.exports.registerCaptain = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, password, vehicle } = req.body;
  const hashedPassword = await captainModel.hashPassword(password);

  const doesCaptainExists = await captainModel.findOne({ email });
  if (doesCaptainExists) {
    return res.status(401).json({ message: "Email already registered" });
  }

  const captain = await captainService.createCaptain(
    fullName,
    email,
    hashedPassword,
    vehicle
  );

  const token = captain.generateAuthToken();
  res.cookie("token", token);
  res.status(201).json({ token, captain });
};

module.exports.loginCaptain = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const captain = await captainModel.findOne({ email }).select("+password");
  if (!captain) {
    res.status(401).json({ message: `Invalid email or password` });
  }

  console.log(captain);
  const isMatch = await captain.comparePassword(password);
  console.log(isMatch);
  if (!isMatch) {
    res.status(401).json({ message: `Invalid email or password` });
  }

  const token = captain.generateAuthToken();
  res.cookie("token", token);
  res.status(200).json({ token, captain });
};

module.exports.getCaptainProfile = async function (req, res, next) {
  res.status(200).json(req.captain);
};

module.exports.logoutCaptain = async function (req, res, next) {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];

  await blacklistTokenModel.create({ token });
  res.status(200).json({ message: "Logged out" });
};
