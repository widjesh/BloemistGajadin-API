const jwt = require('jsonwebtoken');
const config = require("./config");


const getToken = user => {
    return jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      },
      config.JWT_SECRET,
      {
        expiresIn: "365d"
      }
    );
};

const isToday = (someDate) => {
  const today = new Date()
  return someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
}

const isTomorrow = (someDate) => {
  const today = new Date()
  return someDate.getDate()+1 == today.getDate()+1 &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
}

const isProcessing = (status) =>{
  return status === 'PROCESSING';
}

const isAuth = (req,res,next)=>{
    const token = req.headers.authorization;
    if(token){
      const onlyToken = token.slice(7,token.length);
      jwt.verify(onlyToken,config.JWT_SECRET,(err,decoded)=>{
        if(err){
          return res.status(401).send({msg:'Invalid Token'});
        }
        req.user = decoded;
        next();
        return
      });
    }else{
      return res.status(401).send({msg:'User is unauthorized!'});
    }
  }
  

  module.exports = {getToken,isToday,isProcessing}