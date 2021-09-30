import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import 'reflect-metadata';
import { Connection, createConnection } from 'typeorm';
import { AppRoutes } from './routes';

dotenv.config();
console.log('process.env:', process.env);

const resolveConnectionByEnv = (): Promise<Connection> => {
  if (process.env.ENV === 'production') {
    return createConnection({
      type: 'postgres',
      synchronize: true,
      url: process.env.DATABASE_URL,
      ssl: { ca: process.env.SSL_CERT },
      entities: ['src/entities/**/*.ts'],
      migrations: ['src/migration/**/*.ts'],
      subscribers: ['src/subscriber/**/*.ts'],
    });
  }

  return createConnection();
};

resolveConnectionByEnv()
  .then(async () => {
    const app = express();
    const port = process.env.PORT;

    app.use(express.json());

    app.listen(port, () =>
      // eslint-disable-next-line no-console
      console.log(`SOC-backend is running on port: ${port}.`)
    );

    AppRoutes.forEach((route) => {
      const { action, method, path } = route;
      // eslint-disable-next-line @typescript-eslint/ban-types
      app[method](path, (req: Request, res: Response, next: Function) => {
        action(req, res)
          .then(() => next)
          .catch((error) => next(error));
      });
    });
  })
  .catch((error) =>
    console.error(`TypeOrm failed to connect to db \n${error}`)
  );
