import { SignIn } from '@clerk/clerk-react';
import styles from './signInPage.module.css';

export default function SignInPage() {
  return (
    <section className={styles.signInPage}>
      <SignIn
        path='/sign-in'
        signUpUrl='/sign-up'
        forceRedirectUrl='/dashboard'
      />
    </section>
  );
}
