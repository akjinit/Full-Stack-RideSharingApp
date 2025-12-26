const { validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const { createUser } = require("../services/user.service");

module.exports.registerUser = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName : {firstName, lastName}, email, password } = req.body;
  console.log(req.body);
  const hashedPassword = await userModel.hashPassword(password);
  const user = await createUser(firstName, lastName, email, hashedPassword);
  const token = user.generateAuthToken();

  res.status(201).json({ token, user });
};
