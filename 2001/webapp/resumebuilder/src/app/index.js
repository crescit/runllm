import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import HalEye from './hal'
import SinusoidalSpeechBubble from './sine'

export default function Home() {
  return (
    <div style={{        
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#000',
      flexDirection: 'column'}}>
      <HalEye/>
      <SinusoidalSpeechBubble text="Hello World!" />
    </div>
  )
}
