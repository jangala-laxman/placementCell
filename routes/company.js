const express = require('express')
const router = express.Router()
const Company = require('../models/company')

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



module.exports  = router