const User = require('../models/User');

// UC-19: View Profile (Customer)
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UC-20: Update Profile (Customer)
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address, avatar },
      { new: true, runValidators: true }
    ).select('-password');
    res.json({ message: 'Profile updated.', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UC-21: Delete Profile / Deactivate account (Customer)
const deleteProfile = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isActive: false });
    res.json({ message: 'Account deactivated successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UC-31: View Users (Manager / Admin)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(filter).select('-password').skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);
    res.json({ users, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UC-31 CRUD: Get single user (Admin)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CRUD: Create user (Admin)
const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required.' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already exists.' });
    const user = await User.create({ name, email, password, phone, role: role || 'customer' });
    res.status(201).json({ message: 'User created.', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CRUD: Update user (Admin)
const updateUser = async (req, res) => {
  try {
    const { name, phone, address, role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, address, role, isActive },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User updated.', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CRUD: Delete user (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProfile, updateProfile, deleteProfile, getAllUsers, getUserById, createUser, updateUser, deleteUser };
