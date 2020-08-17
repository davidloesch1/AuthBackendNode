const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

//Load Config.env file
dotenv.config({ path: "./config/config.env" });

//connect the database
connectDB();

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000", //<---Location of the react app that we're connecting to
    credentials: true,
  })
);

//Sessions
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

//Cookie Parser middleware
app.use(cookieParser(process.env.SECRET));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Passport Config
require("./config/passport")(passport);

//if its in developement mode, use morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//<----------------------------End of Middleware ------------------------->

//<-----------------------------Routes------------------------------------>
app.use("/", require("./routes/index"))
app.use('/map', require('./routes/map'))
app.use("/auth", require("./routes/auth"));
app.get("/user", (req, res) => {
  res.send(req.user); // The req.user stores the entire user that has been authenticated inside of it.
});

//<------------------------End of Routes------------------------------------>

app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});
//set the port
const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running on ${PORT} in ${process.env.NODE_ENV} mode`)
);
