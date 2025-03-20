import '@shopify/shopify-api/adapters/node';
import { graphqlClient } from "../config/shopify";
import { logger } from "../utils/logger";

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
