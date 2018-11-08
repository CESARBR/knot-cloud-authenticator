import Boom from 'boom';

import InvalidPasswordError from 'entities/InvalidPasswordError';
import UserExistsError from 'entities/UserExistsError';
import InvalidResetTokenError from 'interactors/InvalidResetTokenError';
import UnauthorizedError from '../entities/UnauthorizedError';

class UserController {
  constructor(
    createUserInteractor,
    forgotPasswordInteractor,
    resetPasswordInteractor,
    loginUserInteractor,
    logger,
  ) {
    this.createUserInteractor = createUserInteractor;
    this.forgotPasswordInteractor = forgotPasswordInteractor;
    this.resetPasswordInteractor = resetPasswordInteractor;
    this.loginUserInteractor = loginUserInteractor;
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
      const { uuid, token, password } = request.payload;
      await this.resetPasswordInteractor.execute(uuid, token, password);
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

  async login(request, h) {
    try {
      const { email, password } = request.payload;
      const user = await this.loginUserInteractor.execute(email, password);
      return h.response(this.mapUserToJson(user)).code(200);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw Boom.boomify(error, { statusCode: 401 });
      }

      this.logger.error(`Unexpected error at login(): ${error.message}`);
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
