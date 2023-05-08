const express = require('express')
const router = express.Router()
const Company = require('../models/company')
const Student = require('../models/student')
const Interview = require('../models/interview')

router.get('/all_companies', async(req,res)=>{
    const company = await Company.find({})
    res.render("company/all_companies", {companies:company})
})

router.get("/add_company",async(req,res)=>{
    const company = await Company.find({})
    res.render('company/add_companies',{company:company})
})

router.post('/add_company', async(req,res)=>{
    const company = new Company({
        company:req.body.company,
        ctc:req.body.ctc
    })
    console.log(req.body)
    await company.save()
    res.redirect('/company/all_companies')
})

router.get('/delete/:company', async(req,res)=>{
    try{
        const company  = await Company.find()
        await Student.findByIdAndUpdate(req.params.company, {$pull:{company:req.params.company}})
        await Company.findByIdAndDelete(req.params.company)
        
        res.render("interview/all_interviews",{companies:company} )
    }catch(err){
        console.log(err)
        res.send(err)
    }
})

router.get("/:company/delete/:student", async(req,res)=>{
    try{
        const interview = await Interview.findOneAndRemove({company:req.params.company,student:req.params.student})

        console.log(interview)
        await Company.findByIdAndUpdate(req.params.company, {$pullAll:{
            students:[{_id:req.params.student}]
        }})
        await Student.findByIdAndUpdate(req.params.student, {$pullAll:{
            company:[{_id:req.params.company}]
        }})
        
        res.send("deleted successfully")
       
    }catch(err){
        console.log(err);
        res.json(err)
    }
})

router.get('/update/:id', async(req,res)=>{
    const company = await Company.findById(req.params.id).populate('students')
    const interview = await Interview.findOne({company:company})
    console.log(interview)
    res.render('interview/applied_students', {company:company, interview:interview})
})

router.get('/:company/allocate_interview/:student', async(req,res)=>{
   try{
     const company = await Company.findById(req.params.company)
     const student = await Student.findById(req.params.student)
     const interview = await Interview.find({company:company, student:student})
     console.log(interview)
     res.render('interview/allocate_interview', {company:company, student:student})
   }catch(err){
    console.log(err)
    res.send(err)
   }
})

router.post('/:company/allocate_interview/:student', async(req,res)=>{
    const company = await Company.findById(req.params.company)
    const student = await Student.findById(req.params.student)
    const interview = await Interview.findOneAndUpdate({company:company, student:student}, {
        date:req.body.date
    })
    console.log(interview)
    res.render('interview/allocate_interview', {company:company, student:student})
})


module.exports  = router