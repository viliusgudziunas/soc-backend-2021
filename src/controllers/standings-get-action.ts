import { Request, Response } from 'express';
import moment from 'moment';
import { getManager } from 'typeorm';
import { Workout } from '../entities/workout';
import { StandingsQueries } from '../queries/standings-query';
import { JwtService } from '../services/jwt-service';
import { ResponseService } from '../services/response-service';

export const StandingsGetAction = async (
  request: Request,
  response: Response
): Promise<void> => {
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

  const workoutsRepo = getManager().getRepository(Workout);
  const sql = StandingsQueries.getAggregates();
  const standings = await workoutsRepo.query(sql);

  // TODO: Add type
  const responseData = standings.map((entry) => {
    const { timeSpent } = entry;
    const duration = moment.duration(timeSpent);
    const hours = Math.floor(duration.asHours());
    const mins = Math.floor(duration.asMinutes()) - hours * 60;

    const hoursAndMinutes = `${hours}:${mins}`;

    return { ...entry, timeSpent: hoursAndMinutes };
  });

  const responseBody = ResponseService.success(responseData);
  response.status(200).send(responseBody);
};
