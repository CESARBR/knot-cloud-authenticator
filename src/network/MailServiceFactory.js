import Mailgun from 'mailgun-js';

import MailgunMailService from 'network/MailgunMailService';

class MailServiceFactory {
  create(settings) {
    const mailgun = new Mailgun(settings.mailgun);
    return new MailgunMailService(mailgun);
  }
}

export default MailServiceFactory;
