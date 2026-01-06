const dotenv = require("dotenv");
const { initializeSocket } = require("./socket");

dotenv.config();
const PORT = process.env.PORT || 4000;
const app = require("./app");

const http = require("http");
const server = http.createServer(app);
initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
