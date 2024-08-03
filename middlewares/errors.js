exports.generatedErrors = (err, req, res, next) => {
  const statuscode = err.statusCode || 500;

  if(err.name === "MongoServerError" && err.message.includes("E11000 duplicate key error") ){
    err.message="user already exists with this email"
  }

  res.status(statuscode).json({
     message: err.message,
      errname: err.name,
      stack: err.stack
    });
};
