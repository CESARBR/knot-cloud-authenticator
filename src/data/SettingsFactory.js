import config from 'config';
import Joi from 'joi';
import _ from 'lodash';

import Settings from 'data/Settings';

const serverSchema = Joi.object().keys({
  port: Joi.number().port().required(),
  resetPasswordSenderAddress: Joi.string().email(), // deprecated
  resetSenderAddress: Joi.string().email().required().when('resetPasswordSenderAddress', {
    is: Joi.exist(),
    then: Joi.optional(),
  }),
  resetUri: Joi.string().uri().required(),
});
const meshbluSchema = Joi.object().keys({
  protocol: Joi.string().valid(['http', 'https']).required(),
  host: Joi.string(), // deprecated
  hostname: Joi.string().required().when('host', {
    is: Joi.exist(),
    then: Joi.optional(),
  }),
  port: Joi.number().port().required(),
});
const authenticatorSchema = Joi.object().keys({
  uuid: Joi.string().uuid().required(),
  token: Joi.string().required(),
});
const mailgunSchema = Joi.object().keys({
  apiKey: Joi.string().required(),
  domain: Joi.string().required(),
});
const storageSchema = Joi.object().keys({
  webhookUri: Joi.string().uri(),
});
const levels = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'];
const loggerSchema = Joi.object().keys({
  level: Joi.string().valid(levels).required(),
});

class SettingsFactory {
  create() {
    const server = this.loadServerSettings();
    const meshblu = this.loadMeshbluSettings();
    const authenticator = this.loadAuthenticatorSettings();
    const mailgun = this.loadMailgunSettings();
    const logger = this.loadLoggerSettings();
    const storage = this.loadStorageSettings();
    return new Settings(server, meshblu, authenticator, mailgun, logger, storage);
  }

  loadServerSettings() {
    const server = config.get('server');
    this.validate('server', server, serverSchema);
    return { // return server object when the member marked as deprecated is removed
      port: server.port,
      resetSenderAddress: server.resetSenderAddress || server.resetPasswordSenderAddress,
      resetUri: server.resetUri,
    };
  }

  loadMeshbluSettings() {
    const meshblu = config.get('meshblu');
    this.validate('meshblu', meshblu, meshbluSchema);
    return { // return meshblu object when the member marked as deprecated is removed
      protocol: meshblu.protocol,
      hostname: meshblu.hostname || meshblu.host,
      port: meshblu.port,
      webhookUri: meshblu.webhookUri,
    };
  }

  loadAuthenticatorSettings() {
    const authenticator = config.get('authenticator');
    this.validate('authenticator', authenticator, authenticatorSchema);
    return authenticator;
  }

  loadMailgunSettings() {
    const mailgun = config.get('mailgun');
    this.validate('mailgun', mailgun, mailgunSchema);
    return mailgun;
  }

  loadLoggerSettings() {
    const logger = config.get('logger');
    this.validate('logger', logger, loggerSchema);
    return logger;
  }

  loadStorageSettings() {
    const storage = config.get('storage');
    this.validate('storage', storage, storageSchema);
    return storage;
  }

  validate(propertyName, propertyValue, schema) {
    const { error } = Joi.validate(propertyValue, schema, { abortEarly: false });
    if (error) {
      throw this.mapJoiError(propertyName, error);
    }
  }

  mapJoiError(propertyName, error) {
    const reasons = _.map(error.details, 'message');
    const formattedReasons = reasons.length > 1
      ? `\n${_.chain(reasons).map(reason => `- ${reason}`).join('\n').value()}`
      : reasons[0];
    return new Error(`Invalid "${propertyName}" property: ${formattedReasons}`);
  }
}

export default SettingsFactory;
