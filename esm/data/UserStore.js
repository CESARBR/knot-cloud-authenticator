import _ from 'lodash';
import moment from 'moment';

import User from 'entities/User';
import UserExistsError from 'entities/UserExistsError';

class UserStore {
  constructor(meshbluAuthenticator, meshbluHttp) {
    this.meshbluAuthenticator = meshbluAuthenticator;
    this.meshbluHttp = meshbluHttp;
  }

  async get(query) {
    const device = await this.findDevice(query);
    return device && this.mapDeviceToUser(device);
  }

  async create(email, password) {
    return new Promise((resolve, reject) => {
      const query = this.buildMeshbluQuery({ email });
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
          reject(this.mapError(error, email));
        } else {
          resolve(this.mapDeviceToUser(userDevice));
        }
      });
    });
  }

  async update(user) {
    const device = await this.findDevice({ email: user.email });
    this.updateDeviceWithUser(device, user);
    return new Promise((resolve, reject) => {
      this.meshbluHttp.update(device.uuid, device, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async findDevice(query) {
    return new Promise((resolve, reject) => {
      const meshbluQuery = this.buildMeshbluQuery(query);
      this.meshbluHttp.devices(meshbluQuery, (error, devices) => {
        if (error) {
          reject(this.mapError(error));
          return;
        }

        const device = _.chain(devices)
          .filter(this.isValid.bind(this))
          .first() // shouldn't exist more than one
          .value();
        resolve(device);
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

  getAuthData(device) {
    return device[this.meshbluAuthenticator.authenticatorUuid];
  }

  setAuthData(device, authData) {
    // eslint-disable-next-line no-param-reassign
    device[this.meshbluAuthenticator.authenticatorUuid] = authData;
  }

  isValid(device) {
    const authData = this.getAuthData(device);
    if (!authData || !authData.signature) {
      return false;
    }
    return this.meshbluHttp.verify(
      _.omit(authData, 'signature'),
      authData.signature,
    );
  }

  sign(authData) {
    const signedAuthData = _.cloneDeep(authData);
    signedAuthData.signature = this.meshbluHttp.sign(_.omit(signedAuthData, 'signature'));
    return signedAuthData;
  }

  updateDeviceWithUser(device, user) {
    const authData = this.getAuthData(device);
    authData.resetExpiration = user.resetExpiration
      ? user.resetExpiration.toJSON()
      : undefined;
    authData.resetToken = user.resetToken;
    this.setAuthData(device, this.sign(authData));
  }

  mapDeviceToUser(device) {
    const authData = this.getAuthData(device);
    const resetExpiration = authData.resetExpiration
      ? moment(authData.resetExpiration)
      : undefined;
    return new User(
      authData.id,
      device.uuid,
      device.token,
      authData.resetToken,
      resetExpiration,
    );
  }

  mapError(error, email) {
    if (error.message === 'device already exists') {
      return new UserExistsError(email);
    }
    return error;
  }
}

export default UserStore;
