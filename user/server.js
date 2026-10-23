const http = require('http');
const userApp = require('./app')
const connectDatabase = require('./config/database');

async function startServer() {
    await connectDatabase();

    const server = http.createServer(userApp);
    const port = 3001;

    server.listen(port, () => {
        console.log("Server is running on port 3001");
    });
}

startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exitCode = 1;
});