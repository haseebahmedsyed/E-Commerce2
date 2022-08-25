const express = require('express');
const { Router } = require('react-router-dom/cjs/react-router-dom');
const router = express.Router();
const {authorize,authorizeRole} = require('../../middleware/authorization-middleware');

const {getProduct,createProduct,getSingleProduct,updateProduct,deleteProduct,searchProduct,placeReview,getAllReviews,deleteReview} = require('./product_controller')

router.get('/product',authorize,authorizeRole('admin'),getProduct)
router.get('/single/:id',getSingleProduct)
router.get('/search',searchProduct)
router.post('/admin/product/new',authorize,authorizeRole('admin'),createProduct)
router.put('/admin/update/:id',authorize,authorizeRole('admin'),updateProduct)
router.delete('/admin/del/:id',authorize,authorizeRole('admin'),deleteProduct)
router.post('/review/add',authorize,placeReview)
router.get('/review/getAll/:id',authorize,getAllReviews)
router.delete('/review/delete',authorize,deleteReview)

module.exports = router;