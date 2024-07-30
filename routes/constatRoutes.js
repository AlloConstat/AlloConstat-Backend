const express = require('express');
const router = express.Router();
const constatController = require('../controllers/constatController');
const { verifyToken } = require('../middleware/authMiddleware');

// Route pour  les constats de bateaux
router.get('/boats', constatController.getBoatConstats);
router.get('/boats/:id', constatController.getBoatConstatById);
router.put('/boats/:id', constatController.updateBoatConstatById);
router.delete('/boats/:id', constatController.deleteBoatConstatByID);


// Route pour les constats de voitures
router.get('/cars', constatController.getCarConstats);
router.get('/cars/:id', constatController.getCarConstatById);
router.put('/cars/:id', constatController.updateCarConstatById);
router.delete('/cars/:id', constatController.deleteCarConstatByID);


module.exports = router;
