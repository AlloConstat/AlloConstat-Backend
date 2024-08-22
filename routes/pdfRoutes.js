const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const { verifyToken, isAdmin, isSuperAdmin } = require('../middleware/authMiddleware');

router.post('/generate',[verifyToken, isAdmin] , pdfController.createConstat);



module.exports = router;
