const express = require('express');
const router = express.Router();
const helloController = require('../controllers/helloController');
const usersRoutes = require('./users');

router.get('/', helloController.getHello);
router.use('/users', usersRoutes);

module.exports = router;
