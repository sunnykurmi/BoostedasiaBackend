const mongoose = require("mongoose");

const studentForm = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    schoolname: {
      type: String,
      required: [false, "schoolname is required"],
    },
    class: {
      type: String,
      required: [false, "class is required"],
    },
    belongingcity: {
      type: String,
      required: [true, "belonging city is required"],
    },
    joiningcity: {
        type: [String], 
        required: [true, "joiningcity is required"],
      },
    age: {
      type: Number,
      required: [true, "age is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },
    contact: {
      type: Number,
      required: [true, "contact is required"],
    },
    support: {
      type: [String],
      required: [true, "support is required"],
    },
  },
  { timestamps: true }
);

const studentform = mongoose.model("studentform", studentForm);
module.exports = studentform;
