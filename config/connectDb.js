const mongoose = require("mongoose");
require('dotenv').config()

const uri = process.env.MONGO_URI;

const connectDb = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Database connected on Atlas");
  } catch (error) {
    console.error(error);
  }
};

module.exports = { connectDb };
