const express = require('express')
const app = express();
const fileupload = require('express-fileupload')
var cors = require('cors');
const corsOptions ={
    // origin:'*', 
    origin:true, 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }


 
 const cookieParser = require('cookie-parser');
 const bodyparser = require('body-parser');
 
 const product_router = require('./apis/productApis/product_router');
 const user_router = require('./apis/userApis/user_router')
 const order_router = require('./apis/orderApis/order_router')
 app.use(express.json())
 app.use(cookieParser());
 app.use(bodyparser.urlencoded({extended:true}));
// app.use(cors())
app.use(fileupload())
 app.use(cors(corsOptions))



app.use('/api/v1',product_router);
app.use('/api/v1',user_router);
app.use('/api/v1',order_router)

const errorMiddleware = require('./error_handling/error-middleware')
app.use(errorMiddleware)


module.exports = app