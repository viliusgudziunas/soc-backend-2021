import { UsersSaveAction } from './controllers/users-save-action';

export const AppRoutes = [
  { path: '/users', method: 'post', action: UsersSaveAction },
];
