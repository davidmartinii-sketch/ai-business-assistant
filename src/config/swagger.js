const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Business Assistant API',
      version: '0.1.0',
      description:
        'A production-ready Express.js API with validation, security, and error handling.',
      contact: {
        name: 'API Support',
        url: 'https://github.com/davidmartinii-sketch/ai-business-assistant',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.example.com',
        description: 'Production server',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
