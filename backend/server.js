// Updated backend/server.js with admin page and persistent message storage

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Parse JSON body
app.use(express.json());
// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Path to store the message data
const dataFilePath = path.join(__dirname, 'messageData.json');

// Initialize with default data if the file doesn't exist
if (!fs.existsSync(dataFilePath)) {
  const defaultData = {
    message: "Welcome to the Attendance System!",
    attendanceStatus: "Present",
    timestamp: new Date().toISOString()
  };
  fs.writeFileSync(dataFilePath, JSON.stringify(defaultData, null, 2));
}

// Function to read the current message data
function getMessageData() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading message data:', error);
    return {
      message: "Error retrieving data",
      attendanceStatus: "Unknown",
      timestamp: new Date().toISOString()
    };
  }
}

// Function to update the message data
function updateMessageData(newData) {
  try {
    // Merge with existing data to avoid overwriting fields that aren't updated
    const currentData = getMessageData();
    const updatedData = { ...currentData, ...newData, timestamp: new Date().toISOString() };
    fs.writeFileSync(dataFilePath, JSON.stringify(updatedData, null, 2));
    return updatedData;
  } catch (error) {
    console.error('Error updating message data:', error);
    return null;
  }
}

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// API endpoint to get attendance message
app.get('/api/message', (req, res) => {
  const messageData = getMessageData();
  res.json(messageData);
});

// Admin page route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// API endpoint to update message
app.post('/api/message', (req, res) => {
  const { message, attendanceStatus } = req.body;
  
  if (!message && !attendanceStatus) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const updatedData = updateMessageData({
    message: message || getMessageData().message,
    attendanceStatus: attendanceStatus || getMessageData().attendanceStatus
  });
  
  if (updatedData) {
    res.json({ success: true, data: updatedData });
  } else {
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// Catch-all route to serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Admin interface available at: http://localhost:${PORT}/admin`);
  console.log(`Frontend available at: http://localhost:${PORT}/`);
});
