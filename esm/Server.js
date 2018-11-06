import hapi from 'hapi';
import good from 'good';
import goodWinston from 'hapi-good-winston';
import Joi from 'joi';

class Server {
  constructor(port, userController, logger) {
    this.port = port;
    this.userController = userController;
    this.logger = logger;
  }

  async start() {
    const server = hapi.server({
      port: this.port,
      router: {
        stripTrailingSlash: true,
        isCaseSensitive: false,
      },
      routes: {
        cors: true,
      },
    });

    const routes = this.createRoutes();
    server.route(routes);

    const options = {
      ops: false,
      reporters: {
        winston: [goodWinston(this.logger)],
      },
    };
    await server.register({
      plugin: good,
      options,
    });

    await server.start();
    this.logger.info(`Listening on ${this.port}`);
  }

  createRoutes() {
    return [
      {
        method: 'POST',
        path: '/users',
        handler: this.userController.create.bind(this.userController),
        options: {
          validate: {
            payload: Joi.object({
              email: Joi.string().email().required(),
              password: Joi.string().required(),
            }),
          },
        },
      },
      {
        method: 'POST',
        path: '/forgot',
        handler: this.userController.forgot.bind(this.userController),
        options: {
          validate: {
            payload: Joi.object({
              email: Joi.string().email().required(),
            }),
          },
        },
      },
      {
        method: 'POST',
        path: '/reset',
        handler: this.userController.reset.bind(this.userController),
        options: {
          validate: {
            payload: Joi.object({
              email: Joi.string().email().required(),
              token: Joi.string().required(),
              password: Joi.string().required(),
            }),
          },
        },
      },
    ];
  }
}

export default Server;
