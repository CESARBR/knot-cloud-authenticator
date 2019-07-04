class RouterStore {
  constructor(meshbluHttpFactory, webhookUri) {
    this.meshbluHttpFactory = meshbluHttpFactory;
    this.webhookUri = webhookUri;
  }

  async create(user) {
    return new Promise((resolve, reject) => {
      const client = this.meshbluHttpFactory.create({ uuid: user.uuid, token: user.token });
      const routerParams = {
        type: 'router',
        meshblu: {
          version: '2.0.0',
          whitelists: {
            discover: {
              view: [{ uuid: user.uuid }],
              as: [{ uuid: user.uuid }],
            },
            configure: {
              update: [{ uuid: user.uuid }],
              received: [{ uuid: user.uuid }],
              as: [{ uuid: user.uuid }],
            },
            broadcast: {
              received: [{ uuid: user.uuid }],
            },
            unregister: {
              received: [{ uuid: user.uuid }],
            },
            message: {
              as: [{ uuid: user.uuid }],
            },
          },
          forwarders: this.webhookUri ? this.buildForwarders() : undefined,
        },
      };

      client.register(routerParams, (error, routerDevice) => {
        if (error) {
          reject(error);
        } else {
          resolve(routerDevice);
        }
      });
    });
  }

  buildForwarders() {
    const webhook = {
      type: 'webhook',
      url: this.webhookUri,
      method: 'POST',
      signRequest: true,
    };
    return {
      version: '2.0.0',
      message: { sent: [webhook], received: [webhook] },
      broadcast: { sent: [webhook], received: [webhook] },
      configure: { sent: [webhook], received: [webhook] },
      unregister: { received: [webhook] },
    };
  }


  async subscribeOwn(client, uuid, type, as) {
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
    await this.subscribeOwn(client, user.uuid, 'broadcast.received', user);
    await this.subscribeOwn(client, router.uuid, 'broadcast.received', user);
    await this.subscribeOwn(client, router.uuid, 'configure.received', user);
  }
}

export default RouterStore;
