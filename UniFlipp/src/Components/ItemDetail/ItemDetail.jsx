// ItemDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Chat from '../Chat/Chat';


const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentName, setCurrentName] = useState(null);
  const serverurl = import.meta.env.VITE_SERVER_URL


  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`${serverurl}/item/${id}`, {
          method: 'GET',
          credentials: 'include',
          withCredentials: true
        });
        if (!response.ok) {
          throw new Error('Failed to fetch item');
        }
        const data = await response.json();
        setItem(data.items);
        setCurrentUser(data.currentUser)
        setCurrentName(data.userName)
      } catch (error) {
        console.error('Error fetching item:', error);
      }
    };

    fetchItem();
  }, [id]);

  if (!item) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="item-details-container">
        <div className="item-details-header">
          <h2>{item.itemType}</h2>
        </div>
        <div className="item-details-content">
          <div className="item-image">
            <img src={`/images/${item.image}`} alt="Item" />
          </div>

          <div className="item-info">
            <p><span className='headings'>Type: </span>{item.itemType}</p>
            <p><span className='headings'>Description: </span><br />{item.description}</p>
            <p><span className='headings'>Price: </span>${item.price}</p>
            <p><span className='headings'>Location: </span>{item.location}</p>
          </div>
        </div>
        <div className='chat-itemPage'>
          <h2>Chat with the interested Buyer!</h2>
          {currentUser ? <Chat user={item.user} loggedUser={currentUser} userName={currentName} /> :
            <p>Please Login to chat with the onwer.</p>}
        </div>
      </div>
    </>
  );
};

export default ItemDetail;
