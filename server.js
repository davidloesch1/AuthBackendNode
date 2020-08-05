const express = require("express");
const dotenv = require("dotenv");
const mongoose = require('mongoose')
const connectDB = require("./config/db");
const morgan = require("morgan");
const passport = require("passport");
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)


//Load Config
dotenv.config({ path: "./config/config.env" });

//Passport Config
require('./config/passport')(passport)

//connect the database
connectDB();

//initialize app
const app = express();

//Sessions
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

//Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

//if its in developement mode, use morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Routes
app.use("/", require("./routes/index"));
app.use('/auth', require("./routes/auth"))

//set the port
const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running on ${PORT} in ${process.env.NODE_ENV} mode`)
);
