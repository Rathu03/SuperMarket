import React, { useState } from 'react';
import './App.css';
import Products from './components/Products';
import AddSale from './components/AddSale';
import DailyReport from './components/DailyReport';
import Customers from './components/Customers';
import CustomerReport from './components/CustomerReport'

function App() {
  

  return (
    <div className="app-container">
      <header>
        <h1>Supermarket Management System</h1>
      </header>
      <main>
       
          <Products />
          
        <AddSale />
        
        <Customers />
        <div>
        <DailyReport />
        <CustomerReport />
        </div>
        
      </main>
    </div>
  );
}

export default App;
