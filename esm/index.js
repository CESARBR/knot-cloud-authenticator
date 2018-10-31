import LoggerFactory from 'LoggerFactory';
import UserStoreFactory from 'data/UserStoreFactory';
import CreateUser from 'interactors/CreateUser';
import UserController from 'controllers/UserController';
import ServerFactory from 'ServerFactory';

async function main() {
  let logger;
  try {
    const loggerFactory = new LoggerFactory();
    logger = loggerFactory.create();
    const userStoreFactory = new UserStoreFactory();
    const userStore = await userStoreFactory.create();
    const createUser = new CreateUser(userStore);
    const userController = new UserController(createUser);
    const serverFactory = new ServerFactory();
    const server = serverFactory.create(userController, logger);
    await server.start();
  } catch (error) {
    const message = `Failed to start the server: ${error.message}`;
    if (logger) {
      logger.error(message);
    } else {
      // Failed before creating the logger, log to console directly
      // eslint-disable-next-line no-console
      console.error(message);
    }
    process.exit(1);
  }
}

main();
