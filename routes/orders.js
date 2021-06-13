var express = require("express");
var router = express.Router();
const Order = require("../model/orderModel");
const shortId = require('shortid');
const Customer = require("../model/customerModel");

shortId.characters(
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@"
  );

router.get('/', async(req,res)=>{
    const allOrders = await Order.find({}).sort({ createdAt: -1 });
    res.status(200).send(allOrders);
});

//Order Search API By Date.
router.get('/', async(req,res)=>{

});

router.get('/:id',async(req,res)=>{
    const orderId = req.params.id;
    const orderById = await Order.findOne({_id:orderId});
    if(orderId){
        const customer = await Customer.findOne({name:orderById.customerName})
        if(customer){ 
            orderById.customerPhoneNumber = customer.phoneNumber;
        }
    }
    res.status(200).send(orderById);
});

router.post("/", async (req, res) => {
    try{
        const orderId = shortId.generate().toUpperCase().slice(0,7);
        const {
          deliveryDate,
          customerId,
          customerName,
          deliveryAddress,
          category,
          currency,
          basePrice,
          deliveryCost,
          description,
          notes
        } = req.body;
      
        const totalPrice = basePrice + deliveryCost;
      
        const newOrder = new Order({
          orderId,
          deliveryDate,
          customerId,
          customerName,
          deliveryAddress,
          category,
          currency,
          basePrice,
          deliveryCost,
          totalPrice,
          saldo:totalPrice,
          description,
          notes,
          status:'PENDING'
        });
        const savedNewOrder = await newOrder.save();
        res.status(200).send(savedNewOrder);
    }catch(exception){
        console.log(exception);
        res.status(403).send({message:'Error occured, please check logs...'})
    }
  
});

router.put('/', async(req,res)=>{
    const orderId = req.body.orderId;
    const orderFound = await Order.findOne({_id:orderId});
   const{ deliveryDate,
    customerId,
    customerName,
    deliveryAddress,
    category,
    currency,
    basePrice,
    deliveryCost,
    description,
    notes} = req.body;
    if(orderFound){
        let saldo = 0;
        let newTotal = basePrice + deliveryCost
        if(orderFound.paidAmount.length === 0){
            saldo = newTotal;
        }else{
            let alreadyPaid = 0;
            orderFound.paidAmount.forEach(payment=>{
                alreadyPaid = alreadyPaid + payment.paidAmount;
            })
            saldo = newTotal - alreadyPaid;
        }
        orderFound.deliveryDate = deliveryDate || orderFound.deliveryDate,
        orderFound.customerId = customerId || orderFound.customerId,
        orderFound.customerName = customerName || orderFound.customerName,
        orderFound.deliveryAddress = deliveryAddress || orderFound.deliveryAddress,
        orderFound.category = category || orderFound.category,
        orderFound.currency = currency || orderFound.currency,
        orderFound.basePrice = basePrice || orderFound.basePrice,
        orderFound.deliveryCost = deliveryCost || orderFound.deliveryCost,
        orderFound.description = description || orderFound.description,
        orderFound.notes = notes || orderFound.notes
        orderFound.totalPrice = (basePrice + deliveryCost) || orderFound.totalPrice
        orderFound.saldo = saldo
        orderFound.isPaid = saldo === 0 ? true:false
        const updatedOrder = await orderFound.save();
        res.status(200).send({updatedOrder});
    }else{
        res.status(404).send({msg:`Order with ${orderId} was not found!`})
    }
});

router.post('/pay', async(req, res)=>{
    const {orderId, paidAmount, paymentMethod} = req.body;
    const orderFound = await Order.findOne({_id:orderId});
    if(orderFound){
        const paidAmoundObject = {
            paidAmount,
            paymentMethod
        };
        orderFound.saldo = orderFound.saldo - paidAmount;
        orderFound.paidAmount.push(paidAmoundObject);
        if(orderFound.saldo === 0){
            orderFound.isPaid = true;
        }
        const updatedOrder = await orderFound.save();
        res.status(200).send(updatedOrder);
    }else{
        res.status(404).send({msg:`Order with ${orderId} was not found!`})
    }
});

router.put('/update-status', async(req,res)=>{
    const{orderId,status} = req.body
    const orderFound = await Order.findOne({_id:orderId});
    if(orderFound){
        orderFound.status = status;
        const updatedOrder = await orderFound.save();
        res.status(200).send({updatedOrder})
    }else{
        res.status(404).send({msg:`Order with ${orderId} was not found!`})
    }
})

router.delete('/delete-partial-payment/:orderId/:paymentId',async(req,res)=>{
    const orderId = req.params.orderId;
    const paymentId = req.params.paymentId;
    const orderById = await Order.findOne({_id:orderId});
    let updatedOrder = undefined;
    if(orderById){
        const updatedPaymentList = orderById.paidAmount.filter(payment => payment._id != paymentId);
        console.log(updatedPaymentList);
        orderById.paidAmount = updatedPaymentList;
        let newSaldo = 0;
        let totalPaid = 0;
        orderById.paidAmount.forEach(payment=>{
            totalPaid += payment.paidAmount;
        });
        newSaldo = orderById.totalPrice - totalPaid;
        orderById.saldo = newSaldo;
        if(newSaldo > 0){
            orderById.isPaid = false;
        }
        updatedOrder = await orderById.save();
        if(updatedOrder){
            res.status(200).send(updatedOrder);
        }else{
            res.status(404).send(updatedOrder);
        }
    }else{
        res.status(404).send({message:'Order not found.'})
    }
})

module.exports = router;
