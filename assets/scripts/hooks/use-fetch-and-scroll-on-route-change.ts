import { useEffect, useState, RefObject } from 'react';
import { useLocation } from 'react-router';

interface Fn {
  (): void;
}

interface ActionCallback {
  (ref?: RefObject<HTMLElement>): void;
}

export interface FetchWithCallback {
  (callback: ActionCallback): void;
}

const defaultFetch: FetchWithCallback = (callback) => {
  if (callback) {
    callback();
  }
};

const scrollToTop: Fn = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const useScrollOnRouteChange = (fetch: FetchWithCallback = defaultFetch) => {
  const hasFetch = Boolean(fetch);

  const location = useLocation();
  const route = location.pathname + location.search;
  const [lastRoute, setLastRoute] = useState(route);
  const [lastPathname, setLastPathname] = useState(location.pathname);
  const [lastSearch, setLastSearch] = useState(location.search);
  const [hasFetched, setHasFetched] = useState(false);

  const action: ActionCallback = (ref) => {
    const hasRef = Boolean(ref?.current);

    if (location.pathname !== lastPathname) {
      scrollToTop();
    } else if (location.search && location.search !== lastSearch) {
      if (hasRef) {
        ref.current.scrollIntoView({ behavior: 'smooth' });
      } else {
        scrollToTop();
      }
    }

    setLastPathname(location.pathname);
    setLastSearch(location.search);
  };

  useEffect(() => {
    const currentRoute = location.pathname + location.search;

    if (lastPathname === location.pathname && !location.search) {
      if (!hasFetched) {
        scrollToTop();
      }
    }

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
