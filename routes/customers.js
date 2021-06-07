var express = require("express");
var router = express.Router();
const Customer = require("../model/customerModel");
const Order = require("../model/orderModel");


router.get("/", async (req, res) => {
  const allCustomers = await Customer.find({});
  console.log(allCustomers)
  res.status(200).send({allCustomers});
});

router.put('/:id', async(req,res)=>{
  const id = req.params.id;
  const customerFound = await Customer.findById(id);
  if(customerFound){
    customerFound.name = req.body.name || customerFound.name;
    customerFound.email = req.body.email || customerFound.email;
    customerFound.phoneNumber = req.body.phoneNumber || customerFound.phoneNumber;
    customerFound.address = req.body.address || customerFound.address;
    customerFound.idNumber = req.body.idNumber || customerFound.idNumber;
    const updatedCustomer = await customerFound.save();
    res.status(200).send(updatedCustomer);
  }else{
    res.status(200).send({message:'Customer not found'});
  }
});

router.post("/", async (req, res) => {
  const { name, email, phoneNumber, address, idNumber } = req.body;
  const customer = new Customer({
    name,
    email,
    phoneNumber,
    address,
    idNumber
  });
  const savedCustomer = await customer.save();
  res.status(200).send(savedCustomer);
});

router.get('/:id',async(req,res)=>{
  const id = req.params.id;
  const userFound = await Customer.findOne({_id:id});
  if(userFound){
    res.status(200).send(userFound);
  }else{
    res.status(404).send({message:'User not found'});
  }
})

router.get('/search/combo-box',async(req,res)=>{
  const response = [];
  const allCustomers = await Customer.find();
  if(allCustomers){
    allCustomers.forEach(customer=>{
      response.push({name:customer.name,id:customer._id});
    })
    res.status(200).send(response);
  }else{
    res.status(200).send({message:'Failed to get customers'});
  }
})

router.get('/search', async(req,res)=>{
    const searchKeyWord = req.query.naam ? 
    {
        name: {
          $regex: req.params.id,
          $options: "i"
        }
      }:{};
      const emailKeyWord = req.params.address ? { address: req.query.address } : {}
    const customers = await Customer.find({...emailKeyWord,...searchKeyWord})
    res.status(200).send({customers});
})


router.get('/saldo/:id',async(req,res)=>{
  const id = req.params.id;
  const foundOrder = await Order.find({customerId:id});
  let totalSaldoEUR = 0; 
  let totalSaldoUSD = 0; 
  let totalSaldoSRD = 0; 
  if(foundOrder){
    foundOrder.forEach(order=>{
      if(order.currency === 'EUR'){
        totalSaldoEUR += order.saldo;
      }else if(order.currency === 'USD'){
        totalSaldoUSD += order.saldo
      }else{
        totalSaldoSRD += order.saldo
      }
    })
    const response = {totalSaldoEUR,totalSaldoUSD,totalSaldoSRD}
    res.status(200).send({totalSaldos:response})
  }else{
    res.status(401).send({message:'Order not found.'})
  }
});
module.exports = router;
