const mongoose = require("mongoose");

const expensesSchema = new mongoose.Schema(
  {
    name: { type: String, index: true, required: true },
    price: { type: Number, required: true }
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

const expensesModel = mongoose.model("Expenses", expensesSchema);
module.exports = expensesModel;
