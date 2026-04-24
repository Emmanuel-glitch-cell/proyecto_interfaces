CREATE DATABASE IF NOT EXISTS restaurante_peruano;
USE restaurante_peruano;

CREATE TABLE admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dishes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  image_url VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE restaurant_tables (
  id INT AUTO_INCREMENT PRIMARY KEY,
  table_number VARCHAR(20) NOT NULL UNIQUE,
  capacity INT NOT NULL
);

CREATE TABLE reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  table_id INT NOT NULL,
  guests INT NOT NULL,
  status ENUM('pending','confirmed','cancelled') DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (table_id) REFERENCES restaurant_tables(id),
  UNIQUE KEY unique_table_datetime (reservation_date, reservation_time, table_id)
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  payment_method ENUM('tarjeta','yape','plin') NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  dish_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (dish_id) REFERENCES dishes(id)
);

INSERT INTO restaurant_tables (table_number, capacity) VALUES
('Mesa 1', 2),
('Mesa 2', 4),
('Mesa 3', 4),
('Mesa 4', 6),
('Mesa 5', 8);

INSERT INTO dishes (name, description, price, stock, image_url, category) VALUES
('Lomo saltado', 'Carne salteada con papas y arroz', 28.00, 10, 'https://images.unsplash.com/photo-1547592180-85f173990554', 'Fondo'),
('Ají de gallina', 'Pollo deshilachado con salsa cremosa', 24.00, 12, 'https://images.unsplash.com/photo-1512058564366-18510be2db19', 'Fondo'),
('Ceviche', 'Pescado fresco con limón y ají', 26.00, 8, 'https://images.unsplash.com/photo-1535141192574-5d4897c12636', 'Entrada'),
('Anticuchos', 'Brochetas de corazón con papas', 20.00, 15, 'https://images.unsplash.com/photo-1544025162-d76694265947', 'Antojito');


INSERT INTO admin_users (username, password_hash)
VALUES (
  'admin',
  '$2b$10$G2593dzbbiME157zSGBDGuMXtf1ReOxW9Tb3WpHYfDR2hgALc9qoG'
);