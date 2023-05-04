const Student = require("../models/student")
const Interview = require("../models/interview")
const company = require('../models/company')
const fs = require("fs")
const path = require("path")
const {Parser} = require('json2csv')
const xlsx = require('xlsx')
const express = require("express")
const router = express.Router()
const csvWriter = require('csv-writer');
const json2csv = new Parser()
const excelJS = require("exceljs");

router.get('/aa',async(req,res)=>{
  try {
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