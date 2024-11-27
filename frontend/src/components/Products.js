import React, { useEffect, useState} from 'react';
import axios from 'axios';
import './Products.css';
import { CiCirclePlus } from "react-icons/ci";

function Products() {
  const [products, setProducts] = useState([]);
  const [clicked,setClicked] = useState(false);
  const [price,setPrice] = useState('')
  const [stock,setStock] = useState('')
  const [productname,setProductname] = useState('');
  const [buttonClick,setButtonClick] = useState(false)


  useEffect(() => {
    async function fetchProducts() {
      const response = await axios.get('http://localhost:5000/products');
      setProducts(response.data);
      console.log(products)
    }
    fetchProducts();
  }, [buttonClick]);


  const handleButton = () => {
    setClicked(!clicked)
    console.log(clicked)
  }

  const handleProductaname = (e) => {
    setProductname(e.target.value)
  }

  const handlePrice = (e) => {
    setPrice(e.target.value)
  }

  const handleStock = (e) => {
    setStock(e.target.value)
  }

  const handleAddproduct = async(e) => {
    e.preventDefault()

    try{
      const body = {productname,price,stock}
      const response = await fetch(`http://localhost:5000/addproduct`,{
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
        setProductname('')
        setPrice('')
        setStock('')
        setButtonClick(!buttonClick)
      }
    }
    catch(err){
      console.error(err)
    }

  }

  return (
    <div className="products-container">
      <h2>Products <CiCirclePlus className='circlebutton' onClick={handleButton} /></h2>
      
      {clicked ? 
      <>
        <div className='products-form'>
          <div>Product Name: </div>
          <input 
            type='text'
            name='productname'
            placeholder='Enter product Name'
            value={productname}
            onChange={handleProductaname}
          />
        </div>
        <div className='products-form'>
          <div>Price: </div>
          <input 
            type='text'
            name='price'
            placeholder='Enter price'
            value={price}
            onChange={handlePrice}
          />
        </div>
        <div className='products-form'>
          <div>Quantity: </div>
          <input 
            type='text'
            name='quantity'
            placeholder='Enter quantity'
            value={stock}
            onChange={handleStock}
          />
        </div>
        
          <button onClick={handleAddproduct} className='button'>Add Product</button>
        
      </> : <></>}
      <div className="product-list">
        {products.map((product) => (
          <div key={product.product_id} className="product-card">
            <h3>{product.product_name}</h3>
            <p>Product Id: {product.product_id}</p>
            <p>Price: Rs{product.price}</p>
            <p>Stock: {product.stock_quantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
