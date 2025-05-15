// backend/seedAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const uniqueUsername=("suraj")
async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await User.findOne({ email: 'admin@example.com' });
    if (existing) {
      console.log('Admin already exists');
      return process.exit();
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const newUser = new User({
      username: uniqueUsername,
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });

    await newUser.save();
    console.log('✅ Admin user created successfully');
    process.exit();
  } catch (err) {
    console.error('❌ Error creating admin:', err);
    process.exit(1);
  }
}

seedAdmin();
