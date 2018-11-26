class Settings {
  constructor(server, meshblu, authenticator, mailgun, logger) {
    this.server = server;
    this.meshblu = meshblu;
    this.authenticator = authenticator;
    this.mailgun = mailgun;
    this.logger = logger;
  }
}

export default Settings;
