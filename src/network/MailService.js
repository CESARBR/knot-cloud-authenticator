class MailService {
  constructor(mailgun) {
    this.mailgun = mailgun;
  }

  async sendHtml(from, to, subject, body) {
    return new Promise((resolve, reject) => {
      this.mailgun.messages().send({
        from,
        to,
        subject,
        html: body,
      }, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}

export default MailService;
