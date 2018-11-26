class InvalidResetTokenError extends Error {
  constructor(message, token) {
    super(message);
    this.name = 'InvalidResetTokenError';
    this.token = token;
  }
}

export default InvalidResetTokenError;
