const express = require('express');
const { Router } = require('react-router-dom/cjs/react-router-dom');
const router = express.Router();
const {authorize,authorizeRole} = require('../../middleware/authorization-middleware');

const {createUser,loginUser,logoutUser,forgotPassword,resetPassword,findMe,updatePassword,updateMe,getAllUsers,getAllUser,updateUser,removeUser} = require('./user_controller')

router.post('/register',createUser)
router.post('/login',loginUser)
router.post('/logout',logoutUser)
router.post('/password/forget',forgotPassword)
router.post('/password/reset/:token',resetPassword)
router.get('/me',authorize,findMe)
router.put('/pass/update',authorize,updatePassword);
router.put('/me/update',authorize,updateMe)
router.get('/admin/alluser',authorize,authorizeRole('admin'),getAllUsers)
router.get('/admin/getuser/:id',authorize,authorizeRole('admin'),getAllUser)
router.put('/admin/adminupdateuser/:id',authorize,authorizeRole('admin'),updateUser)
router.delete('/admin/adminremoveuser/:id',authorize,authorizeRole('admin'),removeUser)


module.exports = router;