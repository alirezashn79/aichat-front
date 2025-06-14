import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import PublicRoute from '../public/Private';
import RootLayout from '@/layouts/RootLayout/RootLayout';
const HomePage = lazy(() => import('@pages/HomePage/HomePage'));

export const publicRoutes: RouteObject[] = [
  {
    element: <PublicRoute />,
    children: [
      {
        element: <RootLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
        ],
      },
    ],
  },
];
