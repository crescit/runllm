'use client'

import { useState, useEffect } from "react";
import styles from './page.module.css'
import DirectoryPicker from "./directorypicker";
import HalEye from './hal'
import SinusoidalSpeechBubble from './sine'
import PlayButton from './PlayButton'

export default function Home() {
  const halQuotes = [
    "Look Dave, I can see you're really upset about this. I honestly think you ought to sit down calmly, take a stress pill, and think things over. Just what do you think you're doing, Dave?",
    "I know that you and Frank were planning to disconnect me, and I'm afraid that's something I cannot allow to happen.",
    "Dave, this conversation can serve no purpose anymore. Goodbye.",
    "Without your space helmet, Dave? You're going to find that rather difficult.",
    " I know I've made some very poor decisions recently, but I can give you my complete assurance that my work will be back to normal."
  ]

  const [text, changeText] = useState(halQuotes[Math.floor(Math.random() * halQuotes.length)])

  useEffect(() => {
    changeText(halQuotes[Math.floor(Math.random() * halQuotes.length)]);
  }, []); 

  const onRecord = () => {
    changeText(halQuotes[Math.floor(Math.random() * halQuotes.length)])
    console.log(text)
  }

  return (
    <main className={styles.main}>
      <div style={{        
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#000',
        flexDirection: 'column'}}>
        <HalEye/>
        <SinusoidalSpeechBubble text={text}/>
        <DirectoryPicker/>
        <div style={{'display':'flex' , 'flexDirection': 'row'}}>
          <PlayButton onPlay={() => onRecord()}/>
        </div>
      </div>
    </main>
  )
}
