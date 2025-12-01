const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Default templates for each language
const defaultCode = {
    javascript: `// JavaScript Example
// Try running this code!

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci sequence:");
for (let i = 0; i < 10; i++) {
    console.log(\`fib(\${i}) = \${fibonacci(i)}\`);
}`,
    python: `# Python Example
# Try running this code!

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print("Fibonacci sequence:")
for i in range(10):
    print(f"fib({i}) = {fibonacci(i)}")`
};

// Store room state: { roomId: { code: { javascript: '...', python: '...' }, language: 'javascript' } }
const rooms = {};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);

        // Initialize room if it doesn't exist
        if (!rooms[roomId]) {
            rooms[roomId] = {
                code: { ...defaultCode },
                language: 'javascript'
            };
        }

        // Send current room state to the joining user
        socket.emit('room-state', {
            code: rooms[roomId].code,
            language: rooms[roomId].language
        });
    });

    socket.on('code-change', ({ roomId, code, language }) => {
        if (!rooms[roomId]) {
            rooms[roomId] = {
                code: { ...defaultCode },
                language: 'javascript'
            };
        }

        // Store code for the specific language
        rooms[roomId].code[language] = code;

        // Broadcast to other users in the room
        socket.to(roomId).emit('code-update', { code, language });
    });

    socket.on('language-change', ({ roomId, language }) => {
        if (!rooms[roomId]) {
            rooms[roomId] = {
                code: { ...defaultCode },
                language: 'javascript'
            };
        }

        // Update the room's current language
        rooms[roomId].language = language;

        // Broadcast to other users in the room
        socket.to(roomId).emit('language-update', language);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3001;

// Only start server when this file is run directly (not imported for tests)
if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for testing
module.exports = { app, server, io, rooms };

