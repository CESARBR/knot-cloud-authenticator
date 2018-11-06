import _ from 'lodash';
import bcrypt from 'bcrypt';
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
          resolve(this.mapDeviceToUser(userDevice));
        }
      });
    });
  }

  async update(user) {
    let device = await this.findDevice({ email: user.email });
    device = await this.updateDevice(device, user);
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
    return _.cloneDeep(device[this.meshbluAuthenticator.authenticatorUuid]);
  }

  setAuthData(device, authData) {
    // eslint-disable-next-line no-param-reassign
    device[this.meshbluAuthenticator.authenticatorUuid] = _.cloneDeep(authData);
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

  async updateDevice(device, user) {
    const updatedDevice = _.cloneDeep(device);
    let authData = this.getAuthData(updatedDevice);
    authData = this.updateResetData(authData, user);
    authData = await this.updatePassword(authData, user);
    authData = this.sign(authData);
    this.setAuthData(updatedDevice, authData);
    return updatedDevice;
  }

  updateResetData(authData, user) {
    const updatedAuthData = _.omit(authData, 'resetExpiration', 'resetToken');
    if (user.resetExpiration) {
      updatedAuthData.resetExpiration = user.resetExpiration.toJSON();
      updatedAuthData.resetToken = user.resetToken;
    }
    return updatedAuthData;
  }

  async updatePassword(authData, user) {
    if (!user.password) {
      return authData;
    }
    const updatedAuthData = _.omit(authData, 'secret');
    updatedAuthData.secret = await bcrypt.hash(user.password + user.uuid, 10);
    return updatedAuthData;
  }

  mapDeviceToUser(device) {
    const authData = this.getAuthData(device);
    const resetExpiration = authData.resetExpiration
      ? moment(authData.resetExpiration)
      : undefined;
    return new User(
      authData.id,
      null, // Don't return password
      device.uuid,
      device.token,
      authData.resetToken,
      resetExpiration,
      // don't return password
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
