import React from 'react'
import {styled} from 'styled-components';

const ControlledDiv = styled.div`.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .listing {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 20px;
  }
  .card {
    width: calc(33.33% - 20px);
    margin-bottom: 20px;
    background-color: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s ease-in-out;
  }
  .card:hover {
    transform: translateY(-5px);
  }
  .card img {
    width: 100%;
    height: auto;
  }
  .card-content {
    padding: 15px;
  }
  .book-title {
    font-weight: bold;
    margin-bottom: 10px;
  }
  .book-author {
    font-style: italic;
    color: #666;
    margin-bottom: 10px;
  }
  .book-price {
    font-weight: bold;
    color: #2ecc71;
  }`;

export default ControlledDiv
