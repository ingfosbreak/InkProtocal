const net = require('net');
const fs = require('fs');
const path = require('path');

const HOST = '127.0.0.1';
const PORT = 12345;
const IMAGE_FOLDER = 'received_images'; // Folder to save received images

const server = net.createServer((socket) => {
    console.log('Client connected');

    // let receivedData = Buffer.alloc(0);

    socket.on('data', (data) => {
        // receivedData = Buffer.concat([receivedData, data]);
        console.log('Received data from client', JSON.parse(data.toString()).name);

        // Create the folder if it doesn't exist
        if (!fs.existsSync(IMAGE_FOLDER)) {
            fs.mkdirSync(IMAGE_FOLDER);
        }
        
        const imagePath = path.join(IMAGE_FOLDER, JSON.parse(data.toString()).name);

        const imageDataBuffer = Buffer.from(JSON.parse(data.toString()).imageData, 'base64');
    
        fs.writeFileSync(imagePath, imageDataBuffer);
        // fs.writeFileSync(imagePath, receivedData);
        console.log('Image saved as', imagePath);


        const response = {
            code: 200,
            status: 'ok',
            message: 'Image received and saved successfully'
        };

        socket.write(JSON.stringify(response));


    });

    socket.on('end', () => {
        console.log('Client disconnected');
    });

    socket.on('error', (err) => {
        console.error('Socket error:', err);
    });
});

server.listen(PORT, HOST, () => {
    console.log(`Server listening on ${HOST}:${PORT}`);
});
