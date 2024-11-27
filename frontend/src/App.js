import React, { useState } from 'react';
import './App.css';
import Products from './components/Products';
import AddSale from './components/AddSale';
import DailyReport from './components/DailyReport';
import Customers from './components/Customers';

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
        <DailyReport />
      </main>
    </div>
  );
}

export default App;
