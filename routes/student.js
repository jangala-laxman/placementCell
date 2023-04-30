const express = require("express");
const Student = require('../models/student')
const Interview = require('../models/interview');
const router = express.Router();
const Company = require('../models/company')
router.get('/', async(req,res)=>{
    const student = await Student.find({}).populate('interviews')
    const interview = await Interview.find({}).populate('students')
    const company = await Company.find()
    console.log(interview)
    try{
        res.render('students/index', {student:student, companies:company})
    }
    catch(err){
        res.redirect('/')
    }
})


router.get('/add_student', async (req,res)=>{
    const student = await Student.find({}).populate("interviews")
    try{
        res.render('students/add_student', {student:student})
    }
    catch(err){
        res.redirect('/student')
    }
})

router.post('/add_student', async(req,res)=>{
    
  try{
    // const newStudent = await student.save()
    const password = req.body.password;
    const confirm_password = req.body.confirm_password
        const student = new Student({
            username:req.body.username,
            email:req.body.email,
            college:req.body.college,
            batch:req.body.batch,
            status:req.body.status,
            DSA:req.body.DSA,
            React: req.body.React,
            Webdev:req.body.Webdev,
            application_number:Math.floor(Math.random()*100)
        })        
        await student.save()
        res.redirect('/student')
        
  }catch(err){
    res.status(400).send(err)
  }
})

router.get('/update/:id',async(req,res)=>{
    let id = req.params.id
    // console.log(req.id)
   
    Student.findById(id, (err,student)=>{
        if(err){
            console.log(err)
            
        }else{
            if(student==null){
                
                res.redirect("/")
            }else{
                res.render('students/update_student',{
                    student:student
                })
            }
        }
    })
})

router.post('/update/:id',async(req,res)=>{
    try{
        const id = req.params.id
        const student = await Student.findByIdAndUpdate(id,
        {
            username:req.body.username,
            email:req.body.email,
            college:req.body.college,
            batch:req.body.batch,
            status:req.body.status,
            DSA:req.body.DSA,
            React:req.body.React,
            Webdev:req.body.Webdev,
    });
    res.redirect('/student')
    }catch(err){
       console.log(err)
       res.redirect('/')
    }
})

//deleting the student profile
router.get('/delete/:id',async(req,res)=>{
    try{
        const student = await Student.findById(req.params.id)
        await Interview.deleteMany({students:req.body.id})
        await student.deleteOne()
    //    console.log(student)
        res.redirect("/student")
        // res.send(interview)

    }catch(err){
        console.log(err)
    }
   
})


router.get('/register/:company/enroll',async(req,res)=>{
    try{
        const id = req.params.company        
        const company = await Company.findById(id);
        console.log(company)
        res.render("interview/enroll_interview", {company:company})
    }catch(err){
       console.log(err)
       res.redirect('/')
    }
})

router.post('/register/:company/enroll',async(req,res)=>{
    try{
        const id = req.params.company        
        const company = await Company.findById(id)
        console.log(company)
        const student = await Student.findOne({application_number:req.body.students})    
        console.log(student)
        let students = company.students
        students.push(student._id)
        await company.updateOne({students:students})
        console.log(company)
        res.render("interview/enroll_interview",{company:student})
    }catch(err){
       console.log(err)
       res.send(err)
    }
})


module.exports = router;

