import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';
import { restResources } from '@shopify/shopify-api/rest/admin/2023-04';
import 'dotenv/config';

const {
    API_SECRET,
    SHOPIFY_STORE_URL,
    SHOPIFY_ACCESS_TOKEN
} = process.env;

if (!API_SECRET || !SHOPIFY_STORE_URL || !SHOPIFY_ACCESS_TOKEN) {
    throw new Error("Missing required Shopify environment variables");
}

export const shopify = shopifyApi({
    apiSecretKey: API_SECRET,
    isCustomStoreApp: true,
    adminApiAccessToken: SHOPIFY_ACCESS_TOKEN,
    isEmbeddedApp: false,
    hostName: SHOPIFY_STORE_URL,
    apiVersion: LATEST_API_VERSION,
    restResources,
});

export const session = shopify.session.customAppSession(SHOPIFY_STORE_URL);
export const graphqlClient = new shopify.clients.Graphql({ session });
