const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
  verifyToken,
  isAdmin,
  isSuperAdmin,
} = require("../middleware/authMiddleware");

router.get("/", [verifyToken], userController.getAllUsers);
router.get("/:id", [verifyToken], userController.getUserById);
router.put("/:id", [verifyToken], userController.updateUser);
router.delete("/:id", [verifyToken], userController.deleteUser);
router.get("/region/:region", [verifyToken], userController.getUserByRegion); // Nouvelle route

module.exports = router;
