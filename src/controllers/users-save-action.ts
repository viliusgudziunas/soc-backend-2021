import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { User } from '../entities/user';
import { Utils } from '../utils';

export const UsersSaveAction = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { body } = request;
  const requiredFields = ['email', 'password', 'confirmPassword', 'name'];
  const missingFields = [];

  // * Required fields validation
  requiredFields.forEach((field) => {
    const isFieldInBody = !!body[field];
    if (!isFieldInBody) {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0) {
    const data = { reason: 'Fields are missing', fields: missingFields };
    const responseBody = Utils.createResponseBody('fail', data);
    response.status(400).send(responseBody);
    return;
  }

  // * Email validation
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const isEmailValid = emailRegex.test(String(body.email).toLowerCase());

  if (!isEmailValid) {
    const data = { reason: 'Email is not valid', fields: ['email'] };
    const responseBody = Utils.createResponseBody('fail', data);
    response.status(400).send(responseBody);
    return;
  }

  // * Unique email validation
  const userRepo = getManager().getRepository(User);

  const duplicateUsers = await userRepo.find({ where: { email: body.email } });
  if (duplicateUsers.length > 0) {
    const data = { reason: 'Email is already in use', fields: ['email'] };
    const responseBody = Utils.createResponseBody('fail', data);
    response.status(400).send(responseBody);
    return;
  }

  // * Same password validation
  if (body.password !== body.confirmPassword) {
    const data = {
      reason: 'Passwords do not match',
      fields: ['password', 'confirmPassword'],
    };
    const responseBody = Utils.createResponseBody('fail', data);
    response.status(400).send(responseBody);
    return;
  }

  // * Hash the password
  const salt = await bcrypt.genSalt(+process.env.FOO); // TODO: create environment file
  const hashedPassword = await bcrypt.hash(body.password, salt);

  const newUserData: User = { ...request.body, password: hashedPassword };
  const newUser = userRepo.create(newUserData);
  await userRepo.save(newUser);

  delete newUser.password;
  const responseBody = Utils.createResponseBody('success', newUser);
  response.status(201).send(responseBody);
};
