import { AuthLoginAction } from './controllers/auth-login.action';
import { AuthLogoutAction } from './controllers/auth-logout.action';
import { UsersCreateAction } from './controllers/users-create.action';
import { WorkoutCreateAction } from './controllers/workout-create.action';

export const AppRoutes = [
  { path: '/login', method: 'post', action: AuthLoginAction },
  { path: '/logout', method: 'post', action: AuthLogoutAction },
  { path: '/users', method: 'post', action: UsersCreateAction },
  { path: '/workouts', method: 'post', action: WorkoutCreateAction },
];
