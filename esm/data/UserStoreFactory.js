import config from 'config';
import MeshbluHttp from '@cesarbr/meshblu-http';
import { DeviceAuthenticator } from '@cesarbr/meshblu-authenticator-core';

import UserStore from 'data/UserStore';

class UserStoreFactory {
  async create() {
    const { meshbluConfig, authenticatorConfig } = this.getConfiguration();
    const meshbluHttp = this.createMeshbluHttp(meshbluConfig, authenticatorConfig);
    const authenticatorDevice = await this.getAuthenticatorDevice(
      meshbluHttp,
      authenticatorConfig.uuid,
    );

    meshbluHttp.setPrivateKey(authenticatorDevice.privateKey);
    const authenticator = new DeviceAuthenticator({
      authenticatorUuid: authenticatorConfig.uuid,
      authenticatorName: 'KNoT Authenticator',
      meshbluHttp,
    });
    return new UserStore(authenticator);
  }

  getConfiguration() {
    if (!config.has('meshblu') || !config.has('authenticator')) {
      throw new Error('Missing Meshblu or authenticator configuration');
    }

    const meshbluConfig = config.get('meshblu');
    const authenticatorConfig = config.get('authenticator');
    if (!meshbluConfig.protocol || !meshbluConfig.host || !meshbluConfig.port
      || !authenticatorConfig.uuid || !authenticatorConfig.token) {
      throw new Error('Missing Meshblu or authenticator configuration');
    }

    return { meshbluConfig, authenticatorConfig };
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
          reject(error);
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
