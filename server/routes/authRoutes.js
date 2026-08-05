const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

//Register a new user
router.post('/register', authController.registerUser);

//Login an existing user
router.post('/login', authController.loginUser);

//Verify OTP
router.post('/verify-otp', authController.verifyOtp);

module.exports = router;