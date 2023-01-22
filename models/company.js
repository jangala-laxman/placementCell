
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
})

module.exports = mongoose.model('Company', companySchema)