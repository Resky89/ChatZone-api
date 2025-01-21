const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
require('./scheduledTasks');
const app = express();
const connRoutes = require('./routes/conn-routes');
const userRoutes = require('./routes/UserRoutes');
const contactRoutes = require('./routes/ContactRoutes');
const chatRoutes = require('./routes/ChatRoutes');
const statusRoutes = require('./routes/StatusRoutes');
const callRoutes = require('./routes/CallRoutes');
const groupRoutes = require('./routes/GroupRoutes');
const groupMemberRoutes = require('./routes/GroupMemberRoutes');
const communityRoutes = require('./routes/CommunityRoutes');
const messageRoutes = require('./routes/MessageRoutes');
const communityMemberRoutes = require('./routes/CommunityMemberRoutes');
const communityGroupRoutes = require('./routes/CommunityGroupRoutes');
const communityAnnouncementRoutes = require('./routes/CommunityAnnouncementRoutes');
const ngrok = require('ngrok');
const morgan = require('morgan');


// Add these lines before your routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware untuk melayani file statis
app.use('/media/profile_pictures', express.static(path.join(__dirname, 'media/profile_pictures')));
app.use('/media/statuses', express.static(path.join(__dirname, 'media/statuses')));
app.use('/media/group_images', express.static(path.join(__dirname, 'media/group_images')));
app.use('/media/community_images', express.static(path.join(__dirname, 'media/community_images')));
app.use('/media/message_media', express.static(path.join(__dirname, 'media/message_media')));

// Gunakan morgan dengan format yang customized
app.use(morgan(':method :url :status :response-time ms'));

// Untuk melihat request body, bisa gunakan format custom
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :body'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ChatZone API' });
});

// Routes
app.use('/api',
  connRoutes,
  userRoutes, 
  contactRoutes, 
  chatRoutes, 
  statusRoutes, 
  callRoutes, 
  groupRoutes, 
  groupMemberRoutes, 
  communityRoutes,
  communityMemberRoutes,
  communityGroupRoutes,
  communityAnnouncementRoutes,
  messageRoutes
);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Setup ngrok tunnel
  if (process.env.NODE_ENV !== 'production') {
    try {
      const url = await ngrok.connect({
        addr: PORT,
        authtoken: process.env.NGROK_AUTH_TOKEN
      });
      console.log('Ngrok tunnel is running at:', url);
    } catch (err) {
      console.error('Error setting up ngrok tunnel:', err);
    }
  }
});

module.exports = app;

