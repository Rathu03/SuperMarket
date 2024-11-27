const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: 'root',
  host: 'localhost',
  database: 'supermarket',
  password: 'root',
  port: 5432,
});

pool.connect((err) => {
    if(err) throw err
    console.log('Connected to Postgresql')
})



// Route to get products
app.get('/products', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM products');
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  
  // Route to add a sale
  app.post('/sales', async (req, res) => {
    const { product_id, customer_id, quantity } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO sales (product_id, customer_id, quantity) VALUES ($1, $2, $3) RETURNING sale_id',
        [product_id, customer_id, quantity]
      );
      res.json({ sale_id: result.rows[0].sale_id });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

  
  // Route to get daily sales report
  app.get('/report/daily-sales', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM daily_sales_report()');
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });


  app.post('/product', (req, res) => {
    const {id} = req.body;
    
    const query = `SELECT product_name, price FROM products WHERE product_id = $1`;
  
    pool.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error fetching product details:', err);
        return res.status(500).json({ error: 'Error fetching product details' });
      }

      const size = results.rows.length

      console.log(results.rows)

      if (size > 0) {
        const product = results.rows[0];
        return res.json(product);
      } else {
        return res.status(404).json({ error: 'Product not found' });
      }
    });
  });
  
  // API endpoint to fetch customer details by customer_id
  app.post('/customer', (req, res) => {
    
    const {id} = req.body;
    const query = `SELECT name FROM customers WHERE customer_id = $1`;
  
    pool.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error fetching customer details:', err);
        return res.status(500).json({ error: 'Error fetching customer details' });
      }

      const size = results.rows.length
  
      if (size > 0) {
        const customer = results.rows[0];
        return res.json(customer);
      } else {
        return res.status(404).json({ error: 'Customer not found' });
      }
    });
  });


  app.post('/addproduct',async(req,res) => {
    const {productname,price,stock} = req.body
    const query = `insert into products(product_name,price,stock_quantity) values($1,$2,$3)`;
    try{
      await pool.query(query,[productname,price,stock])
      res.status(200).json({'message':'success'})
    }
    catch(err){
      console.log(err)
      res.status(500).send('Server error');
    }
  })

  app.post('/addcustomer',async(req,res) => {
    const {name,email,phone} = req.body
    const query = `insert into customers(name,email,phone) values($1,$2,$3)`;
    try{
      await pool.query(query,[name,email,phone])
      res.status(200).json({'message':'success'})
    }
    catch(err){
      console.log(err)
      res.status(500).send('Server error');
    }
  })

  app.get('/customerlist',async(req,res) => {
    try {
      const result = await pool.query('SELECT * FROM customers');
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  })

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
  });