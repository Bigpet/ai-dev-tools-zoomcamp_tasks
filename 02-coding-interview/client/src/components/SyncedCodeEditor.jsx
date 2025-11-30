import React, { useEffect } from 'react';
import CodeEditor from './Editor';

const SyncedCodeEditor = ({ code, onChange, roomId, socket }) => {
    useEffect(() => {
        if (!socket) return;

        socket.emit('join-room', roomId);

        const handleCodeUpdate = (newCode) => {
            onChange(newCode);
        };

        socket.on('code-update', handleCodeUpdate);

        return () => {
            socket.off('code-update', handleCodeUpdate);
        };
    }, [roomId, socket, onChange]);

    const handleCodeChange = (newCode) => {
        onChange(newCode);
        if (socket) {
            socket.emit('code-change', { roomId, code: newCode });
        }
    };

    return (
        <CodeEditor
            code={code}
            onChange={handleCodeChange}
        />
    );
};

export default SyncedCodeEditor;
