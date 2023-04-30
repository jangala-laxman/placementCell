
const mongoose = require('mongoose')
mongoose.set("strictQuery", false);
const companySchema = new mongoose.Schema({
    company:{
        type:String,
        required:true,
    },
    ctc:{
        type:Number,
        required:true
    },
    interviews:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Interview'
    },
    students:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Student'
    }]

})

module.exports = mongoose.model('Company', companySchema)