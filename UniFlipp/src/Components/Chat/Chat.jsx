import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './Chat.css';
import logo from './searchIcon.png';

const CONNECTION_PORT = serverurl;
let socket;

function Chat({ user, loggedUser }) {
    const serverurl = import.meta.env.VITE_SERVER_URL

    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState(user);
    const [owner, setOwner] = useState();
    const [currentName, setcurrentName] = useState(loggedUser);
    const [contacts, setContacts] = useState([]);
    const [showContact, setShowContact] = useState(true);

    useEffect(() => {
        fetch(`${serverurl}/api/find-user-name`, {
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
                setOwner(data.name);
            })
            .catch(error => {
                console.error('Error fetching user name:', error);
            });
    }, [username]);

    useEffect(() => {
        socket = io(CONNECTION_PORT);
        socket.on('connect', () => {
            console.log('Connected to server');
        });
        socket.emit('setUserId', currentName);
        socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        socket.on('receive', message => {
            setMessages(prevMessages => [...prevMessages, message]);
        });
    }, []);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`${serverurl}/api/retrieve-messages`, {
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
                const result = await response.json();
                const messages_array = result.messages.map(message => ({
                    user: message.senderEmail,
                    text: message.message
                }));
                setMessages(messages_array);
            } catch (error) {
                console.error('Error retrieving messages:', error);
            }
        };

        const fetchContacts = async () => {
            try {
                const response = await fetch(`${serverurl}/api/retrieve-contacts`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        currentName
                    }),
                });
                const result = await response.json();
                setContacts(result.contacts);
            } catch (error) {
                console.error('Error retrieving contacts:', error);
            }
        };

        fetchMessages();
        fetchContacts();
    }, [username, currentName]);

    const sendMessage = () => {
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value.trim();

        if (message.length === 0) return;

        setMessages(prevMessages => [
            ...prevMessages,
            { user: currentName, text: message }
        ]);

        socket.emit('send', {
            currentUser: currentName,
            username: username,
            text: message
        });

        messageInput.value = '';
    };

    const handleContactClick = async (clickedUser) => {
        setUsername(clickedUser);
        setShowContact(false);
        setMessages([]);  // Clear messages state when contact is changed

        try {
            const response = await fetch(`${serverurl}/api/retrieve-messages`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: clickedUser,
                    currentName
                }),
            });
            const result = await response.json();
            const messages_array = result.messages.map(message => ({
                user: message.senderEmail,
                text: message.message
            }));
            setMessages(messages_array);
        } catch (error) {
            console.error('Error retrieving messages:', error);
        }
    };

    const handleMessageSend = () => {
        const message = document.getElementById('message-input').value;
        if (message.trim().length > 0) {
            sendMessage();
        }
    };

    const handleSocketMessage = (message) => {
        setMessages(prevMessages => [...prevMessages, message]);
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
                <div className="app">
                    {user === loggedUser ? (
                        <>
                            <div className="left-column-chat-list">
                                <div className="chat-search">
                                    <input type="text" placeholder="Search conversation..." />
                                    <button id="send search">
                                        <img src={logo} width="15" height="15" />
                                    </button>
                                </div>
                                <div className="chat-list">
                                    <div className='contactList'>
                                        {contacts.map((contact, index) => (
                                            <div key={index} className='contacts' onClick={() => handleContactClick(contact.recipientEmail)}>{contact.name}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : null}
                    <div className="screen chat-screen active">
                        <div className="header">
                            <div className="logo">Messages Chat</div>
                            {user === loggedUser ? (
                                <>
                                    <span className='mobMenu material-symbols-rounded contactIcon' alt='Menu' onClick={() => setShowContact(!showContact)}>Contacts </span>
                                    <div className='contactMenu left-column-chat-list' style={{ display: showContact ? 'flex' : 'none' }}>
                                        <div className="chat-search">
                                            <input type="text" placeholder="Search conversation..." />
                                            <button id="send search">
                                                <img src={logo} width="15" height="15" />
                                            </button>
                                        </div>
                                        <div className="chat-list">
                                            <div className='contactList'>
                                                {contacts.map((contact, index) => (
                                                    <div key={index} className='contacts' onClick={() => handleContactClick(contact.recipientEmail)}>{contact.name}</div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : null}
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
                </div>
            </div>
        </div>
    );
}

export default Chat;
