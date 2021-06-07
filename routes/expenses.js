var express = require("express");
var router = express.Router();
const Expense = require('../model/expensesModel');

router.get('/',async(req,res)=>{
    const allExpenses = await Expense.find({});
    res.status(200).send({allExpenses});
});

router.post('/', async(req,res)=>{
    const {name,price} = req.body;
    const expense = new Expense({
        name,price
    });
    const savedExpense = await expense.save();
    res.status(200).send({savedExpense});
})

module.exports = router;
