export const envConfig = () => ({
  serverConfig: {
    port: parseInt(process.env.SERVER_PORT, 10) || 3000,
    url: process.env.SERVER_URL,
    clientUrl: process.env.CLIENT_URL
  },
  ftConfig: {
    uid: process.env.CLIENT_ID_42,
    secret: process.env.CLIENT_SECRET_42,
    redirectUri: process.env.CALL_BACK_URL,
  },
  awsConfig: {
    uid: process.env.AWS_ACCESS_KEY,
    secret: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
    bucket: process.env.AWS_BUCKET,
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
