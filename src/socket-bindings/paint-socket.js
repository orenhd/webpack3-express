export function bind(io) {
    io.on('connection', (socket) => {
        socket.on('submit', (doodleData) => {
            io.emit('publish', doodleData);
        });
    });
}