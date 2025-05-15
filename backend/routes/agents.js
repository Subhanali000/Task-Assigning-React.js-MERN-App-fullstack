const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');
router.get('/all', auth, async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent' }).select('name email mobile role joinedAt');

    res.json(agents);
  } catch (err) {
    console.error('Error fetching agents:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});
// Add Agent
router.post('/add', auth, async (req, res) => {
  let { name, email, mobile, password } = req.body;
  const username = email.split('@')[0]; // define username only once

  console.log('Received body:', req.body);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAgent = new User({
      name,
      username, //  pass it in
      email,
      mobile,
      password: hashedPassword,
      joinedAt: new Date(),
      role: 'agent',
    });

    await newAgent.save();
    res.json({ message: 'Agent added successfully' });
  } catch (err) {
    console.error(' Error saving agent:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

module.exports = router;
