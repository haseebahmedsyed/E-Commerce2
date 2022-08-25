const ErrorHandler = require('./Error-Handler');

module.exports = (err,req,res,next) =>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";
    
    // console.log(err.name);
    if(process.env.NODE_ENV == "DEVELOPMENT"){
        res.status(err.statusCode).json({
            success : false,
            error : err,
            message : err.message,
            stack : err.stack
        })
    }

    if(process.env.NODE_ENV == "PRODUCTION"){
        // console.log(err.path);
        let error = err
        // console.log(error.message);
        // if(err.message === "castError"){
            // console.log(err.name);
            // const message = `Reseource not found. Invalid ${err.path}`
            // error=new ErrorHandler(message,404)
            // new ErrorHandler(message,404)
        // }

        if(err.name === 'ValidationError'){
            const message = Object.values(error.errors).map(value => value.message)
            error = new ErrorHandler(message,400)
        }

        // handling mongoose duplicate key error
        if(err.code===11000){
            const message =`Duplicate ${Object.keys(error.keyValue)} entered`
            error = new ErrorHandler(message,400);
        }

        // handle wrong jwt

        if(err.name==='JsonWebTokenError'){
            const message ='JasonWebToke is invalid, Try Again!!!'
            error = new ErrorHandler(message,400)
        }

        // handle expireds jwt token

        if(err.name==='TokenExpiredError'){
            const message ='JasonWebToke is expired, Try Again!!!'
            error = new ErrorHandler(message,400)
        }
        res.status(error.statusCode).json({
            success : false,
            message : error.message || 'Internal server error'
        })
    }
}
