const express = require('express');
const {authorize,authorizeRole} = require('../../middleware/authorization-middleware');

const router = express.Router();

const {createOrder,getsingleOrder,getAllProducts,myOrder,updateOrder,deleteOrder} = require('./order_controller')

router.post('/order/create',authorize,createOrder)
router.get('/order/me',authorize,getsingleOrder)
router.get('/order/me',authorize,myOrder)
router.get('/order/getall',authorize,authorizeRole('admin'),getAllProducts)
router.put('/order/update/:id',authorize,authorizeRole('admin'),updateOrder)
router.delete('/order/delete/:id',authorize,authorizeRole('admin'),deleteOrder) 

module.exports = router;