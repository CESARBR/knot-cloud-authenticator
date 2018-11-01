import PasswordValidator from 'password-validator';

import InvalidPasswordError from 'entities/InvalidPasswordError';

class User {
  constructor(email, password, uuid, token, resetToken, resetExpiration) {
    this.email = email;
    this.password = password;
    this.uuid = uuid;
    this.token = token;
    this.resetToken = resetToken;
    this.resetExpiration = resetExpiration;
  }

  validatePassword() {
    if (!this.isPasswordValid()) {
      throw new InvalidPasswordError('Password must be at least 8 and at most 50 characters long, contain uppercase, lowercase, digit and symbol characters');
    }
  }

  isPasswordValid() {
    // The following chains are more readable if not written one per line
    /* eslint-disable newline-per-chained-call */
    return new PasswordValidator()
      .is().min(8)
      .is().max(50)
      .has().uppercase()
      .has().lowercase()
      .has().digits()
      .has().symbols()
      .is().not().oneOf([this.email])
      .validate(this.password);
    /* eslint-enable newline-per-chained-call */
  }
}

export default User;
