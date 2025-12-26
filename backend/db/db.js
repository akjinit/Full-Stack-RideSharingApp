const mongoose = require("mongoose");

async function connectToDb() {
  try {
    await mongoose.connect(process.env.DB_CONNECT);
    console.log("MongoDB Connected");
  } catch (err) {
    console.log("Error:", err.message);
    process.exit(1);
  }
}

module.exports = connectToDb;
