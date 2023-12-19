'use client'

import { SetStateAction } from "react";
import Image from 'next/image'
import styles from './page.module.css'
import DirectoryPicker from "./directorypicker";
import HalEye from './hal'
import SinusoidalSpeechBubble from './sine'

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
        <SinusoidalSpeechBubble text="Hello World!" />
        <DirectoryPicker/>
      </div>
    </main>
  )
}
