import User from 'entities/User';
import UserExistsError from 'entities/UserExistsError';

class UserStore {
  constructor(meshbluAuthenticator) {
    this.meshbluAuthenticator = meshbluAuthenticator;
  }

  async create(user) {
    return new Promise((resolve, reject) => {
      const query = this.buildMeshbluQuery({ email: user.email });
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
          reject(this.mapError(error, user.email));
        } else {
          resolve(new User(user.email, null, userDevice.uuid, userDevice.token));
        }
      });
    });
  }

  buildMeshbluQuery(query) {
    const meshbluQuery = {};
    if (query.email) {
      meshbluQuery[`${this.meshbluAuthenticator.authenticatorUuid}.id`] = query.email;
    }
    return meshbluQuery;
  }

  mapError(error, email) {
    if (error.message === 'device already exists') {
      return new UserExistsError(email);
    }
    return error;
  }
}

export default UserStore;
