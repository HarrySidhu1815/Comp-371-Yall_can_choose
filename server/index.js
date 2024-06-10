require("dotenv").config()
const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/user.model.js')
const jwt = require('jsonwebtoken')
const Item = require('./models/item.model.js')
const bodyParser = require('body-parser');
const multer = require('multer');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
const socket = require('socket.io');
const Message = require('./models/messages.model.js')
const MemoryStore = require('memorystore')(session)


const allowedOrigin = 'https://comp-371-yall-can-choose-1.onrender.com';
const PORT = process.env.PORT || 1337

app.use(cors({
  origin: allowedOrigin,
  methods: ["POST", "GET"],
  credentials: true // Allow credentials (cookies) to be sent
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'secret123',
  resave: true,
  saveUninitialized: true,
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  cookie: {
    path    : '/',
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    maxAge  : 24*60*60*1000
  },
}));


mongoose.connect(process.env.MONGODB_URI, {
  })
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));


// Middleware to check if user is logged in
const checkLoggedIn = (req, res, next) => {
  if (req.session.userId) {
      next();
  } else {
      res.status(401).json({ message: 'Unauthorized' });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../UniFlipp/public/images/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
const upload = multer({  storage: storage });



app.post('/api/register', async (req, res) =>{
    try{
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        })
        const token = jwt.sign({ userId: user._id }, 'secret123');
        res.json({status: 'ok', token})
    } catch(err){
        console.log(err)
        res.json({status: 'error', error: 'Duplicate Email'})
    }
})

app.post('/api/login', async (req, res) =>{
    const user = await User.findOne({
        email: req.body.email,
        password: req.body.password,
    })
    if(user){
      req.session.email = user.email;
      req.session.name = user.name;
      console.log('User logged in:', req.session);
      
        const token = jwt.sign({
            name: user.name,
            email: user.email,
        }, 'secret123')
        return res.json({status: 'ok', user: token})
    } else{
        return res.json({status: 'error', user: false})
    }
})

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  jwt.verify(token, 'secret123', (err, decoded) => {
      if (err) return res.status(401).json({ error: 'Invalid token' });
      req.userId = decoded.userId;
      next();
  });
};
app.post('/api/add', async (req, res) => {
  if(req.session.email){
    return res.json({status: 'ok', valid: true, email: req.session.email})
  } else {
    return res.json({status: 'error', valid: false})
  }
})



