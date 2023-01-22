const Student = require("../models/student")
const fs = require("fs")
const path = require("path")
const excel = require('exceljs')

const express = require("express")
const router = express.Router()

router.get('/',async(req,res)=>{
    try{
        const students = await Student.find().populate('interviews');
        console.log(students)
        const report = "Student Name, college, email, status, DSA, React, Webdev, INterview date, company, result";
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
            if(i.interviews>0){
                for(let j of i.interviews){
                    let interviewData = "";
                    interviewData+=","+
                    j.date_of_interview+","+
                    j.company+","+
                    j.result+",";
                    report +="\n"+studentData+interviewData
                }
            }
            
        } 
        // console.log(report)
        
        const csvFile=fs.writeFile(
            "studentReport.csv",
            report,
            function (err, data) {
                if (err) {
                  console.log(err);
                  return res.redirect("back");
                }
                // req.send("successfully downloaded CSV report!");
                return res.download("studentsReport.csv");
              }
            );
    }catch(err){
        console.log(err)
    }
})

module.exports = router