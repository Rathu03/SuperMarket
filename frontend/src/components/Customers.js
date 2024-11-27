import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './Products.css';
import { CiCirclePlus } from "react-icons/ci";

const Customers = () => {

  const [customers,setCustomers] = useState([])
  const [clicked,setClicked] = useState(false)
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [phone,setPhone] = useState('')
  const [buttonClick,setButtonClick] = useState(false)

  useEffect(() => {
    fetchCustomers()
  },[buttonClick])

  const fetchCustomers = async() => {
    try{
      const response = await axios.get(`http://localhost:5000/customerlist`);
      setCustomers(response.data)
    }
    catch(error){
      console.error(error)
      alert('Failed to fetch customers')
    }
  }

  const handleAddcustomer = async(e) => {
    e.preventDefault()
    try{
      const body = {name,email,phone}
      const response = await fetch(`http://localhost:5000/addcustomer`,{
        method:"POST",
        headers:{
          "Content-type" : "application/json"
        },
        body:JSON.stringify(body)
      })
      const data = await response.json()
      console.log(data)
      if(data.message == 'success'){
        alert("Added Successfully")
        setName('')
        setEmail('')
        setPhone('')
        setButtonClick(!buttonClick)
      }
    }
    catch(err){
      console.error(err)
    }
  }

  return (
    <div className='products-container'> 
        <h2>Customer List <CiCirclePlus className='circlebutton' onClick={(e) => setClicked(!clicked)}/></h2>
        {clicked ? 
        <>
          <div className='products-form'>
            <div>Customer Name</div>
            <input 
              type='text'
              name='name'
              placeholder='Enter customer name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className='products-form'>
            <div>Email</div>
            <input 
              type='email'
              name='email'
              placeholder='Enter email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='products-form'>
            <div>Phone Number</div>
            <input 
              type='text'
              name='phone'
              placeholder='Enter phone number'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
         
            <button onClick={handleAddcustomer} className='button'>Add Customer</button>
          
        </> : <></>}
        <div className='product-list'>
          {customers.map((entry,index) => (
            <div key={index} className='product-card'>
              <h3>{entry.name}</h3>
              <p>Customer Id: {entry.customer_id}</p>
            </div>
          ))}
        </div>
    </div>
  )
}

export default Customers