class User {
  constructor(email, uuid, token, resetToken, resetExpiration) {
    this.email = email;
    this.uuid = uuid;
    this.token = token;
    this.resetToken = resetToken;
    this.resetExpiration = resetExpiration;
  }
}

export default User;
