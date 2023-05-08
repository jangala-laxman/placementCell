const express = require("express");
const User = require('../models/user')
const router = express.Router();
const bcrypt = require('bcryptjs')
const session =require('express-session')
const Student = require("../models/student");
const Interview = require("../models/interview");



router.get('/login', async(req,res)=>{
    const user = await User.find({})
    try{
        res.sendFile('/users/user_login.html', {root:'views'})
    }
    catch(err){
      console.log(err)
      res.send(err)
    }
})
router.post('/login', async(req,res)=>{
  try{
    const students = await Student.find().populate('company')
    const interviews = await Interview.find()

    const email = req.body.email;
    const user = await User.findOne({email:email})
    if(req.session.user){
        return res.send("You already logged in")
    }
    if(user){
        const compare = bcrypt.compare( req.body.password, user.password)
        if(compare){
            req.session.user = user
            
            res.render('home',{user:req.session.user, session:req.session, students:students, interviews:interviews})
        }
        else{
            res.send("wrong username or password")
        }
    }
    else{
        res.send("Wrong username or Password")
    }    
}catch(err){
    console.log(err)
    res.status(500).send("internal server error")
}
})
router.get('/register', async (req,res)=>{
    const user = await User.find({})
    try{
        res.sendFile('/users/user_register.html', {root:'views'})
    }
    catch(err){
        res.redirect('/user')
    }
})

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



router.get('/logout', async(req,res)=>{
  req.session.user = null
req.session.save(function (err) {
  if (err) next(err)
  req.session.regenerate(function (err) {
    if (err) next(err)
    res.redirect('/')
  })
})
  // res.render('home', {session:null, user:null})
})



module.exports = router;