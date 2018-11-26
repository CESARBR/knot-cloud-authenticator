import moment from 'moment';
import bcrypt from 'bcrypt';

import InvalidResetTokenError from 'interactors/InvalidResetTokenError';

class ResetPassword {
  constructor(userStore) {
    this.userStore = userStore;
  }

  async execute(email, token, password) {
    const user = await this.findUser(email);
    if (!user || !(await this.isTokenValid(token, user))) {
      throw new InvalidResetTokenError('Invalid reset token', token);
    }
    user.password = password;
    user.validatePassword();
    await this.updateUser(user, password);
  }

  async findUser(email) {
    return this.userStore.get({ email });
  }

  async updateUser(user) {
    /* eslint-disable no-param-reassign */
    user.resetExpiration = undefined;
    user.resetToken = undefined;
    /* eslint-enable no-param-reassign */
    await this.userStore.update(user);
  }

  async isTokenValid(token, user) {
    return !this.isTokenExpired(user)
      && this.isTokenEquals(token, user);
  }

  isTokenExpired(user) {
    return !user.resetExpiration
      || (user.resetExpiration
        && moment().isAfter(user.resetExpiration));
  }

  async isTokenEquals(token, user) {
    return bcrypt.compare(token + user.uuid, user.resetToken);
  }
}

export default ResetPassword;
