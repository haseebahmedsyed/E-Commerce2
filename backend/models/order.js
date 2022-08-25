const mongoose = require('mongoose');
const {Schema} = mongoose;

const orderSchema = new Schema({
    shippingInfo:{
        address:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        phone:{
            type:String,
            required:true
        },
        postalcode:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true
        }
    },
    user:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:"User"
    },
    orderItems:[
        {
            name:{
                type:String,
                required:true
            },
            quantity:{
                type:String,
                required:true
            },
            price:{
                type:String,
                required:true
            },
            image:{
                type:String,
                required:true
            },
            product:{
                type:mongoose.Schema.ObjectId,
                required:true,
                ref:"Product"
            }

        }

    ],
    paymentInfo:{
        id:{ //id of stripe payment
            type:String
        },
        status:{
            type:String
        }

    },
    paidAt:{
        type:Date
    },
    itemPrice:{
        type:Number,
        required:true,
        default:0.0
    },
    taxPrice:{
        type:Number,
        required:true,
        default:0.0
    },
    shippingPrice:{
        type:Number,
        required:true,
        default:0.0 
    },
    totalPrice:{
        type:Number,
        required:true,
        default:0.0
    },
    orderStatus:{
        type:String,
        required:true,
        default:"processing"
    },
    derliveredAt:{
        type:Date
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("Order", orderSchema);