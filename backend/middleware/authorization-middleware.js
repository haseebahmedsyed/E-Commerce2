const ErrorHandler = require('../error_handling/Error-Handler');
const AsyncErrorHandler = require('../error_handling/asyncError-Middleware');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authorize =AsyncErrorHandler(async(req,res,next)=>{
    const {token} = req.cookies;

    if(!token) {
        return next(new ErrorHandler("Login First To Access This Resource",401));
    }

    const decode = jwt.verify(token,process.env.MY_TOKEN);

    req.user = await User.findById(decode.id);

    console.log(token);

    next();


})
// this is the parameterized middleware (remember syntax) we use to check authentic roles
const authorizeRole = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role ${req.user.role} is not allowed`,403));
        }
        next();
    }
}


module.exports ={authorize,authorizeRole};