const express = require("express");
const User = require('../models/user')
const router = express.Router();
const bcrypt = require('bcryptjs')
const session =require('express-session')
const passport = require('passport')


router.get('/login', async(req,res)=>{
    const user = await User.find({})
    try{
        res.render('users/user_login', {user:user})
    }
    catch(err){
        res.redirect('/')
    }
})
router.post('/login', async(req,res)=>{
    const user = await User.find({})
    try{
        const email = req.body.email
        const useremail = await User.findOne({email:email})
      if(useremail.password === req.body.password){
        console.log("success")
        res.status(201).redirect("/")
      }else{
        res.send("invalid username/password")
      }
    }
    catch(err){
        console.log(err, "invalid username/password")
        res.send("invalid credentials")
    }
})
router.get('/register', async (req,res)=>{
    const user = await User.find({})
    try{
        res.render('users/user_register')
    }
    catch(err){
        res.redirect('/user')
    }
})

router.use(session({
    secret:"nothing",
    resave:false,
    saveUninitialized:false
  }))
  

router.post('/register', async(req,res)=>{
    
  try{
    // const newuser = await user.save()
    const password = req.body.password;
    const confirm_password = req.body.confirm_password
    if(password === confirm_password){
        const user = new User({
            name:req.body.username,
            email:req.body.email,
            password:req.body.password,
            confirm_password:req.body.confirm_password
        })
        
        await user.save()
        console.log(req.body)
        res.redirect('/')
    }
    else{
        res.send("password and confirm password are not matching")
    }

  }catch(err){
    console.log('error caught')
    res.status(400).send(err)
  }
})

router.get('/user/:id', async(req,res)=>{
    const user = await User.findById({email:email})
})



module.exports = router;