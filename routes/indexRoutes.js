const express = require("express");
const {
  homepage,
  adminusersignup,
  admincurrentuser,
  adminusersignin,
  adminusersignout,
  admincreatecity,
  admineditcity,
  admindeletecity,
  studentform,
  partnerform
} = require("../controllers/indexController");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

//get
router.get("/", homepage);

//post
router.post("/studentform", studentform);

//post
router.post("/partnerwithus", partnerform);

//get /admin
router.post("/admin", admincurrentuser);

//post//signup
router.post("/admin/signup", adminusersignup);

//post//signup
router.post("/admin/signin", adminusersignin);

//get//signout
router.get("/admin/signout", isAuthenticated, adminusersignout);

//post//creatcity
router.post("/admin/createcity", isAuthenticated, admincreatecity);

//post//editcity
router.post("/admin/editcity/:id", isAuthenticated, admineditcity);

//post//editcity
router.post("/admin/deletecity/:id", isAuthenticated, admindeletecity);

module.exports = router;
