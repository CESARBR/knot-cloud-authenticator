import MeshbluHttp from 'meshblu-http';
import { DeviceAuthenticator } from 'meshblu-authenticator-core';
import UserStore from 'data/UserStore';

class UserStoreFactory {
  async create(meshbluConfig, authenticatorConfig) {
    return new Promise((resolve, reject) => {
      const meshbluHttpConfig = {
        uuid: authenticatorConfig.uuid,
        token: authenticatorConfig.token,
        protocol: meshbluConfig.protocol,
        hostname: meshbluConfig.host,
        port: meshbluConfig.port,
      };
      const meshbluHttp = new MeshbluHttp(meshbluHttpConfig);
      meshbluHttp.device(authenticatorConfig.uuid, (error, device) => {
        if (error) {
          reject(error);
          return;
        }

        if (!device.privateKey) {
          reject(new Error('Authenticator device must have a privateKey'));
          return;
        }

        meshbluHttp.setPrivateKey(device.privateKey);

        const authenticator = new DeviceAuthenticator({
          authenticatorUuid: authenticatorConfig.uuid,
          authenticatorName: 'KNoT Authenticator',
          meshbluHttp,
        });
        const userStore = new UserStore(authenticator);
        resolve(userStore);
      });
    });
  }
}

export default UserStoreFactory;
