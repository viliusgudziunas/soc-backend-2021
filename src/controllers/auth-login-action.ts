import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { User } from '../entities/user';
import { JwtService } from '../services/jwt-service';
import { ResponseService } from '../services/response-service';
import { Utils } from '../shared/utils';
import { ValidationUtils } from '../shared/validation-utils';

export const AuthLoginAction = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { body } = request;

  // * Required fields validation
  const requiredFields = ['email', 'password'];
  const missingFields = ValidationUtils.getMissingFields(body, requiredFields);

  if (missingFields.length > 0) {
    const responseBody = ResponseService.missingFields(missingFields);
    response.status(400).send(responseBody);
    return;
  }

  // * Email validation
  const isEmailValid = ValidationUtils.checkEmail(body.email);

  if (!isEmailValid) {
    const responseBody = ResponseService.invalidEmail();
    response.status(400).send(responseBody);
    return;
  }

  // * Existing email validation
  const userRepo = getManager().getRepository(User);
  const user = await userRepo.findOne({ where: { email: body.email } });

  if (!Utils.isSet(user)) {
    const responseBody = ResponseService.incorrectLoginDetails();
    response.status(404).send(responseBody);
    return;
  }

  // * Password validation
  const isPasswordCorrect = await bcrypt.compare(body.password, user.password);

  if (!isPasswordCorrect) {
    const responseBody = ResponseService.incorrectLoginDetails();
    response.status(404).send(responseBody);
    return;
  }

  // * Create auth token
  delete user.password;
  const { ...payload } = user;
  const authToken = JwtService.createToken('auth', payload);

  // * Create refresh token
  const refreshToken = JwtService.createToken('refresh', payload);

  const responseData = { user, authToken, refreshToken };
  const responseBody = ResponseService.success(responseData);
  response.status(200).send(responseBody);
};
