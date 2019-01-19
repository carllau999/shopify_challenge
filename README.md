## Folder Structure
    .
    ├── cart                   # Files containing API routes affecting the cart
          ├── index 
    ├── models                 # Models used
          ├── cart_model
    ├── products               # Files containing API routes querying products
          ├── index
    ├── config                 # MySQL database credentials
    ├── database               # Middleware for MySQL connections
    ├── index                  # Direct API routes to cart and products
    ├── server                 # Initialize server
    └── README.md

##  Usage
RESTful API documentation is currently hosted on **Swagger** linked below:

https://app.swaggerhub.com/apis-docs/carllau999/shopify_challenge/1.0
Click on an API and then click try it out and execute to test it. 
> A cart must be created before calling an other cart APIs since a token is generated for a cart upon creation

You can also test the curl commands provided in the Swagger docs on the terminal.
> Due to CORS setting, it can only be tested through localhost or through the Swagger platform

The APIs are currently hosted at http://142.93.151.141 .
### Local Testing
PM2 is used to manage the Node.JS server, so we have to first install PM2 and the server's dependencies:
```
npm install
npm install pm2@latest
```
Then to start the server run:
```
pm2 start server.js
```
or
```
npm run start
```

## Hosting
Node.JS backend is currently hosted on a Ubuntu server and connected to a MySQL database with phpMyAdmin installed.
The database can be viewed at http://142.93.151.141/phpmyadmin/ with the following credentials:
```
username: user
password: shopify
```
## Database Structure
Table carts:

| token        | products           | 
| ------------- |-------------|
| string     | string of product ids seperated by commas | 

Table products:

| id        | title           | price    | inventory_count |
| ------------- |-------------| ---------| ----------------|
| int     | string | float        | int |
