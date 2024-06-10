import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './additem.css';
import { useNavigate } from 'react-router-dom';

function AddItem() {
  const [name, setName] = useState('')
  const navigate = useNavigate()
  const serverurl = import.meta.env.VITE_SERVER_URL
  
  useEffect(() => {
    // Fetch user data from server and set it in form data
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${serverurl}/api/add`, {
          method: 'POST',
          credentials: 'include',
          withCredentials: true // Send cookies along with the request
        })
        .catch(err =>
          console.log(err)
        )

        const userData = await response.json()
        if(userData.valid){
          setName(userData.email)
        } else{
          navigate('/login')
        }
        setFormData(prevState => ({
          ...prevState,
          userEmail: userData.email // Set user ID in form data
        }));
      } catch (error) {
        console.error('Error:', error);
        // Handle error
      }
    };

    fetchUserData();
  }, [name]);

  const [formData, setFormData] = useState({
    itemType: '',
    condition: '',
    description: '',
    price: '',
    location: '',
    image: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('itemType', formData.itemType);
      data.append('condition', formData.condition);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('location', formData.location);
      data.append('userEmail', formData.userEmail);
      data.append('image', formData.image);
      
      const response = await axios.post(`${serverurl}/api/add-item`, data, {
        method: 'POST',
        headers: {
          'Content-type': 'multipart/form-data'
        }
      })
      alert('Item added successfully!');
      
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the item. Please try again later.');
    }
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  return (
    <div className="App">
      <h1>Add Item Form</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>Item Name:</label>
        <input type="text" name="itemType" value={formData.itemType} onChange={handleChange} required />
        <label>Condition:</label>
        <input type="text" name="condition" value={formData.condition} onChange={handleChange} required />
        <label>Description:</label>
        <textarea name="description" cols="40" rows="10"  value={formData.description} onChange={handleChange} required /><br/>
        {/* <input type="text" name="description" value={formData.description} onChange={handleChange} required /> */}
        <label>Price:</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} required />
        <label>Location:</label>
        <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required />
        <label htmlFor="image">Image:</label>
        <input type="file" id="image" name="image" onChange={handleFileChange} accept="image/*" required /><br></br>
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
}

export default AddItem;