app.post('/api/add-item', upload.single('image'), async (req, res) => {
  try {
    // Ensure that all required fields are provided
    const { itemType, condition, description, price, location, userEmail } = req.body;
    
    if (!itemType || !condition || !description || !price || !location || !userEmail) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    // Create a new item object
    const newItem = new Item({
      itemType,
      condition,
      description,
      price,
      location,
      image: req.file ? req.file.filename : null,
      user: userEmail
    });
    console.log(newItem)
    // Save the item to the database
    const savedItem = await newItem.save();
    res.json(savedItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});


  app.post('/api/get-items', async (req, res) => {
    try {
      const items = await Item.find();
      if(!req.session.email){
        res.json({itemData: items, status: false});
      } else{
        res.json({itemData: items, status: true});
      }
      
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });


  app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ error: 'Server Error' });
      }
      res.clearCookie('connect.sid'); // Clear session cookie
      res.json({ message: 'Logout successful' });
    });
  });
  
  app.post('/api/get-user-items', async (req, res) => {
    try {
      const userEmail = req.session.email; // Retrieve user's email from request body

      const items = await Item.find({ user: userEmail }); // Find items associated with the user's email
      console.log(items)
      if(!req.session.email){
        res.json({itemData: items, status: false});
      } else{
        res.json({itemData: items, status: true});
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });
  
  app.get('/api/delete-item/:id', async (req, res) => {
    try {
      const itemId = req.params.id;
  
      // Check if the item exists
      const existingItem = await Item.findById(itemId);
      if (!existingItem) {
        return res.status(404).json({ error: 'Item not found' });
      }
  
      // Delete the item
      await Item.deleteOne({ _id: itemId });
      
      // Return success message
      res.json({ message: 'Item deleted successfully' });
    } catch (err) {
      console.error('Error deleting item:', err);
      res.status(500).json({ error: 'Server Error' });
    }
  });


  app.get('/item/:id', async (req, res) => {
    try {
      const itemId = req.params.id;
  
      // Find the item by ID in the database
      const item = await Item.findById(itemId);
  
      // If item not found, return error
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      
      // If item found, return it
      res.json({ items: item, user: true, currentUser: req.session.email, userName: req.session.name});
    } catch (err) {
      console.error('Error fetching item by ID:', err);
      res.status(500).json({ error: 'Server Error' });
    }
  });


// Endpoint to retrieve messages
app.post('/api/retrieve-messages', async (req, res) => {
  try {
    const currentUserEmail = req.body.username;
    const recipientEmail = req.body.currentName;

    // Retrieve messages from MongoDB
    const messages = await Message.find({
      $or: [
        { senderEmail: currentUserEmail, recipientEmail: recipientEmail},
        { senderEmail: recipientEmail, recipientEmail: currentUserEmail },
      ],
    })
    .select('senderEmail message')
    .sort({ timestamp: 1 });
    
    res.status(200).json({ messages });
  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/retrieve-contacts', async (req, res) => {
  try {
    const currentUserEmail = req.body.currentName;
    console.log(currentUserEmail)
    // Retrieve messages from MongoDB
    const contacts = await Message.aggregate([
      {
        $match: {
          recipientEmail: currentUserEmail
        }
      },
      {
        $group: {
          _id: "$senderEmail"
        }
      },
      {
        $lookup: {
          from: 'user-data',
          localField: '_id',
          foreignField: 'email',
          as: 'userDetails'
        }
      },
      {
        $unwind: '$userDetails'
      },
      {
        $project: {
          recipientEmail: '$_id',
          name: '$userDetails.name',
          _id: 0
        }
      }
    ]);
    console.log(contacts)
    
    res.status(200).json({ contacts });
  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to find user's name given email
app.post('/api/find-user-name', async (req, res) => {
  try {
      const userEmail = req.body.email; // Assuming email is sent in the request body
      const user = await User.findOne({ email: userEmail }, 'name');
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      res.json({ name: user.name });
  } catch (error) {
      console.error('Error finding user:', error);
      res.status(500).json({ error: 'Server error' });
  }
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

const server = app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`)
})
const io = require('socket.io')(server, {
  cors: {
    origin: "https://comp-371-yall-can-choose-1.onrender.com",
    methods: ["GET", "POST"]
  }
});

const userSocketMap = {};

io.on('connection', (socket) => {
  console.log('New connection');

  // Listen for user ID on connection
  socket.on('setUserId', (userId) => {
    // Associate user ID with socket ID
    userSocketMap[userId] = socket.id;
    console.log(userSocketMap[userId])
    console.log('User', userId, 'connected');
});

socket.on('disconnect', () => {
    // Clean up userSocketMap on disconnection
    const disconnectedUserId = Object.keys(userSocketMap).find(
        (key) => userSocketMap[key] === socket.id
    );
    if (disconnectedUserId) {
        delete userSocketMap[disconnectedUserId];
        console.log('User', disconnectedUserId, 'disconnected');
    }
});
  
  // Handle chat messages
  socket.on('send', async (data) => {
      try {
          const { currentUser , username, text } = data;
          if (!currentUser || !username || !text) {
            return res.status(400).json({ error: 'All fields are required' });
          }
          
          const newMessage = new Message({
            senderEmail: currentUser,
            recipientEmail: username,
            message: text,
            timestamp: new Date() // Optional, will default to the current date if not provided
          });
          newMessage.save()
          //   .then(savedMessage => {
          //   console.log('Message saved:', savedMessage);
          // })

          // Emit the message only to the recipient's socket
        const recipientSocketId = userSocketMap[username];
        
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('receive', {text: text,user: currentUser});
            // socket.broadcast.emit('receive', text)
        } else {
            console.log('Recipient not found or not connected:', username);
        }
      } catch (err) {
          console.error('Error saving message:', err);
      }
  });
});