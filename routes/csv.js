const Student = require("../models/student")
const Interview = require("../models/interview")
const fs = require("fs")
const path = require("path")
const {Parser} = require('json2csv')
const excel = require('exceljs')
const xlsx = require('xlsx')
const express = require("express")
const router = express.Router()
const csvWriter = require('csv-writer');
const json2csv = new Parser()

router.get('/aa',async(req,res)=>{
    try{
        const students = await Student.find().populate('interviews');
        const report = "Student Name, college, email, status, DSA, React, Webdev, Interview date, company, result";
        let studentData = ""
        for(let i of students){
            studentData= i.id+
            ","+
            i.name+","+
            i.college+","+
            i.email+","+
            i.status+","+
            i.DSA+","+
            i.Webdev+","+
            i.React+",";
            let interviewData = "";
            if(i.interviews>0){
                for(let j of i.interviews){                    
                    const interviews = Interview.findById({id:j._id})
                    console.log(interviews)
                    interviewData+=",";
                    j.date_of_interview+","+
                    j.company+","+
                    j.result+","
                }
            }
            report +="\n"+studentData+interviewData
            
        } 
        
        const writer = csvWriter.createObjectCsvWriter({
            path: path.resolve(__dirname, 'students.csv'),
            header: [
              { id: 'username', title: 'Name' },
              { id: 'email', title: 'Email' },
              { id: 'college', title: 'College' },
              { id: 'status', title: 'Status' },
            ],
          });

          const download = writer.writeRecords(report)
            console.log(download);
            res.send("done")

   
    }catch(err){
        console.log(err)
    }
})


router.get('/',async(req,res)=>{
    try{
      let wb = xlsx.utils.book_new()
      const student = await Student.find().populate('interviews')
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