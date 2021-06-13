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

router.post('/filter',async(req,res)=>{
    const {startDate,endDate} = req.body;
    let totalExpense = 0;
    const foundExpenses = await Expense.find({ createdAt: { $gte: startDate, $lte: endDate} })
    if(foundExpenses){
        foundExpenses.forEach(expense => {
            totalExpense = totalExpense + expense.price;
        })
        res.status(200).send({foundExpenses,totalExpense});
    }else{
        res.status(407).send({message:'Could not find expenses in the given time span.'})
    }
});

router.delete('/:id',async(req,res)=>{
    const id = req.params.id;
    const deletedExpense = await Expense.deleteOne({_id:id});
    if(deletedExpense){
        res.status(200).send({message:'Deleted Successfull'})
    }else{
        res.status(500).send({message:'Could not perform delete on Expenses'});
    }
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
