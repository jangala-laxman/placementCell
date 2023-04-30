const express = require('express')
const router = express.Router()
const Student = require('../models/student')
const Interview = require('../models/interview')
const Company = require('../models/company')

router.get('/', async(req,res)=>{
    const interviews = await Interview.find()
    res.render('interview/all_interviews',{interviews:interviews})    
})

router.get('/create_interview', async(req,res)=>{
    const interviews = await Interview.find()
    res.render('company/add_companies')    
})

router.get('/update/:id', async(req,res)=>{
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

// router.post('/create_interview', async (req,res)=>{
//     try{
//         const email = req.body.email
//         const student = await Student.findOne({email:email})
//         const interviews = new Interview({
//             company:req.body.company,
//             date_of_interview:req.body.date_of_interview,  
//         })
//         await interviews.save({})
//         res.redirect('/student')
//     }catch(err){
//         console.log(err)
//     }
    
// })

router.get('/all_companies', async(req,res)=>{
    const companies = await Company.find()
    console.log(companies)
    res.render('company/all_companies.ejs',{companies:companies})
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




module.exports  = router