const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String,
         unique: true,
         index: true,
         dropDups: true },
    email: {
      type: String,
      unique: true,
      index: true,
      dropDups: true
    },
    password:{
      type:String
    },
    isAdmin:{type:Boolean, default:false}
  },
  {
    timestamps: {
      currentTime: () => {
        let utcDate = new Date();
        utcDate.setHours(utcDate.getHours() - 3);
        return utcDate;  
      }
    }
  }
);

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
