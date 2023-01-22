const express = require('express')
const router = express.Router()
const Company = require('../models/company')

router.get('/', async(req,res)=>{
    const company = await Company.find({})
    
    res.render("company/all_companies", {company:company})
})
router.get("/add",async(req,res)=>{
    const company = await Company.find({})
    res.render('company/add_companies',{company:company})
})
router.post('/add', async(req,res)=>{
    
    const company = new Company({
        company_name:req.body.company_name,
        ctc:req.body.ctc
    })
    console.log(req.body)
    await company.save()
    res.redirect('/company')
})

module.exports  = router