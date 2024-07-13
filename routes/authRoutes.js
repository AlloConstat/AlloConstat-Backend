const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');


// Routes d'authentification
router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    authController.googleAuthCallback);

module.exports = router;
