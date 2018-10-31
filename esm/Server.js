import hapi from 'hapi';
import Joi from 'joi';

class Server {
  constructor(userController) {
    this.userController = userController;
  }

  async start(port) {
    const server = hapi.server({
      port,
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
    await server.start();
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
              email: Joi.string().email(),
              password: Joi.string(),
            }),
          },
        },
      },
    ];
  }
}

export default Server;
