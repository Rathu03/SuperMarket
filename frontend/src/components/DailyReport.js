import React, { useState } from 'react';
import axios from 'axios';
import './DailyReport.css';

function DailyReport() {
  const [report, setReport] = useState([]);

  const fetchDailyReport = async () => {
    try {
      const response = await axios.get('http://localhost:5000/report/daily-sales');
      setReport(response.data);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch report');
    }
  };

  return (
    <div className="daily-report-container">
      <h2>Daily Sales Report</h2>
      <button onClick={fetchDailyReport}>Get Report</button>
      <div className="report-list">
        {report.map((entry, index) => (
          <div key={index} className="report-card">
            <h3>{entry.product_name}</h3>
            <p>Units Sold: {entry.total_sales}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DailyReport;
