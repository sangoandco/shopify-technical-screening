# Shopify Technical Screening

## Task 1: Create a liquid snippet for products on sale
- This solition makes use of the **liquid** templating language
- This solution checks if the variants `compare_at_price` is greater than `price`.
- If so; it renders a span which contains inline css and sale text.

### Setting up
To run this snippet place `{% render 'sale-badge' %}` in the desired location on your **Product Display Page**. This will often be a **Section** which will be named along the lines of `main-product.liquid`. You will also be able to find this by locating the `product` template which will reference it.

### Sale Badge
```sh
{% render 'sale-badge' %}
```

### Assumptions
- You do not have a `sale-badge` currently
- This is only required for **Product Display Pages**

## Task 2: Retrieve orders placed within the last 30 days that contain a specific product ID
This app is built using:
- NodeJS via Typescript
- GraphQL
- Shopify's Admin api

### Installation
1. Populate your **.env** file with the following values:
| Variable   | Value  |
|--------------|---------|
| `SHOPIFY_STORE_URL` | Your store url |
| `SHOPIFY_ACCESS_TOKEN` | Your shopify app's access token |
| `API_KEY` | Your app's api key |
| `API_SECRET` | Your app's api secret |
| `PORT` | The port you want to run this application on locally |
2. `cd` into `node app`
3. run `npm i` to install all dependencies
4. run `npm run dev` to run the app in dev mode

### Assumptions
- That there would be no more than 50 products in the tested dev store
- That you would like to pull variant id as it is more specific
- Your shopify has access to the following scopes `write_orders, read_orders, write_customers, read_customers`