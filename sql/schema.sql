CREATE DATABASE IF NOT EXISTS burritoDB;
USE burritoDB;

DROP TABLE IF EXISTS burritoList;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS orderItems;


CREATE TABLE burritoList(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(25) NOT NULL,
    size ENUM('S', 'M', 'L', 'XL') NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orderItems (
    burrito_id INT,
    order_id INT,
    FOREIGN KEY (burrito_id) REFERENCES burritoList(id),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    PRIMARY KEY (burrito_id, order_id),
    count INT DEFAULT 1
);

INSERT INTO burritoList (name, size, price)
VALUES
('Chicken', 'S', 3.5),
('Chicken', 'M', 4.5),
('Chicken', 'L', 5.5),
('Beef', 'S', 4.1),
('Beef', 'M', 4.1),
('Beef', 'L', 5.1),
('Beef', 'XL', 5.1),
('Pork', 'S', 3.3),
('Pork', 'M', 4.3),
('Pork', 'L', 5.3),
('Pork', 'XL', 6.3),
('Breakfast', 'S', 2.2),
('Breakfast', 'M', 3.2),
('Breakfast', 'L', 4.2);

INSERT INTO orders ()
VALUES
();

INSERT INTO orderItems (burrito_id, order_id, count)
VALUES
(1,1,2),
(4,1,3),
(8,1,1);
