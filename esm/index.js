import SettingsFactory from 'SettingsFactory';
import LoggerFactory from 'LoggerFactory';
import UserStoreFactory from 'data/UserStoreFactory';
import MailServiceFactory from 'network/MailServiceFactory';
import CreateUser from 'interactors/CreateUser';
import ForgotPassword from 'interactors/ForgotPassword';
import UserController from 'controllers/UserController';
import Server from 'Server';

async function main() {
  try {
    const settings = new SettingsFactory().create();
    const loggerFactory = new LoggerFactory();
    const userStore = await (new UserStoreFactory()).create(settings);
    const mailService = (new MailServiceFactory()).create(settings);
    const createUser = new CreateUser(userStore);
    const forgotPassword = new ForgotPassword(
      userStore,
      mailService,
      settings.server.resetUri,
      loggerFactory.create(settings, 'ForgotPassword'),
    );
    const userController = new UserController(
      createUser,
      forgotPassword,
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
