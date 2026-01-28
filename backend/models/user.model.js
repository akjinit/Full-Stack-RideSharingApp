const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    firstName: {
      type: String,
      required: true,
      minlength: [3, "First name must be atleast three characters"],
    },
    lastName: {
      type: String,
      minlength: [3, "Last name must be atleast three characters"],
    },
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  rideId: {
    type: mongoose.Schema.ObjectId,
    ref: 'ride',
    default: null
  },

  password: {
    type: String,
    required: true,
    select: false,
  },

  socketId: {
    type: String,
    default: null
  },

  userState: {
    type: String,
    enum: ['active', 'inactive', 'riding', 'requested', 'waiting'],
    default: 'inactive',
    required: true
  }
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  return hash;
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
