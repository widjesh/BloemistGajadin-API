const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, index: true, required:true},
    email: {
      type: String,
      unique: true,
      index: true,
      dropDups: true
    },
    phoneNumber:{type:String, required:true},
    address:{type:String,required:true},
    idNumber:{type:String}
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

const customerModel = mongoose.model("Customer", customerSchema);
module.exports = customerModel;
