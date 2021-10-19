import { Request, Response } from 'express';
import moment from 'moment';
import { getManager } from 'typeorm';
import { Workout } from '../entities/workout';
import { StandingsQueries } from '../queries/standings-query';
import { ResponseService } from '../services/response-service';
import { ValidationService } from '../services/validation-service';

export const StandingsGetAction = async (
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
