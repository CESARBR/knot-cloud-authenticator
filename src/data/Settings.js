class Settings {
  constructor(server, meshblu, authenticator, mailService, mailgun, logger) {
    this.server = server;
    this.meshblu = meshblu;
    this.authenticator = authenticator;
    this.mailService = mailService;
    this.mailgun = mailgun;
    this.logger = logger;
  }
}

export default Settings;
