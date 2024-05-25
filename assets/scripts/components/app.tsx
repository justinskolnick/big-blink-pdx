import React, { useEffect, useRef } from 'react';
import { useLocation, Outlet, ScrollRestoration } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';

import fetchFromPath from '../lib/fetch-from-path';

import { hasAlertClass } from './alert-portal';
import { hasModalClass } from './modal-portal';
import AlertError from './alert-error';
import AlertMessage from './alert-message';
import AlertWarning from './alert-warning';
import GlobalFooter from './global-footer';
import Section from './section';

import useCaptureScrollPosition from '../hooks/use-capture-scroll-position';

import { getDescription, getPageTitle } from '../selectors';

const App = () => {
  const initiated = useRef(false);
  const location = useLocation();
  const description = useSelector(getDescription);
  const pageTitle = useSelector(getPageTitle);
  const isHome = location.pathname === '/';
  const className = ['section', location.pathname.split('/').at(1)].join('-');

  const scrollCaptureClasses: Array<string> = [hasAlertClass, hasModalClass];

  useCaptureScrollPosition(scrollCaptureClasses);

  useEffect(() => {
    const { pathname, search } = location;

    if (!initiated.current) {
      fetchFromPath('/overview');
      initiated.current = true;
    }

    fetchFromPath(pathname + search, true);
  }, [initiated, location]);

  return (
    <div className='global-layout'>
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
      <AlertError />
      <AlertMessage />
      <AlertWarning />

      <main className='global-main'>
        {isHome ? (
          <Outlet />
        ) : (
          <Section className={className}>
            <Outlet />
          </Section>
        )}
      </main>

      <GlobalFooter />
      <ScrollRestoration />
    </div>
  );
};

export default App;
