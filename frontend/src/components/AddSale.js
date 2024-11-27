import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddSale.css';

function AddSale() {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [data, setData] = useState([]);
  const [saleAdded, setSaleAdded] = useState(false); // To track sale status
  const [totalPrice, setTotalPrice] = useState(0); // To calculate the total price

  // Fetch product and customer details from server
  const fetchProductDetails = async (productId) => {
    try {
      const response = await axios.post(`http://localhost:5000/product`,{id : productId});
      return response.data;  // Expected: { product_name, price }
    } catch (error) {
      console.error('Error fetching product details:', error);
      return null;
    }
  };

  const fetchCustomerDetails = async (customerId) => {
    try {
      const response = await axios.post(`http://localhost:5000/customer`,{id : customerId});
      console.log(response)
      return response.data;  // Expected: { customer_name }
    } catch (error) {
      console.error('Error fetching customer details:', error);
      return null;
    }
  };

  // Add sale to local data before sending to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Only add sale if all fields are filled
    if (productId && quantity && customerId) {
      try {
        const productDetails = await fetchProductDetails(productId);
        const customerDetails = await fetchCustomerDetails(customerId);

        console.log(productDetails,customerDetails)
        
        if (productDetails && customerDetails) {
          const total = productDetails.price * quantity;
          const newSale = {
            productId,
            customerId,
            quantity,
            productName: productDetails.product_name,
            //customerName: customerDetails.customer_name,
            price: productDetails.price,
            totalPrice: total,
          };
          
          setData([...data, newSale]);  // Add the sale to the data array
          setProductId('');
          setQuantity('');
        } else {
          alert('Invalid product or customer ID');
        }
      } catch (error) {
        alert('Error adding sale');
        console.error(error);
      }
    } else {
      alert('Please fill all fields');
    }
  };

  // Function to send sale to backend (API call)
  const addSale = async (sale) => {
    try {
      await axios.post('http://localhost:5000/sales', {
        product_id: sale.productId,
        customer_id: sale.customerId,
        quantity: sale.quantity,
      });
    } catch (error) {
      console.error(error);
      alert('Error adding sale');
    }
  };

  // Function to handle adding all sales to the backend
  const handleSaleSubmit = async (e) => {
    e.preventDefault();

    if (data.length === 0) {
      alert('No sales to add');
      return;
    }

    try {
      let total = 0;
      for (const sale of data) {
        await addSale(sale);  // Add each sale to the backend
        total += sale.totalPrice;  // Add each sale's total price
      }
      setTotalPrice(total);  // Set the total price for the alert
      setSaleAdded(true);  // Indicate that the sale was successfully added
    } catch (error) {
      console.error(error);
      alert('Error adding all sales');
    }
  };

  useEffect(() => {
    if (saleAdded) {
      alert(`Total Price: $${totalPrice}`);
      window.location.reload();  // Reload the page to reset the state after adding sales
    }
  }, [saleAdded, totalPrice]);

  return (
    <div className="add-sale-container">
      <h2>Add Sale</h2>

      {/* Customer ID input outside the form */}
      <div>
        <input
        className='test'
          type="number"
          placeholder="Customer ID"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          required
        />
      </div>

      <form onSubmit={handleSubmit} className="sale-form">
        <input
          type="number"
          placeholder="Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          required
        />
        
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
        <button type="submit">Add Sale</button>
      </form>

      {/* Button to add all sales to the backend */}
      <button type="submit" onClick={handleSaleSubmit}>
        Add All to Sale
      </button>

      {/* Displaying the added sales in a table */}
      <div className="sales-list">
        <h3>Added Sales</h3>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              {/* <th>Customer Name</th> */}
              <th>Quantity</th>
              <th>Price</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {data.map((sale, index) => (
              <tr key={index}>
                <td>{sale.productName}</td>
                {/* <td>{sale.customerName}</td> */}
                <td>{sale.quantity}</td>
                <td>${sale.price}</td>
                <td>${sale.totalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AddSale;
