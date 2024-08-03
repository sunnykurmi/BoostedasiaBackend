const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config({ path: "./.env" });

//DB CONNECTION
require("./models/database").connectdb();

//logger
const logger = require("morgan");
const ErrorHandler = require("./utils/ErrorHandler");
const { generatedErrors } = require("./middlewares/errors");
app.use(logger("tiny"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//session and cookie
const session = require("express-session");
const cookieparser = require("cookie-parser");
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.EXPRESS_SESSION_SECRET,
  })
);
app.use(cookieparser());
app.use(bodyParser.json({ limit: "10000000mb" }));

app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "10000000mb",
    parameterLimit: 5000000000,
  })
);

//express file upload
const fileupload = require("express-fileupload");
app.use(fileupload());

//route
app.use("/", require("./routes/indexRoutes"));

//error handling
app.all("*", (req, res, next) => {
  next(new ErrorHandler(`page not found ; ${req.url}`, 404));
});
app.use(generatedErrors);

app.listen(
  process.env.PORT,
  console.log(`server running on port ${process.env.PORT}`)
);
