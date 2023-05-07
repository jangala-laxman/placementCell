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
    date:{
        type:String,
    },
    result:{
        type:'String',
        enum:["Pass","Onhold", "Didn't Attempt", "Fail"],
        required:true
    },
})




module.exports = mongoose.model("Interview", interviewSchema)