const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const ResponseModels = require('../models/responseModels');
require('dotenv').config();
const passport = require('passport');

exports.register = async (req, res) => {
    const { nom, prenom, email, mot_de_passe, telephone, region, role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(ResponseModels.CONFLICT.status).send(ResponseModels.CONFLICT);

        user = new User({
            nom,
            prenom,
            email,
            mot_de_passe,
            telephone,
            region,
            role: role || 'user',
        });

        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(ResponseModels.SUCCESS.status).send({ ...ResponseModels.SUCCESS, token });
    } catch (err) {
        res.status(ResponseModels.INTERNAL_SERVER_ERROR.status).send(ResponseModels.INTERNAL_SERVER_ERROR);
    }
};

exports.login = async (req, res) => {
    const { email, mot_de_passe } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !user.comparePassword(mot_de_passe)) {
            return res.status(ResponseModels.UNAUTHORIZED.status).send(ResponseModels.UNAUTHORIZED);
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(ResponseModels.SUCCESS.status).send({ ...ResponseModels.SUCCESS, token });
    } catch (err) {
        res.status(ResponseModels.INTERNAL_SERVER_ERROR.status).send(ResponseModels.INTERNAL_SERVER_ERROR);
    }
};

// Authentification avec Google OAuth
exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

// Callback de Google OAuth
exports.googleAuthCallback = (req, res, next) => {
    passport.authenticate('google', { failureRedirect: '/login' }, (err, user) => {
        if (err) {
            return res.status(ResponseModels.INTERNAL_SERVER_ERROR.status).send(ResponseModels.INTERNAL_SERVER_ERROR);
        }
        if (!user) {
            return res.status(ResponseModels.UNAUTHORIZED.status).send(ResponseModels.UNAUTHORIZED);
        }

        // Créer un token JWT
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        // Redirection ou réponse après authentification réussie
        res.redirect(`/profile?token=${token}`); // Remplacez par l'URL souhaitée après l'authentification réussie
    })(req, res, next);
};
