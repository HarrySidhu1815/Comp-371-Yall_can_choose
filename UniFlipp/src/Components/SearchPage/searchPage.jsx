import React, { useState } from 'react';
import './search.css'; // Import the CSS file

function SearchPage() {
    // State to hold the search query
    const [searchQuery, setSearchQuery] = useState('');
    
    // Sample data representing content on the search page
    const content = [
        { id: 1, title: 'First Item', description: '#Description of first item' },
        { id: 2, title: 'Second Item', description: '#Description of second item' },
        { id: 3, title: 'Third Item', description: '#Description of third item' }
    ];

    // Function to handle changes in the search input
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Function to filter content based on search query
    const filteredContent = content.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="search-page-container">
            <h2>Welcome to the Search Page</h2>
            <input 
                type="text" 
                className="search-input" // Add the CSS class to the input field
                placeholder="Search..." 
                value={searchQuery} 
                onChange={handleSearchChange} 
            />
            <div>
                {filteredContent.map(item => (
                    <div className="search-item" key={item.id}>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SearchPage;
