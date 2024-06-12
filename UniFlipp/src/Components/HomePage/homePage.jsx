import React, { useState, useEffect } from 'react'
import jwt from 'jsonwebtoken'
import { useNavigate } from "react-router-dom";
import Card from './Card';

function HomePage() {
    const navigate = useNavigate()
    const serverurl = import.meta.env.VITE_SERVER_URL

    async function populateQuotes(){
        const req = await fetch(`${serverurl}/api/quote`, {
          credentials: 'include',
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        const data = req.json()
        console.log(data);

    }
    useEffect(() => {
        const token = localStorage.getItem('token')
        if(token){
            const user = jwt.decode(token)
            if(!user){
                localStorage.removeItem('token')
                navigate('/login')
            } else{
                populateQuotes()
            }
        }
    })
const [items, setItems] = useState([]);
const [permission, setPermission] = useState(false);
const [isLogged, setIsLogged] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage] = useState(12);
const [totalPages, setTotalPages] = useState(0);

const fetchAllItems = () => {
  const fetchItems = async () => {
    const result = await fetch(`${serverurl}/api/get-items`, {
      method: 'POST',
      credentials: 'include',
      headers: {
          'Content-Type': 'application/json'
      }
    });
    const data = await result.json()
    
    setItems(data.itemData);
    if(data.status){
      setIsLogged(true)
      setPermission(false)
    }
  };

  fetchItems();
}

  useEffect(fetchAllItems, []);

  useEffect(() => {
    setTotalPages(Math.ceil(items.length / itemsPerPage));
  }, [items, itemsPerPage]);

    const fetchUserItems = async () => {
      const result = await fetch(`${serverurl}/api/get-user-items`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
      });
      const data = await result.json()
      setItems(data.itemData);
      setPermission(true)
    };
    const onDelete = (deletedItemId) => {
      setItems(items.filter((item) => item._id !== deletedItemId));
    };
    // const onItemClick = (itemId) => {
    //   navigate(`/item/${itemId}`);
    // };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <>
      <h1>Items</h1>
      {isLogged && <button onClick={fetchUserItems}>View your Items</button>}
      &nbsp;
      <button onClick={fetchAllItems}>View all Items</button>
      <div className="container2">
      <div className='listing'>
        {currentItems.map(item => 
          <Card id={item._id} owner={item.user} location={item.location} onDelete={onDelete} isDelete={permission ? true : false}  key={item._id} image={item.image} type={item.itemType} price={item.price}/>
        )}
      </div>
      </div>
      <ul className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <li key={index} className="page-item">
            <button
              onClick={() => paginate(index + 1)}
              className="page-link"
            >
              {index + 1}
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}

export default HomePage;