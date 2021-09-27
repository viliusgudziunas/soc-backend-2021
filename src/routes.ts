import { AuthLoginAction } from './controllers/auth-login.action';
import { UsersSaveAction } from './controllers/users-save.action';

export const AppRoutes = [
  { path: '/users', method: 'post', action: UsersSaveAction },
  { path: '/login', method: 'post', action: AuthLoginAction },
];
