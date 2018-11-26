import Mailgun from 'mailgun-js';

import MailService from 'network/MailService';

class MailServiceFactory {
  create(settings) {
    const mailgun = new Mailgun(settings.mailgun);
    return new MailService(mailgun);
  }
}

export default MailServiceFactory;
