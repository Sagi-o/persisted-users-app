import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import App from '../app';
import { HomePage } from '../pages/HomePage';
import { RandomListPage } from '../pages/RandomListPage';
import { SavedListPage } from '../pages/SavedListPage';
import { ProfileDetailPage } from '../pages/ProfileDetailPage';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'random', element: <RandomListPage /> },
      { path: 'saved', element: <SavedListPage /> },
      { path: 'profile/:source/:id', element: <ProfileDetailPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
