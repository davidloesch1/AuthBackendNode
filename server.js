const express = require("express");
const dotenv = require("dotenv");
const mongoose = require('mongoose')
const connectDB = require("./config/db");
const morgan = require("morgan");
const passport = require("passport");
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const passportLocal = require('passport-local')
const cors = require('cors')
const bodyParser = require('body-parser');
const User = require("./models/User");


//Load Config
dotenv.config({ path: "./config/config.env" });

//Passport Config
require('./config/passport')(passport)

//connect the database
connectDB();

//initialize app
const app = express();

//Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))

//Sessions
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

//Cookie Parser middleware
app.use(cookieParser("secret"))

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
app.use('/register', (req, res) => {
  User.findOne({ email: req.body.email}, async (err, doc) => {
    if(err) throw err;
    if(doc) res.send("User Already Exists")
    if(!doc) {
      const hash = await bcrypt.hash(req.body.password, 10)
      const newUser = new User({
        email: req.body.email,
        password: hash
      })
      await newUser.save()
      res.send("User Created")
    }
  })
})


app.use((req, res, next) => {
  console.log(req.session)
  console.log(req.user)
  next()
})
//set the port
const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running on ${PORT} in ${process.env.NODE_ENV} mode`)
);
