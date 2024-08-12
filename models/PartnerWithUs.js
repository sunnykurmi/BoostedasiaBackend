const mongoose = require("mongoose");

const PartnerWithUs = new mongoose.Schema(
  {
    companyname: {
      type: String,
      required: [false],
    },
    companywebsite: {
      type: String,
      required: [false],
    },
    name: {
      type: String,
      required: [true, "name is required"],
    },
    socialmedia: {
      type: String,
      required: [false],
    },
    
    joiningcity: {
        type: [String], 
        required: [true, "joiningcity is required"],
      },
    email: {
      type: String,
      required: [true, "email is required"],
    },
    contact: {
      type: Number,
      required: [true, "contact is required"],
    },
    
  },
  { timestamps: true }
);

const partner = mongoose.model("partner", PartnerWithUs);
module.exports = partner;
