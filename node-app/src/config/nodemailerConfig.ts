import 'dotenv/config';
import nodemailer from 'nodemailer';
import { getEnvVar } from "../utils/envGetter.js";

const EMAIL_HOST = getEnvVar("EMAIL_HOST");
const EMAIL_PORT = getEnvVar("EMAIL_PORT");
const EMAIL_USER_ADDRESS = getEnvVar("EMAIL_USER_ADDRESS");
const EMAIL_USER_PASSWORD = getEnvVar("EMAIL_USER_PASSWORD");

export const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: true,
    auth: {
      user: EMAIL_USER_ADDRESS,
      pass: EMAIL_USER_PASSWORD,
    },
});