import dotenv from 'dotenv';

dotenv.config();

export const Env = {
  BCRYPT_ROUNDS: +process.env.BCRYPT_ROUNDS,
  DB: {
    CA_CERT: process.env.CA_CERT,
    HOST: process.env.DB_HOST,
    NAME: process.env.DB_NAME,
    PASSWORD: process.env.DB_PASSWORD,
    PORT: +process.env.DB_PORT,
    USERNAME: process.env.DB_USERNAME,
  },
  ENV: process.env.ENV,
  JWT: {
    AUTH_TOKEN_EXPIRY_TIME: process.env.JWT_AUTH_TOKEN_EXPIRY_TIME,
    REFRESH_TOKEN_EXPIRY_TIME: process.env.JWT_REFRESH_TOKEN_EXPIRY_TIME,
    SECRET: process.env.JWT_SECRET,
  },
  PORT: process.env.PORT,
};
