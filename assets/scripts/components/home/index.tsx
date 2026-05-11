import React, { useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router';

import useFetchAndScrollOnRouteChange, {
  FetchWithCallbackRef
} from '../../hooks/use-fetch-and-scroll-on-route-change';

import { delayedScrollToRef } from '../../lib/dom';
import { hasLeaderboardFilterSearchParams } from '../../lib/params';

import api from '../../services/api';

import Activity from './activity';
import Leaderboard from './leaderboard';

const Home = () => {
  const ref = useRef(null);

  const location = useLocation();
  const [searchParams] = useSearchParams();
  const hasFilterParams = hasLeaderboardFilterSearchParams(searchParams);

  const [trigger] = api.useLazyGetLeaderboardQuery();

  const fetch: FetchWithCallbackRef = async (callback) => {
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
    <>
      <Activity />
      <Leaderboard ref={ref} />
    </>
  );
};

export default Home;
