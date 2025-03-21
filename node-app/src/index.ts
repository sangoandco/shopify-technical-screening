import express, { Request, Response } from "express";
import 'dotenv/config';
import { fetchOrders, fetchProducts, comparePrices } from "./services/shopifyService";

const app = express();
app.use(express.json()); 

const {
  PORT,
  VARIANT_ID
} = process.env;

app.get("/previous-orders", (req: Request, res: Response) => {
  fetchOrders(VARIANT_ID)
    .then((orders: object) => {
      console.log("Orders:", JSON.stringify(orders, null, 2));
      return orders;
    })
    .then((orders: object) => res.json(orders))
    .catch((error: { message: any; }) => console.error(error.message));
})

app.get("/get-current-prices", fetchProducts);

app.post("/webhook", async (req: Request, res: Response) => {
  try {
    await comparePrices(req.body);
    res.status(200).send('Webhook received');
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});