import SettingsFactory from 'SettingsFactory';
import LoggerFactory from 'LoggerFactory';
import UserStoreFactory from 'data/UserStoreFactory';
import CreateUser from 'interactors/CreateUser';
import UserController from 'controllers/UserController';
import Server from 'Server';

async function main() {
  try {
    const settings = new SettingsFactory().create();
    const logger = new LoggerFactory().create(settings);
    const userStore = await (new UserStoreFactory()).create(settings);
    const createUser = new CreateUser(userStore);
    const userController = new UserController(createUser);
    const server = new Server(settings.server.port, userController, logger);

    await server.start();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error.message);
    process.exit(1);
  }
}

main();
