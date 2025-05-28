import React, { useEffect } from 'react';
import { useLocation, Outlet } from 'react-router';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';

import { hasAlertClass } from './alert-portal';
import { hasModalClass } from './modal-portal';
import AlertError from './alert-error';
import AlertMessage from './alert-message';
import AlertWarning from './alert-warning';
import GlobalFooter from './global-footer';
import Section from './section';

import useCaptureScrollPosition from '../hooks/use-capture-scroll-position';
import useTriggerPrimaryQuery from '../hooks/use-trigger-primary-query';

import api from '../services/api';

import { getDescription, getPageTitle } from '../selectors';

const App = () => {
  const [triggerOverview, overviewResult] = api.useLazyGetOverviewQuery();
  const [triggerLeaderboard, leaderboardResult] = api.useLazyGetLeaderboardQuery();

  const location = useLocation();
  const description = useSelector(getDescription);
  const pageTitle = useSelector(getPageTitle);
  const isHome = location.pathname === '/';
  const className = ['section', location.pathname.split('/').at(1)].join('-');

  const scrollCaptureClasses: Array<string> = [hasAlertClass, hasModalClass];

  useCaptureScrollPosition(scrollCaptureClasses);

  useEffect(() => {
    if (overviewResult.isUninitialized) {
      triggerOverview(null);
    }
    if (leaderboardResult.isUninitialized) {
      triggerLeaderboard(null);
    }
  }, [
    leaderboardResult,
    overviewResult,
    triggerLeaderboard,
    triggerOverview,
  ]);

  useTriggerPrimaryQuery();

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
    </div>
  );
};

export default App;
