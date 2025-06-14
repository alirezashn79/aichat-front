import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import Guest from '../guest/Guest';
const SignInPage = lazy(() => import('@/pages/SignInPage/SignInPage'));
const SignUpPage = lazy(() => import('@/pages/SignUpPage/SignUpPage'));

export const authRoutes: RouteObject[] = [
  {
    element: <Guest />,
    children: [
      {
        path: 'sign-in/*',
        element: <SignInPage />,
      },
      {
        path: 'sign-up/*',
        element: <SignUpPage />,
      },
    ],
  },
];
