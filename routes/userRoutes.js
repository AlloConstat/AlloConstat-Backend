const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin, isSuperAdmin } = require('../middleware/authMiddleware');

router.get('/', [verifyToken, isAdmin ], userController.getAllUsers);
router.get('/:id',[verifyToken, isAdmin ], userController.getUserById);
router.put('/:id',[verifyToken, isAdmin], userController.updateUser);
router.delete('/:id',[verifyToken, isAdmin], userController.deleteUser);
router.get('/region/:region', [verifyToken, isAdmin], userController.getUserByRegion); // Nouvelle route

module.exports = router;
