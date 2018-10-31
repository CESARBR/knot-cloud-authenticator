import User from 'entities/User';
import UserExistsError from 'entities/UserExistsError';

class UserStore {
  constructor(meshbluAuthenticator) {
    this.meshbluAuthenticator = meshbluAuthenticator;
  }

  async create(user) {
    return new Promise((resolve, reject) => {
      const query = {};
      query[`${this.meshbluAuthenticator.authenticatorUuid}.id`] = user.email;
      const userParams = {
        query,
        data: {
          type: 'knot:user',
        },
        user_id: user.email,
        secret: user.password,
      };
      this.meshbluAuthenticator.create(userParams, (error, userDevice) => {
        if (error) {
          reject(this.parseError(error, user.email));
        } else {
          resolve(new User(user.email, null, userDevice.uuid, userDevice.token));
        }
      });
    });
  }

  parseError(error, email) {
    if (error.message === 'device already exists') {
      return new UserExistsError(email);
    }
    return error;
  }
}

export default UserStore;
