import React, { useState, useEffect, useRef } from 'react';
import './CopyNotification.css';

const CopyNotification = ({ trigger }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [key, setKey] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (trigger) {
      // Clear existing timeout if it exists
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Increment key to force re-render and restart animation
      setKey(prev => prev + 1);
      setIsVisible(true);

      // Set new timeout to hide notification
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        timeoutRef.current = null;
      }, 5000);
    }
  }, [trigger]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <span key={key} className="copy-notification">
      ✅ Link copied!
    </span>
  );
};

export default CopyNotification;