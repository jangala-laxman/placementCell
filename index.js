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
const Interview = require("./models/interview");

const session = require('express-session')
const db = mongoose.connection;

mongoose.connect("mongodb://127.0.0.1:27017/placement");
db.on("error", console.error.bind("error while connecting to db"));
mongoose.set({ strictQuery: false });
db.once("open", () => {
  console.log("connection successful");
});

app.set("view engine", "ejs");
app.use(expressEJSLayouts);
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/layout");

app.use(session({
  secret:'cat',
  resave:true,
  saveUninitialized:true,
}))


app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async(req, res) => {

  const students = await Student.find().populate('interviews')
  const interviews = await Interview.find()
  
  console.log(students, interviews)
    res.render("home",{students:students, interviews:interviews})
});

app.use("/student", studentRouter);
app.use("/interview", interviewRouter);
app.use("/student", studentRouter);
app.use("/company", companyRouter);
app.use("/user", userRouter);
app.use('/dashboard', csvRouter)


app.listen(3000); //the server object listens on port 8080
