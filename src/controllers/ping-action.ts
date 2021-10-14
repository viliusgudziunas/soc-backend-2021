import { Request, Response } from 'express';

export const PingAction = async (
  _request: Request,
  response: Response
): Promise<void> => {
  const responseBody = { pong: true };
  response.status(200).send(responseBody);
};
