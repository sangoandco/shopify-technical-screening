import '@shopify/shopify-api/adapters/node';
import { graphqlClient } from "../config/shopify";
import { logger } from "../utils/logger";
import fs from 'fs';
import { triggerEmail } from "../services/nodemailerService"
import path from "path";

export const fetchProducts = async () => {
    try {
        const loader = `
            query {
                products(first: 250) {
                    edges {
                        node {
                            id
                            title
                            variants(first: 5) {
                                edges {
                                    node {
                                    id
                                    displayName
                                    price
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `

        const response = await graphqlClient.request(loader)
        const filePath = './src/assets/current-prices.json';
        fs.writeFileSync(filePath, JSON.stringify(response.data.products.edges, null, 2), 'utf-8');
        logger.info(`Product data has been written to ${filePath}`);

        return
    } catch (error) {
        logger.error("Error fetching products:", error);
        return
    }
};

export const comparePrices = async (newResponse: any): Promise<void> => {
    try {
        logger.info("Webhook triggered:", JSON.stringify(newResponse, null, 2));

        const currentPricesPath = path.join(getCurrentDir(), '../assets/current-prices.json');
        const currentPricesData = fs.readFileSync(currentPricesPath, 'utf-8');
        const currentPrices = JSON.parse(currentPricesData);
        
        let priceUpdated = false;

        currentPrices.forEach((currentProduct: any) => {

            currentProduct.node.variants.edges.forEach((variantEdge: any) => {
                const currentVariantId = `gid://shopify/ProductVariant/${variantEdge.node.id.split('/').pop()}`;
                const matchingVariant = newResponse.variants.find(
                (variant: any) => variant.admin_graphql_api_id === currentVariantId
                );

                if (matchingVariant) {
                    const currentPrice = parseFloat(variantEdge.node.price);
                    const newPrice = parseFloat(matchingVariant.price);
                    let title = variantEdge.node.displayName

                    if (newPrice !== currentPrice) {
                        variantEdge.node.price = newPrice.toFixed(2);
                        priceUpdated = true;
                    }

                    if (newPrice <= (currentPrice * 0.8)) {
                        const percentageDifference = ((currentPrice - newPrice) / currentPrice) * 100;

                        triggerEmail(currentPrice, newPrice, percentageDifference, title);
                    }
                }
            });
        });

        if (priceUpdated) {
            fs.writeFileSync(currentPricesPath, JSON.stringify(currentPrices, null, 2), 'utf-8');
            logger.info("Updated current-prices.json");
        }

    } catch (error) {
        logger.error("Error reading current prices or comparing prices:", error);
    }
}

const getCurrentDir = () => {
    const url = new URL(import.meta.url);
    return path.dirname(url.pathname);
};