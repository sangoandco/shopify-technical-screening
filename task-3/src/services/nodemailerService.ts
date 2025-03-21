import 'dotenv/config';
import { transporter } from "../config/nodemailerConfig";
import { getEnvVar } from "../utils/envGetter.js";
import { logger } from '../utils/logger.js';

const EMAIL_USER_NAME = getEnvVar("EMAIL_USER_NAME");
const EMAIL_USER_ADDRESS = getEnvVar("EMAIL_USER_ADDRESS");

export async function triggerEmail(currentPrice: number, newPrice: number, percentageDifference: number, title: string) {
    const info = await transporter.sendMail({
        from: `"${EMAIL_USER_NAME}" <${EMAIL_USER_ADDRESS}>`,
        to: `${EMAIL_USER_ADDRESS}`,
        subject: "Price Notification",
        html: `
            <p>The ${title} has been edited</p>
            <ul>
                <li>Old price: £${currentPrice}</li>
                <li>New price: £${newPrice}</li>
                <li>Percentage decrease: ${percentageDifference}%</li>
            </ul>
        `,
    });
  
    logger.info("Message sent: %s", info.messageId);
  }