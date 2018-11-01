import config from 'config';

import Settings from 'Settings';

class SettingsFactory {
  create() {
    const server = this.loadServerSettings();
    const meshblu = this.loadMeshbluSettings();
    const authenticator = this.loadAuthenticatorSettings();
    const mailgun = this.loadMailgunSettings();
    const logger = this.loadLoggerSettings();
    return new Settings(server, meshblu, authenticator, mailgun, logger);
  }

  loadServerSettings() {
    if (!config.get('server')) {
      throw new Error('Missing server settings');
    }
    const server = config.get('server');
    if (!server.port
      || !server.resetUri) {
      throw new Error('Missing server settings');
    }
    return server;
  }

  loadMeshbluSettings() {
    if (!config.has('meshblu')) {
      throw new Error('Missing Meshblu settings');
    }
    const meshblu = config.get('meshblu');
    if (!meshblu.protocol
      || !meshblu.host
      || !meshblu.port) {
      throw new Error('Missing Meshblu settings');
    }
    return meshblu;
  }

  loadAuthenticatorSettings() {
    if (!config.has('authenticator')) {
      throw new Error('Missing authenticator settings');
    }
    const authenticator = config.get('authenticator');
    if (!authenticator.uuid
      || !authenticator.token) {
      throw new Error('Missing authenticator settings');
    }
    return authenticator;
  }

  loadMailgunSettings() {
    if (!config.has('mailgun')) {
      throw new Error('Missing Mailgun settings');
    }
    const mailgun = config.get('mailgun');
    if (!mailgun.apiKey
      || !mailgun.domain) {
      throw new Error('Missing Mailgun settings');
    }
    return mailgun;
  }

  loadLoggerSettings() {
    if (!config.has('logger')) {
      throw new Error('Missing logger settings');
    }
    const logger = config.get('logger');
    if (!logger.level) {
      throw new Error('Missing logger settings');
    }
    return logger;
  }
}

export default SettingsFactory;
