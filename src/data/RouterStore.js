class RouterStore {
  constructor(meshbluHttpFactory) {
    this.meshbluHttpFactory = meshbluHttpFactory;
  }

  create(user) {
    return new Promise((resolve, reject) => {
      const routerParams = {
        type: 'router',
        meshblu: {
          version: '2.0.0',
          whitelists: {
            discover: {
              view: [{ uuid: user.uuid }],
            },
            configure: {
              update: [{ uuid: user.uuid }],
            },
          },
        },

      };
      const client = this.meshbluHttpFactory.create({ uuid: user.uuid, token: user.token });
      client.register(routerParams, (error, routerDevice) => {
        if (error) {
          reject(error);
        } else {
          resolve(routerDevice);
        }
      });
    });
  }

  subscribeOwn(client, uuid, type, as) {
    return new Promise((resolve, reject) => {
      client.createSubscription({
        subscriberUuid: uuid,
        emitterUuid: uuid,
        type,
      }, { as: as.uuid }, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async createSubscriptions(router, user) {
    const client = this.meshbluHttpFactory.create({ uuid: user.uuid, token: user.token });
    await this.subscribeOwn(client, router.uuid, 'broadcast.received', user);
    await this.subscribeOwn(client, router.uuid, 'configure.received', user);
  }
}

export default RouterStore;
