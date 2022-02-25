const router = require('express').Router();
const { signupAuth, loginAuth, verifyAuth, logoutProcess } = require('../controllers/auth.controller');
const { isAuthenticated } = require('../middleware/jwt.middleware');

// Signup
router.post("/signup", signupAuth);

// Login
router.post("/login", loginAuth);

// Verify
router.get('/verify', isAuthenticated, verifyAuth);

// Logout
router.post("/logout", logoutProcess);

module.exports = router;