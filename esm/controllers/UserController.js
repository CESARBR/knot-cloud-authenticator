import Boom from 'boom';

import InvalidPasswordError from 'entities/InvalidPasswordError';
import UserExistsError from 'entities/UserExistsError';

class UserController {
  constructor(createUserInteractor, logger) {
    this.createUserInteractor = createUserInteractor;
    this.logger = logger;
  }

  async create(request, h) {
    try {
      const { email, password } = this.mapCreateRequest(request);
      const user = await this.createUserInteractor.execute(email, password);
      return h.response(this.mapUserToJson(user)).code(201);
    } catch (error) {
      if (error instanceof InvalidPasswordError) {
        throw Boom.boomify(error, { statusCode: 400 });
      }
      if (error instanceof UserExistsError) {
        throw Boom.boomify(error, { statusCode: 409 });
      }
      this.logger.error(`Unexpected error at create(): ${error.message}`);
      throw Boom.internal();
    }
  }

  mapCreateRequest(request) {
    return request.payload;
  }

  mapUserToJson(user) {
    return {
      email: user.email,
      uuid: user.uuid,
      token: user.token,
    };
  }
}

export default UserController;
