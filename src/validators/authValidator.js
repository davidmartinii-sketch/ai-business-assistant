const joi = require('joi');

const registerSchema = joi.object({
  name: joi.string().min(2).max(100).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
  }),
  email: joi.string().email().required().messages({
    'string.email': 'Email must be valid',
  }),
  password: joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
  }),
});

const loginSchema = joi.object({
  email: joi.string().email().required().messages({
    'string.email': 'Email must be valid',
  }),
  password: joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
