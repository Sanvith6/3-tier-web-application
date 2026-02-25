CREATE DATABASE IF NOT EXISTS crud_app;
USE crud_app;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  category VARCHAR(80) NOT NULL,
  stock INT NOT NULL CHECK (stock >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO products (name, price, category, stock)
SELECT 'Mechanical Keyboard', 79.99, 'Accessories', 40
WHERE NOT EXISTS (SELECT 1 FROM products);

INSERT INTO products (name, price, category, stock)
SELECT 'Wireless Mouse', 29.99, 'Accessories', 85
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Wireless Mouse');

INSERT INTO products (name, price, category, stock)
SELECT '27 inch Monitor', 249.50, 'Display', 22
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = '27 inch Monitor');
