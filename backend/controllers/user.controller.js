const { validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const { createUser } = require("../services/user.service");
const blacklistTokenModel = require("../models/blacklistToken.model");

module.exports.registerUser = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    fullName: { firstName, lastName },
    email,
    password,
  } = req.body;
  console.log(req.body);
  const hashedPassword = await userModel.hashPassword(password);
  const user = await createUser(firstName, lastName, email, hashedPassword);
  const token = user.generateAuthToken();
  res.cookie("token", token);
  res.status(201).json({ token, user });
};

module.exports.loginUser = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    res.status(401).json({ message: `Invalid email or password` });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    res.status(401).json({ message: `Invalid email or password` });
  }

  const token = user.generateAuthToken();
  res.cookie("token", token);
  res.status(200).json({ token, user });
};

module.exports.getUserProfile = async function (req, res, next) {
  res.status(200).json(req.user);
};

module.exports.logoutUser = async function (req, res, next) {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];

  await blacklistTokenModel.create({ token });
  res.status(200).json({ message: "Logged out" });
};
