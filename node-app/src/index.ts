import express, { Request, Response } from "express";
import 'dotenv/config';
import { fetchOrders, fetchProducts, comparePrices } from "./services/shopifyService";
import { getEnvVar } from "./utils/envGetter";
import { logger } from "./utils/logger.js";

const app = express();
app.use(express.json()); 

const PORT = getEnvVar("PORT");
const VARIANT_ID = getEnvVar("VARIANT_ID");

app.get("/previous-orders", (req: Request, res: Response) => {
  fetchOrders(VARIANT_ID)
  .then((orders: object) => {
    logger.info("Orders:", JSON.stringify(orders, null, 2));
    return orders;
  })
  .then((orders: object) => res.json(orders))
  .catch((error: { message: any; }) => logger.error(error.message));
})
  
app.get("/get-current-prices", fetchProducts);

app.post("/webhook", async (req: Request, res: Response) => {
  try {
    await comparePrices(req.body);
    res.status(200).send('Webhook received');
  } catch (error) {
    logger.error('Error processing webhook:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});