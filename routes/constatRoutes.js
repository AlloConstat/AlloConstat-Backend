const express = require("express");
const router = express.Router();
const constatController = require("../controllers/constatController");
const { verifyToken } = require("../middleware/authMiddleware");

// Route pour  les constats de bateaux
router.get("/boats", constatController.getBoatConstats);
router.get("/boats/:id", constatController.getBoatConstatById);
router.put("/boats/:id", constatController.updateBoatConstatById);
router.get("/boats/duplicata/:id", constatController.getBoatConstatDuplicata);

// Route pour les constats de voitures
router.get("/cars", constatController.getCarConstats);
router.get("/cars/:id", constatController.getCarConstatById);
router.put("/cars/:id", constatController.updateCarConstatById);

// Route delete
router.delete("/:id", constatController.deleteConstatById);
router.get("/:region", constatController.getConstatByRegion);

module.exports = router;
