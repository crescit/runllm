'use client'

import { SetStateAction } from "react";
import Image from 'next/image'
import styles from './page.module.css'
import DirectoryPicker from "./directorypicker";
import HalEye from './hal'
import SinusoidalSpeechBubble from './sine'
import StopButton from './StopButton'
import PlayButton from './PlayButton'

const onStop = () => {
  console.log('processing audio, STOP')
}

const onRecord = () => {
  console.log('processing audio, RECORD')
}

export default function Home() {

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
        <SinusoidalSpeechBubble text="Look Dave, I can see you're really upset about this. I honestly think you ought to sit down calmly, take a stress pill, and think things over. Just what do you think you're doing, Dave?" />
        <DirectoryPicker/>
        <div style={{'display':'flex' , 'flexDirection': 'row'}}>
          <PlayButton onPlay={onRecord}/>
        </div>
      </div>
    </main>
  )
}
