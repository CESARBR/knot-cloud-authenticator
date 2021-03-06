import moment from 'moment';
import UUID from 'uuid';
import bcrypt from 'bcrypt';

const EXPIRATION_IN_MINUTES = 30;

class ForgotPassword {
  constructor(userStore, mailService, resetSenderAddress, resetUri, logger) {
    this.userStore = userStore;
    this.mailService = mailService;
    this.resetSenderAddress = resetSenderAddress;
    this.resetUri = resetUri;
    this.logger = logger;
  }

  async execute(email) {
    const user = await this.userStore.get({ email });
    if (!user) {
      this.logger.info(`No user found for ${email}`);
      return;
    }

    const resetToken = this.createResetToken();
    user.resetToken = await this.hashToken(user, resetToken);
    user.resetExpiration = this.getResetExpirationDate();
    await this.userStore.update(user);

    try {
      await this.sendMail(user, resetToken);
    } catch (error) {
      // Ignore mail errors
      this.logger.error(`Failed to send forgot password e-mail: ${error.message}`);
    }
  }

  createResetToken() {
    return UUID.v4();
  }

  async hashToken(user, token) {
    return bcrypt.hash(token + user.uuid, 10);
  }

  getResetExpirationDate() {
    return moment().add(EXPIRATION_IN_MINUTES, 'minutes');
  }

  async sendMail(user, token) {
    const resetUri = `${this.resetUri}?email=${user.email}&token=${token}`;
    const body = `<p>You recently requested to reset your password for your KNoT Cloud account. Click <a href="${resetUri}">here</a> to reset your password, it will be available for the next ${EXPIRATION_IN_MINUTES} minutes.</p><p>If you didn't make this request, please ignore this e-mail.`;
    await this.mailService.sendHtml(this.resetSenderAddress, user.email, 'Forgot password?', body);
  }
}

export default ForgotPassword;
