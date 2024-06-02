import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './Chat.css';
import logo from '../searchIcon.png';


const CONNECTION_PORT = 'http://localhost:1337';
let socket;

function Chat({user, loggedUser}) {
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState(user);
    const [owner, setOwner] = useState();
    const [currentName, setcurrentName] = useState(loggedUser);

    fetch('http://localhost:1337/api/find-user-name', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: username })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        setOwner(data.name)
    })
    .catch(error => {
        console.error('Error fetching user name:', error);
    });

    useEffect(()=> {
    
        socket = io(CONNECTION_PORT);
        socket.on('connect', () => {
            console.log('Connected to server');
        });
        socket.emit('setUserId', currentName)
        socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        return () => {
            socket.disconnect();
        };
    }, [CONNECTION_PORT])

    useEffect(() => {
        socket.on('receive', message => {
            setMessages(prevMessages => [...prevMessages, message]);
        });
    }, []);

    useEffect(() => {
        // Function to fetch messages from the server
        const fetchMessages = async () => {
            try {
                // Make a request to retrieve messages
                const response = await fetch('http://localhost:1337/api/retrieve-messages', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username,
                        currentName
                    }),
                });
                const data = response.json()
                .then(result => {
                    const messages_array = result.messages
                    const new_array = [];
                    messages_array.map(message => {
                        new_array.push({
                            user: message.senderEmail,
                            text: message.message
                        })
                    })
                    setMessages(new_array)
                })
                // Update state with the messages received from the server
                // setMessages(result.messages)
            } catch (error) {
                console.error('Error retrieving messages:', error);
            }
        };

        // Call the function to fetch messages when the component mounts
        fetchMessages();
    }, []);

    const sendMessage = () => {
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value.trim();
        
        if (message.length === 0) return;
        
        renderMessage('my', {
            username: currentName,
            text: message
        });
        console.log(currentName, username, message)
        socket.emit('send', {
            currentUser: currentName,
            username: username,
            text: message
        });
        
        messageInput.value = '';
    };

    const renderMessage = (type, message) => {
        const messageContainer = document.querySelector('.chat-screen .messages');
        
        let el = document.createElement('div');
        el.className = `message ${type === 'my' ? 'my-message' : 'other-message'}`;
        el.innerHTML = `
            <div>
                <div class="name">${type === 'my' ? 'You' : message.user}</div>
                <div class="text">${message.text}</div>
            </div>
        `;
        
        messageContainer.appendChild(el);
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    };

    const handleMessageSend = () => {
        const message = document.getElementById('message-input').value;
        if (message.trim().length > 0) {
            sendMessage();
        }
    };

    const handleSocketMessage = (message) => {
        setMessages(prevMessages => {[...prevMessages, message]});
    };

    useEffect(() => {
        socket.on('chat', handleSocketMessage);
        return () => {
            socket.off('chat', handleSocketMessage);
        };
    }, []);

    return (
        <div className="chatwrap">
            <div className="chatapp">
                {/* <div className="app"> */}
                    {/* <div className="left-column-chat-list">
                        <div className="chat-search">
                            <input type="text" placeholder="Search conversation..." />
                            <button id="send search">
                                <img src={logo} width="15" height="15" />
                            </button>
                        </div>
                        <div className="chat-list">
                            <div className="block">Friend Icon, Username, Text Preview, Date & Time</div>
                        </div>
                    </div> */}
                    <div className="screen chat-screen active">
                        <div className="header">
                            <div className="logo">Messages Chat</div>
                        </div>
                        <div className="messages">
                            {messages.map((message, index) => (
                                <div key={index} className={`message ${message.user === currentName ? 'my-message' : 'other-message'}`}>
                                    <div>
                                        <div className="name">{message.user === currentName ? 'You' : owner}</div>
                                        <div className="text">{message.text}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="typebox">
                            <input type="text" placeholder="Type your message and click Send..." id="message-input" />
                            <button id="send-message" onClick={handleMessageSend}>Send</button>
                        </div>
                    </div>
                    {/* <div className="bottom-filler"></div> */}
                {/* </div> */}
            </div>
        </div>
    );
}

export default Chat;
