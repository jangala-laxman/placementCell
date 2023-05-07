const mongoose  = require('mongoose')
const interviewSchema = new mongoose.Schema({
   
    company:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Company',
    },
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Student'
    },
<<<<<<< HEAD
    date:{
        type:String,
    },
=======
>>>>>>> 0603d45fec33ffb9d3755f72c1d93735db045f2c
    result:{
        type:'String',
        enum:["Pass","Onhold", "Didn't Attempt", "Fail"],
        required:true
    },
})




module.exports = mongoose.model("Interview", interviewSchema)