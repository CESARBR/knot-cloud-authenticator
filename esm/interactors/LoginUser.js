class LoginUser {
  constructor(userStore, logger) {
    this.userStore = userStore;
    this.logger = logger;
  }

  async execute(email, password) {
    const device = await this.userStore.findVerifiedDevice({ email }, password);
    if (!device) {
      this.logger.info(`Email or password invalid for ${email}`);
      return null;
    }

    return this.userStore.generateAndStoreToken(device);
  }
}

export default LoginUser;
