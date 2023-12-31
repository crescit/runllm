'use client';

import { useState, useEffect } from 'react';
import { useSpeechRecognition } from 'react-speech-kit';

import styles from './page.module.css';
import DirectoryPicker from './directorypicker';
import HalEye from './hal';
import SinusoidalSpeechBubble from './sine';
import PlayButton from './PlayButton';
import AddInterviewButton from './AddInterview';

export default function Home() {
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
      <p
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '50px 100px',
        }}
      >
        Run an AI mock interview anytime by providing some basic information to
        build that repetetive muscle and better prepare for your next interview
      </p>
      <div className={styles.main}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#000',
            flexDirection: 'column',
          }}
        >
          <container
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '75px',
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
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: '15px',
          marginTop: '-50px',
          borderTop: '5px solid red',
          borderBottom: '5px solid red',
        }}
      >
        <p className={styles.valueprops}>Increase Confidence</p>
        <p className={styles.valueprops}>Practice Increases Performance</p>
        <p className={styles.valueprops}>Tangible Results</p>
        <p className={styles.valueprops}>Interview Anytime</p>
        <p className={styles.valueprops}>Identify Strengths & Weaknesses</p>
      </div>
      <p style={{ marginBottom: '50px' }} align='center'>
        <iframe
          src='https://docs.google.com/forms/d/e/1FAIpQLSftkTKMBDB3_w8BgTSfk6TpErw9Cps2sM2mcoBXNdsx4Y9s2g/viewform?embedded=true'
          width='640'
          height='649'
          frameborder='0'
          marginheight='0'
          marginwidth='0'
        >
          Loading…
        </iframe>
      </p>
    </main>
  );
}
