const { catchError } = require("../middlewares/catchError");
const adminmodel = require("../models/adminmodel");
const citymodel = require("../models/citymodel");
const partner = require("../models/PartnerWithUs");
const studentform = require("../models/StudentForm");
const ErrorHandler = require("../utils/ErrorHandler");
const { sendtoken } = require("../utils/SendToken");

exports.homepage = catchError(async (req, res, next) => {
  const allcities  = await citymodel.find().populate("studentsjoined").exec();
  const allpartners = await partner.find().exec();
  res.json({ message: "homepage",allcities , allpartners });
});


exports.adminusersignup = catchError(async (req, res, next) => {
  const newUser = await new adminmodel(req.body).save();
  sendtoken(newUser, 201, res);
});


exports.admincurrentuser = catchError(async (req, res, next) => {
  const loggedinuser = await adminmodel
    .findById(req.id)
    .exec();
  res.json({ loggedinuser  });
});

exports.adminusersignin = catchError(async (req, res, next) => {
  console.log("object");
  const founduser = await adminmodel
    .findOne({
      name: req.body.name,
    })
    .select("+password")
    .exec();
  if (!founduser)
    return next(
      new ErrorHandler("user not found with this email address ", 404)
    );
  const ismatched = founduser.comparepassword(req.body.password);
  if (!ismatched) return next(new ErrorHandler(" wrong credentials ", 500));
  sendtoken(founduser, 200, res);
});

exports.adminusersignout = catchError(async (req, res, next) => {
  res.clearCookie("token");
  res.json({ message: "successfully signed out" });
});



///////////////////////student form////////////////////////
exports.studentform = catchError(async (req, res, next) => {
  const newform = await new studentform(req.body).save();
  console.log(newform.joiningcity);
  for (const city of newform.joiningcity) {
    const cityModel = await citymodel.findOne({ cityname: city });
    if (cityModel) {
      cityModel.studentsjoined.push(newform._id);
      await cityModel.save();
    }
  }
  res.json({ message: "successfully form submitted" });
});



///////////////////////Partner With Us////////////////////////

exports.partnerform = catchError(async (req, res, next) => {
  const newform = await new partner(req.body).save();
  res.json({ message: "successfully form submitted" });
  
});




///////////////////////create city////////////////////////

exports.admincreatecity = catchError(async (req, res, next) => {
  console.log(req.body);
  const newcity = await new citymodel(req.body).save();
  await newcity.save();
  res.json({ newcity });
});

//make a rout for edit city details by admin
exports.admineditcity = catchError(async (req, res, next) => {
  const { id } = req.params;
  const city = await citymodel.findByIdAndUpdate(id, req.body, { new: true }) 
    .exec();
  res.status(200).json({
    success: true,
    message: "city updated successfully",
    city,
  });
});
//make a rout for delete city details by admin
exports.admindeletecity = catchError(async (req, res, next) => {
  const { id } = req.params;
  const city = await citymodel.findByIdAndDelete(id, req.body) 
    .exec();
  res.status(200).json({
    success: true,
    message: "city deleted successfully",
  });
});