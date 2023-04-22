import * as Joi from 'joi';

// export const envValidation = () =>
//   Joi.object({
//     NODE_ENV: Joi.string()
//       .valid('local', 'development', 'production', 'test', 'deploy')
//       .required(),
//     // PORT: Joi.string().required(), // todo: 주석 해제 해야 함
//     // API_URL: Joi.string().required(),
//     // CLIENT_URL: Joi.string().required(),
//     // FT_API_UID: Joi.string().required(),
//     // FT_API_SECRET: Joi.string().required(),
//     // FT_API_REDIRECT: Joi.string().required(),
//     // SMTP_USER: Joi.string().required(),
//     // SMTP_UID: Joi.string().required(),
//     // SMTP_SECRET: Joi.string().required(),
//     // SMTP_TOKEN: Joi.string().required(),
//     // JWT_SECRET: Joi.string().required(),
//     // SESSION_SECRET: Joi.string().required(),
//     // DATABASE_USERNAME: Joi.string().required(),
//     // DATABASE_PASSWORD: Joi.string().required(),
//     // DATABASE_NAME: Joi.string().required(),
//     // DATABASE_HOST: Joi.string().required(),
//     // DATABASE_PORT: Joi.string().required(),
//     // REDIS_HOST: Joi.string().required(),
//     // REDIS_PORT: Joi.string().required(),
//   });

export const envConfig = () => ({
  serverConfig: {
    port: parseInt(process.env.SERVER_PORT, 10) || 3000,
  },
  ftConfig: {
    uid: process.env.CLIENT_ID_42,
    secret: process.env.CLIENT_SECRET_42,
    redirectUri: process.env.CALL_BACK_URL,
  },
  authConfig: {
    jwt: process.env.JWT_SECRET,
    expiredIn: process.env.JWT_EXPIRED_IN,
    algorithm: process.env.JWT_ALGORITHM,
  },
  dbConfig: {
    dbname: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  },
});
