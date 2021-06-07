var express = require('express');
var router = express.Router();
const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const {getToken} = require('../utils')
const saltRounds = 10;


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/register", async (req, res) => {
const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });
  const userExists = await User.findOne({
    email: req.body.email
  });
  if (!userExists) {
    const newUser = await user.save();
    if (newUser) {
      res.status(200).send({msg:'User registered successfully !'})
    } else {
      res.status(400).send({ msg: "Invalid User Data." });
    }
  } else {
    res
      .status(409)
      .send({ msg: "User already exists!" });
  }
});

router.post('/signin',async (req,res)=>{
  const signinUser = await User.findOne({
    email: req.body.email
  });
  if(signinUser){
  const match = await bcrypt.compare(req.body.password, signinUser.password);
  if(match){
    res.status(200).send({jwt_token:getToken(signinUser)});
  }else{
    res.status(400).send({
      message:'Invalid username and/or password'
    })
  }
  }else{
    res.status(400).send({
      message:'Invalid username and/or password'
    })
  }
});

module.exports = router;
