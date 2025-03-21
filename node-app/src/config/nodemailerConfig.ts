import 'dotenv/config';
import nodemailer from 'nodemailer';

const {
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER_ADDRESS,
    EMAIL_USER_PASSWORD,
} = process.env;

export const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: true,
    auth: {
      user: EMAIL_USER_ADDRESS,
      pass: EMAIL_USER_PASSWORD,
    },
});