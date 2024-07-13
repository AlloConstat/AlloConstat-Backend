const express = require('express');
const router = express.Router();
const constatController = require('../controllers/constatController');

router.post('/', constatController.createConstat);
router.get('/', constatController.getAllConstats);
router.get('/:id', constatController.getConstatById);
router.put('/:id', constatController.updateConstat);
router.delete('/:id', constatController.deleteConstat);

module.exports = router;
