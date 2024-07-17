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

const isAdmin = async (req, res, next) => {
    try {
        
        if (req.userRole !== 'admin') return res.status(ResponseModels.FORBIDDEN.status).send(ResponseModels.FORBIDDEN);
        next();
    } catch (error) {
        res.status(ResponseModels.INTERNAL_SERVER_ERROR.status).send(ResponseModels.INTERNAL_SERVER_ERROR);
    }
};


const isSuperAdmin = async (req, res, next) => {
    try {
        
        if (req.userRole !== 'superAdmin') return res.status(ResponseModels.FORBIDDEN.status).send(ResponseModels.FORBIDDEN);
        next();
    } catch (error) {
        res.status(ResponseModels.INTERNAL_SERVER_ERROR.status).send(ResponseModels.INTERNAL_SERVER_ERROR);
    }
};

module.exports = { verifyToken, isAdmin };
