const mongoose = require("mongoose");

const Roadmap = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },
    contact: {
      type: Number,
      required: [true, "contact is required"],
    },
    city: {
      type: String,
      required: [true, "city is required"],
    },
    pdflink:{
        type: String,
        required: true
      },
  },
  { timestamps: true }
);

const roadmaps = mongoose.model("roadmap", Roadmap);
module.exports = roadmaps;
