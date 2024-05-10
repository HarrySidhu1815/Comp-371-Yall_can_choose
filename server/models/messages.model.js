const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    senderEmail: { type: String, required: true },
    recipientEmail: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  {collection: 'user-messages'}
  );
  
  // Create a model for messages
  const Message = mongoose.model('Message', messageSchema);

  module.exports = Message;