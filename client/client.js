const net = require('net');
const path = require('path');
const fs = require('fs');


const HOST = '127.0.0.1';
const PORT = 12345;
const IMAGE_FILE = 'image.jpg'

const client = new net.Socket();

client.connect(PORT, HOST, () => {
    console.log('Connected to server');

    // Read the image file
    const imageData = fs.readFileSync(IMAGE_FILE);

    // Send image data to server
    const dataToSend = JSON.stringify({ imageData: imageData.toString('base64'), name: path.basename(IMAGE_FILE) });

    client.write(dataToSend);
    console.log('Image sent to server');

    

});

client.on('end', () => {
    console.log('Connection is closed');
});

client.on('data', (data) => {
    // Received image data from server
    console.log('Message from Server -->', JSON.parse(data.toString()).code);
    console.log('Message from Server -->', JSON.parse(data.toString()).message);
    console.log('Message from Server -->', JSON.parse(data.toString()).status);
    console.log('prepare to close the connection')
    

    client.end();

});

client.on('error', (err) => {
    console.error('Socket error:', err);
});

