const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: false },
  profilepicUrl: { type: String },
  bio: { type: String },
  location: { latitude: String, longitude: String },
  mobile: { type: String },
  experience: { type: String },
  specialization: { type: String },
  role: {
    type: String,
    enum: ["admin", "customer", "service provider"],
    default: "customer",
  },

  orders: [{type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
  
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      starRating: { type: Number, required: true, min: 1, max: 5 },
      review: { type: String, required: true },
    },
  ],
 

  createdOn: { type: Date, default: Date.now() },
  updatedOn: { type: Date, default: Date.now() },
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
