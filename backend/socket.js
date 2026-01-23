const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io = null;

const initializeSocket = (server) => {
    io = new socketIo.Server(server, {
        cors: {
            origin: process.env.VITE_URL,
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        socket.on('join', async (data) => {
            const { userId, userType } = data;
            if (userType === "user") {
                const user = await userModel.findById(userId);
                socket.join('users');
                if (user) {
                    user.socketId = socket.id;
                    await user.save();
                    console.log(`User ${userId} joined with socket ID: ${socket.id}`);
                }

            } else if (userType === "captain") {
                const captain = await captainModel.findById(userId);

                socket.join('captains');

                if (captain) {
                    captain.socketId = socket.id;
                    captain.captainState = 'active';
                    await captain.save();
                    console.log(`Captain ${userId} joined with socket ID: ${socket.id}`);
                }

                socket.on("disconnect", async () => {
                    try {
                        const captain = await captainModel.findById(userId);
                        if (!captain) return;

                        captain.captainState = 'inactive';
                        await captain.save();

                        console.log(`Captain ${userId} disconnected`);
                    } catch (err) {
                        console.error("Error on captain disconnect:", err);
                    }
                });

            }
        })



        socket.on('update-location-captain', async (data) => {
            const { captainId, latitude, longitude } = data;

            if (!latitude || !longitude || !captainId) {
                console.error('Invalid location data received:', data);
                return socket.emit('error', { message: 'Invalid location data' });
            }

            try {
                await captainModel.findByIdAndUpdate(captainId, {
                    location: {
                        type: "Point",
                        coordinates: [longitude, latitude]
                    }
                });
                console.log(`Updated location for captain ${captainId} to`, { latitude, longitude });
            }
            catch (err) {
                console.error('Error updating captain location:', err);
                return socket.emit('error', { message: 'Failed to update location' });
            }

        })



    }
    );
};

function sendMessageToSocketId(socketId, event, message) {
    if (io) {
        io.to(socketId).emit(event, message);
    } else {
        console.error('Socket.io not initialized');
    }
}

module.exports = {
    initializeSocket,
    sendMessageToSocketId,
};