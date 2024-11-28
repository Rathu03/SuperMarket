-- Create the products table
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL
);

-- Create the customers table
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20)
);

-- Create the sales table
CREATE TABLE sales (
    sale_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(product_id),
    customer_id INT REFERENCES customers(customer_id),
    quantity INT NOT NULL,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Procedure to update stock when a sale is made
CREATE OR REPLACE FUNCTION update_stock() RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE product_id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the update_stock function after a sale is inserted
CREATE TRIGGER after_sale
AFTER INSERT ON sales
FOR EACH ROW
EXECUTE FUNCTION update_stock();

-- Procedure to generate daily sales report
CREATE OR REPLACE FUNCTION daily_sales_report() RETURNS TABLE(product_name VARCHAR, total_sales INT) AS $$
BEGIN
    RETURN QUERY
    SELECT p.product_name, SUM(s.quantity)
    FROM sales s
    JOIN products p ON s.product_id = p.product_id
    WHERE s.sale_date::DATE = CURRENT_DATE
    GROUP BY p.product_name;
END;
$$ LANGUAGE plpgsql;


CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    product_id INT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);


CREATE OR REPLACE FUNCTION update_orders_from_sales()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert a new record into the orders table
    INSERT INTO orders (customer_id, product_id, price, quantity)
    VALUES (
        NEW.customer_id,
        NEW.product_id,
        (SELECT price FROM products WHERE product_id = NEW.product_id), -- Get price from the products table
        NEW.quantity
    )
    ON CONFLICT (customer_id, product_id) DO UPDATE
    SET quantity = orders.quantity + NEW.quantity; -- Update the quantity if the record exists

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER after_sales_insert
AFTER INSERT ON sales
FOR EACH ROW
EXECUTE FUNCTION update_orders_from_sales();

ALTER TABLE orders ADD CONSTRAINT unique_customer_product UNIQUE (customer_id, product_id);


-- Example Testing

-- Insert into sales
INSERT INTO sales (product_id, customer_id, quantity)
VALUES (1, 1, 5);

-- Check the orders table
SELECT * FROM orders;


