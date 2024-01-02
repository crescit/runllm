import React from 'react';
import styles from '../page.module.css';

const About = () => {
  return (
    <div>
      <h1>About Us</h1>
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
        {/* <Link href="/about">About Us</Link> */}
        <p className={styles.valueprops}>Increase Confidence</p>
        <p className={styles.valueprops}>Practice Increases Performance</p>
        <p className={styles.valueprops}>Tangible Results</p>
        <p className={styles.valueprops}>Interview Anytime</p>
        <p className={styles.valueprops}>Identify Strengths & Weaknesses</p>
      </div>
    </div>
  );
};  

export default About;
