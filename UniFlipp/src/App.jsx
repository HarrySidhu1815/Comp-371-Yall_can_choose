//Uniflipp App
import React from 'react'
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import HomePage from './homePage'
import SearchPage from './searchPage'
import WhoAreWePage from './WhoAreWePage';
import GetInvolvedPage from './GetInvolvedPage';
import SignUpPage from './SignUpPage';
import Login from './Login'
import AddItem from './AddItem'
import Logout from './Logout'
import ItemDetails from './ItemDetail'

function App() {
  const [isNavOpen, setIsNavOpen] = useState(false)

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen)
  }
  return (
    <Router>
      <div>
        
          <header>
          <img className='logo' src="/src/logoimage.png" alt="Logo" width="100" height="50" />
          <h3>UniFlip</h3>
          </header>
          <div id="main">            
            <div id="content">
              <Routes>
                <Route path="/home" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/whoarewe" element={<WhoAreWePage />} />
                <Route path="/getinvolved" element={<GetInvolvedPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/add" element={<AddItem />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/item/:id" element={<ItemDetails />} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </div>
          <nav className={isNavOpen ? 'nav-open' : 'nav-closed'}>
            <div id="NavToggle" onClick={toggleNav}>
              <span className="material-symbols-rounded menuicon">menu</span>
              <span className="material-symbols-rounded closeicon">close</span>
            </div>
            <ul>
              <li className="navElement">
                <Link to="/home">
                  <span className="material-symbols-rounded">home</span>
                  <p>Home</p>
                </Link>
              </li>
              <li className="navElement">
                <Link to="/search">
                  <span className="material-symbols-rounded">search</span>
                  <p>Search</p>  
                </Link>
              </li>
              <li className="navElement">
                <Link to="/whoarewe">
                  <span className="material-symbols-rounded">handshake</span>
                  <p>Who are we?</p>
                </Link>
              </li>
              {/*<li className="navElement">
                <Link to="/getinvolved">
                  <span className="material-symbols-rounded">volunteer_activism</span>
                  <p>Get Involved</p>
                </Link>
                 </li>*/}
              <li className="navElement">
                <Link to="/signup">
                  <span className="material-symbols-rounded">person_add</span>
                  <p>Sign Up</p>  
                </Link>
              </li>
              <li className="navElement">
                <Link to="/login">
                <span className="material-symbols-rounded">login</span>
                  <p>Login</p>  
                </Link>
                </li>

                <li className="navElement">
                <Link to="/add">
                <span className="material-symbols-rounded">add</span>
                  <p>AddItem</p>  
                </Link>
              </li>
              <li className="navElement Logoutbtn">
                <Link to="/Logout">
                <span className="material-symbols-rounded">Logout</span>
                  <p>Logout</p>  
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <footer>
            <ul id="footer">
              <li><a href="/src/aboutus.html">2024 Uniflip</a></li>
              <li><a href="/src/privacy.html">Privacy Policy</a></li>
              <li><a href="/src/termsofservice.html">Terms of Service</a></li>
            </ul>
        </footer>
      </div>    
    </Router>
  )
}

export default App
