class NoneMailService {
  constructor(logger) {
    this.logger = logger;
  }

  async sendHtml(from, to, subject, body) {
    this.logger.verbose(
      `e-mail sent from: ${from},
      e-mail sent to: ${to},
      e-mail subject: ${subject},
      e-mail body: ${body}`,
    );
  }
}

export default NoneMailService;
