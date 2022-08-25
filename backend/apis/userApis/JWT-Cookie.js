const createCookie = (user , statusCode , res)=>{
    const token = user.createWebToken();

    const options ={
        expires:new Date( Date.now() + (process.env.COOKIE_EXPIRATION * 24*60*60*1000)),
        httpOnly:true
    }
    console.log(user);
    res.status(statusCode).cookie("token",token,options).json({
        success:true,
        token,
        user
    })

}

module.exports = createCookie