const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  serviceTitle: {type : String},
  description : {type : String},
  serviceProvider: {type: mongoose.Schema.Types.ObjectId, ref: "User" },
  description : {type:String},
  serviceCost: { type: Number },
  picUrls : {type :String},
  isActive: { type: Boolean , default :false},
  discount : {type :Number},
  timeOfCompletion : {type : String}, 
  region : String,
  category : String,

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

const Service = mongoose.model("Service", serviceSchema);

module.exports = { Service };
