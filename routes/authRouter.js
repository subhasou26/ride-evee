const express = require('express');
const { signup, login, sendOtp, verifyOtp } = require('../controller/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/otp/send', sendOtp);
router.post('/otp/verify', verifyOtp);

module.exports = router;
