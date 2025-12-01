import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import SyncedCodeEditor from './components/SyncedCodeEditor';
import Output from './components/Output';
import ConnectionStatus from './components/ConnectionStatus';
import './App.css';

import Worker from './worker?worker';

// Get backend URL from environment variable, fallback to localhost
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const socket = io(BACKEND_URL);

// Default templates for each language
const defaultCodeTemplates = {
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

function App() {
  // Get room from URL query parameter, fallback to default-room
  const urlParams = new URLSearchParams(window.location.search);
  const initialRoomId = urlParams.get('room') || 'default-room';

  const [codeByLanguage, setCodeByLanguage] = useState({ ...defaultCodeTemplates });
  const [output, setOutput] = useState([]);
  const [roomId, setRoomId] = useState(initialRoomId);
  const [roomInput, setRoomInput] = useState(initialRoomId);
  const [language, setLanguage] = useState('javascript');

  // Get current code for the active language
  const code = codeByLanguage[language];

  // Update URL when room changes
  const updateRoomUrl = (newRoomId) => {
    const url = new URL(window.location);
    url.searchParams.set('room', newRoomId);
    window.history.replaceState({}, '', url);
  };

  // Handle room change
  const handleRoomChange = (newRoomId) => {
    setRoomId(newRoomId);
    setRoomInput(newRoomId);
    updateRoomUrl(newRoomId);

    // Emit room change to server
    socket.emit('join-room', newRoomId);
  };

  // Copy invite link to clipboard
  const copyInviteLink = async () => {
    const inviteUrl = `${window.location.origin}${window.location.pathname}?room=${roomId}`;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      alert('Invite link copied to clipboard!');
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = inviteUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert('Invite link copied to clipboard!');
      } catch (err) {
        alert('Failed to copy invite link');
      }
      document.body.removeChild(textArea);
    }
  };

  // Handle room state updates from server and initial room join
  useEffect(() => {
    // Join the initial room
    socket.emit('join-room', roomId);

    const handleRoomState = ({ code, language: roomLanguage }) => {
      setCodeByLanguage(code);
      setLanguage(roomLanguage);
    };

    const handleLanguageUpdate = (newLanguage) => {
      setLanguage(newLanguage);
    };

    socket.on('room-state', handleRoomState);
    socket.on('language-update', handleLanguageUpdate);

    return () => {
      socket.off('room-state', handleRoomState);
      socket.off('language-update', handleLanguageUpdate);
    };
  }, [roomId]); // Include roomId in dependencies to re-join when room changes

  const handleCodeChange = (newCode) => {
    // Update local state
    setCodeByLanguage(prev => ({
      ...prev,
      [language]: newCode
    }));
  };

  const handleLanguageChange = (newLanguage) => {
    // Update local state
    setLanguage(newLanguage);

    // Emit language change to server to sync with other clients
    socket.emit('language-change', { roomId, language: newLanguage });
  };

  const runCode = () => {
    setOutput([]); // Clear previous output

    const worker = new Worker();

    worker.onmessage = (e) => {
      const { type, logs, error } = e.data;
      if (type === 'success') {
        setOutput(logs);
      } else {
        setOutput([...logs, `Error: ${error}`]);
      }
      worker.terminate();
    };

    worker.onerror = (error) => {
      setOutput([`Worker Error: ${error.message}`]);
      worker.terminate();
    };

    worker.postMessage({ code, language });

    // Timeout to prevent infinite loops
    setTimeout(() => {
      worker.terminate();
      setOutput((prev) => [...prev, 'Execution timed out (5s limit)']);
    }, 5000);
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Coding Interview Platform</h1>
        <div className="header-center">
          <div className="room-controls">
            <label htmlFor="room-input" className="room-label">Room:</label>
            <input
              id="room-input"
              type="text"
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
              onBlur={() => {
                if (roomInput.trim() !== roomId) {
                  handleRoomChange(roomInput.trim() || 'default-room');
                }
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.target.blur();
                }
              }}
              className="room-input"
              placeholder="Enter room name"
            />
            <button onClick={copyInviteLink} className="copy-link-btn" title="Copy invite link">
              📋 Copy Link
            </button>
          </div>
        </div>
        <div className="header-right">
          <div className="controls">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="language-selector"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>
          </div>
          <ConnectionStatus socket={socket} />
          <button onClick={runCode} className="run-code-btn">Run Code</button>
        </div>
      </div>
      <div className="main-content">
        <div className="editor-pane">
          <SyncedCodeEditor
            code={code}
            onChange={handleCodeChange}
            roomId={roomId}
            socket={socket}
            language={language}
            codeByLanguage={codeByLanguage}
          />
        </div>
        <div className="output-pane">
          <Output output={output} />
        </div>
      </div>
    </div>
  );
}

export default App;
