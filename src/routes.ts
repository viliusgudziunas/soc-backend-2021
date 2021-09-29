import { AuthLoginAction } from './controllers/auth-login.action';
import { UsersCreateAction } from './controllers/users-create.action';
import { WorkoutCreateAction } from './controllers/workout-create.action';

export const AppRoutes = [
  { path: '/login', method: 'post', action: AuthLoginAction },
  { path: '/users', method: 'post', action: UsersCreateAction },
  { path: '/workouts', method: 'post', action: WorkoutCreateAction },
];
