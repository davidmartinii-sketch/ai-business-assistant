const joi = require('joi');

const createUserSchema = joi.object({
  name: joi.string().min(2).max(100).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must not exceed 100 characters',
  }),
  email: joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
  }),
  age: joi.number().integer().min(0).max(150).optional().messages({
    'number.min': 'Age must be at least 0',
    'number.max': 'Age must not exceed 150',
  }),
});

module.exports = {
  createUserSchema,
};
