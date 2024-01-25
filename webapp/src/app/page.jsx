'use client';

import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Link from 'next/link';

import styles from './page.module.css';
import HalEye from './hal';
import SinusoidalSpeechBubble from './sine';
import PlayButton from './PlayButton';
import AddInterviewButton from './AddInterview';
import Questions from './Questions'
import { QuestionsProvider } from './context/QuestionContext'
import PrevButton from './PrevQuestionButton'

export default function Home() {
  const [feedbackModalIsOpen, setFeedbackModalIsOpen] = useState(false);

  const openFeedbackModal = () => {
    setFeedbackModalIsOpen(true);
  };


  const closeFeedbackModal = () => {
    setFeedbackModalIsOpen(false);
  };

  const [text, changeText] = useState(
   "HOW IT WORKS: 1) Click 'Add Interview' and upload interview information - resume, job description, interview length, type of interview. 2) A series of interview questions are created based off the information provided. 3) Click 'Record' to respond to the first question and then click 'Stop Recording'. 4) Repeat for each question. "
  );

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
      <QuestionsProvider>
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
         style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', backgroundColor: '#000', flexDirection: 'column' }}
        >
          <container
          className="card"
            style={{ display: 'flex',  flexDirection: 'column', alignItems: 'center', }}
          >
            <HalEye />
            <SinusoidalSpeechBubble text={text} />
          </container>
          <AddInterviewButton userID={'d0bd5d2a-3392-4eb7-b8f3-455f2d85292e'}/>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <PrevButton />
            <PlayButton userID={'d0bd5d2a-3392-4eb7-b8f3-455f2d85292e'}/>
          </div>
       </div>
      </div>
      <Questions userID={'d0bd5d2a-3392-4eb7-b8f3-455f2d85292e'}/>

      {/** Begin footer */}
      <div id="footer"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '15px', marginTop: '-50px', borderTop: '5px solid red', borderBottom: '5px solid red' }}
      >

      <Link href="/about">About Us</Link>
        <p style={{ display: 'flex', marginLeft: '20px', cursor: 'pointer' }} onClick={openFeedbackModal}>
          Provide Feedback
        </p>
      </div>
    
      <Modal
        isOpen={feedbackModalIsOpen}
        onRequestClose={closeFeedbackModal}
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
        <button style={{ position: 'absolute', top: '10px', right: '10px', width: '30px', height: '30px', backgroundColor: '#333', color: '#fff', fontSize: '18px', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          onClick={closeFeedbackModal}
        >
          X
        </button>
      </Modal>
      </QuestionsProvider>
    </main>
  );
}
