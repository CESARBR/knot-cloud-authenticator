import Boom from 'boom';

import InvalidPasswordError from 'entities/InvalidPasswordError';
import UserExistsError from 'entities/UserExistsError';

class UserController {
  constructor(createUserInteractor, forgotPasswordInteractor, logger) {
    this.createUserInteractor = createUserInteractor;
    this.forgotPasswordInteractor = forgotPasswordInteractor;
    this.logger = logger;
  }

  async create(request, h) {
    try {
      const { email, password } = request.payload;
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

  async forgot(request, h) {
    try {
      const { email } = request.payload;
      await this.forgotPasswordInteractor.execute(email);
      return h.response().code(200);
    } catch (error) {
      this.logger.error(`Unexpected error at forgot(): ${error.message}`);
      throw Boom.internal();
    }
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
