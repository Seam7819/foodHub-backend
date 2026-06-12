import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT,

  databaseUrl: process.env.DATABASE_URL,

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET as string,

    refreshSecret: process.env.JWT_REFRESH_SECRET as string,

    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,

    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  },
};