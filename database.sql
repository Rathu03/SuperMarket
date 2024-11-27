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
