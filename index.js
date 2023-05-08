const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const expressEJSLayouts = require("express-ejs-layouts");
const studentRouter = require("./routes/student");
const interviewRouter = require("./routes/interview");
const companyRouter = require("./routes/company");
const userRouter = require("./routes/user");
const csvRouter = require('./routes/csv')
const Student = require("./models/student");
const User = require("./models/user");
const Interview = require("./models/interview");
const session = require('express-session')
const MongoStore = require('connect-mongo')
const db = mongoose.connection;

mongoose.connect("mongodb+srv://srilaxman48:L1u9c9k9y@cluster0.zwtmwnc.mongodb.net/Placement");
db.on("error", console.error.bind("error while connecting to db"));
mongoose.set({ strictQuery: false });
db.once("open", () => {
  console.log("connection successful");
});

app.set("view engine", "ejs");
app.use(expressEJSLayouts);
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/layout");

let store = new MongoStore({
  mongoUrl: "mongodb+srv://srilaxman48:L1u9c9k9y@cluster0.zwtmwnc.mongodb.net/Placement",
  collection: "sessions",
  ttl: 300 * 1000,
  autoRemove: "native",
});

app.use(
  session({
    secret: "SECRET KEY",
    resave: false,
    saveUninitialized: false,
    cookie: { originalMaxAge: 1000 * 60 * 5 }, //5mins
    store:store,
  })
);

function checkAuth(req, res, next) {
  if (req.session.user) {
    res.set(
      "Cache-Control",
      "no-Cache, private, no-store, must-revalidate, post-chech=0,pre-check=0"
    );
    // res.render('home', {user:req.session.user})
    next();
  } else {
    // res.render('home', {user:req.session.user, session:req.session})
    next();
  }
}

app.get("/", checkAuth, async (req, res) => {
  let session;
  try {
    const students = await Student.find().populate('company')
    const interviews = await Interview.find()
    if (req.session.user) {
      req.session.user = "RunChodDaas";
      const user = await User.find();

      console.log(req.session);
      req.session.save((err) => {
        if (err) {
          console.log(err);
        } else {
          console.log(req.session.user);
        }
      });
      session = req.session.user;
      res.render("home", { user: user, session: req.session , students:students, interviews:interviews });
    } else {
      res.render("home_unauth", { user: null, session: null });
    }
  } catch (err) {
    console.log(err);
  }
});


app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async(req, res) => {

  const students = await Student.find().populate('company')
  const interviews = await Interview.find()
  
  res.render("home",{students:students, interviews:interviews})
});

app.use("/student", studentRouter);
app.use("/interview", interviewRouter);
app.use("/student", studentRouter);
app.use("/company", companyRouter);
app.use("/user", userRouter);
app.use('/dashboard', csvRouter)


app.listen(3000, ()=>{
  console.log("listening to port 3000")
}); //the server object listens on port 8080
