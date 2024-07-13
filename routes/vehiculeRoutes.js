const express = require('express');
const router = express.Router();
const vehiculeController = require('../controllers/vehiculeController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', [verifyToken, isAdmin], vehiculeController.getAllVehicules);
router.get('/:id',  vehiculeController.getVehiculeById);

module.exports = router;
