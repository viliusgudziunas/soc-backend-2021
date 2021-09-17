import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Timezones by location application is running on port ${port}.`);
});

const test = (_request: Request, response: Response): void => {
  const body = { hello: 'world!' };
  response.status(200).json(body);
};

app.get('/test', test);
