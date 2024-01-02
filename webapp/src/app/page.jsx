'use client';

import { useState, useEffect } from 'react';
import { useSpeechRecognition } from 'react-speech-kit';
import Modal from 'react-modal';
import Link from 'next/link';

import styles from './page.module.css';
import HalEye from './hal';
import SinusoidalSpeechBubble from './sine';
import PlayButton from './PlayButton';
import AddInterviewButton from './AddInterview';

export default function Home() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };


  const halQuotes = [
    "Look Dave, I can see you're really upset about this. I honestly think you ought to sit down calmly, take a stress pill, and think things over. Just what do you think you're doing, Dave?",
    "I know that you and Frank were planning to disconnect me, and I'm afraid that's something I cannot allow to happen.",
    'Dave, this conversation can serve no purpose anymore. Goodbye.',
    "Without your space helmet, Dave? You're going to find that rather difficult.",
    " I know I've made some very poor decisions recently, but I can give you my complete assurance that my work will be back to normal.",
  ];

  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result) => {
      // Handle the recognized speech result
      console.log('Speech Recognized:', result);
      changeText(result);
    },
  });

  const [text, changeText] = useState(
    halQuotes[Math.floor(Math.random() * halQuotes.length)]
  );

  useEffect(() => {
    changeText(halQuotes[Math.floor(Math.random() * halQuotes.length)]);
  }, []);

  const onRecord = () => {
    changeText(halQuotes[Math.floor(Math.random() * halQuotes.length)]);
    console.log(text);
    listen();
  };

  const customStyles = {
    content: {
      width: '66%', // Set your desired width
      height: '66%', // Set your desired height
      top: '50%', // Center vertically
      left: '50%', // Center horizontally
      transform: 'translate(-50%, -50%)', // Center the modal
      background: 'rgba(0, 0, 0, 1)',
    },
  };

  return (
    <main>
      <div
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          marginTop: '50px',
        }}
      >
        <h1>tutr.ai</h1>
        <h3 style={{ color: 'red' }}>Elevate Your Interview Game</h3>
      </div>
      <div className={styles.main}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '80vh',
            backgroundColor: '#000',
            flexDirection: 'column',
          }}
        >
          <container
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <HalEye />
            <SinusoidalSpeechBubble text={text} />
          </container>
          <AddInterviewButton />
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <PlayButton onPlay={() => onRecord()} onStop={() => stop()} />
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '15px',
          marginTop: '-50px',
          borderTop: '5px solid red',
          borderBottom: '5px solid red',
        }}
      >
        <Link href="/about">About Us</Link>
        <p style={{ display: 'flex', marginLeft: '20px' }} onClick={openModal}>
          Provide Feedback
        </p>
      </div>
      {/* <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <button style={{ display: 'flex'}} className={'button'} onClick={openModal}>
          Provide Feedback
        </button>
      </div> */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel='Feedback Modal'
        style={customStyles} // Apply custom styles
      >
        <p style={{ marginBottom: '50px' }} align='center'>
          <iframe
            src='https://docs.google.com/forms/d/e/1FAIpQLSftkTKMBDB3_w8BgTSfk6TpErw9Cps2sM2mcoBXNdsx4Y9s2g/viewform?embedded=true'
            width='640'
            height='649'
            frameborder='0'
            marginheight='0'
            marginWidth='0'
          >
            Loading…
          </iframe>
        </p>
        <button
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '30px',
            height: '30px',
            backgroundColor: '#333  ',
            color: '#fff',
            fontSize: '18px',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={closeModal}
        >
          X
        </button>
      </Modal>
    </main>
  );
}
