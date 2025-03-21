import '@shopify/shopify-api/adapters/node';
import { graphqlClient } from "../config/shopify";
import { logger } from "../utils/logger";
import { Response } from "express";
import fs from 'fs';
import { triggerEmail } from "../services/nodemailerService"
import path from "path";

interface Order {
    id: string;
    customer: { firstName: string; lastName: string } | null;
    lineItems: {
        edges: {
            node: {
                name: string;
                quantity: number;
                variant: { id: string };
            };
        }[];
    };
}

interface ShopifyResponse {
    data: {
        orders: {
            edges: { node: Order }[];
        };
    };
}

export const fetchOrders = async (variantId: string): Promise<Order[]> => {
    try {
        const query = `
            query {
                orders(first: 50, reverse: true, query: "variant_id:${variantId} created_at:<=30d") {
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
            }
        `;

        const response: ShopifyResponse = await graphqlClient.request(query);
        const orders = response.data.orders.edges.map(edge => edge.node);

        logger.info(`Fetched ${orders.length} orders`);

        return orders;
    } catch (error) {
        logger.error('Error fetching orders:', error);
        throw new Error('Failed to fetch orders');
    }
};

export const fetchProducts = async (_req: Request, res: Response): Promise<Response | void> => {
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

        return res.json({ message: "Product data successfully written", filePath });
    } catch (error) {
        logger.error("Error fetching products:", error);
        return res.status(500).json({ error: "Failed to fetch products" });
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