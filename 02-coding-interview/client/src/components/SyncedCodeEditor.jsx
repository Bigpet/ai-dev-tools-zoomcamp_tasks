import React, { useEffect, useRef } from 'react';
import CodeEditor from './Editor';

const SyncedCodeEditor = ({ code, onChange, roomId, socket, language, codeByLanguage }) => {
    const onChangeRef = useRef(onChange);

    // Keep the ref updated
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    // Join room once when component mounts or roomId changes
    useEffect(() => {
        if (!socket) return;

        socket.emit('join-room', roomId);
    }, [roomId, socket]);

    // Handle code updates from other clients
    useEffect(() => {
        if (!socket) return;

        const handleCodeUpdate = ({ code: newCode, language: updateLanguage }) => {
            // Only update if the code update is for the current language
            if (updateLanguage === language) {
                onChangeRef.current(newCode);
            }
        };

        socket.on('code-update', handleCodeUpdate);

        return () => {
            socket.off('code-update', handleCodeUpdate);
        };
    }, [socket, language]);

    const handleCodeChange = (newCode) => {
        onChange(newCode);
        if (socket) {
            socket.emit('code-change', { roomId, code: newCode, language });
        }
    };

    return (
        <CodeEditor
            code={code}
            onChange={handleCodeChange}
            language={language}
        />
    );
};

export default SyncedCodeEditor;
