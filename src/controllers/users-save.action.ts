import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { User } from '../entities/user';
import { ResponseService } from '../services/response-service';
import { ValidationUtils } from '../shared/validation-utils';

export const UsersSaveAction = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { body } = request;

  // * Required fields validation
  const requiredFields = ['email', 'password', 'confirmPassword', 'name'];
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

  // * Unique email validation
  const userRepo = getManager().getRepository(User);
  const duplicateUsers = await userRepo.find({ where: { email: body.email } });

  if (duplicateUsers.length > 0) {
    const responseBody = ResponseService.emailInUse();
    response.status(400).send(responseBody);
    return;
  }

  // * Same password validation
  if (body.password !== body.confirmPassword) {
    const responseBody = ResponseService.passwordsDoNotMatch();
    response.status(400).send(responseBody);
    return;
  }

  // * Hash the password
  const salt = await bcrypt.genSalt(+process.env.BCRYPT_ROUNDS);
  const hashedPassword = await bcrypt.hash(body.password, salt);

  const newUserData: User = { ...request.body, password: hashedPassword };
  const newUser = userRepo.create(newUserData);
  await userRepo.save(newUser);

  delete newUser.password;
  const responseBody = ResponseService.success(newUser);
  response.status(201).send(responseBody);
};
