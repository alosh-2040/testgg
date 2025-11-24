const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;

// Enable CORS for Flutter app
app.use(cors());
app.use(express.json());

// Read channels data
const getChannels = () => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'channels.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading channels.json:', error);
    return [];
  }
};

// GET /channels - Return all channels
app.get('/channels', (req, res) => {
  console.log('📡 Received request for channels');
  const channels = getChannels();
  console.log(`✅ Returning ${channels.length} channels`);
  res.json(channels);
});

// GET /channel/:id - Return specific channel
app.get('/channel/:id', (req, res) => {
  const channelId = parseInt(req.params.id);
  console.log(`📡 Received request for channel ID: ${channelId}`);
  
  const channels = getChannels();
  const channel = channels.find(c => c.id === channelId);
  
  if (channel) {
    console.log(`✅ Found channel: ${channel.name}`);
    res.json(channel);
  } else {
    console.log(`❌ Channel not found: ${channelId}`);
    res.status(404).json({ error: 'Channel not found' });
  }
});

// POST /channels - Add or update channels (optional)
app.post('/channels', (req, res) => {
  try {
    const newChannels = req.body;
    fs.writeFileSync(
      path.join(__dirname, 'channels.json'),
      JSON.stringify(newChannels, null, 2)
    );
    console.log('✅ Channels updated successfully');
    res.json({ message: 'Channels updated successfully' });
  } catch (error) {
    console.error('❌ Error updating channels:', error);
    res.status(500).json({ error: 'Failed to update channels' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 ═══════════════════════════════════════════════════');
  console.log('🚀 Server started successfully!');
  console.log('🚀 ═══════════════════════════════════════════════════');
  console.log(`📡 Listening on: http://0.0.0.0:${PORT}`);
  console.log(`🌐 Access from network: http://YOUR_IP:${PORT}`);
  console.log('📋 Available endpoints:');
  console.log(`   GET  /channels       - Get all channels`);
  console.log(`   GET  /channel/:id    - Get specific channel`);
  console.log(`   POST /channels       - Update channels`);
  console.log(`   GET  /health         - Health check`);
  console.log('🚀 ═══════════════════════════════════════════════════');
  
  const channels = getChannels();
  console.log(`✅ Loaded ${channels.length} channels from database`);
  console.log('🎬 Ready to serve streams!');
  console.log('');
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});
