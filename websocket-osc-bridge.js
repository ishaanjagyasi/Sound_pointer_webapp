const WebSocket = require('ws');
const osc = require('node-osc');

const wss = new WebSocket.Server({ port: 8080 });

// This object will store our OSC clients, keyed by port number.
// Example: { '9000': clientForPort9000, '9001': clientForPort9001 }
const oscClients = {};

console.log('WebSocket-to-OSC bridge running on port 8080');

wss.on('connection', (ws) => {
    console.log('Phone connected to bridge');
    
    ws.on('message', (data) => {
        try {
            const msg = JSON.parse(data);
            
            // Get the destination port from the message, default to 9000 if not provided
            const port = msg.port || 9000;
            
            // Check if we already have an OSC client for this port
            if (!oscClients[port]) {
                // If not, create a new one and store it in our cache
                console.log(`Creating new OSC client for port ${port}`);
                oscClients[port] = new osc.Client('127.0.0.1', port);
            }
            
            // Use the correct client (based on the port) to send the message
            oscClients[port].send(msg.address, msg.value);
            
            // Log the action
            console.log(`OSC sent to port ${port}: ${msg.address} ${msg.value.toFixed(2)}`);
            
        } catch (error) {
            console.error('Error parsing or sending message:', error);
        }
    });
    
    ws.on('close', () => {
        console.log('Phone disconnected');
    });
});