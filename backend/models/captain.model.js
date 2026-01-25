const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

const captainSchema = new mongoose.Schema({
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

  password: {
    type: String,
    required: true,
    select: false,
  },

  socketId: {
    type: String,
    default: null,
  },

  captainState: {
    type: String,
    enum: ["active", "inactive", 'riding'],
    default: "inactive",
  },

  rideId: {
    type: mongoose.Schema.ObjectId,
    ref: 'ride',
    default: null
  },

  vehicle: {
    color: {
      type: String,
      minlength: [3, "Color must be at least 3 charcters long"],
      required: true,
    },

    plate: {
      type: String,
      required: true,
      minLength: [3, "Plate must be atleast 4 characters long"],
    },

    capacity: {
      type: Number,
      required: true,
      min: [1, "Capacity should be a number"],
    },

    vehicleType: {
      type: String,
      required: true,
      enum: ["car", "motorcycle", "auto"],
      default: "car",
    },
  },

  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },

    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },

  // Captain statistics
  stats: {
    totalRides: {
      type: Number,
      default: 0
    },
    totalEarnings: {
      type: Number,
      default: 0
    },
    totalDistance: {
      type: Number,
      default: 0
    },
    totalDuration: {
      type: Number,
      default: 0
    },
    hoursOnline: {
      type: Number,
      default: 0
    },
    lastOnlineTime: {
      type: Date,
      default: null
    }
  }
});

captainSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  return token;
};

captainSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

captainSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  return hash;
};

captainSchema.index({ location: '2dsphere' });

module.exports = mongoose.model("captain", captainSchema);
