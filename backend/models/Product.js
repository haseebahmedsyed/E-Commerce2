const mongoose = require('mongoose')
const {Schema} = mongoose;

const products = new Schema({

    name:{
        type:String,
        required:[true,"Please enter product name"],
        trim:true,
        maxlength :[100,"Name should be 100 characters"]
    },
    price:{
        type:String,
        required:[true,"Please enter price"],
        maxlength:[5,"Price should be 5 digits"],
        default:0.0
    },
    description:{
        type:String,
        required:[true,"Please enter the description"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:[true,"Please select cateogry for this product"],
        enum:{
            values:[
                'Electronics',
                'Cameras',
                'Laptops',
                'Accessories',
                'Headphones',
                'Food',
                'Books',
                'Clothes/Shoes',
                'Beaty/Health',
                'Sports',
                'Outdoor',
                'Home'
            ],
            message : "Please select correct category for products"
        }
    },
    seller:{
        type:String,
        required:[true,"Please enter product seller"]
    },
    stock:{
        type:Number,
        required:[true,'Please enter product stock'],
        maxlength:[5,"Productname shouldn't exceed 5 characters"],
        default:0
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:'User',
                required:true
        
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }

        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    }
    // user:{
    //     type:mongoose.Schema.ObjectId,
    //     ref:'User',
    //     required:true

    // }

})

module.exports = mongoose.model('product',products);