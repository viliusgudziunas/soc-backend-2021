import { Request, Response } from 'express';
import { JwtService } from '../services/jwt-service';
import { ResponseService } from '../services/response-service';

export const AuthLogoutAction = async (
  request: Request,
  response: Response
): Promise<void> => {
  // TODO: add some auth protection
  // * Token validation
  const authHeader = request.header('Authorization');
  if (!authHeader) {
    const responseBody = ResponseService.noAuth();
    response.status(401).send(responseBody);
    return;
  }

  try {
    const token = authHeader.split(' ')[1];
    JwtService.verifyToken(token);
  } catch (error) {
    const responseBody = ResponseService.invalidToken();
    response.status(401).send(responseBody);
    return;
  }

  const status = 'success';
  const message = 'User logged out successfully';

  const responseBody = { status, message };
  response.status(200).send(responseBody);
};
