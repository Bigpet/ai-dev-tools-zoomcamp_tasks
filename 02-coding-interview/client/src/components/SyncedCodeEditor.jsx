import React, { useEffect } from 'react';
import CodeEditor from './Editor';

const SyncedCodeEditor = ({ code, onChange, roomId, socket, language, codeByLanguage }) => {
    useEffect(() => {
        if (!socket) return;

        socket.emit('join-room', roomId);

        const handleCodeUpdate = ({ code: newCode, language: updateLanguage }) => {
            // Only update if the code update is for the current language
            if (updateLanguage === language) {
                onChange(newCode);
            }
        };

        socket.on('code-update', handleCodeUpdate);

        return () => {
            socket.off('code-update', handleCodeUpdate);
        };
    }, [roomId, socket, onChange, language]);

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
