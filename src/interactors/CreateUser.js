import User from 'entities/User';

class CreateUser {
  constructor(userStore) {
    this.userStore = userStore;
  }

  async execute(email, password) {
    const user = new User(email, password);
    user.validatePassword();
    return this.userStore.create(user);
  }
}

export default CreateUser;
