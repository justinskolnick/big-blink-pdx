import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router';

import { delayedScrollToRef, delayedScrollToTop } from '../lib/dom';
import {
  hasIncidentFilterSearchParams,
  hasPageSearchParams,
  hasSortSearchParams,
} from '../lib/params';

import { Fn, FnRef, Ref } from '../types';

export interface FetchWithCallback {
  (callback: Fn): void;
}

export interface FetchWithCallbackRef {
  (callback: FnRef): void;
}

const defaultFetch: FetchWithCallback = (callback) => {
  if (callback) {
    callback();
  }
};

const useScrollOnRouteChange = (fetch: FetchWithCallback | FetchWithCallbackRef = defaultFetch, scroll: boolean = true) => {
  const hasFetch = Boolean(fetch);

  const location = useLocation();
  const [searchParams] = useSearchParams();

  const route = location.pathname + location.search;
  const [lastRoute, setLastRoute] = useState(route);
  const [lastPathname, setLastPathname] = useState(location.pathname);
  const [lastSearchParams, setLastSearchParams] = useState(searchParams);
  const [hasFetched, setHasFetched] = useState(false);

  const action = (ref?: Ref) => {
    const hasPageParams = hasPageSearchParams(searchParams);
    const hasSortParams = hasSortSearchParams(searchParams);
    const hasIncidentFilterParams = hasIncidentFilterSearchParams(searchParams);

    const hasParams = hasPageParams || hasSortParams || hasIncidentFilterParams;

    if (scroll) {
      if (location.pathname === lastPathname) {
        const hadPageParams = hasPageSearchParams(lastSearchParams);
        const hadSortParams = hasSortSearchParams(lastSearchParams);
        const hadIncidentFilterParams = hasIncidentFilterSearchParams(lastSearchParams);
        const hadParams = hadPageParams || hadSortParams || hadIncidentFilterParams;

        if (ref?.current && (hasParams || hadParams)) {
          delayedScrollToRef(ref);
        } else {
          delayedScrollToTop();
        }
      } else {
        if (ref?.current && hasParams) { // eslint-disable-line no-lonely-if
          delayedScrollToRef(ref);
        } else {
          delayedScrollToTop();
        }
      }
    }

    setLastPathname(location.pathname);
    setLastSearchParams(searchParams);
  };

  useEffect(() => {
    const currentRoute = location.pathname + location.search;

    if (lastRoute !== currentRoute) {
      setHasFetched(false);
      setLastRoute(currentRoute);
    }

    if (!hasFetched) {
      setHasFetched(true);

      if (hasFetch) {
        fetch(action);
      } else {
        action();
      }
    }
  }, [
    action,
    fetch,
    hasFetched,
    lastPathname,
    lastRoute,
    location,
    setHasFetched,
    setLastRoute,
  ]);
};

export default useScrollOnRouteChange;
