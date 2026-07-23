const {Router}=require('express');
const authController=require('../controllers/auth.controller');
const router=Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
router.post('/register',authController.registerUser);
router.post('/login',authController.loginUser)
module.exports=router;