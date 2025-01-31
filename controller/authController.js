const User = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendOtp = require('../utils/sendOtp');
const Otp=require("../model/otp")

exports.signup = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({
        name,
        email,
        password: await bcrypt.hash(password, 10),
        phone,
      });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendOtp = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });
      await sendOtp(email);
      res.json({ message: 'OTP sent successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      const otpRecord = await Otp.findOne({ email });
  
      if (!otpRecord || otpRecord.otp !== otp || new Date() > otpRecord.expiresAt) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }
  
      await Otp.deleteOne({ email }); 
  
      let user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'User not found' });
  
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };