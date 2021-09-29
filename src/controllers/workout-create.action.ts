import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { getManager } from 'typeorm';
import { User } from '../entities/user';
import { Workout } from '../entities/workout';
import { ResponseService } from '../services/response-service';
import { DATE_FORMAT, TIME_FORMAT } from '../shared/constants';
import { ValidationUtils } from '../shared/validation-utils';

export const WorkoutCreateAction = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { body } = request;

  // TODO: add some auth protection
  // * Token validation
  const authHeader = request.header('Authorization');
  if (!authHeader) {
    const responseBody = ResponseService.noAuth();
    response.status(401).send(responseBody);
    return;
  }

  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    const responseBody = ResponseService.invalidToken();
    response.status(401).send(responseBody);
    return;
  }

  // TODO: add validation for not found user
  const userId = decoded.id;
  const userRepo = getManager().getRepository(User);
  const user = await userRepo.findOne(userId);

  // * Required fields validation
  const requiredFields = ['caloriesBurnt', 'timeSpent', 'workoutDate', 'name'];
  const missingFields = ValidationUtils.getMissingFields(body, requiredFields);

  if (missingFields.length > 0) {
    const responseBody = ResponseService.missingFields(missingFields);
    response.status(400).send(responseBody);
    return;
  }

  // * Time spent validation
  const isValidTime = TIME_FORMAT.test(body.timeSpent);
  if (!isValidTime) {
    const responseBody = ResponseService.invalidTimeFormat('timeSpent');
    response.status(400).send(responseBody);
    return;
  }

  // * Workout date validation
  const isValidDate = moment(body.workoutDate, DATE_FORMAT, true).isValid();
  if (!isValidDate) {
    const responseBody = ResponseService.invalidDateFormat('workoutDate');
    response.status(400).send(responseBody);
    return;
  }

  const start = '01/10/2021';
  const end = '01/11/2021';
  const workoutDate = moment(body.workoutDate, DATE_FORMAT);
  const startDate = moment(start, DATE_FORMAT);
  // TODO: Add logic to not allow dates older than today
  const endDate = moment(end, DATE_FORMAT);

  const isDateInRange = workoutDate.isBetween(startDate, endDate);
  if (!isDateInRange) {
    const responseBody = ResponseService.dateNotInRange(
      start,
      end,
      'workoutDate'
    );
    response.status(400).send(responseBody);
    return;
  }

  const timeSpent = moment.duration(body.timeSpent).asMilliseconds();
  const workoutRepo = getManager().getRepository(Workout);

  const newWorkoutData: Workout = {
    ...request.body,
    timeSpent,
    workoutDate,
    user,
  };
  const newWorkout = workoutRepo.create(newWorkoutData);
  await workoutRepo.save(newWorkout);

  // TODO: Add type
  const newWorkoutFormatted = {
    ...newWorkout,
    timeSpent: body.timeSpent,
    workoutDate: body.workoutDate,
    userId: user.id,
  };
  delete newWorkoutFormatted.user;

  const responseBody = ResponseService.success(newWorkoutFormatted);
  response.status(201).send(responseBody);
};
