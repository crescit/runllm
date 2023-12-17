'use client'

import { SetStateAction } from "react";
import Image from 'next/image'
import styles from './page.module.css'
import DirectoryPicker from "./directorypicker";

export default function Home() {

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <DirectoryPicker />
      </div>
    </main>
  )
}
