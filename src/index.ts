import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { AppRoutes } from './routes';

createConnection()
  .then(async () => {
    const app = express();
    const port = 3000;

    dotenv.config();
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
  })
  .catch((error) =>
    console.error(`TypeOrm failed to connect to db \n${error}`)
  );