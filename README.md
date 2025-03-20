# Shopify Technical Screening
In this repository you will find...


## 🚀 Task 1: Create a liquid snippet for products on sale
- This solution checks if the variants `compare_at_price` is greater than `price`.
- If so; it renders a span which contains inline css and sale text.

To run this snippet place the following code at your desired location on you your product page.

```sh
{% render 'sale-badge' %}
```