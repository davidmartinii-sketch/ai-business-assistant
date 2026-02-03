const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateRequest } = require('../middleware/validation');
const { createUserSchema } = require('../validators/userValidator');

router.post('/', validateRequest(createUserSchema), userController.createUser);
router.get('/', userController.getUsers);

module.exports = router;
