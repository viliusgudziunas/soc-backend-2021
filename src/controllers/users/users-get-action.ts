import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { User } from '../../entities/user';
import { ResponseService } from '../../services/response-service';
import { ValidationService } from '../../services/validation-service';
import { Utils } from '../../shared/utils';

export const UsersGetAction = async (
  request: Request,
  response: Response
): Promise<void> => {
  const authHeader = request.header('Authorization');
  const validation = ValidationService.validateToken(authHeader);

  if (validation.status === 'fail') {
    const { responseBody } = validation.data;
    response.status(401).send(responseBody);
    return;
  }

  const { userId } = request.params;
  const userRepo = getManager().getRepository(User);
  const user = await userRepo.findOne(userId);

  if (!Utils.isSet(user)) {
    const responseBody = ResponseService.userNotFound();
    response.status(404).send(responseBody);
    return;
  }

  delete user.password;
  const responseBody = ResponseService.success(user);
  response.status(200).send(responseBody);
};
