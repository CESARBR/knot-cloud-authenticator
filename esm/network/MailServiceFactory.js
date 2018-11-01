import Mailgun from 'mailgun-js';

import MailService from 'network/MailService';

class MailServiceFactory {
  create(mailgunConfig) {
    const mailgun = new Mailgun(mailgunConfig);
    return new MailService(mailgun);
  }
}

export default MailServiceFactory;
