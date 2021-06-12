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

router.put('/',async(req,res)=>{
    const {expenseId, name,price} = req.body;
    const foundExpense = await Expense.findById(expenseId);
    if(foundExpense){
        foundExpense.name = name || foundExpense.name;
        foundExpense.price = price || foundExpense.price;
        const updatedExpense = await foundExpense.save();
        if(updatedExpense){
            res.status(200).send(updatedExpense)
        }
    }else{
        res.status(404).send({message:'Expense could not be found'});
    }
});

module.exports = router;
