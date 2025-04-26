import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
  NODE_ENV,
  PORT,
  DB_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  AWS_BUCKET_NAME,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  PORT_AUTH_SERVICE
} = process.env;
