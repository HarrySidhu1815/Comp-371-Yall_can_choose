// WhoAreWePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './whoarewepage.css';

const WhoAreWePage = () => {
    return (
        <div>
            <h1>We are UniFlip!</h1>
            <p>UniFlipp is a platform for students to buy and sell supplies like Textbooks, Calculators and more.</p>
            <p>Made in the University of the Fraser Valley's Software Engineering course by students for students.</p>
            <p>Our goal is to give an alternative way to get essential school supplies through finding students who are looking to sell their supplies.</p>
            <p>Our platform is free to use and we do not take any commission from the sales, we stay running through the help of donations.</p>
            <p>Thank you for using UniFlipp! We appreciate you!</p>

            <Link to="/getinvolved">
                  <span className="material-symbols-rounded">volunteer_activism</span>
            </Link>
        </div>

    );
};

export default WhoAreWePage;