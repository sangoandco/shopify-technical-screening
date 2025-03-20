import express from "express";
import 'dotenv/config';
import { fetchOrders } from "./services/shopifyService";

const app = express();
app.use(express.json()); 

const {
    PORT,
    VARIANT_ID
} = process.env;

fetchOrders(VARIANT_ID)
    .then((orders: object) => console.log("Orders:", JSON.stringify(orders, null, 2)))
    .catch((error: { message: any; }) => console.error(error.message));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});