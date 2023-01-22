const express = require("express");
const Student = require('../models/student')
const Interview = require('../models/interview');
const router = express.Router();

router.get('/', async(req,res)=>{
    const student = await Student.find({}).populate('interviews')
    const interview = await Interview.find()
    // console.log(student)
    try{
        res.render('students/index', {student:student, interview:interview})
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
            Webdev:req.body.Webdev
        })        
        await student.save()
        res.redirect('/student')
        
  }catch(err){
    res.status(400).send(err)
  }
})

router.get('/update/:id',async(req,res)=>{
    let id = req.params.id
    console.log(req.id)
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
        Interview.deleteMany({student:req.params.id})
        await Student.findByIdAndRemove(req.params.id) 
       
    res.redirect("/student")

    }catch(err){
        console.log(err)
    }
   
})


router.get('/register/:student/interviews',async(req,res)=>{
    try{
        const id = req.params.student
        
        const student = await Student.findById(id);
        res.render("interview/enroll_interview", {student:student})
    }catch(err){
       console.log(err)
       res.redirect('/student')
    }
})

router.post('/register/:student/interviews',async(req,res)=>{
    try{
        const id = req.params.student
        
        const interview = new Interview({
            company:req.body.company,
            date_of_interview:req.body.date_of_interview,
        })
        await interview.save()
        const student = await Student.findById(id)
        student.interviews.push(interview)
        await student.save()
        console.log(student.interviews)
        res.render("interview/enroll_interview",{student:student})
    }catch(err){
       console.log(err)
       res.redirect('/student')
    }
})


module.exports = router;

