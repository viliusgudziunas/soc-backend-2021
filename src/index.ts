import express, { Request, Response } from 'express';
import 'reflect-metadata';
import { Connection, createConnection } from 'typeorm';
import { Env } from './environment';
import { AppRoutes } from './routes';

const resolveConnectionByEnv = (): Promise<Connection> => {
  if (Env.ENV === 'production') {
    return createConnection({
      type: 'postgres',
      host: Env.DB.HOST,
      port: Env.DB.PORT,
      database: Env.DB.NAME,
      username: Env.DB.USERNAME,
      password: Env.DB.PASSWORD,
      synchronize: true,
      logging: true,
      ssl: { ca: Env.DB.CA_CERT },
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
    const port = Env.PORT;

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
