const mongoose = require('mongoose');
const {Schema} = mongoose;
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new Schema({
    name:{
        type:String,
        required:[true,"Please enter the name"],
        maxlength:[30,"Name must not exceed 30 characters"]
    },
    email:{
        type:String,
        required:[true,"Please enter an email"],
        unique:true,
        validate:[validator.isEmail,"Please enter valid email"]
    },
    password:{
        type:String,
        required:[true,"Please enter a password"],
        minlength:[6,"Password must be at least 6 characters"],
        select:false //It means that when a user is selected the password is not be sent.
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:'user'
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    resetPasswordToken:String,
    resetPasswordExpires:Date

})

// Encrypt password before saving

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){//this means if password is not changed then proceed next(save)
        next()
    }
    this.password = await bcrypt.hash(this.password,10);  //else if password is changed then hash it
})
//implement JWT

userSchema.methods.createWebToken = function(){
    return jwt.sign({id: this._id} , process.env.MY_TOKEN,{
        expiresIn: process.env.MY_TOKEN_EXPIRESDATE
    });
}

// compare password function

userSchema.methods.comparePassword =async function(entrypass){
    return await bcrypt.compare(entrypass,this.password);
}

// reset password token
userSchema.methods.forgetPasswordToken = function(){
    // creating token
    const resetToken = crypto.randomBytes(20).toString('hex');
    // hashing token or encrypting and save in database
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.resetPasswordExpires = Date.now() + 30*60*1000;

    return resetToken;
}

module.exports = mongoose.model("User",userSchema)