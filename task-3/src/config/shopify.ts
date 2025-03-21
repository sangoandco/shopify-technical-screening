import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';
import { restResources } from '@shopify/shopify-api/rest/admin/2023-04';
import 'dotenv/config';
import { getEnvVar } from "../utils/envGetter.js";

const API_SECRET = getEnvVar("API_SECRET");
const SHOPIFY_STORE_URL = getEnvVar("SHOPIFY_STORE_URL");
const SHOPIFY_ACCESS_TOKEN = getEnvVar("SHOPIFY_ACCESS_TOKEN");

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
