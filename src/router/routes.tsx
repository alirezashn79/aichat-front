import type { RouteObject } from 'react-router-dom';
import { authRoutes } from './routes/AuthRoutes';
import { privateRoutes } from './routes/PrivateRoutes';
import { publicRoutes } from './routes/PublicRoutes';

export const routes: RouteObject[] = [
  ...publicRoutes,
  ...authRoutes,
  ...privateRoutes,
];
