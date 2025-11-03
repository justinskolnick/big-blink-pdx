import React, { useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router';

import useFetchAndScrollOnRouteChange, { FetchWithCallback } from '../../hooks/use-fetch-and-scroll-on-route-change';

import { delayedScrollToRef } from '../../lib/dom';
import { hasLeaderboardFilterSearchParams } from '../../lib/params';

import api from '../../services/api';

import Chart from './chart';
import Leaderboard from './leaderboard';
import Section from '../section';

const Home = () => {
  const ref = useRef(null);

  const location = useLocation();
  const [searchParams] = useSearchParams();
  const hasFilterParams = hasLeaderboardFilterSearchParams(searchParams);

  const [trigger] = api.useLazyGetLeaderboardQuery();

  const fetch: FetchWithCallback = async (callback) => {
    await trigger({ search: location.search });

    if (callback) {
      callback(ref);
    }
  };

  useFetchAndScrollOnRouteChange(fetch, false);

  useEffect(() => {
    const hasRef = Boolean(ref?.current);

    if (hasFilterParams && hasRef) {
      delayedScrollToRef(ref);
    }
  }, [hasFilterParams, ref]);

  return (
    <Section
      icon='handshake'
      title='Lobbying in Portland, Oregon'
      className='section-home'
    >
      <Chart />
      <Leaderboard ref={ref} />
    </Section>
  );
};

export default Home;
