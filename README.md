# burrito_shop

## installing and running

Burrito shop rest api example using node.js, express and mysql2.

First clone the project by running:  
`git clone https://github.com/dimitrifrazao/burrito_shop`

Make sure you have [node.js](https://nodejs.org/en) installed.  
If you want to test this app without using docker you'll need to install [mysql](https://www.mysql.com/).

Use the sql/schema.sql file to create the burritoDB database.  
Create a .env file and define these env variables to allow the app to connect to mysql:

MYSQL_HOST = 127.0.0.1  
MYSQL_USER = 'root'  
MYSQL_PASSWORD = ''  
MYSQL_DATABASE = 'burritoDB'

NOTE: change host, user and password to whatever suit your needs.

By default the burrito_shop app serves on port 8080.  
You can have it run on a different port by adding PORT variable to your .env file.  
EX:  
PORT = 5000

To install node packages: `npm install`  
To build the typescript files into dist: `npm run tsc`  
To run the app in dev mode (auto runs tsc): `npm run dev`  
To run the app in production mode: `npm start`
To run jest tests: `npm test`

## docker

First make sure you have [docker](https://www.docker.com/) installed.  
I recommend downloading [docker desktop](https://www.docker.com/products/docker-desktop/).

To clone this app docker image run: `docker pull dimitrifrazao/burrito_shop:latest`  
To run the image: `docker run dimitrifrazao/burrito_shop:latest`

You can also build the image from the dockerfile in this project:  
`docker build . -t dimitrifrazao/burrito_shop:latest`

Note: the image is just for the app. If you want docker to also launch mysql then run docker-compose.  
First, make sure you have the app image (either build or clone as mentioned above).  
To launch the docker-compose run: `docker-compose up`

## burrito shop api

Burrito list end point:  
/api/v1/burrito

A GET on this end point will return a json file representing a list of available burritos to order.
Each burrito has a unique id, name, size (small, mdedium, large and extra large) and price.  
Size is represented by 'S', 'M', 'L' and 'XL'.

```
[
    {
        "id": 1,
        "name": "Chicken",
        "size": "S",
        "price": "3"
    }
]
```

Orders end point:  
/api/v1/orders

A GET on this end point will return a json file representing a list of orders.
Each order has a unique id and a total price.

```
[
    {
        "order_id": 1,
        "total": "22"
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
        "count": "1"
    }
]
```

Order detail end point:  
/api/v1/orders/id  
NOTE: id must be a valid order id number, ex: /api/v1/orders/1

A GET on this endpoint will return a list with details of an existing order.  
The detail list is composed of order items.

```
[
    {
        "name": "Chicken",
        "size": "S",
        "price": "3",
        "count": 2
    },
    {
        "name": "Beef",
        "size": "S",
        "price": "4",
        "count": 3
    }
]
```
