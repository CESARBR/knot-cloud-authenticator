class UserExistsError extends Error {
  constructor(email) {
    super(`User for '${email}' exists`);
    this.name = 'UserExistsError';
    this.email = email;
  }
}

export default UserExistsError;
