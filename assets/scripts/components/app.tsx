import React from 'react';
import { Outlet } from 'react-router';
import { Helmet, HelmetProvider } from '@dr.pogodin/react-helmet';

import { hasAlertClass } from './alert-portal';
import { hasModalClass } from './modal-portal';
import AlertError from './alert-error';
import AlertMessage from './alert-message';
import AlertWarning from './alert-warning';
import GlobalFooter from './global-footer';
import GlobalMain from './global-main';

import useCaptureScrollPosition from '../hooks/use-capture-scroll-position';
import useSelector from '../hooks/use-app-selector';
import useTriggerPrimaryQuery from '../hooks/use-trigger-primary-query';

import { getDescription, getPageTitle } from '../selectors';

const App = () => {
  const description = useSelector(getDescription);
  const pageTitle = useSelector(getPageTitle);

  const scrollCaptureClasses: Array<string> = [hasAlertClass, hasModalClass];

  useCaptureScrollPosition(scrollCaptureClasses);
  useTriggerPrimaryQuery();

  return (
    <div className='global-layout'>
      <HelmetProvider>
        <Helmet
          defaultTitle='The Big Blink PDX'
          titleTemplate='%s · The Big Blink PDX'
        >
          {pageTitle && (
            <title>{pageTitle}</title>
          )}
          {description && (
            <meta name='description' content={description} />
          )}
        </Helmet>
      </HelmetProvider>

      <AlertError />
      <AlertMessage />
      <AlertWarning />

      <GlobalMain>
        <Outlet />
      </GlobalMain>

      <GlobalFooter />
    </div>
  );
};

export default App;
