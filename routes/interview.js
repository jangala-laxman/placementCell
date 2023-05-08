const express = require('express')
const router = express.Router()
const Student = require('../models/student')
const Interview = require('../models/interview')
const Company = require('../models/company')

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
    const company = await Company.find().populate('students')
    res.render('interview/all_interviews',{companies:company, session:session})    
})

router.get('/create_interview', async(req,res)=>{
    const interviews = await Interview.find()
    res.render('company/add_companies', {session:session})    
})

router.get('/update/:id',  checkAuth,  async(req,res)=>{
    await Interview.findById(req.params.id,(err, interview)=>{
        if(err){
            console.log(err)
            res.redirect('/interview')
        }else{
            if(interview == null){
                res.redirect('/interview')
            }
            else{
               res.render("interview/update_interview",{interview:interview}) 
            }
        }
    })
})

router.post('/update/:id', async(req,res)=>{
    await Interview.findByIdAndUpdate(req.params.id,{
        company:req.body.company,
        student:req.body.student,
        date_of_interview:req.body.date_of_interview
    })
})


router.get('/all_companies', async(req,res)=>{
    const companies = await Company.find()
    console.log(companies)
    res.render('company/all_companies.ejs',{companies:companies, session:session})
})




router.get('/delete/:id', async(req,res)=>{
    const student = await Student.findOne({interviews:req.params.id})
    // const interviews = await Student.interviews;
    // console.log(student.interviews)
    const id = req.params.id
    const interview = await Interview.findById(req.params.id)
    const interviews = student.interviews
    let k = 0;
    for(let i=0;i<interviews.length;i++){
        if(student.interviews[i]._id == req.params.id){
            k=i;
            console.log(interview.company)
        }
    }
    interviews.splice(k,1)
    console.log(interviews)
    await student.updateOne({interviews:interviews})
    await Interview.findByIdAndRemove(req.params.id)

    res.redirect('/student')
})


router.get('/results/:interview', async(req,res)=>{
    const interview = await Interview.findById(req.params.interview).populate(['student', 'company'])
    console.log(interview)
    res.render('interview/update_interview', {student:interview.student, company:interview.company, interview:interview, session:session})
})

router.post('/results/:interview', async(req,res)=>{
    const interview = await Interview.findById(req.params.interview)
    const studentId = interview.student
    const student = await Student.findById(studentId)
    await interview.updateOne({result:req.body.result})
    if(req.body.result === "Pass"){
        await student.updateOne({
            status:"true"
        })
    }
    res.render('interview/update_interview', {student:interview.student, company:interview.company, interview:interview, session:session})
})

module.exports  = router