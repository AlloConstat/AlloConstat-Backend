const express = require('express');
const router = express.Router();
const constatController = require('../controllers/constatController');
const pdfController = require('../controllers/pdfController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/generate',  pdfController.createConstat);



module.exports = router;
