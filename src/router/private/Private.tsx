import Loader from '@/components/shared/Loader';
import { useAuth } from '@clerk/clerk-react';
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRutes() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <Loader />;
  if (isLoaded && !isSignedIn) {
    return <Navigate to='/sign-in' />;
  }
  return <Outlet />;
}
