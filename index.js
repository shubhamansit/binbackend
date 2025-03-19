const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const bodyParser = require("body-parser");

// Create Express app
const app = express();
const PORT = 5544;

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Configure Express middleware
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw({ type: "*/*" }));

// Express route to handle all incoming requests
app.all("*", (req, res) => {
  console.log("------- HTTP REQUEST RECEIVED -------");
  console.log("Time:", new Date().toISOString());
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("Headers:", JSON.stringify(req.headers, null, 2));

  // Log the body regardless of content type
  if (Buffer.isBuffer(req.body)) {
    console.log("Body (Buffer):", req.body);
    console.log("Body (String):", req.body.toString());
    try {
      console.log("Body (JSON):", JSON.parse(req.body.toString()));
    } catch (e) {
      // Not JSON, that's fine
    }
  } else {
    console.log("Body:", req.body);
  }

  console.log("-----------------------------------");

  // Send a simple response
  res.status(200).send("Data received");
});

// WebSocket connection handler
wss.on("connection", (ws) => {
  console.log("------- WebSocket Client Connected -------");

  // WebSocket message handler
  ws.on("message", (message) => {
    console.log("------- WebSocket MESSAGE RECEIVED -------");
    console.log("Time:", new Date().toISOString());

    // Try to handle different message formats
    if (Buffer.isBuffer(message)) {
      console.log("Message (Buffer):", message);
      console.log("Message (String):", message.toString());
      try {
        console.log("Message (JSON):", JSON.parse(message.toString()));
      } catch (e) {
        // Not JSON, that's fine
      }
    } else {
      console.log("Message:", message);
    }

    console.log("-----------------------------------");
  });

  ws.on("close", () => {
    console.log("------- WebSocket Client Disconnected -------");
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`HTTP: http://localhost:${PORT}`);
  console.log(`WebSocket: ws://localhost:${PORT}`);
});
