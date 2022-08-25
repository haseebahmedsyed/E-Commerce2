const Product = require('../../models/Product')
const ErrorHandler = require('../../error_handling/Error-Handler')
const AsyncErrorHandler = require('../../error_handling/asyncError-Middleware');
const searchProductKaro = require('../../utils/search-prod')

const createProduct =AsyncErrorHandler(async(req,res,next)=>{
        req.body.user = req.user.id;//adding user property
        const createdProducts = await Product.create(req.body);
        res.status(201).json({success:true,product:createdProducts}) 

})

const getProduct = AsyncErrorHandler(async(req,res,next)=>{
    const proooducts = await Product.find()
    res.status(200).json({success:true,products:proooducts})
})

const searchProduct = AsyncErrorHandler(async(req,res,next)=>{
    const resPerPage = 8;
    const productCount = await Product.countDocuments();//count number of entities in product scehma
    // const proooducts = await (new searchProductKaro(Product.find(),req.query).search().filter().pagination(resPerPage)).query;
    const apiFeature = new searchProductKaro(Product.find(),req.query).search().filter().pagination(resPerPage);
    // const apiFeature = new searchProductKaro(Product.find(),req.query).search();
    let proooducts = await apiFeature.query;
    // let filteredProductCount = proooducts.length;
    // apiFeature.pagination(resPerPage);
    // proooducts = await apiFeature.query;

    res.status(200).json({success:true, productsCount : productCount , count : proooducts.length, products:proooducts,
        resPerPage:resPerPage})
        
        // return next(new ErrorHandler("Resource not found",400));
})

const getSingleProduct = AsyncErrorHandler(async(req,res,next)=>{
    try{
        const singleProduct = await Product.findById(req.params.id);
        if(!singleProduct){
            return next(new ErrorHandler("Resource not found",400));
        }
        res.status(200).json({success:true,product:singleProduct})

    }catch(err){
        console.log(err);
    }
})

const updateProduct=AsyncErrorHandler(async(req,res,next)=>{
    try{
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!updateProduct){
            return next(new ErrorHandler("Resource not found",400));
        }
        res.status(200).json({success:true,product:updatedProduct})

    }catch(err){
        console.log(err);
    }

})

const deleteProduct=AsyncErrorHandler(async(req,res,next)=>{
    try{
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if(!deleted){
            return next(new ErrorHandler("Resource not found",400));
        }
        res.status(200).json({success:true,product:deleted})
    }catch(err){
        console.log(err);
    }
})


const placeReview=AsyncErrorHandler(async (req, res, next) => {
    const {rating,comment,productId} = req.body;

    const review={
        user: req.user.id,
        name:req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId);
    const isReview = product.reviews.find(rev=>rev.user.toString()===req.user.id.toString());


    if(isReview) {

        product.reviews.forEach(rev=>{
            if(rev.user.toString()===req.user.id.toString()){
                rev.comment=comment;
                rev.rating=rating;
            }
        })

    }else{
        product.reviews.push(review);
        product.numOfReviews=product.reviews.length;
    }
    product.ratings = product.reviews.reduce((total,item)=>total+item.rating,0)/product.reviews.length;

    product.save({validateBeforeSave: true})

    res.status(200).json({
        success: true
    })
})

const getAllReviews =AsyncErrorHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    const review = product.reviews;

    res.status(200).json({
        success: true,
        review
    })
})
 
const deleteReview = AsyncErrorHandler(async(req,res,next)=>{
    const product = await Product.findById(req.query.productId);

    const reviews = product.reviews.filter((rev)=>{
        rev.id.toString()!==req.query.id.toString()
    })

    console.log(reviews);

    const numOfReviews = reviews.length;

    const ratings = product.reviews.reduce((total,rev)=>total+rev.rating,0)/reviews.length;

    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        numOfReviews,
        ratings
    },{
        new:true
    })

    console.log(product.reviews);

    res.status(200).json({
        success: true
    })
})

module.exports = {createProduct,getProduct,getSingleProduct,updateProduct,deleteProduct,searchProduct,placeReview,getAllReviews,deleteReview}