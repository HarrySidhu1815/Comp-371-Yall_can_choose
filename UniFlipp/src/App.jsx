//Uniflipp App
import React from 'react'
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import HomePage from './Components/HomePage/homePage'
import SearchPage from './Components/SearchPage/searchPage'
import WhoAreWePage from './Components/WhoAreWe/WhoAreWePage';
import GetInvolvedPage from './Components/GetInvolved/GetInvolvedPage';
import SignUpPage from './Components/SignUp/SignUpPage';
import Login from './Components/Login/Login'
import AddItem from './Components/AddItem/AddItem'
import Logout from './Components/LogOut/Logout'
import ItemDetails from './Components/ItemDetail/ItemDetail'
import menu from './assets/menu.png'

function App() {
  const [isNavOpen, setIsNavOpen] = useState(false)

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen)
  }
  const [showMenu, setShowMenu] = useState(false)
  return (
    <Router>
      <div>

        <header>
          <img className='logo' src="/src/assets/logoimage.png" alt="Logo" width="100" height="50" />
          <h3>UniFlip</h3>
          <span className='mobMenu material-symbols-rounded menuicon1' alt='Menu' onClick={() => setShowMenu(!showMenu)}>menu </span>
          <div className='navMenu' style={{ 'display': showMenu ? 'flex' : 'none' }}>
            <Link activeClass='active' to='/home' onClick={() => setShowMenu(false)} className='listItem'>Home</Link>
            <Link activeClass='active' to='/search'onClick={() => setShowMenu(false)} className='listItem'>Search</Link>
            <Link activeClass='active' to='/whoarewe' onClick={() => setShowMenu(false)} className='listItem'>Who are we?</Link>
            <Link activeClass='active' to='/signup' onClick={() => setShowMenu(false)} className='listItem'>Sign Up</Link>
            <Link activeClass='active' to='/login' onClick={() => setShowMenu(false)} className='listItem'>Login</Link>
            <Link activeClass='active' to='/add' onClick={() => setShowMenu(false)} className='listItem'>AddItem</Link>
            <Link activeClass='active' to='/Logout' onClick={() => setShowMenu(false)} className='listItem'>LogOut</Link>
          </div>
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
            <li><a href="/src/Components/About/aboutus.html">2024 Uniflip</a></li>
            <li><a href="/src/Components/Privacy/privacy.html">Privacy Policy</a></li>
            <li><a href="/src/Components/TermsofService/termsofservice.html">Terms of Service</a></li>
          </ul>
        </footer>
      </div>
    </Router>
  )
}

export default App
