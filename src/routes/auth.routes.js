const {Router}=require('express');
const authController=require('../controllers/auth.controller');
const router=Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
router.post('/register',authController.registerUser);

/**
 * @route POST /api/auth/login
 * @description login a existing user
 * @access Public
 */
router.post('/login',authController.loginUser)

/**
 * @route POST /api/auth/logout
 * @description logout a  user
 * @access Public
 */
router.post('/logout',authController.logoutUser);
module.exports=router;