const User = require('../models/User');
const { generateToken } = require('../utils/helpers');
const crypto = require('crypto');

// UC-08: Register
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered.' });

    const user = await User.create({ name, email, password, phone, role: 'customer' });
    const token = generateToken(user._id);
    res.status(201).json({ message: 'Registration successful.', token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UC-09: Register with Google Auth
const registerWithGoogle = async (req, res) => {
  try {
    const { name, email, googleId, avatar } = req.body;
    if (!name || !email || !googleId) {
      return res.status(400).json({ message: 'Name, email and googleId are required.' });
    }
    let user = await User.findOne({ email });
    if (user) {
      if (!user.isGoogleAuth) return res.status(409).json({ message: 'Email already registered with password.' });
    } else {
      user = await User.create({ name, email, googleId, avatar, isGoogleAuth: true, role: 'customer' });
    }
    const token = generateToken(user._id);
    res.status(201).json({ message: 'Google registration successful.', token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UC-16: Login (Customer / Manager / Admin)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

    const user = await User.findOne({ email });
    if (!user || !user.password) return res.status(401).json({ message: 'Invalid credentials.' });
    if (!user.isActive) return res.status(403).json({ message: 'Account is deactivated.' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

    const token = generateToken(user._id);
    res.json({ message: 'Login successful.', token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UC-14: Google Login
const loginWithGoogle = async (req, res) => {
  try {
    const { email, googleId, name, avatar } = req.body;
    if (!email || !googleId) return res.status(400).json({ message: 'Email and googleId are required.' });

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, googleId, avatar, isGoogleAuth: true, role: 'customer' });
    } else if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated.' });
    }
    const token = generateToken(user._id);
    res.json({ message: 'Google login successful.', token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UC-22: Logout (client-side token removal; server-side confirmation)
const logout = (req, res) => {
  res.json({ message: 'Logged out successfully.' });
};

// UC-23: Change Password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required.' });
    }
    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect.' });

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UC-30: Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account with that email.' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 mins
    await user.save();

    // In production: send email with token link
    res.json({ message: 'Password reset token generated.', resetToken: token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, registerWithGoogle, login, loginWithGoogle, logout, changePassword, forgotPassword };
