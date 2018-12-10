DROP DATABASE IF EXISTS bamazon;

Create database bamazon;

Use bamazon;

Create table products (
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(25) NOT NULL,
department_name VARCHAR(25) NOT NULL,
price decimal(10, 2) NOT NULL,
stock_quantity integer(10) NOT NULL,
PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Lemon Wonder", "Bulk Desserts", 33.00, 746);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Orange Delight", "Bulk Desserts", 36.50, 555);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Kiwi Passion", "Bulk Desserts", 9.00, 534);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Papaya Yoghurt", "Breakfast", 8.00, 234);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Banana Marshmallow", "Breakfast", 4.50, 92);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Cherry Brandy", "Desserts", 15.50, 424);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Avacado Chestnut", "Lunch", 16.00, 634);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Tomato Buttercream", "Lunch", 38.50, 223);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Sweet Pepper Garlic", "Lunch", 48.00, 127);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Plum Basil", "Single Desserts", 3.50, 225);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Grape Mint", "Single Desserts", 2.50, 112);