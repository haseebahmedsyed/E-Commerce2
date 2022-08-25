const Order = require('../../models/order')
const Product = require('../../models/Product')
const ErrorHandler = require('../../error_handling/Error-Handler')
const AsyncErrorHandler = require('../../error_handling/asyncError-Middleware');

const createOrder =AsyncErrorHandler(async(req,res,next)=>{
    const{
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    }=req.body

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt:Date.now(),
        user:req.user.id
    })

    res.status(200).json({
        success: true,
        order
    })

})

const getsingleOrder=AsyncErrorHandler(async(req, res, next)=>{

    try {
        const order =await Order.findById(req.params.id).populate("user","name email");
    
        if(!order){
            return new ErrorHandler("No product exists",404)
        }
        else{
            console.log("pk");
            res.status(200).json({
                success: true,
                order
            })
        }
        
    } catch (error) {
     
        return new ErrorHandler(error.message,500);
    }


})

const getAllProducts = AsyncErrorHandler(async(req, res, next)=>{
    try {
        const order = await Order.find();

        let alltotalPrice = 0;

        order.forEach(element=>{
            alltotalPrice += element.totalPrice;
        })

        res.status(200).json({
            success: true,
            alltotalPrice,
            order
        })
    } catch (error) {
        return new ErrorHandler(error.message,500)
    }
})

const myOrder = AsyncErrorHandler(async(req, res, next)=>{
    let orders = await Order.find({user : req.user.id});

    res.status(200).json({
        success: true,
        orders
    })
})

const updateOrder= AsyncErrorHandler(async(req, res, next)=>{
    const order = await Order.findById(req.params.id);

    if(order.orderStatus==='Delivered'){
        return next(new ErrorHandler('You have already delivered this order',400));
    }

    order.orderItems.forEach(async item=>{
        await updateStock(item.product , item.quantity);
    })

    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now();

    order.save();

    res.status(200).json({
        success: true,
        order
    })
})

const updateStock =async(id, quantity) =>{
    const product = await Product.findById(id);

    product.stock -=quantity;

    await product.save({validateBeforeSave :false});
}

const deleteOrder = AsyncErrorHandler(async(req, res, next)=>{
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler('Order not found',404));
    }

    order.remove();

    res.status(200).json({
        success: true,
        message: 'Order deleted successfully'
    })
})

module.exports = {createOrder,getsingleOrder,getAllProducts,myOrder,updateOrder,deleteOrder}