const AsyncErrorHandler = require('../../error_handling/asyncError-Middleware');
const ErrorHandler = require('../../error_handling/Error-Handler')
const createCookie = require('./JWT-Cookie')
const sendEmail = require('../../utils/sendEmail')

const User = require('../../models/user')
const crypto = require('crypto')

// create user
const createUser = AsyncErrorHandler(async(req,res,next)=>{
    const {name,email,password,role} = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:'mrdv',
            url:'fvdgv'
        },
        role
    })
    createCookie(user,201,res);
})

// login user

const loginUser = AsyncErrorHandler(async(req,res,next)=>{
    const {email, password} = req.body;

    if(!email || !password) {
        return next(new ErrorHandler("Provide email and password",400));
    }

    const user = await User.findOne({email}).select('+password');

    if(!user){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    // create a custom function in user schema "comparePassword" which compares passwords

    const comparedPass = await user.comparePassword(password);

    if(!comparedPass){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    createCookie(user,201,res);
})

const logoutUser = AsyncErrorHandler(async(req,res,next)=>{
    res.cookie('token',null,{
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message:"Successfully Logout"
    })

})


// forgot password

const forgotPassword = AsyncErrorHandler(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("No user found",404));
    }

    const forgetToken = user.forgetPasswordToken();

    await user.save({validateBeforeSave : false});
    
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${forgetToken}`;

    const message = `Your Password reset token is as follow\n\n${resetURL}\n\nIf you have not requested this email ignore it.`;

    try {
        // send email function is on another file
        await sendEmail({
            email:user.email,
            subject : 'Ecommerce Password Recovery',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`
        })
        
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save({validateBeforeSave: false})

        next(new ErrorHandler(error.message , 500));
    }
})

// reserPassword

const resetPassword = AsyncErrorHandler(async(req,res,next)=>{
    const resetToken = req.params.token;
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const user = await User.findOne({ 
        resetPasswordToken,
        resetPasswordExpires:{$gt : Date.now()}
    })

    if(!user){
        return next(new ErrorHandler("Token is invalid or expired",400));
    }

    if(req.body.password!==req.body.confirmPassword){
        return next(new ErrorHandler("Password not matched",400));
    }

    user.password = req.body.password;

    user.resetPasswordToken=undefined;
    user.resetPasswordExpires=undefined;

    await user.save();
    createCookie(user,201,res);
})


const findMe = AsyncErrorHandler(async(req,res,next)=>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
})

const updatePassword = AsyncErrorHandler(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select('+password');

    const match = user.comparePassword(req.body.oldpassword);

    if(!match){
        return next(new ErrorHandler("Invalid old password",400));
    }

    user.password=req.body.password;

    await user.save();

    res.status(200).json({
        success: true
    })


})

const updateMe = AsyncErrorHandler(async(req,res,next)=>{
    const newUser = {
        name:req.body.name,
        email:req.body.email
    }
    const user = await User.findByIdAndUpdate(req.user.id,newUser,{new:true});

    res.status(200).json({
        success: true,
        user
    })
})

const getAllUsers = AsyncErrorHandler(async(req,res,next)=>{
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})

const getAllUser = AsyncErrorHandler(async(req,res,next)=>{
    const user = await User.findById(req.params.id);

    res.status(200).json({
        success:true,
        user
    })

})

const updateUser = AsyncErrorHandler(async(req,res,next)=>{
    const newUser = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id,newUser,{new:true});

    res.status(200).json({
        success: true,
        user
    })
})

const removeUser= AsyncErrorHandler(async(req,res,next)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User not found with id ${req.params.id}`,400));
    }
    await user.remove();

    res.status(200).json({
        success: true
    })

})

module.exports = {createUser,loginUser,logoutUser,forgotPassword,resetPassword,findMe,updatePassword,updateMe,getAllUsers,getAllUser,updateUser,removeUser};