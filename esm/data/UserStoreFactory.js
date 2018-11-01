import MeshbluHttp from '@cesarbr/meshblu-http';
import { DeviceAuthenticator } from '@cesarbr/meshblu-authenticator-core';

import UserStore from 'data/UserStore';

class UserStoreFactory {
  async create(settings) {
    const meshbluHttp = this.createMeshbluHttp(settings.meshblu, settings.authenticator);
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
    return new UserStore(authenticator, meshbluHttp);
  }

  createMeshbluHttp(meshbluConfig, authenticatorConfig) {
    const meshbluHttpConfig = {
      uuid: authenticatorConfig.uuid,
      token: authenticatorConfig.token,
      protocol: meshbluConfig.protocol,
      hostname: meshbluConfig.host,
      port: meshbluConfig.port,
    };
    return new MeshbluHttp(meshbluHttpConfig);
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
