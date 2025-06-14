import { SignUp } from '@clerk/clerk-react';
import styles from './signUpPage.module.css';

export default function SignUpPage() {
  return (
    <section className={styles.signUpPage}>
      <SignUp
        path='/sign-up'
        signInUrl='/sign-in'
        forceRedirectUrl='/dashboard'
      />
    </section>
  );
}
