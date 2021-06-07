var express = require("express");
var router = express.Router();
const Order = require("../model/orderModel");
const { isToday, isProcessing } = require("../utils");

router.get("/", async (req, res) => {
  let listToBeSend = {}; // {today:"5/20",tomorrow:"3/10"}
  let countForToday = 0;
  let countForTomorrow = 0;
  let totalSaldo = 0;

  let now = new Date();
  let startToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    1,
    0,
    0
  );
  let endToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    59,
    59
  );

  let startTomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()+1,
    1,
    0,
    0
  );
  let endTomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 2,
    0,
    59,
    59
  );

  let queryToday = { deliveryDate: { $gte: startToday, $lt: endToday } };
  let queryTomorrow = { deliveryDate: { $gte: startTomorrow, $lt: endTomorrow } };

  const allOrdersToday = await Order.find(queryToday);
  const allOrdersTomorrow = await Order.find(queryTomorrow);
  const allOrders = await Order.find({});

  for (const order of allOrdersToday) {
    if (isProcessing(order.status)) {
      countForToday = countForToday + 1;
    }
  }

  for (const order of allOrdersTomorrow) {
    if (isProcessing(order.status)) {
      countForTomorrow = countForTomorrow + 1;
    }
  }

  for(const order of allOrders){
      totalSaldo = totalSaldo + order.saldo;
  }

  listToBeSend = {
    today: `${countForToday}/${allOrdersToday.length}`,
    tomorrow: `${countForTomorrow}/${allOrdersTomorrow.length}`,
    totalSaldo
  };

  res.status(200).send({ analytics: listToBeSend });
});

module.exports = router;
