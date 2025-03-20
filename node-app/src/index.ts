import express from "express";
import 'dotenv/config';
import '@shopify/shopify-api/adapters/node';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';
import { restResources } from '@shopify/shopify-api/rest/admin/2023-04';

const app = express();
app.use(express.json()); 

const {
    PORT,
    API_SECRET,
    SHOPIFY_STORE_URL,
    SHOPIFY_ACCESS_TOKEN,
    VARIANT_ID
} = process.env;

const shopify = shopifyApi({
    apiSecretKey: API_SECRET!,
    isCustomStoreApp: true,                        
    adminApiAccessToken: SHOPIFY_ACCESS_TOKEN, 
    isEmbeddedApp: false,
    hostName: SHOPIFY_STORE_URL!, 
    apiVersion: LATEST_API_VERSION,
    restResources,
});

const session = shopify.session.customAppSession(SHOPIFY_STORE_URL!);
const client = new shopify.clients.Graphql({ session });

const fetchOrders = async () => {
    try {
        const response = await client.request(
            `query {
                orders(first: 50, reverse: true, query: "variant_id:${VARIANT_ID} created_at:<=30d") {
                    edges {
                        node {
                            id
                            customer {
                                firstName
                                lastName
                            }
                            lineItems(first: 250) {
                                edges {
                                    node {
                                        name
                                        quantity
                                        variant {
                                            id
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }`
        );

        const orders = response.data.orders.edges;            
        console.log('Orders: ', JSON.stringify(orders, null, 2))

    } catch (error) {
        console.error('Error fetching orders:', error);
    }
};

fetchOrders();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});