const Student = require("../models/student")
const Interview = require("../models/interview")
<<<<<<< HEAD
const Company = require('../models/company')
=======
const company = require('../models/company')
>>>>>>> 0603d45fec33ffb9d3755f72c1d93735db045f2c
const fs = require("fs")
const path = require("path")
const {Parser} = require('json2csv')
const xlsx = require('xlsx')
const express = require("express")
const router = express.Router()
<<<<<<< HEAD
const csv = require('csv-stringify');
const csvwriter = require('csv-writer').createObjectCsvWriter
=======
const csvWriter = require('csv-writer');
>>>>>>> 0603d45fec33ffb9d3755f72c1d93735db045f2c
const json2csv = new Parser()
const excelJS = require("exceljs");

router.get('/aa',async(req,res)=>{
  try {
<<<<<<< HEAD
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
=======
    const student = await Student.find().populate('company')
    const workbook = new excelJS.Workbook();  // Create a new workbook
    const worksheet = workbook.addWorksheet("Students"); // New Worksheet
    // Column for data in excel. key must match data key
    worksheet.columns = [
      { header: "S no.", key: "s_no", width: 10 }, 
      { header: "Username", key: "username", width: 10 },
      { header: "Email Id", key: "email", width: 10 },
      { header: "College", key: "college", width: 10 },
      { header: "Batch", key: "batch", width: 10 },
      { header: "Status", key: "status", width: 10 },
      { header: "DSA", key: "DSA", width: 10 },
      { header: "React", key: "React", width: 10 },
      { header: "WebDev", key: "Webdev", width: 10 },
      { header: "Interviews", key: "company", width: 10 },
      { header: "Result", key: "result", width: 10 },
  ];
  // Looping through User data
  let counter = 1;
  student.forEach((i) => {
    i.s_no = counter;
    let s = ""
    for(let j of i.company){
      s+=j.company
    }
    if(i.company){
      i.company = s;
    }
    worksheet.addRow(i); // Add data in worksheet
    counter++;
  });

  // Making first line in excel bold
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
  });
  
    await workbook.xlsx.writeFile('data.xlsx')
    res.send('successfully downloaded')
>>>>>>> 0603d45fec33ffb9d3755f72c1d93735db045f2c

  } catch (err) {
    console.log(err)
      res.send(err);
    }
})


router.get('/',async(req,res)=>{
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