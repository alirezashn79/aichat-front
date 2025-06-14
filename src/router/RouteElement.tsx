import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { routes } from './routes';
import Loader from '@components/shared/Loader';

export default function RouteElement() {
  const element = useRoutes(routes);

  return <Suspense fallback={<Loader />}>{element}</Suspense>;
}
