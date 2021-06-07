const mongoose = require("mongoose");

const paidAmountSchema = new mongoose.Schema({
  paidAmount:{type:Number},
  paymentMethod:{type:String}
},{
  timestamps: {
    currentTime: () => {
      return new Date().setHours(new Date().getHours() -3)
    }
  }
});

const orderSchema = new mongoose.Schema(
  {
    orderId:{type:String,required:true},
    deliveryDate:{type:Date,required:true},
    customerId:{type : String, required:true},
    customerName:{type : String, required:true},
    customerPhoneNumber:{type : String, transient:true},
    deliveryAddress:{type : String, required:true},
    category:{type : String, required:true},
    basePrice:{type : Number, required:true},
    deliveryCost:{type : Number, required:true},
    totalPrice:{type : Number, required:true},
    paidAmount:[paidAmountSchema],
    saldo:{type : Number, required:true},
    description:{type : String, required:true},
    notes:{type : String},
    status:{type: String},
    isPaid:{type:Boolean,default:false},
    currency:{type:String, require:true}
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

const orderModel = mongoose.model("Order", orderSchema);
module.exports = orderModel;
