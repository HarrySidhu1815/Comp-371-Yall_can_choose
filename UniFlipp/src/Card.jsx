import React from 'react'
import { Link } from 'react-router-dom';

const Card = ({type, location, price, image, isDelete, id, onDelete, owner}) => {

    const handleDelete = async () => {
        try {
          await fetch(`http://localhost:1337/api/delete-item/${id}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
          });
          onDelete(id); // Remove the deleted item from the UI
          alert('Item deleted successfully');
        } catch (error) {
          console.error('Error deleting item:', error);
          alert('An error occurred while deleting the item');
        }
      };
    return (
        <div className="card">
            <img src={`src/images/${image}`} alt='Item' />
            <div className="card-content">
            <Link to={`/item/${id}`}>
                <div className="book-title">{type}</div>
                </Link>
                <div className="book-author">{location}</div>
                <div className="book-price">$ {price}</div>
            </div>
            {isDelete && <button onClick={handleDelete}>Delete Item</button>}
        </div>  
    )
}

export default Card
