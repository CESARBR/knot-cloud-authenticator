import moment from 'moment';
import UUID from 'uuid';
import bcrypt from 'bcrypt';

const EXPIRATION_IN_MINUTES = 30;
const FROM_ADDRESS = 'knot@cesar.org.br';

class ForgotPassword {
  constructor(userStore, mailService, resetUri) {
    this.userStore = userStore;
    this.mailService = mailService;
    this.resetUri = resetUri;
  }

  async execute(email) {
    const user = await this.userStore.get(email);
    if (!user) {
      return;
    }

    user.resetToken = await this.createResetToken(user);
    user.resetExpiration = this.getResetExpirationDate();
    await this.userStore.update(user);

    try {
      await this.sendMail(user);
    } catch (error) {
      // Ignore mail errors
    }
  }

  async createResetToken(user) {
    return new Promise((resolve, reject) => {
      const uuid = UUID.v4();
      return bcrypt.hash(uuid + user.uuid, 10, (error, token) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      });
    });
  }

  getResetExpirationDate() {
    return moment().add(EXPIRATION_IN_MINUTES, 'minutes');
  }

  async sendMail(user) {
    const resetUri = `${this.resetUri}?token=${user.resetToken}`;
    const body = `<p>You recently requested to reset your password for your KNoT Cloud account. Click <a href="${resetUri}">here</a> to reset your password, it will be available for the next ${EXPIRATION_IN_MINUTES} minutes.</p><p>If you didn't make this request, please ignore this e-mail.`;
    await this.mailService.sendHtml(FROM_ADDRESS, user.email, 'Forgot password?', body);
  }
}

export default ForgotPassword;
