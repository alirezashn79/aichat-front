import BotlImage from '@assets/images/bot.png';
import Human1Image from '@assets/images/human1.jpeg';
import human2Image from '@assets/images/human2.jpeg';
import orbitalImage from '@assets/images/orbital.png';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import styles from './homePage.module.css';
import LogoImage from '@assets/images/logo.png';

export default function HomePage() {
  const [typingStatus, setTypingStatus] = useState('human1');

  return (
    <div className={styles.homepage}>
      <img
        src={orbitalImage}
        alt=''
        className={styles.orbital}
        loading='lazy'
      />

      <div className={styles.left}>
        <h1>ALIREZA AI</h1>
        <h2>Supercharge your creativity and productivity</h2>
        <h3>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat sint
          dolorem doloribus, architecto dolor.
        </h3>
        <Link to='/dashboard'>Get Started</Link>
      </div>

      <div className={styles.right}>
        <div className={styles.imgContainer}>
          <div className={styles.bgContainer}>
            <div className={styles.bg}></div>
          </div>
          <img src={BotlImage} alt='' className={styles.bot} loading='lazy' />

          <div className={styles.chat}>
            <img
              src={
                typingStatus === 'human1'
                  ? Human1Image
                  : typingStatus === 'human2'
                    ? human2Image
                    : BotlImage
              }
              alt=''
              loading='lazy'
            />
            <TypeAnimation
              sequence={[
                'Human:We produce food for Mice',
                2000,
                () => setTypingStatus('bot'),
                'Bot:We produce food for Hamsters',
                2000,
                () => setTypingStatus('human2'),
                'Human2:We produce food for Guinea Pigs',
                2000,
                () => setTypingStatus('bot'),
                'Bot:We produce food for Chinchillas',
                2000,
                () => setTypingStatus('human1'),
              ]}
              wrapper='span'
              repeat={Infinity}
              cursor={true}
              omitDeletionAnimation={true}
            />
          </div>
        </div>
      </div>

      <div className={styles.terms}>
        <img src={LogoImage} alt='Logo' loading='lazy' />
        <div className={styles.links}>
          <Link to='/'>Terms of Service</Link>
          <span>|</span>
          <Link to='/'>Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}
