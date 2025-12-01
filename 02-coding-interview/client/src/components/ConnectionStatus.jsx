import React, { useState, useEffect } from 'react';
import './ConnectionStatus.css';

const ConnectionStatus = ({ socket }) => {
  const [isConnected, setIsConnected] = useState(socket?.connected || false);
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    if (!socket) return;

    // Set initial connection state
    setIsConnected(socket.connected);

    const handleConnect = () => {
      setIsConnected(true);
      setConnectionError(null);
    };

    const handleDisconnect = (reason) => {
      setIsConnected(false);
      setConnectionError(`Disconnected: ${reason}`);
    };

    const handleConnectError = (error) => {
      setIsConnected(false);
      setConnectionError(`Connection error: ${error.message}`);
    };

    const handleReconnectAttempt = (attemptNumber) => {
      setConnectionError(`Attempting to reconnect... (${attemptNumber})`);
    };

    const handleReconnectFailed = () => {
      setConnectionError('Failed to reconnect to server');
    };

    // Register event listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('reconnect_attempt', handleReconnectAttempt);
    socket.on('reconnect_failed', handleReconnectFailed);

    // Cleanup event listeners
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('reconnect_attempt', handleReconnectAttempt);
      socket.off('reconnect_failed', handleReconnectFailed);
    };
  }, [socket]);

  const statusClass = isConnected ? 'connected' : 'disconnected';
  const statusText = isConnected ? 'Connected' : 'Disconnected';

  return (
    <div className={`connection-status ${statusClass}`}>
      <div className="status-indicator">
        <span className="status-dot"></span>
        <span className="status-text">{statusText}</span>
      </div>
      {connectionError && (
        <div className="connection-error">
          {connectionError}
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;