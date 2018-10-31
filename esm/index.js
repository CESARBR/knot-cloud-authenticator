import LoggerFactory from 'LoggerFactory';
import SettingsFactory from 'data/SettingsFactory';
import UserStoreFactory from 'data/UserStoreFactory';
import CreateUser from 'interactors/CreateUser';
import UserController from 'controllers/UserController';
import Server from 'Server';

async function main() {
  try {
    const settings = new SettingsFactory().create();
    const loggerFactory = new LoggerFactory();
    const userStore = await (new UserStoreFactory()).create(settings);
    const createUser = new CreateUser(userStore);
    const userController = new UserController(
      createUser,
      loggerFactory.create(settings, 'UserController'),
    );
    const server = new Server(
      settings.server.port,
      userController,
      loggerFactory.create(settings, 'Server'),
    );

    await server.start();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error.message);
    process.exit(1);
  }
}

main();
