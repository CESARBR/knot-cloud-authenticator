import User from 'entities/User';

class CreateUser {
  constructor(userStore, routerStore) {
    this.userStore = userStore;
    this.routerStore = routerStore;
  }

  async execute(email, password) {
    const user = new User(email, password);
    user.validatePassword();

    const registeredUser = await this.userStore.create(user);
    const router = await this.routerStore.create(registeredUser);
    await this.routerStore.createSubscriptions(router, registeredUser);
    await this.userStore.assignRouter(router, registeredUser);

    return this.userStore.reload(registeredUser);
  }
}

export default CreateUser;
