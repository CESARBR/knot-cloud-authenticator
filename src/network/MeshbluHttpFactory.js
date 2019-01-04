import MeshbluHttp from '@cesarbr/meshblu-http';

class MeshbluHttpFactory {
  constructor(settings) {
    this.hostname = settings.hostname;
    this.port = settings.port;
    this.protocol = settings.protocol;
  }

  create(credentials) {
    return new MeshbluHttp({
      hostname: this.hostname,
      port: this.port,
      protocol: this.protocol,
      uuid: credentials.uuid,
      token: credentials.token,
    });
  }
}

export default MeshbluHttpFactory;
