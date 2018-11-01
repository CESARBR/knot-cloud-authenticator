import config from 'config';

import UserStoreFactory from 'data/UserStoreFactory';
import MailServiceFactory from 'network/MailServiceFactory';
import CreateUser from 'interactors/CreateUser';
import ForgotPassword from 'interactors/ForgotPassword';
import UserController from 'controllers/UserController';
import Server from 'Server';

async function main() {
  try {
    const meshbluConfig = config.get('meshblu');
    const authenticatorConfig = config.get('authenticator');
    const mailgunConfig = config.get('mailgun');
    const serverConfig = config.get('server');

    const userStoreFactory = new UserStoreFactory();
    const userStore = await userStoreFactory.create(meshbluConfig, authenticatorConfig);
    const mailServiceFactory = new MailServiceFactory();
    const mailService = mailServiceFactory.create(mailgunConfig);
    const createUser = new CreateUser(userStore);
    const forgotPassword = new ForgotPassword(userStore, mailService, serverConfig.resetUri);
    const userController = new UserController(createUser, forgotPassword);
    const server = new Server(userController);

    await server.start(serverConfig.port);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

main();
