const { timeStamp } = require("console");
// const {isEmail} = require('validator')
const bcrypt = require('bcryptjs')
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true
    }, 
    email: {
      type: String,
      required: [true, 'please enter your email Id'],
    },
    password: {
      type: String,
      required: [true, ' please enter your password'],
    },
    confirm_password: {
      type: String,
      required: [true, ' please enter your password again'],
    }
  },
  {
    timeStamp: true
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// validate the password with passed on user password
userSchema.methods.isValidatedPassword = async function (userSentPassword) {
  return await bcrypt.compare(userSentPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
