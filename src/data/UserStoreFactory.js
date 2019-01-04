import { DeviceAuthenticator } from '@cesarbr/meshblu-authenticator-core';

import MeshbluHttpFactory from 'network/MeshbluHttpFactory';

import UserStore from 'data/UserStore';

class UserStoreFactory {
  async create(settings) {
    const meshbluHttpFactory = new MeshbluHttpFactory(settings.meshblu);
    const meshbluHttp = meshbluHttpFactory.create(settings.authenticator);
    const authenticatorDevice = await this.getAuthenticatorDevice(
      meshbluHttp,
      settings.authenticator.uuid,
    );

    meshbluHttp.setPrivateKey(authenticatorDevice.privateKey);
    const authenticator = new DeviceAuthenticator({
      authenticatorUuid: settings.authenticator.uuid,
      authenticatorName: 'KNoT Authenticator',
      meshbluHttp,
    });
    return new UserStore(authenticator, meshbluHttpFactory, meshbluHttp);
  }

  async getAuthenticatorDevice(meshbluHttp, authenticatorUuid) {
    return new Promise((resolve, reject) => {
      meshbluHttp.device(authenticatorUuid, (error, device) => {
        if (error) {
          let message;
          if (error.code === 404) {
            message = 'Invalid authenticator device credentials';
          } else {
            message = 'Failed to connect to Meshblu service';
          }
          reject(new Error(message));
          return;
        }

        if (!device.privateKey) {
          reject(new Error('Authenticator device must have a privateKey'));
          return;
        }

        resolve(device);
      });
    });
  }
}

export default UserStoreFactory;
