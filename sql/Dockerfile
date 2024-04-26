FROM mysql

ENV MYSQL_ROOT_PASSWORD=pass PORT=3306

COPY ./schema.sql /docker-entrypoint-initdb.d/

EXPOSE 3306

RUN chmod -R 644 /docker-entrypoint-initdb.d/schema.sql