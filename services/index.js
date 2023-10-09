const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = process.env.PORT || 3000;

// CORS Configuration
const corsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));

// Socket.IO Connection Event
io.on('connection', (socket) => {
  console.log('Socket connection established');

  socket.on('disconnect', () => {
    console.log('Socket connection disconnected');
  });
});

// Fetch trip data from Mapbox
async function fetchTripData() {
  try {
    const mapboxAccessToken = process.env.MAPBOX_ACCESS_TOKEN;
    const waypoints = '82.539876,22.339444;82.170562,22.057430';
    const options = {
      profile: 'mapbox/driving',
      geometries: 'geojson', // Request GeoJSON format
    };

    const optionsQuery = new URLSearchParams(options).toString();
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${waypoints}?${optionsQuery}&access_token=${mapboxAccessToken}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch trip data from Mapbox: ${response.statusText}`);
    }

    const tripData = await response.json();
    console.log('Trip data from Mapbox API:', tripData);

    // Simulate car movement
    simulateCarMovement(io, tripData.routes[0].geometry.coordinates);
  } catch (error) {
    console.error('Error fetching trip data from Mapbox:', error);
  }
}

// Simulate car movement
function simulateCarMovement(socket, routeCoordinates) {
  // ... (implement the car movement logic here)
}

// Calculate distance between two coordinates
function calculateDistance(coord1, coord2) {
  // ... (implement the distance calculation logic here)
}

// Interpolate coordinates between two points
function interpolateCoordinates(coord1, coord2, fraction) {
  // ... (implement the interpolation logic here)
}

// Start the server
server.listen(port, () => {
  console.log(`Listening on port ${port}`);
  fetchTripData();
});
