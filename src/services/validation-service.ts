import { ValidationResponseModel } from '../models/common';
import { JwtService } from './jwt-service';
import { ResponseService } from './response-service';

export interface TokenValidationResponseModel extends ValidationResponseModel {
  data: {
    responseBody?: unknown;
    decoded?: unknown;
  };
}

export const ValidationService = {
  validateToken: (authHeader: string): TokenValidationResponseModel => {
    if (!authHeader) {
      const responseBody = ResponseService.noAuth();
      return { status: 'fail', data: { responseBody } };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let decoded: any;
    try {
      const token = authHeader.split(' ')[1];
      decoded = JwtService.verifyToken(token);
    } catch (error) {
      const responseBody = ResponseService.invalidToken();
      return { status: 'fail', data: { responseBody } };
    }

    return { status: 'success', data: { decoded } };
  },
};
