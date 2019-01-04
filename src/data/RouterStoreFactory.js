import RouterStore from 'data/RouterStore';
import MeshbluHttpFactory from 'network/MeshbluHttpFactory';

class RouterStoreFactory {
  create(settings) {
    const meshbluHttpFactory = new MeshbluHttpFactory(settings.meshblu);
    return new RouterStore(meshbluHttpFactory);
  }
}

export default RouterStoreFactory;
