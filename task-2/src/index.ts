import express from "express";
import 'dotenv/config';
import { fetchOrders } from "./services/shopifyService";
import { getEnvVar } from "./utils/envGetter";
import { logger } from "./utils/logger.js";

const app = express();
app.use(express.json()); 

const PORT = getEnvVar("PORT");
const VARIANT_ID = getEnvVar("VARIANT_ID");

fetchOrders(VARIANT_ID)
  .then((orders: object) => {
    logger.info("Orders:", JSON.stringify(orders, null, 2));
    return orders;
  })
  .then((orders: object) => (orders))
  .catch((error: { message: any; }) => logger.error(error.message));

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});