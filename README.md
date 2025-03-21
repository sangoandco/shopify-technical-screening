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
| Variable   | Value  | Example | 
|--------------|---------|---------|
| `SHOPIFY_STORE_URL` | Your store url | `my-store`.myshopify.com |
| `SHOPIFY_ACCESS_TOKEN` | Your shopify app's access token | `...` |
| `API_SECRET` | Your app's api secret | `...` |
| `PORT` | The port you want to run this application on locally | `3000` |
| `VARIANT_ID` | The id of the variant you would like to check against | *gid://shopify/ProductVariant/*`56935439270237` |
2. `cd` into `node app`
3. run `npm i` to install all dependencies
4. run `npm run dev` to run the app in dev mode
5. see **Task 3** for details on getting previous orders 

### Assumptions
- That there would be no more than 50 products in the tested dev store
- That you would like to pull variant id as it is more specific
- Your shopify has access to the following scopes `write_orders, read_orders, write_customers, read_customers`

## Task 3
This app is is an extension of *task-2*

### Setup
1. Add the following values to your **.env** file: 
| Variable   | Value  | Example | 
|--------------|---------|---------|
| `EMAIL_HOST` | Your email host | `smtp.gmail.com` |
| `EMAIL_PORT` | Your email port setting | `465` |
| `EMAIL_USER_NAME` | The email Sender's name | `John Peters` |
| `EMAIL_USER_ADDRESS` | Your email address | `john@snowmail.com` |
| `EMAIL_USER_PASSWORD` | Your email's password | `H*tWater!` |
2. Start your development server and connect to a tunneling service to gain access to `https`
3. Once you have your **url**; navigate to `settings > notifications > webhooks > create webhook`.
    1. **event** = `product update`
    2. **format** = `JSON`
    3. **url** = The Tunneling Url recieved from **Step 2**
    4. **webhook** = `Latest`

### Running application
1. Navigate to **url or localhost:port**/previous-orders to get previous orders
2. Navigate to **url or localhost:port**/get-current-prices to write a json file with current prices of products on store
3. Test webhook from shopify to test if data is logged upon testing
4. Navigate to product page & edit the pricing of products.
5. Ensure shopify has access to the following scopes `write_products, read_products, write_product_listings, read_product_listings, write_product_feeds, read_product_feeds, read_customer_events`

### Assumptions
- That you are able to serve your app via https
- You are comfortable using **nodemailer**
- That you would like to send an email to yourself
- It would be quicker to write to a local file instead of using a DB

## License  
This project is licensed under the **MIT License**.

---

### **Contributors**  
- **Moses Sangobiyi** – Creator & Developer  
