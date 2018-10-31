import config from 'config';

import Server from 'Server';

class ServerFactory {
  create(userController, logger) {
    if (!config.has('server.port')) {
      throw new Error('Missing server configuration');
    }
    const port = config.get('server.port');
    return new Server(port, userController, logger);
  }
}

export default ServerFactory;
