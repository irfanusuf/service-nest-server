const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service"},
  orderCost: { type: Number, require: true },
  // paymentMode: { type: String, enum: ["cashThroughAgent", "card", "onilne"] },
  payment : {type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
  orderStatus: { type: String, enum: ["completed", "pending" , "cancelled" , "refunded" , "inTransit"] , default : "pending" },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdOn: { type: Date, default: Date.now() },
  updatedOn: { type: Date, default: Date.now() },
});


const Order = mongoose.model("Order", orderSchema);

module.exports = { Order };
