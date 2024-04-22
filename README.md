# burrito_shop

burrito shop rest api example

first clone the project:
git clone https://github.com/dimitrifrazao/burrito_shop

make sure you have Node.js and mysql installed.
install node packages:
npm install

use the schema.sql file to create the burritoDB in mysql.
create a .env file and define these env variables to connect to mysql:

MYSQL_HOST = 127.0.0.1
MYSQL_USER = 'root'
MYSQL_PASSWORD = ''
MYSQL_DATABASE = 'burritoDB'

NOTE: change some of those values to your priviledge settings.

to run jest tests:
npm test

to build the source ts files:
npm run tsc

to run the app in development mode:
npm run dev

to run the app:
npm run start
