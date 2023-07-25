import React, { useEffect, useRef } from 'react';
import { useLocation, Outlet, ScrollRestoration } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { cx, css } from '@emotion/css';

import fetchFromPath from '../lib/fetch-from-path';

import { hasAlertClass } from './alert-portal';
import { hasModalClass } from './modal-portal';
import AlertError from './alert-error';
import AlertMessage from './alert-message';
import AlertWarning from './alert-warning';
import GlobalFooter from './global-footer';
import GlobalHeader from './global-header';

import useCaptureScrollPosition from '../hooks/use-capture-scroll-position';

import { getDescription } from '../selectors';

const styles = css`
  position: relative;
  margin: 0 auto;
  padding-top: var(--layout-margin);
  padding-bottom: var(--layout-margin);
  max-width: 990px;
  width: 100vw;
  height: 100%;
  z-index: 3;

  @media screen and (min-width: 601px) {
    width: calc(100vw - (2 * var(--layout-margin)));
  }

  @media screen and (min-width: 401px) {
    transform-origin: left bottom;
    transform-style: preserve-3d;
    // transition: filter 250ms ease-in-out,
    //             transform 250ms ease-in-out;
    transition: filter 250ms ease-in-out;

    .has-modal & {
      filter: saturate(0.25);
      // transform: perspective(800px) rotateY(5deg) scale(0.95);
    }
  }

  a {
    text-decoration: none;
  }

  .global-header + .global-main {
    margin-top: calc(3 * var(--gap));
  }

  .global-main + .global-footer {
    margin-top: calc(3 * var(--gap));
    padding-top: calc(3 * var(--gap));
    border-top: 3px solid var(--color-light-gray);
  }

  header {
    & + .item-content {
      margin-top: var(--gap);
    }

    &.item-header + .item-content {
      margin-top: calc(3 * var(--gap));
    }
  }

  @media screen and (max-width: 600px) {
    --layout-margin: var(--gap);
  }

  @media screen and (min-width: 601px) {
    --layout-margin: calc(3 * var(--gap));
  }
`;

const App = () => {
  const initiated = useRef(false);
  const location = useLocation();
  const description = useSelector(getDescription);

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
    <div className={cx('global-layout', styles)}>
      <Helmet
        defaultTitle='The Big Blink PDX'
        titleTemplate='%s | The Big Blink PDX'
      >
        {description && (
          <meta name='description' content={description} />
        )}
      </Helmet>
      <AlertError />
      <AlertMessage />
      <AlertWarning />
      <GlobalHeader />

      <main className='global-main'>
        <Outlet />
      </main>

      <GlobalFooter />
      <ScrollRestoration />
    </div>
  );
};

export default App;
