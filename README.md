
# livekit-jwt-api

## Overview
This application provides a basic API endpoint for generating JWTs for a LiveKit server. It is designed to be simple and straightforward to deploy and use, built with Node.js and optionally deployable via Docker.

## Prerequisites
- Node.js v22.x
- Docker (optional for Docker deployment)

## Installation

**Step 1: Clone the repository**
Clone the repository to your local machine:
```bash
git clone https://yourrepositoryurl.com/path/to/livekit-jwt-api.git
cd livekit-jwt-api
```

**Step 2: Install Dependencies**
Install the necessary Node.js dependencies:
```bash
npm install
```

## Configuration

**Environment Variables**
Configure the application with the necessary environment variables. You can set these in your environment, or create a `.env` file in the root directory with the following contents:

```plaintext
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
LIVEKIT_SERVER=wss://your_livekit_server_url
LIVEKIT_TOKEN_TTL=30m  # e.g., '30m' for 30 minutes, default is '10m'
ALLOWED_ORIGINS='https://example.com,https://another.com'  # Default is '*' (all origins)
LIVEKIT_API_PORT=3000  # Default is 3000
```

**Step 3: Run the Application**
Start the application by running:
```bash
npm run start
```
This command will start the server on the port specified in `LIVEKIT_API_PORT` or the default port `3000`.

## Docker Deployment

**Building the Docker Image**
To containerize the application, build the Docker image using:
```bash
docker build -t livekit-jwt-api .
```

**Running the Docker Container**
Run the Docker container with port mapping:
```bash
docker run -p 3000:3000 livekit-jwt-api
```
This command maps port `3000` of the container to port `3000` on your host, allowing you to access the API via `localhost:3000`.

## Pull Our Docker Image
```bash
docker pull ghcr.io/techproofing/livekit-jwt-api:latest
```
```plaintext
Published on 2024-05-05 17:50:15 UTC(+0000)
```
## Usage
Once the server is running, you can generate JWTs by sending a POST request to `http://localhost:3000/getToken` with a JSON payload containing `roomName` and `participantName`. Example using curl:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"roomName": "yourRoomName", "participantName": "yourParticipantName"}' http://localhost:3000/getToken
```

## Additional Notes
- Ensure that all environment variables are correctly set before starting the server.
- For security in production environments, secure your environment variables and consider using HTTPS for all communications.

