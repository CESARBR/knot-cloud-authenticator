import InvalidPasswordError from 'entities/InvalidPasswordError';
import UserExistsError from 'entities/UserExistsError';

class UserController {
  constructor(createUserInteractor, forgotPasswordInteractor) {
    this.createUserInteractor = createUserInteractor;
    this.forgotPasswordInteractor = forgotPasswordInteractor;
  }

  async create(request, h) {
    try {
      const { email, password } = this.mapCreateRequest(request);
      const user = await this.createUserInteractor.execute(email, password);
      return h.response(this.mapUserToJson(user)).code(201);
    } catch (error) {
      const errorObj = this.mapErrorToJson(error);
      if (error instanceof InvalidPasswordError) {
        return h.response(errorObj).code(422);
      }
      if (error instanceof UserExistsError) {
        return h.response(errorObj).code(409);
      }
      return h.response().code(500);
    }
  }

  async forgot(request, h) {
    try {
      const { email } = this.mapForgotRequest(request);
      await this.forgotPasswordInteractor.execute(email);
      return h.response().code(200);
    } catch (error) {
      return h.response().code(500);
    }
  }

  mapCreateRequest(request) {
    return request.payload;
  }

  mapForgotRequest(request) {
    return request.payload;
  }

  mapErrorToJson(error) {
    return {
      message: error.message,
    };
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
