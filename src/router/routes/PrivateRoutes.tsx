import DashboardLayout from '@/layouts/DashboardLayout/DashboardLayout';
import RootLayout from '@/layouts/RootLayout/RootLayout';
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import PrivateRoutes from '../private/Private';
const DashboardPage = lazy(() => import('@pages/DashboardPage/DashboardPage'));
const ChatPage = lazy(() => import('@pages/ChatPage/ChatPage'));

export const privateRoutes: RouteObject[] = [
  {
    element: <PrivateRoutes />,
    children: [
      {
        element: <RootLayout />,
        children: [
          {
            path: 'dashboard',
            element: <DashboardLayout />,
            children: [
              {
                index: true,
                element: <DashboardPage />,
              },
              {
                path: 'chats/:id',
                element: <ChatPage />,
              },
            ],
          },
        ],
      },
    ],
  },
];
