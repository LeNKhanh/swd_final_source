const express = require('express');
const router = express.Router();
const { register, registerWithGoogle, login, loginWithGoogle, logout, changePassword, forgotPassword } = require('../controllers/auth.controller');
const authenticate = require('../middleware/auth.middleware');

// UC-08: Guest - Register
router.post('/register', register);

// UC-09: Guest - Register with Google
router.post('/register/google', registerWithGoogle);

// UC-16: All roles - Login
router.post('/login', login);

// UC-14: Customer - Google Login
router.post('/login/google', loginWithGoogle);

// UC-22: Authenticated - Logout
router.post('/logout', authenticate, logout);

// UC-23: Customer - Change Password
router.put('/change-password', authenticate, changePassword);

// UC-30: Guest - Forgot Password
router.post('/forgot-password', forgotPassword);

module.exports = router;
