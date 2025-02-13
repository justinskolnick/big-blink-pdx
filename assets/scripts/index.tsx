import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router';

import { store } from './lib/store';

import AlertError from './components/alert-error';
import App from './components/app';
import EntitiesIndex from './components/entities/index';
import EntitiesDetail from './components/entities/detail';
import Home from './components/home/index';
import IncidentsIndex from './components/incidents/index';
import IncidentsDetail from './components/incidents/detail';
import PeopleIndex from './components/people/index';
import PeopleDetail from './components/people/detail';
import SourcesIndex from './components/sources/index';
import SourcesDetail from './components/sources/detail';
import { alertPortalId, alertRootId } from './components/alert-portal';
import { modalPortalId, modalRootId } from './components/modal-portal';

const rootTarget = document.getElementById('root');
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <AlertError />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'entities/*',
        children: [
          {
            path: '',
            element: <EntitiesIndex />,
          },
          {
            path: ':id',
            element: <EntitiesDetail />,
          },
        ],
      },
      {
        path: 'incidents/*',
        children: [
          {
            path: '',
            element: <IncidentsIndex />,
          },
          {
            path: ':id',
            element: <IncidentsDetail />,
          },
        ],
      },
      {
        path: 'people/*',
        children: [
          {
            path: '',
            element: <PeopleIndex />,
          },
          {
            path: ':id',
            element: <PeopleDetail />,
          },
        ],
      },
      {
        path: 'sources/*',
        children: [
          {
            path: '',
            element: <SourcesIndex />,
          },
          {
            path: ':id',
            element: <SourcesDetail />,
          },
        ],
      },
    ],
  }
]);

const createTarget = (id: string) => {
  const target = document.createElement('div');
  target.id = id;
  target.className = id;

  return target;
};

const appendTarget = (target: HTMLDivElement) => {
  document.body.appendChild(target);
};

if (rootTarget) {
  try {
    const modal = createTarget(modalRootId);
    const alert = createTarget(alertRootId);

    appendTarget(modal);
    appendTarget(alert);

    createRoot(modal).render(
      <Provider store={store}>
        <div id={modalPortalId} />
      </Provider>
    );

    createRoot(alert).render(
      <Provider store={store}>
        <div id={alertPortalId} />
      </Provider>
    );

    createRoot(rootTarget).render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );
  } catch (error) {
    console.log(error);
  }
}
