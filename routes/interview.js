const express = require('express')
const router = express.Router()
const Student = require('../models/student')
const Interview = require('../models/interview')

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


router.get('/delete/:id', async(req,res)=>{
    await Interview.findByIdAndRemove(req.params.id)
    res.redirect('/interview')
})
module.exports  = router