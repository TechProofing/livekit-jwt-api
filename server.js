import express from 'express';
import cors from 'cors';
import path from 'path';
import { AccessToken } from 'livekit-server-sdk';

const createToken = async (roomName, userName) => {
  const ttlValue = process.env.LIVEKIT_TOKEN_TTL || '10m'; // Default to 10 minutes if not set
  const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
    identity: userName,
    ttl: ttlValue,
  });
  at.addGrant({ roomJoin: true, room: roomName });

  return await at.toJwt();
}

const app = express();
// Use environment variable for port or default to 3000
const port = process.env.LIVEKIT_API_PORT || 3000;

// CORS Configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
};

// Apply CORS middleware with configured options
app.use(cors(corsOptions));
app.use(express.json());

// Log CORS origins and TTL on server start
console.log(`CORS Allowed Origins: ${corsOptions.origin}`);
console.log(`LiveKit Token TTL: ${process.env.LIVEKIT_TOKEN_TTL || '10m'}`);

// Serve static files from the 'public' directory
app.use(express.static('public'));
// Default route to serve the main web page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/v2/meet/token', async (req, res) => {
  const { roomName, userName } = req.body;
  if (!roomName || !userName) {
    return res.status(400).json({ error: 'Room name and participant name are required' });
  }

  // Log CORS origins and TTL on each token request (optional)
//   console.log(`Processing token request - CORS Allowed Origins: ${corsOptions.origin}`);
//   console.log(`Processing token request - LiveKit Token TTL: ${process.env.LIVEKIT_TOKEN_TTL || '10m'}`);

  try {
    const token = await createToken(roomName, userName);
    const url = process.env.LIVEKIT_SERVER;
    const success = true;
    res.json({ roomName, success, token, url });
  } catch (error) {
    console.error('Failed to create token:', error);
    res.status(500).json({ error: 'Failed to create token' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
