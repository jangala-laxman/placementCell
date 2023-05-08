const express = require("express");
const Student = require('../models/student')
const Interview = require('../models/interview');
const router = express.Router();
const Company = require('../models/company')
const User = require('../models/user')
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
  
router.get('/', checkAuth, async(req,res)=>{
    const student = await Student.find({}).populate('company')
    const interview = await Interview.find({}).populate('student')
    const company = await Company.find({}).populate('students')
    console.log(interview)
    try{
        res.render('students/index', {student:student, session:session})
    }
    catch(err){
        res.redirect('/')
    }
})

router.get('/add_student',  checkAuth,async (req,res)=>{
    const student = await Student.find({}).populate("company")
    try{
        res.render('students/add_student', {student:student, session:session})
    }
    catch(err){
        res.redirect('/student')
    }
})

router.post('/add_student',  checkAuth, async(req,res)=>{
    
  try{
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

router.get('/update/:id', checkAuth, async(req,res)=>{
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
                    student:student, session:session
                })
            }
        }
    })
})

router.post('/update/:id', checkAuth, async(req,res)=>{
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
router.get('/delete/:id', checkAuth, async(req,res)=>{
    try{
        const student = await Student.findById(req.params.id)
        await Interview.deleteMany({students:req.body.id})
        await student.deleteOne()
    //    console.log(student)
        res.redirect("/student")
        // res.send(interview)

    }catch(err){
        console.log(err)
        res.send(err)
    }
})

router.get('/register/:company/enroll', checkAuth, async(req,res)=>{
    try{
        const id = req.params.company        
        const company = await Company.findById(id);
        console.log(company)
        res.render("interview/enroll_interview", {company:company, session:session})
    }catch(err){
       console.log(err)
       res.redirect('/')
    }
})

router.post('/register/:company/enroll', checkAuth, async(req,res)=>{
    try{
        const id = req.params.company        
        const company = await Company.findById(id)
        console.log(company._id)

        const student = await Student.findOne({application_number:req.body.students})    
        console.log(student)

        let students = company.students
        let companies = student.company

        companies.push(company._id)
        students.push(student._id)
       
        await company.updateOne({$push:{students:student}})
        await student.updateOne({$push:{company:company}})
        console.log(company)
        await Interview.create({
            company:company,
            student:student,
            result:"Didn't Attempt",
        })
        res.render("interview/enroll_interview",{company:student, session:session})
    }catch(err){
       console.log(err)
       res.send(err)
    }
})



module.exports = router;