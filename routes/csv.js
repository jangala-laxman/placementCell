const Student = require("../models/student")
const Interview = require("../models/interview")
const path = require("path")
const xlsx = require('xlsx')
const express = require("express")
const router = express.Router()
const csvwriter = require('csv-writer').createObjectCsvWriter

function checkAuth(req, res, next) {
  if (req.session.user) {
    res.set(
      "Cache-Control",
      "no-Cache, private, no-store, must-revalidate, post-chech=0,pre-check=0"
    );
    session = req.session.user;
    // res.render('home', {user:req.session.user})
    next();
  } else {
    // res.render('home', {user:req.session.user, session:req.session})
    next();
  }
} 

router.get('/aa', checkAuth, async(req,res)=>{
  try {
    const interview = await Interview.find().populate(['student','company'])
    let counter = 1;
    let records = []

    const writer = csvwriter({
      path:path.resolve('data.csv'),
      header:[
      { title: "Student id", id: "student_id", width: 10 }, 
      { title: "student name", id: "student_username", width: 10 },
      { title: "student college", id: "student_college", width: 10 },
      { title: "student status", id: "student_status", width: 10 },
      { title: "DSA Final Score", id: "student_DSA", width: 10 },
      { title: "WebD Final Score", id: "student_Webdev", width: 10 },
      { title: "React Final Score", id: "student_React", width: 10 },
      { title: "interview date", id: "interview_date", width: 10 },
      { title: "interview company", id: "interview_company", width: 10 },
      { title: "interview student result", id: "result", width: 10 },
  ]
})

for(let i of interview){
  records.push({
    student_id:counter,
    student_username:i.student.username,
    student_college:i.student.college,
    student_status:i.student.status,
    student_DSA:i.student.DSA,
    student_Webdev:i.student.Webdev,
    student_React:i.student.React,
    interview_company:i.company.company,
    interview_date:i.date,
    result:i.result
  })   
  counter++;
}

  writer.writeRecords(records)
  console.log(records)
  res.send('downloaded data.xlsx')

  } catch (err) {
    console.log(err)
      res.send(err);
    }
})


router.get('/', checkAuth, async(req,res)=>{
    try{
      let wb = xlsx.utils.book_new()
      const student = await Student.find().populate('company')
      let temp = JSON.stringify(student)
      temp = JSON.parse(temp)
      let ws = xlsx.utils.json_to_sheet(temp)
      let down = __dirname+'/data.csv'
      xlsx.utils.book_append_sheet(wb, ws, "sheet1")
      xlsx.writeFile(wb, down,{bookType:'csv'})
      res.download(down)
      console.log(down)
    }catch(err){
        console.log(err)
    }
})
module.exports = router