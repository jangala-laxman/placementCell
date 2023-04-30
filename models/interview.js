const mongoose  = require('mongoose')
const interviewSchema = new mongoose.Schema({
   
    company:{
        type:String,
        required:true,
    },
    students:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Student'
    },
    result:{
        type:String,
        enum:["Pass","Onhold", "Didn't Attempt", "Fail"]
    },
})




module.exports = mongoose.model("Interview", interviewSchema)