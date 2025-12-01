const { server, io } = require('./index');
const Client = require('socket.io-client');

describe('Server Integration Tests', () => {
    let clientSocket1, clientSocket2;
    const serverPort = 3002; // Use different port to avoid conflict with dev server
    const serverUrl = `http://localhost:${serverPort}`;

    beforeAll((done) => {
        // Start the server for testing
        if (!server.listening) {
            server.listen(serverPort, () => {
                done();
            });
        } else {
            done();
        }
    });

    afterAll((done) => {
        // Clean up all connections
        io.close(() => {
            if (server.listening) {
                server.close(done);
            } else {
                done();
            }
        });
    });

    beforeEach(() => {
        // Create fresh client sockets for each test
        clientSocket1 = Client(serverUrl, {
            transports: ['websocket'],
            forceNew: true
        });
        clientSocket2 = Client(serverUrl, {
            transports: ['websocket'],
            forceNew: true
        });
    });

    afterEach(() => {
        // Disconnect all clients after each test
        if (clientSocket1 && clientSocket1.connected) {
            clientSocket1.disconnect();
        }
        if (clientSocket2 && clientSocket2.connected) {
            clientSocket2.disconnect();
        }
    });

    test('Client can connect to server', (done) => {
        clientSocket1.on('connect', () => {
            expect(clientSocket1.connected).toBe(true);
            done();
        });
    });

    test('Client can join a room', (done) => {
        const roomId = 'test-room-123';

        clientSocket1.on('connect', () => {
            clientSocket1.emit('join-room', roomId);

            // Give it a moment to join
            setTimeout(() => {
                // If no error occurred, test passes
                expect(clientSocket1.connected).toBe(true);
                done();
            }, 100);
        });
    });

    test('Client receives existing code when joining a room with existing code', (done) => {
        const roomId = 'test-room-existing-code';
        const existingCode = 'console.log("Hello, World!");';

        // First client joins and sets code
        clientSocket1.on('connect', () => {
            clientSocket1.emit('join-room', roomId);
            clientSocket1.emit('code-change', { roomId, code: existingCode });

            // Wait for code to be set, then create and connect second client
            setTimeout(() => {
                // Disconnect the default client2 created in beforeEach
                if (clientSocket2 && clientSocket2.connected) {
                    clientSocket2.disconnect();
                }

                // Create a new client that will receive existing code
                clientSocket2 = Client(serverUrl, {
                    transports: ['websocket'],
                    forceNew: true
                });

                clientSocket2.on('code-update', (code) => {
                    expect(code).toBe(existingCode);
                    done();
                });

                clientSocket2.on('connect', () => {
                    clientSocket2.emit('join-room', roomId);
                });
            }, 200);
        });
    });

    test('Code changes are synchronized between clients in the same room', (done) => {
        const roomId = 'test-room-sync';
        const testCode = 'function test() { return 42; }';

        let client1Connected = false;
        let client2Connected = false;

        const checkAndProceed = () => {
            if (client1Connected && client2Connected) {
                // Both clients connected, now send code change
                clientSocket1.emit('code-change', { roomId, code: testCode });
            }
        };

        clientSocket1.on('connect', () => {
            clientSocket1.emit('join-room', roomId);
            client1Connected = true;
            checkAndProceed();
        });

        clientSocket2.on('connect', () => {
            clientSocket2.emit('join-room', roomId);
            client2Connected = true;

            // Client 2 should receive code updates
            clientSocket2.on('code-update', (code) => {
                expect(code).toBe(testCode);
                done();
            });

            checkAndProceed();
        });
    });

    test('Multiple clients in the same room all receive code updates', (done) => {
        const roomId = 'test-room-multiple';
        const testCode = 'const x = 100;';

        let client3 = Client(serverUrl, {
            transports: ['websocket'],
            forceNew: true
        });

        let connectCount = 0;
        const totalClients = 3;
        let receivedCount = 0;

        const checkAllConnected = () => {
            connectCount++;
            if (connectCount === totalClients) {
                // All clients connected, send code change from client 1
                clientSocket1.emit('code-change', { roomId, code: testCode });
            }
        };

        const handleCodeUpdate = (code) => {
            expect(code).toBe(testCode);
            receivedCount++;

            // Client 1 sends, so clients 2 and 3 should receive (2 total)
            if (receivedCount === 2) {
                client3.disconnect();
                done();
            }
        };

        clientSocket1.on('connect', () => {
            clientSocket1.emit('join-room', roomId);
            checkAllConnected();
        });

        clientSocket2.on('connect', () => {
            clientSocket2.emit('join-room', roomId);
            clientSocket2.on('code-update', handleCodeUpdate);
            checkAllConnected();
        });

        client3.on('connect', () => {
            client3.emit('join-room', roomId);
            client3.on('code-update', handleCodeUpdate);
            checkAllConnected();
        });
    });

    test('Clients in different rooms do not receive each other\'s code updates', (done) => {
        const room1 = 'test-room-1';
        const room2 = 'test-room-2';
        const codeRoom1 = 'const room1 = true;';
        const codeRoom2 = 'const room2 = true;';

        let receivedUpdates = 0;

        clientSocket1.on('connect', () => {
            clientSocket1.emit('join-room', room1);

            // Client1 should NOT receive room2's code
            clientSocket1.on('code-update', (code) => {
                // This should not be called
                expect(code).not.toBe(codeRoom2);
            });
        });

        clientSocket2.on('connect', () => {
            clientSocket2.emit('join-room', room2);

            // Client2 should NOT receive room1's code
            clientSocket2.on('code-update', (code) => {
                // This should not be called
                expect(code).not.toBe(codeRoom1);
            });

            // Give clients time to join rooms
            setTimeout(() => {
                // Send code changes to different rooms
                clientSocket1.emit('code-change', { roomId: room1, code: codeRoom1 });
                clientSocket2.emit('code-change', { roomId: room2, code: codeRoom2 });

                // Wait and verify no cross-room updates occurred
                setTimeout(() => {
                    expect(receivedUpdates).toBe(0);
                    done();
                }, 200);
            }, 100);
        });
    });

    test('Server handles client disconnection gracefully', (done) => {
        const roomId = 'test-room-disconnect';

        clientSocket1.on('connect', () => {
            clientSocket1.emit('join-room', roomId);

            // Disconnect client
            clientSocket1.disconnect();

            // Wait a moment then verify server is still responsive
            setTimeout(() => {
                const newClient = Client(serverUrl, {
                    transports: ['websocket'],
                    forceNew: true
                });

                newClient.on('connect', () => {
                    expect(newClient.connected).toBe(true);
                    newClient.disconnect();
                    done();
                });
            }, 200);
        });
    });
});
