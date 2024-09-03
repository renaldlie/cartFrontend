import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateProduct() {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productType, setProductType] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

     // Reset messages
     setMessage('');
     setError('');
 
     // Validate form fields
    if (!productName || !productPrice || !productType) {
        setError('All fields are required');
        return;
      }

    try {
      const response = await axios.post('http://localhost:8080/api/products', {
        name: productName,
        price: productPrice,
        description: productType,
      });

      setMessage(`Product created with ID: ${response.data.id}`);
      navigate('/');
    } catch (error) {
      setMessage('Error creating product');
      alert('All fields are required')
    }
  };

  return (
    <div>
      <h1>Create Product</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Product Name :
            <input
              type="text"
              style={{marginLeft:'10px'}}
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Price :
            <input
              type="number"
              value={productPrice}
              style={{marginLeft:'10px', marginTop:'10px'}}
              onChange={(e) => setProductPrice(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Type :
            <input
              value={productType}
              style={{marginLeft:'10px', marginTop:'10px'}}
              onChange={(e) => setProductType(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Create Product</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CreateProduct;
