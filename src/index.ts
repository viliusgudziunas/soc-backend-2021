import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import 'reflect-metadata';
import { AppRoutes } from './routes';

dotenv.config();
console.log('HTTP_PORT:', process.env.HTTP_PORT);
console.log('PORT:', process.env.PORT);
console.log('process.env:', process.env);

// const resolveConnectionByEnv = (): Promise<Connection> =>
//   process.env.ENV === 'production'
//     ? createConnection({ type: 'postgres', url: process.env.DATABASE_URL })
//     : createConnection();

// resolveConnectionByEnv()
//   .then(async () => {
const app = express();
const port = 3000;

app.use(express.json());

AppRoutes.forEach((route) => {
  const { action, method, path } = route;
  // eslint-disable-next-line @typescript-eslint/ban-types
  app[method](path, (req: Request, res: Response, next: Function) => {
    action(req, res)
      .then(() => next)
      .catch((error) => next(error));
  });
});

app.listen(port, () =>
  // eslint-disable-next-line no-console
  console.log(`SOC-backend is running on port: ${port}.`)
);
// })
// .catch((error) =>
//   console.error(`TypeOrm failed to connect to db \n${error}`)
// );
