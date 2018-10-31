import User from 'entities/User';
import UserExistsError from 'entities/UserExistsError';

class UserStore {
  constructor(meshbluAuthenticator) {
    this.meshbluAuthenticator = meshbluAuthenticator;
  }

  async create(email, password) {
    return new Promise((resolve, reject) => {
      const query = {};
      query[`${this.meshbluAuthenticator.authenticatorUuid}.id`] = email;
      const userParams = {
        query,
        data: {
          type: 'knot:user',
        },
        user_id: email,
        secret: password,
      };
      this.meshbluAuthenticator.create(userParams, (error, userDevice) => {
        if (error) {
          reject(this.parseError(error, email));
        } else {
          resolve(new User(email, userDevice.uuid, userDevice.token));
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
