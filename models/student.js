const mongoose = require("mongoose");
const Interview = require("./interview");
mongoose.set("strictQuery", false);
const studentSchema = new mongoose.Schema(
  {
    
    username: {
      type: String,
      require: true
    }, 
    email: {
      type: String,
      required: 'Please enter your email ',
    },
    college:{
      type:String,
      required:[true]
    },
    batch:{
      type:String,
      required:true
    },
    status:{
      type:String,
      default:false,
      required:true,
    },
    DSA:{
      type:Number,
      required:true
    },
    React:{
      type:Number,
      required:true
    },
    Webdev:{
      type:Number,
      required:true
    },
    result:{
      type:String,
      enum:["Pass","Onhold", "Didn't Attempt", "Fail"]
    },
    interviews:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Interview"
    }],
    company:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Company'
    }],
    application_number:{
      type:Number,
    }

  }
);

// studentSchema.pre('remove',(next)=>{
//   this.model('Client').remove({ submission_ids: this._id }, next);
// })

module.exports = mongoose.model("Student", studentSchema);
