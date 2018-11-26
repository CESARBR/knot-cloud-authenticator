class LoginUser {
  constructor(userStore, logger) {
    this.userStore = userStore;
    this.logger = logger;
  }

  async execute(email, password) {
    const user = await this.userStore.getVerified({ email }, password);
    if (!user) {
      this.logger.info(`Invalid e-mail or password for ${email}`);
      return null;
    }

    return this.userStore.generateAndStoreToken(user);
  }
}

export default LoginUser;
