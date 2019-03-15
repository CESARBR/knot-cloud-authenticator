import Mailgun from 'mailgun-js';

import MailgunMailService from 'network/MailgunMailService';

class MailServiceFactory {
  create(settings) {
    let mailService;

    switch (settings.mailService) {
      case 'MAILGUN': {
        const mailgun = new Mailgun(settings.mailgun);
        mailService = new MailgunMailService(mailgun);
        break;
      }
      default:
        throw Error('Unknown mail service');
    }

    return mailService;
  }
}

export default MailServiceFactory;
