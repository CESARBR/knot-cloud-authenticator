import Mailgun from 'mailgun-js';
import AWS from 'aws-sdk';

import MailgunMailService from 'network/MailgunMailService';
import SESMailService from 'network/SESMailService';

class MailServiceFactory {
  create(settings, logger) {
    let mailService;

    logger.info(`Using ${settings.mailService} mail service`);
    switch (settings.mailService) {
      case 'MAILGUN': {
        const mailgun = new Mailgun(settings.mailgun);
        mailService = new MailgunMailService(mailgun);
        break;
      }
      case 'AWS-SES': {
        const ses = new AWS.SES({ apiVersion: '2010-12-01' });
        mailService = new SESMailService(ses);
        break;
      }
      default:
        throw Error('Unknown mail service');
    }

    return mailService;
  }
}

export default MailServiceFactory;
