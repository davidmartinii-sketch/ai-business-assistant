const express = require('express');

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get API greeting
 *     description: Returns a simple greeting message
 *     tags:
 *       - General
 *     responses:
 *       200:
 *         description: Greeting message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hello World"
 */

const router = express.Router();
const helloController = require('../controllers/helloController');
const usersRoutes = require('./users');

router.get('/', helloController.getHello);
router.use('/users', usersRoutes);

module.exports = router;
