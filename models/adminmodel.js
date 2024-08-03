const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminmodel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Firstname is required"],
      minLength: [4, "First name should be 4 character long"],
    },
    password: {
      type: String,
      select: false,
      maxLength: [15, "password should not exceed more than 15 characters"],
      minLength: [6, "password should be atleast 6 characters"],
      // match:[/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/]
    },
    
  },
  { timestamps: true }
);

adminmodel.pre("save", function () {
  if (!this.isModified("password")) {
    return;
  }
  let salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

adminmodel.methods.comparepassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};
adminmodel.methods.getjwttoken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const admin = mongoose.model("admin", adminmodel);
module.exports = admin;
