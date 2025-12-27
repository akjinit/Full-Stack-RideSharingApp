const captainModel = require("../models/captain.model");

module.exports.createCaptain = async (fullName, email, password, vehicle) => {
  if (!fullName || !email || !password || !vehicle) {
    throw new Error("All fields not recieved");
  }

  const captain = captainModel.create({
    fullName,
    email,
    password,
    vehicle,
  });

  return captain;
};
