import Logo from '@assets/images/logo.png';
import { SignedIn, UserButton } from '@clerk/clerk-react';
import { Link, Outlet } from 'react-router-dom';
import styles from './rootLayout.module.css';
export default function RootLayout() {
  return (
    <div className={styles.rootLayout}>
      <header>
        <Link to='/' className={styles.logo}>
          <img src={Logo} alt='Alireza AI' />
          <span>ALIREZA AI</span>
        </Link>
        <div className='user'>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
