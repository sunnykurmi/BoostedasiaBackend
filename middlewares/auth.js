const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");
const { catchError } = require("../middlewares/catchError");

exports.isAuthenticated = catchError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("please login to access the resource", 401));
  }
  try {
    const { id } = await jwt.verify(token, process.env.JWT_SECRET);
    req.id = id;
    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid token, please login again", 401));
  }
});