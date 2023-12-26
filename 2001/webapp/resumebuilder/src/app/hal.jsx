import React, { useEffect } from 'react';

const HalEye = () => {
  useEffect(() => {
    const handleMouseMove = (e) => {
      const eye = document.querySelector('.pupil');
      const eyeRect = eye.getBoundingClientRect();
      const eyeX = eyeRect.left + eyeRect.width / 2;
      const eyeY = eyeRect.top + eyeRect.height / 2;
      const angle = Math.atan2(e.clientY - eyeY, e.clientX - eyeX);
      const distance = Math.min(eyeRect.width / 4, eyeRect.height / 4);
      const translateX = distance * Math.cos(angle);
      const translateY = distance * Math.sin(angle);

      eye.style.transform = `translate(-50%, -50%) translate(${translateX}px, ${translateY}px)`;
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div style={{ position: 'relative', textAlign: 'center' }}>
      <div
        alt={"robotic scifi speaking eye"}
        className="camera-enclosure"
        aria-label="Camera Enclosure"
        style={{
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          position: 'relative',
          background: 'radial-gradient(circle, #333, #000)',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
        }}
      >
        <div
          className="jarvis-eye"
          aria-label="Jarvis Eye"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            position: 'absolute',
            backgroundColor: '#ff3333',
            overflow: 'hidden',
          }}
        >
          <div
            className="pupil"
            aria-label="Pupil"
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#000',
              borderRadius: '50%',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              transition: 'transform 0.1s ease-out',
            }}
          >
            <div
              className="shine"
              aria-hidden="true"
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: '#fff',
                borderRadius: '50%',
                position: 'absolute',
                top: '20%',
                left: '30%',
              }}
            ></div>
          </div>
        </div>
      </div>
      <div
        className="label"
        style={{
          textAlign: 'center',
          marginTop: '10px',
          color: '#fff',
          position: 'absolute',
          left: '-9999px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        Accessible HAL-inspired Jarvis Eye
      </div>
    </div>
  );
};

export default HalEye;
