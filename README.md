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

By default the burrito_shop app serves on port 8080.  
You can have the app serving on a different port by adding a PORT variable to your .env file, ex:  
PORT = 5000

To install node packages: `npm install`  
To build the typescript files into dist: `npm run tsc`  
To run the app in dev mode (auto runs tsc): `npm run dev`  
To run the app in production mode: `npm start`  
To run jest tests: `npm test`

## Mysql

The app uses a mysql database.  
If you want to test this app without using docker you'll need to install [mysql](https://www.mysql.com/).  
Use the sql/schema.sql file to create the burritoDB database.

## Docker

First make sure you have [docker](https://www.docker.com/) installed.  
I recommend downloading [docker desktop](https://www.docker.com/products/docker-desktop/).

To clone this app docker image run: `docker pull dimitrifrazao/burrito_shop:latest`  
To run the image: `docker run dimitrifrazao/burrito_shop:latest`

You can also build the image from the dockerfile in this project:  
`docker build . -t dimitrifrazao/burrito_shop:latest`

Note: the image is just for the app. If you want docker to also launch mysql then run docker-compose.  
First, make sure you have the app image (either build or clone as mentioned above).  
To launch the docker-compose run: `docker-compose up`

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
