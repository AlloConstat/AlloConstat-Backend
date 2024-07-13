const express = require('express');
const router = express.Router();
const constatController = require('../controllers/constatController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/',verifyToken, constatController.createConstat);
router.get('/', verifyToken,constatController.getAllConstats);
router.get('/:id',verifyToken, constatController.getConstatById);
router.put('/:id',verifyToken,  constatController.updateConstat);
router.delete('/:id',verifyToken,  constatController.deleteConstat);

module.exports = router;
