const jwt = require('jsonwebtoken');
const ResponseModels = require('../models/responseModels');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(ResponseModels.UNAUTHORIZED.status).send(ResponseModels.UNAUTHORIZED);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(ResponseModels.UNAUTHORIZED.status).send(ResponseModels.UNAUTHORIZED);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(ResponseModels.UNAUTHORIZED.status).send(ResponseModels.UNAUTHORIZED);
    }
    next();
};

module.exports = { verifyToken, isAdmin };
