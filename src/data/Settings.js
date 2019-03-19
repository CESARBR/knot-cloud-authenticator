class Settings {
  constructor(server, meshblu, authenticator, mailgun, logger, storage) {
    this.server = server;
    this.meshblu = meshblu;
    this.authenticator = authenticator;
    this.mailgun = mailgun;
    this.logger = logger;
    this.storage = storage;
  }
}

export default Settings;
