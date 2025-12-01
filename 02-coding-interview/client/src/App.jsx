import React, { useState } from 'react';
import io from 'socket.io-client';
import SyncedCodeEditor from './components/SyncedCodeEditor';
import Output from './components/Output';
import './App.css';

import Worker from './worker?worker';

// Get backend URL from environment variable, fallback to localhost
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const socket = io(BACKEND_URL);

function App() {
  const [code, setCode] = useState('// Write your code here\nconsole.log("Hello World!");');
  const [output, setOutput] = useState([]);
  const [roomId, setRoomId] = useState('default-room');
  const [language, setLanguage] = useState('javascript');

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
        <div className="controls">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="language-selector"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
          </select>
          <button onClick={runCode}>Run Code</button>
        </div>
      </div>
      <div className="main-content">
        <div className="editor-pane">
          <SyncedCodeEditor
            code={code}
            onChange={setCode}
            roomId={roomId}
            socket={socket}
            language={language}
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
