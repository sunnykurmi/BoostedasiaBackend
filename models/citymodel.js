const mongoose = require("mongoose");

const citymodel = new mongoose.Schema(
  {
    cityname: {
      type: String,
      required: [true, "cityname is required"],
    },
    image: {
      type: String,
      required: [true, "image is required"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    date: {
      type: String,
      required: [true, "date is required"],
    },
    studentsjoined: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "studentform", 
      },
    ],
  },
  { timestamps: true }
);

const city = mongoose.model("city", citymodel);
module.exports = city;
