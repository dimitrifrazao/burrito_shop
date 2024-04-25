# burrito_shop

## About

Burrito shop is a simple rest api example to support a burrito shop's point of sales and
ordering system.

This backend example uses the following tech:

- node.js and express for our rest api.
- typescript.
- jest for unit testing.
- mysql2 to connect to mysql.
- docker.
- passport google oauth20

## Installing and running

First make sure you have [node.js](https://nodejs.org/en) installed.

Then clone the project by running the following git command:  
`git clone https://github.com/dimitrifrazao/burrito_shop`

Create a .env file and define these env variables to allow the app to connect to mysql.  
NOTE: change host, user and password to your production env.

MYSQL_HOST = 127.0.0.1  
MYSQL_USER = 'root'  
MYSQL_PASSWORD = ''  
MYSQL_DATABASE = 'burritoDB'

When making an order there's a limit of 100 per burrito.  
You can change this by setting this .env variable, ex:  
COUNT_LIMIT = 50

By default the burrito_shop app serves on localhost port 8080.  
You can change the host and port by adding these variables in your .env file:  
HOST = localhost
PORT = 8080

To install node packages: `npm install`  
To build the typescript files into dist: `npm run tsc`  
To run the app in dev mode (auto runs tsc): `npm run dev`  
To run the app in production mode: `npm start`  
To run jest tests: `npm test`

## Mysql

The app uses a mysql database.  
If you want to test this app without using docker you'll need to install [mysql](https://www.mysql.com/).  
Use the sql/schema.sql file to create the burritoDB database.

## Authentication

The app requires a google authentication for order and order detail end points.

First, you'll need to create a [google OAuth 2.0 credential](https://developers.google.com/identity/protocols/oauth2).  
When setting your credential redirect path, make sure to set your host and port:  
`http://{your host}:{your port}/auth/google/callback"`

In your .env file add a client id and client secret from your OAuth 2.0 credential:  
GOOGLE_CLIENT_ID = "{client id}"  
GOOGLE_CLIENT_SECRET = "{client secret}"

In your .env file make sure to define the host and port used in your redirect path, ex:  
REDIRECT_HOST = localhost  
REDIRECT_PORT = 8080

You also need to define a session secret in your .env file:  
SESSION_SECRET = "some secret word"

You can disable authentication when running tests by setting this .env variable to true:  
SKIP_AUTH = true

NOTE: do not update passport. [There's a bug on version 6 that causes a crash](https://github.com/jaredhanson/passport/issues/907).

## Docker

First make sure you have [docker](https://www.docker.com/) installed.  
I recommend downloading [docker desktop](https://www.docker.com/products/docker-desktop/).

You can find the burrito shop app & mysql images at my [docker hub](https://hub.docker.com/repositories/dimitrifrazao)

To clone the app docker image run: `docker pull dimitrifrazao/burrito_shop-web_app`  
To clone the mysql docker image run: `docker pull dimitrifrazao/burrito_shop-mysql`

You can also set your .env file and build the docker compose yml file.  
To launch the docker-compose run: `docker-compose up`

## .env file variables

```
HOST
PORT
MYSQL_HOST
MYSQL_USER
MYSQL_PASSWORD
MYSQL_DATABASE
COUNT_LIMIT (optional)
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
SESSION_SECRET
REDIRECT_HOST
REDIRECT_PORT
SKIP_AUTH
```

## API

### /api/v1/burrito

A GET on this end point will return a json file representing a list of available burritos to order.  
Each burrito has a unique id, name, size (small, mdedium, large and extra large) and price.  
Size is represented by 'S', 'M', 'L' and 'XL'.

```
[
    {
        "id": 1,
        "name": "Chicken",
        "size": "S",
        "price": "3.50"
    }
]
```

### /api/v1/orders

A GET on this end point will return a json file representing a list of orders.  
Each order has a unique id and a total price.

```
[
    {
        "order_id": 1,
        "total": "22.60"
    }
]
```

A POST on this end point will add an order to the order list.  
You need to pass a json file in the request body that represents the order data.  
The order data is just a list of order items.  
Each order item has a burrito id (from the burrito list) and a count number.  
The response will be the same as a GET but showing only the newly created order.

```
[
    {
        "burrito_id": 1,
        "count": 1
    }
]
```

### /api/v1/orders/id

NOTE: id must be a valid order id number, ex: /api/v1/orders/1  
A GET on this endpoint will return a list with details of an existing order.  
The detail list is composed of order items.

```
[
    {
        "name": "Chicken",
        "size": "S",
        "price": "3.50",
        "count": 2
    },
    {
        "name": "Beef",
        "size": "S",
        "price": "4.10",
        "count": 3
    },
    {
        "name": "Pork",
        "size": "S",
        "price": "3.30",
        "count": 1
    }
]
```

## To do

- add more jest tests.
- make a more robust user input validation.
- add payment middleware.
- store user auth in database.
- show only user orders when using orders endpoint.
- admin endpoint to modify burrito list?
- option for users to change order detail.
- drop passport and use google OAuth 2.0 api directly.
