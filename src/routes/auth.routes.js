const {Router}=require('express');
const authController=require('../controllers/auth.controller');
const authMiddleware=require('../middlewares/auth.middleware')
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

/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access Private
 */
router.get('/get-me',authMiddleware,authController.getMe);
module.exports=router;