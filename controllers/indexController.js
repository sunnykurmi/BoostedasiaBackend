const { catchError } = require("../middlewares/catchError");
const adminmodel = require("../models/adminmodel");
const citymodel = require("../models/citymodel");
const partner = require("../models/PartnerWithUs");
const Roadmaps = require("../models/roadmaps");
const studentform = require("../models/StudentForm");
const ErrorHandler = require("../utils/ErrorHandler");
const { getChatCompletion } = require("../utils/openai");
const { pdfcreater } = require("../utils/pdf.creater");
const { sendmail } = require("../utils/sendmail");
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

// **********************

exports.createroadmap = catchError(async (req, res, next) => {

  // generate gpt response
  let formdata = req.body;

  let prompt = `
    ***********
    personal Details:

    Full Name: ${formdata.fullname}
    Gender: ${formdata.gender}
    state: ${formdata.state}
    City: ${formdata.city}

     ***********
    
    my Academics:      

    Class: ${formdata.class}

    Educational board: ${formdata.educationBoard}

    10th marks: ${formdata.tenthMarks}

    11th Marks: ${formdata.eleventhMarks}

    Stream: ${formdata.stream}

    Do you want to study abroad? - ${formdata.abroadStudy}

    What About SAT Exam? - ${formdata.aboutsatexam}

    SAT Score- ${formdata.satScore}

    Which english Proficiency test - ${formdata.englishtest}

    Country Preferance - ${formdata.countrypreferance}

    Dream University Name - ${formdata.dreamuniversity}

    Are you preparing for any entrance examination? - ${formdata.entranceExam}

    Which is the most challenging subject for you?: ${formdata.challengingSubject}

    What is your short-term academic goal? - ${formdata.shortTermGoal}
    
    What is your long-term goal? - ${formdata.longTermGoal}
    
    ***********

    other Details:
    
    family Annual Income: ${formdata.familyincome}

    caste: ${formdata.caste}

    physical disability: ${formdata.physicaldisabilities}

     disabilities if any: ${formdata.physicaldisabilitiestype}

    What do you want to become in the future: ${formdata.BecomeInFuture}

    Interest Field Areas: ${formdata.interestField}
    
    ***********

    Activities/Extracurriculars:
    `;

  formdata.activities.slice(1).forEach((activity, index) => {
    prompt += `
    Activity ${index + 1}:  
  
    Activity: ${activity.activityType}

    Position / Role in the activity: ${activity.workingProfile}
    
    Organization/Company Name: ${activity.organizationName}

    Description: ${activity.taskDescription}
    
    `;
  });

  let roadmap = await getChatCompletion(prompt);

  // *********************************************

  // convert pdf using this data

  if(formdata.email && formdata.fullname && formdata.city && formdata.contact){

    let {pdfpath,pdfname,roadmapuserfullname} =await pdfcreater(`${formdata.email.split('@')[0]}`,`${roadmap}`,`${formdata.fullname}`)
    
  // *********************************************
    
  // sending a mail using nodemailer
    sendmail(req,res,next,pdfpath,formdata)

    const createdRoadmap = await new Roadmaps({
      name:formdata.fullname,
      email:formdata.email,
      contact:formdata.contact,
      city:formdata.city,
      pdflink:pdfpath,
    })
    await createdRoadmap.save()
  
    res.status(200).json({
      success: true,
      message: 'Roadmap has been generated and saved as PDF.',
    })
    
  }else{
    res.status(400).json({
      success: false,
      message: 'you have missing some feild!',
    })
  }

  // *********************************************
    
  

  
});

// **********************

exports.allroadmap = catchError(async (req, res, next) => {

  let roadmaps = await Roadmaps.find().exec()

  res.status(200).json({
    success: true,
    message: "All roadmap",
    roadmaps
  });
  
});