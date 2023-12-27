import React, { useEffect, useState } from 'react';

const SinusoidalSpeechBubble = ({ text }) => {
    const [clientData, setClientData] = useState(null);
    useEffect(() => {
      const keyframes = `
        @keyframes sinusoidal-animation {
          0%, 100% {
            transform: translateY(0) translateX(${Math.random() * 4 - 2}px);
          }
          50% {
            transform: translateY(-10px) translateX(${Math.random() * 4 - 2}px);
          }
        }
      `;
  
      const styleTag = document.createElement('style');
      styleTag.innerHTML = keyframes;
      document.head.appendChild(styleTag);
      setClientData(text);
      return () => {
        document.head.removeChild(styleTag);
      };
    }, [text]);
  
    const bubbleStyle = {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#ecf0f1',
        borderRadius: '16px',
        width: 'auto',
        marginTop: '25px',
    };
  
    const textStyle = {
      fontSize: '16px',
      lineHeight: '1.5',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      color: '#333',
      position: 'relative',
      marginTop: '20px',
      padding: '15px',
    };
  
    const waveformStyle = {
      position: 'absolute',
      bottom: '-15px',
      left: '0',
      right: '0',
      height: '20px',
      background: 'linear-gradient(to right, #333 25%, transparent 25%, transparent 50%, #333 50%, #333 75%, transparent 75%, transparent 100%)',
      backgroundSize: '6px 6px',
      animation: 'sinusoidal-animation 2s linear infinite',
      marginLeft: '15px',
      marginRight: '15px'
    };
  
    return (
      <div style={bubbleStyle}>
        <p style={textStyle} alt={"output from scifi robot"}>
          <span style={waveformStyle}></span>
          {clientData}
        </p>
      </div>
    );
  };
  

export default SinusoidalSpeechBubble