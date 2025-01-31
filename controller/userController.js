const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select('-password');
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

  exports.getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
 
  exports.updateUser = async (req, res) => {
    try {
      const { name, phone, role } = req.body;
      const user = await User.findById(req.params.id);
  
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      if (req.user.id !== user.id && req.user.role !== 'admin')
        return res.status(403).json({ message: 'Unauthorized' });
  
      user.name = name || user.name;
      user.phone = phone || user.phone;
      user.role = role || user.role;
      await user.save();
  
      res.json({ message: 'User updated successfully', user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  
  exports.deleteUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
  
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      if (req.user.role !== 'admin') return res.status(403).json({ message: 'Unauthorized' });
  
      await user.deleteOne();
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };