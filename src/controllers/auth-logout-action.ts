import { Request, Response } from 'express';
import { ValidationService } from '../services/validation-service';

export const AuthLogoutAction = async (
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

  const status = 'success';
  const message = 'User logged out successfully';

  const responseBody = { status, message };
  response.status(200).send(responseBody);
};
