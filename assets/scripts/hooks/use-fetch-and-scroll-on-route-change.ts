import { useEffect, useState, RefObject } from 'react';
import { useLocation, useSearchParams } from 'react-router';

import {
  dateOnParam,
  dateRangeFromParam,
  dateRangeToParam,
  pageParam,
  quarterParam,
  sortByParam,
  sortParam,
  withEntityIdParam,
  withPersonIdParam,
} from '../config/constants';
import {
  DETAIL_ROUTE_PATTERN,
} from '../config/patterns';

import type { LocationPathname } from '../types';

interface Fn {
  (): void;
}

interface FnRef {
  (ref: RefObject<HTMLElement>): void;
}

interface ActionCallback {
  (ref?: RefObject<HTMLElement>): void;
}

export interface FetchWithCallback {
  (callback: ActionCallback): void;
}

const PAGE_PARAMS = [
  pageParam,
];
const SORT_PARAMS = [
  sortByParam,
  sortParam,
];
const INCIDENT_FILTER_PARAMS = [
  dateOnParam,
  dateRangeFromParam,
  dateRangeToParam,
  quarterParam,
  withEntityIdParam,
  withPersonIdParam,
];

const isDetailRoute = (pathname: LocationPathname) => DETAIL_ROUTE_PATTERN.test(pathname);
const hasPageSearchParams = (searchParams: URLSearchParams) => PAGE_PARAMS.some(p => searchParams.has(p));
const hasSortSearchParams = (searchParams: URLSearchParams) => SORT_PARAMS.some(p => searchParams.has(p));
const hasIncidentFilterSearchParams = (searchParams: URLSearchParams) => INCIDENT_FILTER_PARAMS.some(p => searchParams.has(p));

const defaultFetch: FetchWithCallback = (callback) => {
  if (callback) {
    callback();
  }
};

const scrollToTop: Fn = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const scrollToRef: FnRef = (ref) => {
  ref.current.scrollIntoView({ behavior: 'smooth' });
};

const useScrollOnRouteChange = (fetch: FetchWithCallback = defaultFetch) => {
  const hasFetch = Boolean(fetch);

  const location = useLocation();
  const [searchParams] = useSearchParams();

  const route = location.pathname + location.search;
  const [lastRoute, setLastRoute] = useState(route);
  const [lastPathname, setLastPathname] = useState(location.pathname);
  const [lastSearchParams, setLastSearchParams] = useState(searchParams);
  const [hasFetched, setHasFetched] = useState(false);

  const action: ActionCallback = (ref) => {
    const hasRef = Boolean(ref?.current);
    const isDetail = isDetailRoute(location.pathname);
    const hasPageParams = hasPageSearchParams(searchParams);
    const hasSortParams = hasSortSearchParams(searchParams);
    const hasIncidentFilterParams = hasIncidentFilterSearchParams(searchParams);

    const hasParams = hasPageParams || hasSortParams || hasIncidentFilterParams;

    setTimeout(() => {
      if (location.pathname === lastPathname) {
        const hadPageParams = hasPageSearchParams(lastSearchParams);
        const hadSortParams = hasSortSearchParams(lastSearchParams);
        const hadIncidentFilterParams = hasIncidentFilterSearchParams(lastSearchParams);
        const hadParams = hadPageParams || hadSortParams || hadIncidentFilterParams;

        if (isDetail && hasRef && (hasParams || hadParams)) {
          scrollToRef(ref);
        } else {
          scrollToTop();
        }
      } else {
        if (isDetail && hasRef && hasParams) { // eslint-disable-line no-lonely-if
          scrollToRef(ref);
        } else {
          scrollToTop();
        }
      }
    }, 250);

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
