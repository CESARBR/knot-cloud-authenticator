import LoggerFactory from 'LoggerFactory';
import SettingsFactory from 'data/SettingsFactory';
import UserStoreFactory from 'data/UserStoreFactory';
import RouterStoreFactory from 'data/RouterStoreFactory';
import MailServiceFactory from 'network/MailServiceFactory';
import CreateUser from 'interactors/CreateUser';
import ForgotPassword from 'interactors/ForgotPassword';
import ResetPassword from 'interactors/ResetPassword';
import LoginUser from 'interactors/LoginUser';
import UserController from 'controllers/UserController';
import Server from 'Server';

async function main() {
  try {
    // eslint-disable-next-line no-console
    console.log(`Starting '${process.env.NODE_ENV}' configuration`);

    const settings = new SettingsFactory().create();
    const loggerFactory = new LoggerFactory();
    const userStore = await (new UserStoreFactory()).create(settings);
    const routerStore = await (new RouterStoreFactory()).create(settings);
    const mailService = (new MailServiceFactory()).create(
      settings,
      loggerFactory.create(settings, 'MailService'),
    );
    const createUser = new CreateUser(userStore, routerStore);
    const forgotPassword = new ForgotPassword(
      userStore,
      mailService,
      settings.server.resetSenderAddress,
      settings.server.resetUri,
      loggerFactory.create(settings, 'ForgotPassword'),
    );
    const resetPassword = new ResetPassword(userStore);
    const loginUser = new LoginUser(
      userStore,
      loggerFactory.create(settings, 'LoginUser'),
    );

    const userController = new UserController(
      createUser,
      forgotPassword,
      resetPassword,
      loginUser,
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
