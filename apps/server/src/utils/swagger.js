import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Book Store API',
      version: '1.0.0',
      description: 'API documentation for Book Store e-commerce application',
    },
    servers: [
      {
        url: '/api/v1',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'jwt',
        },
      },
    },
  },
  apis: ['./apps/server/src/routes/*.js'],
};

const specs = swaggerJsDoc(options);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
