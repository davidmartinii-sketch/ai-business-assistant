const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      convert: true,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        error: { statusCode: 400, message: `Validation error: ${messages}` },
      });
    }

    req.body = value;
    next();
  };
};

module.exports = { validateRequest };
