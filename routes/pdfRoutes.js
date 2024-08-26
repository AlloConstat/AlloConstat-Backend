const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const { verifyToken, isAdmin, isSuperAdmin } = require('../middleware/authMiddleware');

router.post('/generate' , pdfController.createConstat);



module.exports = router;
