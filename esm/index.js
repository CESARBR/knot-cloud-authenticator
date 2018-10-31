import config from 'config';

import UserStoreFactory from 'data/UserStoreFactory';
import CreateUser from 'interactors/CreateUser';
import UserController from 'controllers/UserController';
import Server from 'Server';

async function main() {
  try {
    const meshbluConfig = config.get('meshblu');
    const authenticatorConfig = config.get('authenticator');
    const port = config.get('server.port');

    const userStoreFactory = new UserStoreFactory();
    const userStore = await userStoreFactory.create(meshbluConfig, authenticatorConfig);
    const createUser = new CreateUser(userStore);
    const userController = new UserController(createUser);
    const server = new Server(userController);

    await server.start(port);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

main();
