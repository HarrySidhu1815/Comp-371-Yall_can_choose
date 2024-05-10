const sendMessage = async (recipientEmail, message) => {
    try {
      const response = await fetch('http://localhost:1337/api/send-message', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipientEmail, message }),
      });
      
      if (response.ok) {
        console.log('Message sent successfully');
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Function to retrieve messages
const retrieveMessages = async () => {
    try {
      const response = await fetch('http://localhost:1337/api/retrieve-messages', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        const messages = data.messages;
        console.log('Retrieved messages:', messages);
        // Handle messages (e.g., update state to display messages)
      } else {
        console.error('Failed to retrieve messages');
      }
    } catch (error) {
      console.error('Error retrieving messages:', error);
    }
  };
  