import Boom from 'boom';

import InvalidPasswordError from 'entities/InvalidPasswordError';
import UserExistsError from 'entities/UserExistsError';
import InvalidResetTokenError from 'interactors/InvalidResetTokenError';

class UserController {
  constructor(createUserInteractor, forgotPasswordInteractor, resetPasswordInteractor, logger) {
    this.createUserInteractor = createUserInteractor;
    this.forgotPasswordInteractor = forgotPasswordInteractor;
    this.resetPasswordInteractor = resetPasswordInteractor;
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

  async reset(request, h) {
    try {
      const { email, token, password } = request.payload;
      await this.resetPasswordInteractor.execute(email, token, password);
      return h.response().code(200);
    } catch (error) {
      if (error instanceof InvalidPasswordError
        || error instanceof InvalidResetTokenError) {
        throw Boom.boomify(error, { statusCode: 400 });
      }
      this.logger.error(`Unexpected error at reset(): ${error.message}`);
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
