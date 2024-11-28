import axios from 'axios';
import React, { useEffect, useState } from 'react';

const CustomerReport = () => {
  const [report, setReport] = useState([]);
  const [analysis, setAnalysis] = useState([]);

  // Fetch report data
  const fetchCustomerReport = async () => {
    try {
      const response = await axios.get('http://localhost:5000/customer-report');
      setReport(response.data);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch report');
    }
  };

  // Analyze report data
  const analyzeReport = () => {
    const customerAnalysis = report.reduce((acc, { customer_id, product_id, total_quantity }) => {
      if (!acc[customer_id]) acc[customer_id] = [];
      acc[customer_id].push({ product_id, total_quantity });
      return acc;
    }, {});

    const customerSummary = Object.entries(customerAnalysis).map(([customerId, purchases]) => {
      const topProduct = purchases.reduce((max, item) =>
        item.total_quantity > max.total_quantity ? item : max
      );
      return {
        customer_id: customerId,
        product_id: topProduct.product_id,
        total_quantity: topProduct.total_quantity,
      };
    });

    setAnalysis(customerSummary);
  };

  useEffect(() => {
    fetchCustomerReport();
  }, []);

  useEffect(() => {
    if (report.length > 0) {
      analyzeReport();
    }
  }, [report]);

  return (
    <div>
      <h3>Customer Purchase Analysis</h3>
      {analysis.length > 0 ? (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Top Product ID</th>
              <th>Total Quantity</th>
            </tr>
          </thead>
          <tbody>
            {analysis.map(({ customer_id, product_id, total_quantity }) => (
              <tr key={customer_id}>
                <td>{customer_id}</td>
                <td>{product_id}</td>
                <td>{total_quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading analysis...</p>
      )}
    </div>
  );
};

export default CustomerReport;
