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

const allowedOrigins = ["http://localhost:5173", "https://boostedasia.org/"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Allow requests with no origin (like mobile apps or curl requests)
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

//bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`server running on port ${process.env.PORT}`);
});