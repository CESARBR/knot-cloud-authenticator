import PasswordValidator from 'password-validator';
import InvalidPasswordError from 'entities/InvalidPasswordError';

class CreateUser {
  constructor(userStore) {
    this.userStore = userStore;
  }

  async execute(email, password) {
    if (!this.isPasswordValid(password, email)) {
      throw new InvalidPasswordError('Password must be at least 8 and at most 50 characters long, contain uppercase, lowercase, digit and symbol characters');
    }
    return this.userStore.create(email, password);
  }

  isPasswordValid(password, email) {
    /* eslint-disable newline-per-chained-call */
    return new PasswordValidator()
      .is().min(8)
      .is().max(50)
      .has().uppercase()
      .has().lowercase()
      .has().digits()
      .has().symbols()
      .is().not().oneOf([email])
      .validate(password);
    /* eslint-enable newline-per-chained-call */
  }
}

export default CreateUser;
