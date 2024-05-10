import React from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:1337/api/logout', {
        method: 'POST',
        credentials: 'include', // Include credentials (cookies) in the request
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message); // Show logout message
        navigate('/login'); // Redirect to login page after logout
      } else {
        alert('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while logging out. Please try again later.');
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Logout;
